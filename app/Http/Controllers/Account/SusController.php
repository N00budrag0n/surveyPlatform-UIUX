<?php

namespace App\Http\Controllers\Account;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;
use App\Exports\ResponsesSUSExport;
use App\Models\SurveyResponses;
use App\Models\Survey;
use App\Models\SurveyQuestions;
use App\Models\SurveyAiRecommendation;
use App\Services\GroqService;
use Psy\Readline\Hoa\Console;

class SusController extends Controller
{

    protected $groqService;

    public function __construct(GroqService $groqService)
    {
        $this->groqService = $groqService;
    }

    public function index(Request $request)
    {
        $user = auth()->user();

        if (auth()->user()->hasPermissionTo('sus.index.full')) {
            $surveyTitles = Survey::whereHas('methods', function ($query) {
                $query->where('method_id', 1);
            })
                ->get(['surveys.id', 'surveys.title']);
        } else {
            $surveyTitles = Survey::where('user_id', $user->id)
                ->whereHas('methods', function ($query) {
                    $query->where('method_id', 1);
                })
                ->get(['surveys.id', 'surveys.title']);

            if ($surveyTitles->isEmpty()) {
                return redirect()->route('account.surveys.create');
            }
        }

        $sortedSurveyTitles = $surveyTitles->sortBy('id');
        $lowestTitleId = $sortedSurveyTitles->first()->id;

        return redirect()->route('account.sus.id', ['id' => $lowestTitleId]);
    }

    public function show(Request $request, $id)
    {
        $userID = auth()->user()->id;
        $survey = Survey::find($id);
        $surveyName = $survey->title;
        $surveyTheme = $survey->theme;

        $cacheExpiredMinutes = 2 * 60;

        if (!auth()->user()->hasPermissionTo('sus.index.full') && $survey->user_id != $userID) {
            return abort(403, 'Unauthorized');
        }

        if (auth()->user()->hasPermissionTo('sus.index.full')) {
            $surveyTitles = Survey::whereHas('methods', function ($query) {
                    $query->where('method_id', 1);
                })
                ->get(['surveys.id', 'surveys.title']);
        } else {
            $surveyTitles = Survey::where('user_id', $userID)
                ->whereHas('methods', function ($query) {
                    $query->where('method_id', 1);
                })
                ->get(['surveys.id', 'surveys.title']);
        }

        $susQuestions = SurveyQuestions::where('survey_id', $id)->get();

        $responses = Cache::remember('responses-sus-' . $id, $cacheExpiredMinutes, function () use ($id) {
            return SurveyResponses::where('survey_id', $id)
                ->where('response_data', 'LIKE', '%"sus"%')
                ->get();
        });

        $respondentCount = $this->countRespondents($id);
        $demographicRespondents = $this->demographicRespondents($responses);
        $averageSUS = $this->calculateAverageSUS($responses);
        $classifySUSGrade = $this->classifySUSGrade($averageSUS);
        $susSurveyResults = $this->getSUSResults($responses);
        $getSUSChartData = $this->getSUSChartData($id, $responses);
        $getAverageAnswer = $this->getAverageAnswer($susSurveyResults);
        $getResumeDescription = $this->getResumeDescription($getAverageAnswer, $surveyTheme);

        // Get AI recommendation if exists
        $aiRecommendation = $survey->getAiRecommendation('SUS');

        return inertia('Account/SUS/Index', [
            'surveyTitles' => $surveyTitles,
            'survey' => $survey,
            'resumeDescription' => $getResumeDescription,
            'averageAnswer' => $getAverageAnswer,
            'respondentCount' => $respondentCount,
            'demographicRespondents' => $demographicRespondents,
            'averageSUS' => $averageSUS,
            'classifySUSGrade' => $classifySUSGrade,
            'getSUSChartData' => $getSUSChartData,
            'susSurveyResults' => $susSurveyResults,
            'susQuestions' => $susQuestions,
            'aiRecommendation' => $aiRecommendation
        ])->with('currentSurveyTitle', $survey->title);
    }

    public function generateAiRecommendation(Request $request, $id)
    {
        try {
            $survey = Survey::findOrFail($id);

            // Check authorization
            if (!auth()->user()->hasPermissionTo('sus.index.full') && $survey->user_id != auth()->id()) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Get survey data for analysis
            $responses = SurveyResponses::where('survey_id', $id)
                ->where('response_data', 'LIKE', '%"sus"%')
                ->get();

            if ($responses->isEmpty()) {
                return response()->json(['error' => 'Tidak ada data respons untuk dianalisis'], 400);
            }

            // Calculate analysis data
            $susSurveyResults = $this->getSUSResults($responses);
            $getAverageAnswer = $this->getAverageAnswer($susSurveyResults);
            $getResumeDescription = $this->getResumeDescription($getAverageAnswer, $survey->theme);

            if (!$getResumeDescription) {
                return response()->json(['error' => 'Tidak dapat menghasilkan deskripsi resume'], 400);
            }

            // Generate AI recommendation
            $aiRecommendation = $this->groqService->generateSurveyRecommendation(
                'SUS',
                $getResumeDescription,
                $survey->theme
            );

            // Save or update AI recommendation
            SurveyAiRecommendation::updateOrCreate(
                [
                    'survey_id' => $id,
                    'method_type' => 'SUS'
                ],
                [
                    'resume_description' => $getResumeDescription,
                    'ai_recommendation' => $aiRecommendation,
                    'generated_at' => now()
                ]
            );

            return response()->json([
                'success' => true,
                'recommendation' => $aiRecommendation,
                'generated_at' => now()->format('d/m/Y H:i')
            ]);

        } catch (\Exception $e) {
            \Log::error('SUS AI Recommendation Error: ' . $e->getMessage());
            return response()->json(['error' => 'Terjadi kesalahan saat menghasilkan rekomendasi'], 500);
        }
    }

    private function demographicRespondents($responses)
    {
        if ($responses->isEmpty()) {
            return null;
        }

        $demographics = [
            'gender' => [],
            'profession' => [],
            'educational_background' => [],
            'age' => []
        ];

        foreach ($responses as $response) {
            foreach ($demographics as $key => $value) {
                if ($key === 'age') {
                    $age_category = $this->categorizeAge($response['birth_date']);
                    if (isset($demographics[$key][$age_category])) {
                        $demographics[$key][$age_category]++;
                    } else {
                        $demographics[$key][$age_category] = 1;
                    }
                } else {
                    if (isset($demographics[$key][$response[$key]])) {
                        $demographics[$key][$response[$key]]++;
                    } else {
                        $demographics[$key][$response[$key]] = 1;
                    }
                }
            }
        }

        return $demographics;
    }


    private function categorizeAge($birth_date)
    {
        $birth_date = Carbon::parse($birth_date);
        $age = $birth_date->age;

        if ($age < 18) {
            return '0-17';
        } elseif ($age >= 18 && $age < 25) {
            return '18-24';
        } elseif ($age >= 25 && $age < 35) {
            return '25-34';
        } elseif ($age >= 35 && $age < 45) {
            return '35-44';
        } elseif ($age >= 45 && $age < 55) {
            return '45-54';
        } elseif ($age >= 55 && $age < 65) {
            return '55-64';
        } else {
            return '65+';
        }
    }

    private function countRespondents($surveyId)
    {
        $totalResponsesWithSUS = SurveyResponses::where('survey_id', $surveyId)
            ->where('response_data', 'LIKE', '%"sus"%')
            ->count();

        return $totalResponsesWithSUS;
    }

    private function calculateAverageSUS($responses)
    {

        $totalSUS = 0;
        $count = count($responses);

        foreach ($responses as $response) {
            $responseData = json_decode($response->response_data, true)['sus'];
            $totalSUS += $this->calculateSUS($responseData);
        }

        if ($count > 0) {
            $averageSUS = $totalSUS / $count;
            return $averageSUS = number_format($averageSUS, 2);
        } else {
            return $averageSUS = 0;
        }
    }

    private function classifySUSGrade($averageSUS)
    {
        if ($averageSUS >= 90) {
            return 'A';
        } elseif ($averageSUS >= 80) {
            return 'B';
        } elseif ($averageSUS >= 70) {
            return 'C';
        } elseif ($averageSUS >= 60) {
            return 'D';
        } else {
            return 'F';
        }
    }

    private function calculateSUS($responseData)
    {
        // Menghitung Skor SUS dari respons
        $susScore = 0;
        $susScore += $responseData['sus1'] - 1;
        $susScore += 5 - $responseData['sus2'];
        $susScore += $responseData['sus3'] - 1;
        $susScore += 5 - $responseData['sus4'];
        $susScore += $responseData['sus5'] - 1;
        $susScore += 5 - $responseData['sus6'];
        $susScore += $responseData['sus7'] - 1;
        $susScore += 5 - $responseData['sus8'];
        $susScore += $responseData['sus9'] - 1;
        $susScore += 5 - $responseData['sus10'];

        return $susScore * 2.5; // Mengubah skala SUS menjadi 0-100
    }

    private function getSUSChartData($survey_id, $responses)
    {
        // Inisialisasi array kosong untuk setiap pertanyaan (sus1, sus2, dst)
        $sus_data = [];

        // Loop melalui setiap respons
        foreach ($responses as $response) {
            // Decode response_data dari JSON ke dalam array asosiatif
            $responseData = json_decode($response->response_data, true)['sus'];

            // Loop melalui setiap pertanyaan (sus1, sus2, dst)
            foreach ($responseData as $question => $answer) {
                // Jika pertanyaan belum ada dalam array $sus_data, inisialisasikan dengan array kosong
                if (!isset($sus_data[$question])) {
                    $sus_data[$question] = [];
                }

                // Tambahkan nilai jawaban ke array yang sesuai
                $sus_data[$question][] = $answer;
            }
        }

        // Kembalikan hasil dalam format JSON tanpa headers tambahan
        return response()->json($sus_data);
    }

    private function getSUSResults($responses)
    {
        $susSurveyResults = [];

        foreach ($responses as $response) {
            $responseData = json_decode($response->response_data, true)['sus'];

            $susSurveyResults[] = [
                'id' => $response->id,
                'respondentName' => $response->first_name . " " . $response->surname,
                'susScore' => $this->calculateSUS($responseData),
                'answerData' => $responseData,
            ];
        }

        return $susSurveyResults;
    }

    private function getAverageAnswer($susSurveyResults)
    {
        if (count($susSurveyResults) == 0) {
            return null;
        }
        $normalizedSusResults = [];
        foreach ($susSurveyResults as $result) {
            $normalizedSus = [
                $result['answerData']['sus1'],
                6 - $result['answerData']['sus2'],
                $result['answerData']['sus3'],
                6 - $result['answerData']['sus4'],
                $result['answerData']['sus5'],
                6 - $result['answerData']['sus6'],
                $result['answerData']['sus7'],
                6 - $result['answerData']['sus8'],
                $result['answerData']['sus9'],
                6 - $result['answerData']['sus10']
            ];

            $normalizedSusResults[] = $normalizedSus;
        }

        $averageResults = array_fill(0, 10, 0);

        foreach ($normalizedSusResults as $normalizedSus) {
            foreach ($normalizedSus as $key => $value) {
                $averageResults[$key] += $value;
            }
        }

        $totalResults = count($normalizedSusResults);

        foreach ($averageResults as $key => $value) {
            $averageResults[$key] = round($value / $totalResults, 2);
        }

        return $averageResults;
    }

    private function getResumeDescription(&$getAverageAnswer, $surveyTheme)
    {
        if ($getAverageAnswer == null) {
            return null;
        }

        $getAverageAnswer = array_values($getAverageAnswer);

        $getResumeDescription = [];

        $kalimatPositif = [
            "Sebagian besar pengguna $surveyTheme berniat untuk menggunakan kembali sistem ini(1).",
            "Kebanyakan pengguna merasa sistem ini tidak rumit(2) ",
            "dan banyak pengguna merasa sistem ini mudah digunakan(3).",
            "Tanpa membutuhkan bantuan dari orang lain atau teknisi pengguna dapat menggunakan sistem(4).",
            "Selain itu, pengguna merasa fitur-fitur sistem berjalan dengan semestinya(5) ",
            "dan merasa tidak ada banyak hal yang tidak konsisten dalam sistem ini(6).",
            "Mereka merasa orang lain akan dengan cepat memahami cara menggunakan sistem ini(7) ",
            "dan merasa sistem ini tidak membingungkan(8).",
            "Mereka juga merasa tidak ada hambatan dalam menggunakan sistem(9) ",
            "dan tidak perlu membiasakan diri terlebih dahulu sebelum menggunakannya(10)."
        ];

        $kalimatNegatif = [
            "Sebagian besar pengguna $surveyTheme tidak berniat untuk menggunakan kembali sistem ini(1).",
            "Kebanyakan pengguna mengeluhkan kerumitan dalam menggunakan sistem ini(2) ",
            "dan banyak pengguna merasa sistem ini sulit digunakan(3).",
            "Banyak pengguna yang memerlukan bantuan dari orang lain atau teknisi untuk menggunakan sistem ini(4).",
            "Selain itu, banyak pengguna merasa fitur sistem tidak berjalan dengan semestinya(5) ",
            "dan merasa ada banyak hal yang tidak konsisten dalam sistem ini(6).",
            "Mereka merasa orang lain mungkin akan kesulitan memahami cara menggunakan sistem ini(7) ",
            "dan merasa sistem ini membingungkan(8).",
            "Mereka mengalami hambatan dalam menggunakan sistem(9) ",
            "dan merasa perlu membiasakan diri terlebih dahulu sebelum menggunakannya(10)."
        ];


        $kalimatNetral = [
            "Sebagian besar pengguna $surveyTheme memiliki pandangan netral terhadap penggunaan kembali sistem ini(1).",
            "Kebanyakan pengguna merasa cukup nyaman menggunakan sistem ini(2) ",
            "dan banyak pengguna merasa sistem ini agak sulit digunakan(3).",
            "Banyak pengguna merasa sistem ini perlu sedikit bantuan dari orang lain atau teknisi untuk menggunakan sistem ini(4).",
            "Selain itu, banyak pengguna merasa fitur sistem ini dianggap berjalan dengan cukup baik sebagaimana mestinya(5) ",
            "dan merasa ada sebagian kecil aspek yang dinilai tidak konsisten dalam sistem ini menurut pengguna(6).",
            "Mereka merasa orang lain mungkin memerlukan sedikit waktu untuk memahami cara menggunakan sistem ini(7) ",
            "dan merasa sistem ini sedikit membingungkan(8).",
            "Mereka merasa ada beberapa hambatan kecil dalam menggunakan sistem(9) ",
            "dan merasa perlu sedikit waktu untuk bisa terbiasa dengan sistem ini(10)."
        ];


        foreach ($getAverageAnswer as $key => $value) {
            if ($value <= 2.5) {
                $getResumeDescription[$key] = $kalimatNegatif[$key];
            } else if ($value > 2.5 && $value < 3.5) {
                $getResumeDescription[$key] = $kalimatNetral[$key];
            } else if ($value >= 3.5) {
                $getResumeDescription[$key] = $kalimatPositif[$key];
            } else {
                $getResumeDescription[$key] = "Nilai tidak valid";
            }
        }

        $resumeParagraph = implode(" ", $getResumeDescription);

        return $resumeParagraph;
    }

    // public function export($survey_id)
    // {
    //     $survey = Survey::find($survey_id);
    //     $surveyName = $survey->title;
    //     $dateTime = now()->format('Y-m-d H.i');
    //     $dateTimeFormatted = str_replace(' ', '-', $dateTime);
    //     $fileName = $surveyName . '_' . $dateTimeFormatted . '_SUS_export.xlsx';

    //     return Excel::download(new ResponsesSUSExport($survey_id), $fileName);
    // }

    public function export(Request $request)
    {
        $surveyIds = $request->get('surveys');

        if (!$surveyIds) {
            return redirect()->back()->with('error', 'Tidak ada survei yang dipilih untuk diekspor');
        }

        // Convert comma-separated string to array
        $surveyIdsArray = explode(',', $surveyIds);

        // Validate survey IDs and check permissions
        $user = auth()->user();
        $validSurveyIds = [];

        foreach ($surveyIdsArray as $surveyId) {
            $survey = Survey::find($surveyId);

            if (!$survey) {
                continue;
            }

            // Check if survey has SUS method
            if (!$survey->methods()->where('method_id', 1)->exists()) {
                continue;
            }

            // Check permissions
            if (!$user->hasPermissionTo('sus.index.full') && $survey->user_id != $user->id) {
                continue;
            }

            $validSurveyIds[] = $surveyId;
        }

        if (empty($validSurveyIds)) {
            return redirect()->back()->with('error', 'Tidak ada survei yang valid untuk diekspor');
        }

        // Generate filename
        $dateTime = now()->format('Y-m-d_H-i');
        $surveyCount = count($validSurveyIds);

        if ($surveyCount === 1) {
            $survey = Survey::find($validSurveyIds[0]);
            $fileName = $survey->title . '_' . $dateTime . '_SUS_export.xlsx';
        } else {
            $fileName = 'Multiple_SUS_Surveys_' . $dateTime . '_export.xlsx';
        }

        return Excel::download(new ResponsesSUSExport($validSurveyIds), $fileName);
    }
}
