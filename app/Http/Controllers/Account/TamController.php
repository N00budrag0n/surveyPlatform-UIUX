<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Models\SurveyResponses;
use App\Models\Survey;
use App\Models\SurveyQuestions;
use App\Models\SurveyAiRecommendation;
use App\Services\GroqService;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ResponsesTAMExport;
use Illuminate\Support\Facades\Cache;

class TamController extends Controller
{

    protected $groqService;

    public function __construct(GroqService $groqService)
    {
        $this->groqService = $groqService;
    }

    public function index(Request $request)
    {
        $user = auth()->user();

        if (auth()->user()->hasPermissionTo('tam.index.full')) {
            $surveyTitles = Survey::whereHas('methods', function ($query) {
                $query->where('method_id', 2);
            })
                ->get(['surveys.id', 'surveys.title']);
        } else {
            $surveyTitles = Survey::where('user_id', $user->id)
                ->whereHas('methods', function ($query) {
                    $query->where('method_id', 2);
                })
                ->get(['surveys.id', 'surveys.title']);

            if ($surveyTitles->isEmpty()) {
                return redirect()->route('account.surveys.create');
            }
        }

        $sortedSurveyTitles = $surveyTitles->sortBy('id');
        $lowestTitleId = $sortedSurveyTitles->first()->id;

        return redirect()->route('account.tam.id', ['id' => $lowestTitleId]);
    }

    public function show(Request $request, $id)
    {
        $userID = auth()->user()->id;
        $survey = Survey::find($id);
        $surveyName = $survey->title;
        $surveyTheme = $survey->theme;
        $responsesFormated = [];

        $cacheExpiredMinutes = 2 * 60;

        $survey = Survey::find($id);
        if (!auth()->user()->hasPermissionTo('tam.index.full') && $survey->user_id != $userID) {
            return abort(403, 'Unauthorized');
        }

        if (auth()->user()->hasPermissionTo('tam.index.full')) {
            $surveyTitles = Survey::whereHas('methods', function ($query) {
                $query->where('method_id', 2);
            })
                ->get(['surveys.id', 'surveys.title']);
        } else {
            $surveyTitles = Survey::where('user_id', $userID)
                ->whereHas('methods', function ($query) {
                    $query->where('method_id', 2);
                })
                ->get(['surveys.id', 'surveys.title']);
        }

        $responses = Cache::remember('responses-tam-' . $id, $cacheExpiredMinutes, function () use ($id) {
            return SurveyResponses::where('survey_id', $id)
                ->where('response_data', 'LIKE', '%"tam"%')
                ->get();
        });

        // Mulai - Format data TAM - responsesFormated
        $responsesFormatedJson = [];

        foreach ($responses as $response) {
            $responseDataFormated = [];

            $responseData = json_decode($response->response_data, true);

            if (!isset($responseDataFormated['response_data'])) {
                $responseDataFormated['response_data'] = [];
            }

            if (isset($responseData['sus'])) {
                $responseDataFormated['response_data']['sus'] = $responseData['sus'];
            }

            $tamFormatted = [];
            foreach ($responseData['tam'] as $variable) {
                foreach ($variable['responses'] as $response) {
                    foreach ($response['value'] as $value) {
                        $tamFormatted[$value[0]] = $value[1];
                    }
                }
            }
            $responseDataFormated['response_data']['tam'] = $tamFormatted;
            $responsesFormatedJson[] = json_encode($responseDataFormated);
        }

        foreach ($responses as $index => $response) {
            $responseCopy = clone $response;
            $responseCopy->response_data = $responsesFormatedJson[$index];
            $responsesFormated[] = $responseCopy;
        }
        // Akhir - Format data TAM - responsesFormated

        $tamQustions = SurveyQuestions::where('survey_id', $id)->get();

        $respondents = $this->countRespondents($id, $responses);

        $respondentCount = $this->countRespondents($id, $responsesFormated);
        $getTAMChartData = $this->getTAMChartData($id, $responsesFormated);
        $demographicRespondents = $this->demographicRespondents($responses);
        $tamSurveyResults = $this->getTAMResults($responsesFormated);
        $calculateDescriptiveStatistics = $this->getCalculateDescriptiveStatistics($respondents, $responses);
        $calculateRegression = $this->getCalculateRegression($respondents, $responses);
        $getResumeDescription = $this->getResumeDescription($calculateRegression, $surveyTheme);

        // Get AI recommendation if exists
        $aiRecommendation = $survey->getAiRecommendation('TAM');

        return inertia('Account/TAM/Index', [
            'surveyTitles' => $surveyTitles,
            'survey' => $survey,
            'responsesFormated' => $responsesFormated,
            'respondentCount' => $respondentCount,
            'demographicRespondents' => $demographicRespondents,
            'getTAMChartData' => $getTAMChartData,
            'calculateDescriptiveStatistics' => $calculateDescriptiveStatistics,
            'calculateRegression' => $calculateRegression,
            'tamSurveyResults' => $tamSurveyResults,
            'tamQustions' => $tamQustions,
            'resumeDescription' => $getResumeDescription,
            'aiRecommendation' => $aiRecommendation
        ])->with('currentSurveyTitle', $survey->title);
    }

     public function generateAiRecommendation(Request $request, $id)
    {
        try {
            $survey = Survey::findOrFail($id);

            // Check authorization
            if (!auth()->user()->hasPermissionTo('tam.index.full') && $survey->user_id != auth()->id()) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Get survey data for analysis
            $responses = SurveyResponses::where('survey_id', $id)
                ->where('response_data', 'LIKE', '%"tam"%')
                ->get();

            if ($responses->isEmpty()) {
                return response()->json(['error' => 'Tidak ada data respons untuk dianalisis'], 400);
            }

            // Calculate analysis data
            $respondents = $this->countRespondents($id, $responses);
            $calculateRegression = $this->getCalculateRegression($respondents, $responses);
            $getResumeDescription = $this->getResumeDescription($calculateRegression, $survey->theme);

            if (!$getResumeDescription) {
                return response()->json(['error' => 'Tidak dapat menghasilkan deskripsi resume'], 400);
            }

            // Convert resume description array to string for AI analysis
            $resumeDescriptionText = '';
            foreach ($getResumeDescription as $category => $sentences) {
                $resumeDescriptionText .= "\n{$category}:\n";
                foreach ($sentences as $sentence) {
                    $resumeDescriptionText .= "- {$sentence}\n";
                }
            }

            // Generate AI recommendation
            $aiRecommendation = $this->groqService->generateSurveyRecommendation(
                'TAM',
                $resumeDescriptionText,
                $survey->theme
            );

            // Save or update AI recommendation
            SurveyAiRecommendation::updateOrCreate(
                [
                    'survey_id' => $id,
                    'method_type' => 'TAM'
                ],
                [
                    'resume_description' => $resumeDescriptionText,
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
            \Log::error('TAM AI Recommendation Error: ' . $e->getMessage());
            return response()->json(['error' => 'Terjadi kesalahan saat menghasilkan rekomendasi'], 500);
        }
    }

    private function countRespondents($surveyId, $responsesFormated)
    {
        $totalResponsesWithTAM = SurveyResponses::where('survey_id', $surveyId)
            ->where('response_data', 'LIKE', '%"tam"%')
            ->count();

        return $totalResponsesWithTAM;
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

    private function getTAMChartData($survey_id, $responsesFormated)
    {
        $tam_data = [];
        foreach ($responsesFormated as $response) {
            $responseData = json_decode($response->response_data, true)['response_data']['tam'];

            foreach ($responseData as $question => $answer) {
                if (!isset($tam_data[$question])) {
                    $tam_data[$question] = [];
                }

                $tam_data[$question][] = $answer;
            }
        }

        return response()->json($tam_data);
    }

    private function getCalculateDescriptiveStatistics($respondents, $responses)
    {
        if ($responses->isEmpty()) {
            return null;
        }

        $descriptiveStatistics = [];
        $maxValues = [];
        $sumValues = [];

        foreach ($responses as $response) {
            $responseData = json_decode($response->response_data, true);
            $formattedTamArray = [];

            foreach ($responseData['tam'] as $variable) {
                $formattedResponses = [];

                foreach ($variable['responses'] as $indicator) {
                    if (isset($indicator['value']) && is_array($indicator['value'])) {
                        foreach ($indicator['value'] as $value) {
                            $indicatorName = $value[0];
                            $indicatorValue = $value[1];
                            $formattedResponses[$indicatorName] = $indicatorValue;
                        }
                    }
                }

                $formattedTamArray[$variable['name']] = $formattedResponses;
            }

            foreach ($formattedTamArray as $variable => $responses) {
                $maxValue = count($responses) * 5;
                $sumValue = array_sum($responses);
                if (!isset($maxValues[$variable])) {
                    $maxValues[$variable] = 0;
                }
                if (!isset($sumValues[$variable])) {
                    $sumValues[$variable] = 0;
                }

                $maxValues[$variable] += $maxValue;
                $sumValues[$variable] += $sumValue;
            }
        }

        foreach ($maxValues as $variable => $sumMaxValue) {
            $sumValue = $sumValues[$variable];
            if ($sumValue != 0) {
                $p = ($sumValue / $sumMaxValue) * 100;

                $minValue = min($formattedTamArray[$variable]);
                $maxValue = max($formattedTamArray[$variable]);
            }

            $descriptiveStatistics[] = [
                'variable' => $variable,
                'nI' => count($formattedTamArray[$variable]),
                'min' => number_format($minValue, 2),
                'max' => number_format($maxValue, 2),
                'sum_SK' => $sumMaxValue,
                'sum_SH' => $sumValue,
                'P' => number_format($p, 2) . '%',
            ];
        }

        return $descriptiveStatistics;
    }

    private function getCalculateRegression($respondents, $responsesFormated)
    {
        if ($responsesFormated->isEmpty()) {
            return null;
        }
        $responseData = json_decode($responsesFormated[0]->response_data, true);
        $variablesAnswerCount = [];
        $respondentsValues = [];
        $respondentsSum = [];
        $respondentsAvg = [];

        foreach ($responseData['tam'] as $variable) {
            $tamCount = 0;

            foreach ($variable['responses'] as $indicator) {
                if (isset($indicator['value']) && is_array($indicator['value'])) {
                    foreach ($indicator['value'] as $value) {
                        $tamCount += 1;
                    }
                }
            }
            $variablesAnswerCount[$variable['name']] = $tamCount;
        }

        // Awal menghitung rata-rata dan jumlah nilai variable setiap responden
        foreach ($responsesFormated as $responseFormated) {
            $responseData = json_decode($responseFormated->response_data, true);
            $response = $responseData['tam'];

            foreach ($response as $variable) {
                $variableName = $variable['name'];
                $varValue = [];
                $sum = 0;
                $avg = 0;

                foreach ($variable['responses'] as $indicator) {
                    foreach ($indicator['value'] as $value) {
                        $varValue[] = $value[1];
                        $sum += $value[1];
                    }
                }
                $avg = $sum / $variablesAnswerCount[$variableName];

                $variablesValues[$variableName] = $varValue;

                if (!isset($respondentsSum[$variableName])) {
                    $respondentsSum[$variableName] = [];
                }
                if (!isset($respondentsAvg[$variableName])) {
                    $respondentsAvg[$variableName] = [];
                }
                $respondentsSum[$variableName][] = $sum;
                $respondentsAvg[$variableName][] = $avg;
            }
            $respondentsValues[] = $variablesValues;
        }
        // Akhir menghitung rata-rata dan jumlah nilai variable setiap responden

        $regressionResults = [];
        $regressionPathDefault = [
            ['PEU', 'PU'],
            ['PEU', 'ATU'],
            ['PU', 'ATU'],
            ['PU', 'BI'],
            ['ATU', 'BI'],
            ['BI', 'ASU']
        ];
        $regressionPath = $regressionPath ?? $regressionPathDefault;

        $filteredRegressionPath = array_filter($regressionPath, function ($path) use ($respondentsAvg) {
            return isset($respondentsAvg[$path[0]]) && isset($respondentsAvg[$path[1]]);
        });

        if (empty($filteredRegressionPath)) {
            return $regressionResults = null;
        }
        foreach ($filteredRegressionPath as $path) {
            $n = count($responsesFormated);
            $x = $respondentsAvg[$path[0]];
            $y = $respondentsAvg[$path[1]];
            $xSquared = [];
            $xy = [];

            foreach ($x as $value) {
                $xSquared[] = $value * $value;
            }
            foreach ($x as $index => $value) {
                $xy[] = $value * $y[$index];
            }

            $x_sum = array_sum($x);
            $y_sum = array_sum($y);
            $x_squared_sum = array_sum($xSquared);
            $xy_sum = array_sum($xy);
            $x_sum_squared = $x_sum * $x_sum;

            $denominator = ($n * $x_squared_sum) - ($x_sum_squared);

            if ($denominator != 0) {
                $a = (($y_sum * $x_squared_sum) - ($x_sum * $xy_sum)) / $denominator;
                $b = (($n * $xy_sum) - ($x_sum * $y_sum)) / $denominator;
            } else {
                $a = 0;
                $b = 0;
            }

            $path_formatted = $path[0] . " ➔ " . $path[1];

            $regressionResults[] = [
                'path' => $path_formatted,
                'n' => $n,
                'x_sum' => number_format($x_sum, 2, '.', ''),
                'y_sum' => number_format($y_sum, 2, '.', ''),
                'x_squared_sum' => number_format($x_squared_sum, 2, '.', ''),
                'xy_sum' => number_format($xy_sum, 2, '.', ''),
                'x_sum_squared' => number_format($x_sum_squared, 2, '.', ''),
                'a' => number_format($a, 2, '.', ''),
                'b' => number_format($b, 2, '.', ''),
            ];
        }

        return $regressionResults;
    }

    private function getResumeDescription($regressionResults, $surveyTheme)
    {
        if ($regressionResults == null) {
            return null;
        }

        $getResumeDescription = [];

        $translatedVariables = [
            "Perceived Ease of Use (PEU)" => "mudah",
            "Perceived Usefulness (PU)" => "manfaat",
            "Attitude Toward Use (ATU)" => "sikap",
            "Behavioral Intention (BI)" => "niat",
            "Actual System Use (ASU)" => "aktual",
        ];

        foreach ($regressionResults as $index => $regressionResult) {
            $path = $regressionResult['path'];
            $variables = explode(' ➔ ', $path);

            foreach ($variables as $key => $value) {
                $descriptionVariables = [
                    "PEU" => "Perceived Ease of Use (PEU)",
                    "PU" => "Perceived Usefulness (PU)",
                    "ATU" => "Attitude Toward Use (ATU)",
                    "BI" => "Behavioral Intention (BI)",
                    "ASU" => "Actual System Use (ASU)"
                ];

                if (array_key_exists($value, $descriptionVariables)) {
                    $variables[$key] = $descriptionVariables[$value];
                }
            }

            $variableIndependent = $variables[0];
            $variableDependent = $variables[1];

            $kalimatPositif = [
                "Terdapat hubungan positif antara $variableIndependent dan $variableDependent. Setiap peningkatan satu poin $variableIndependent akan meningkatkan poin $variableDependent sebesar $regressionResult[b] poin. Ini menunjukkan bahwa semakin $translatedVariables[$variableIndependent] pengguna dalam menggunakan sistem, maka semakin besar $translatedVariables[$variableDependent] yang dirasakan pengguna(1).",
                "$variableIndependent memberikan kontribusi positif terhadap $variableDependent. Setiap peningkatan satu poin $variableIndependent akan meningkatkan poin $variableDependent sebesar $regressionResult[b] poin. Ini menunjukkan bahwa semakin $translatedVariables[$variableIndependent] pengguna dalam menggunakan sistem, maka semakin positif $translatedVariables[$variableDependent] mereka terhadap sistem(2).",
                "Pengaruh $variableIndependent terhadap $variableDependent terlihat positif. Setiap peningkatan satu poin $variableIndependent akan meningkatkan poin $variableDependent sebesar $regressionResult[b] poin. Ini menunjukkan bahwa semakin besar $translatedVariables[$variableIndependent] yang dirasakan pengguna dari sistem, maka semakin positif $translatedVariables[$variableDependent] mereka terhadap sistem(3).",
                "$variableIndependent berdampak positif terhadap $variableDependent. Setiap peningkatan satu poin $variableIndependent akan meningkatkan poin $variableDependent sebesar $regressionResult[b] poin. Ini menunjukkan bahwa semakin besar $translatedVariables[$variableIndependent] yang dirasakan pengguna dari sistem, maka semakin besar $translatedVariables[$variableDependent] mereka untuk menggunakan sistem(4).",
                "Terdapat hubungan positif antara $variableIndependent dan $variableDependent. Setiap peningkatan satu poin $variableIndependent akan meningkatkan poin $variableDependent sebesar $regressionResult[b] poin. Ini menunjukkan bahwa semakin positif $translatedVariables[$variableIndependent] pengguna dalam menggunakan sistem, maka semakin besar $translatedVariables[$variableDependent] mereka untuk menggunakan sistem(5).",
                "Hasil regresi menunjukkan bahwa semakin tinggi $variableIndependent, semakin tinggi pula $variableDependent. Setiap peningkatan satu poin $variableIndependent akan meningkatkan poin $variableDependent sebesar $regressionResult[b] poin. Dengan demikian menunjukkan bahwa semakin besar $translatedVariables[$variableIndependent] pengguna untuk menggunkan sistem, maka semakin besar pula penggunaan $translatedVariables[$variableDependent] mereka terhadap sistem (6)."
            ];

            $kalimatNetral = [
                "Dari hasil regresi TAM, tidak ada hubungan yang signifikan antara $variableIndependent dan $variableDependent(1).",
                "$variableIndependent tidak menunjukkan pengaruh terhadap $variableDependent(2).",
                "Pengaruh $variableIndependent terhadap $variableDependent tidak begitu terlihat(3).",
                "$variableIndependent tidak berdampak terhadap $variableDependent(4).",
                "Tidak terdapat hubungan antara $variableIndependent dan $variableDependent(5).",
                "Hasil regresi menunjukkan bahwa tidak ada hubungan antara $variableIndependent dan $variableDependent(6)."
            ];

            $kalimatNegatif = [
                "Terdapat hubungan negatif antara $variableIndependent dan $variableDependent. Setiap peningkatan satu poin $variableIndependent akan mengurangi poin $variableDependent sebesar $regressionResult[b] poin. Ini menunjukkan bahwa semakin $translatedVariables[$variableIndependent] pengguna dalam menggunakan sistem, maka semakin kecil kemungkinan $translatedVariables[$variableDependent] yang dirasakan pengguna(1).",
                "$variableIndependent memberikan kontribusi negatif terhadap $variableDependent. Setiap peningkatan satu poin $variableIndependent akan mengurangi poin $variableDependent sebesar $regressionResult[b] poin. Ini menunjukkan bahwa semakin $translatedVariables[$variableIndependent] pengguna dalam menggunakan sistem, maka semakin negatif $translatedVariables[$variableDependent] mereka terhadap sistem(2).",
                "Pengaruh $variableIndependent terhadap $variableDependent terlihat negatif. Setiap peningkatan satu poin $variableIndependent akan mengurangi poin $variableDependent sebesar $regressionResult[b] poin. Ini menunjukkan bahwa semakin besar $translatedVariables[$variableIndependent] yang dirasakan pengguna dari sistem, maka semakin negatif $translatedVariables[$variableDependent] mereka terhadap sistem(3).",
                "$variableIndependent berdampak negatif terhadap $variableDependent. Setiap peningkatan satu poin $variableIndependent akan mengurangi poin $variableDependent sebesar $regressionResult[b] poin. Ini menunjukkan bahwa semakin besar $translatedVariables[$variableIndependent] yang dirasakan pengguna dari sistem, maka semakin kecil $translatedVariables[$variableDependent] mereka untuk menggunakan sistem(4).",
                "Terdapat hubungan negatif antara $variableIndependent dan $variableDependent. Setiap peningkatan satu poin $variableIndependent akan mengurangi poin $variableDependent sebesar $regressionResult[b] poin. Ini menunjukkan bahwa semakin positif $translatedVariables[$variableIndependent] pengguna dalam menggunakan sistem, maka semakin kecil $translatedVariables[$variableDependent] mereka untuk menggunakan sistem(5).",
                "Hasil regresi menunjukkan bahwa semakin tinggi $variableIndependent, maka $variableDependent akan semakin rendah . Setiap peningkatan satu poin $variableIndependent akan mengurangi poin $variableDependent sebesar $regressionResult[b] poin. Dengan demikian menunjukkan bahwa semakin besar $translatedVariables[$variableIndependent] pengguna untuk menggunkan sistem, maka semakin kecil penggunaan $translatedVariables[$variableDependent] mereka terhadap sistem (6)."
            ];




            // if ($regressionResult['a'] > 0) {
            //     $getResumeDescription[] = $kalimatPositif[$index];
            // } else if ($regressionResult['a'] == 0) {
            //     $getResumeDescription[] = $kalimatNetral[$index];
            // } else if ($regressionResult['a'] < 0) {
            //     $getResumeDescription[] = $kalimatNegatif[$index];
            // } else {
            //     $getResumeDescription[] = "Nilai tidak valid";
            // }

            if ($regressionResult['b'] > 0) {
                $getResumeDescription['Positif'][] = $kalimatPositif[$index];
            } else if ($regressionResult['b'] == 0) {
                $getResumeDescription['Netral'][] = $kalimatNetral[$index];
            } else if ($regressionResult['b'] < 0) {
                $getResumeDescription['Negatif'][] = $kalimatNegatif[$index];
            } else {
                $getResumeDescription[] = "Nilai tidak valid";
            }
        }

        return $getResumeDescription;
    }

    private function getTamResults($responsesFormated)
    {
        $tamSurveyResults = [];

        foreach ($responsesFormated as $response) {
            $responseData = json_decode($response->response_data, true)['response_data']['tam'];

            $tamSurveyResults[] = [
                'id' => $response->id,
                'respondentName' => $response->first_name . " " . $response->surname,
                'answerData' => $responseData,
            ];
        }

        return $tamSurveyResults;
    }

    public function export($survey_id)
    {
        $survey = Survey::find($survey_id);
        $surveyName = $survey->title;
        $dateTime = now()->format('Y-m-d H.i');
        $dateTimeFormatted = str_replace(' ', '-', $dateTime);
        $fileName = $surveyName . '_' . $dateTimeFormatted . '_TAM_export.xlsx';

        return Excel::download(new ResponsesTAMExport($survey_id), $fileName);
    }
}
