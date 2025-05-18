<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Models\SurveyResponses;
use App\Models\Survey;
use App\Models\SurveyQuestions;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ResponsesABTestExport;
use Illuminate\Support\Facades\Cache;
use App\Services\TextAnalysisService;

class AbTestController extends Controller
{
    protected $textAnalysisService;

    public function __construct(TextAnalysisService $textAnalysisService)
    {
        $this->textAnalysisService = $textAnalysisService;
    }

    public function index(Request $request)
    {
        $user = auth()->user();

        if (auth()->user()->hasPermissionTo('ab_test.index.full')) {
            $surveyTitles = Survey::whereHas('methods', function ($query) {
                $query->where('method_id', 3); // A/B Testing method ID
            })
                ->get(['surveys.id', 'surveys.title']);

            if ($surveyTitles->isEmpty()) {
                return redirect()->route('account.surveys.create');
            }
        } else {
            $surveyTitles = Survey::where('user_id', $user->id)
                ->whereHas('methods', function ($query) {
                    $query->where('method_id', 3); // A/B Testing method ID
                })
                ->get(['surveys.id', 'surveys.title']);

            if ($surveyTitles->isEmpty()) {
                return redirect()->route('account.surveys.create');
            }
        }

        $sortedSurveyTitles = $surveyTitles->sortBy('id');
        $lowestTitleId = $sortedSurveyTitles->first()->id;

        return redirect()->route('account.ab_test.id', ['id' => $lowestTitleId]);
    }

    public function show(Request $request, $id)
    {
        $userID = auth()->user()->id;
        $survey = Survey::find($id);
        $surveyName = $survey->title;
        $surveyTheme = $survey->theme;

        $cacheExpiredMinutes = 2 * 60;

        if (!auth()->user()->hasPermissionTo('ab_test.index.full') && $survey->user_id != $userID) {
            return abort(403, 'Unauthorized');
        }

        if (auth()->user()->hasPermissionTo('ab_test.index.full')) {
            $surveyTitles = Survey::whereHas('methods', function ($query) {
                $query->where('method_id', 3);
            })
                ->get(['surveys.id', 'surveys.title']);
        } else {
            $surveyTitles = Survey::where('user_id', $userID)
                ->whereHas('methods', function ($query) {
                    $query->where('method_id', 3);
                })
                ->get(['surveys.id', 'surveys.title']);
        }

        $abTestQuestions = SurveyQuestions::where('survey_id', $id)->get();

        $responses = Cache::remember('responses-abtest-' . $id, $cacheExpiredMinutes, function () use ($id) {
            return SurveyResponses::where('survey_id', $id)
                ->where('response_data', 'LIKE', '%"ab_testing"%')
                ->get();
        });

        $respondentCount = $this->countRespondents($id);
        $demographicRespondents = $this->demographicRespondents($responses);
        $abTestResults = $this->calculateABTestResults($responses);
        $abTestSurveyResults = $this->getABTestResults($responses);

        return inertia('Account/ABTest/Index', [
            'surveyTitles' => $surveyTitles,
            'survey' => $survey,
            'respondentCount' => $respondentCount,
            'demographicRespondents' => $demographicRespondents,
            'abTestResults' => $abTestResults,
            'abTestSurveyResults' => $abTestSurveyResults,
            'abTestQuestions' => $abTestQuestions
        ])->with('currentSurveyTitle', $survey->title);
    }

    private function countRespondents($surveyId)
    {
        $totalResponsesWithABTest = SurveyResponses::where('survey_id', $surveyId)
            ->where('response_data', 'LIKE', '%"ab_testing"%')
            ->count();

        return $totalResponsesWithABTest;
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

    private function calculateABTestResults($responses)
    {
        if ($responses->isEmpty()) {
            return [];
        }

        $results = [];

        foreach ($responses as $response) {
            $responseData = json_decode($response->response_data, true);

            if (!isset($responseData['ab_testing']) || !is_array($responseData['ab_testing'])) {
                continue;
            }

            foreach ($responseData['ab_testing'] as $group) {
                $groupName = $group['name'];

                if (!isset($results[$groupName])) {
                    $results[$groupName] = [];
                }

                foreach ($group['responses'] as $comparisonResponse) {
                    $comparisonId = $comparisonResponse['id'];

                    if (!isset($results[$groupName][$comparisonId])) {
                        $results[$groupName][$comparisonId] = [
                            'a' => 0,
                            'b' => 0,
                            'total' => 0,
                            'reasons_a' => [],
                            'reasons_b' => []
                        ];
                    }

                    $selected = $comparisonResponse['selected'];
                    $reason = isset($comparisonResponse['reason']) ? $comparisonResponse['reason'] : '';

                    $results[$groupName][$comparisonId][$selected]++;
                    $results[$groupName][$comparisonId]['total']++;

                    if (!empty($reason)) {
                        $results[$groupName][$comparisonId]["reasons_{$selected}"][] = $reason;
                    }
                }
            }
        }

        // Calculate percentages and add analysis
        foreach ($results as $groupName => $comparisons) {
            foreach ($comparisons as $comparisonId => $data) {
                if ($data['total'] > 0) {
                    $results[$groupName][$comparisonId]['a_percentage'] = round(($data['a'] / $data['total']) * 100, 1);
                    $results[$groupName][$comparisonId]['b_percentage'] = round(($data['b'] / $data['total']) * 100, 1);
                } else {
                    $results[$groupName][$comparisonId]['a_percentage'] = 0;
                    $results[$groupName][$comparisonId]['b_percentage'] = 0;
                }

                // Add theme analysis based on votes and reason counts
                if ((count($data['reasons_a']) >= 2 || count($data['reasons_b']) >= 2)) {
                    // Determine which variant to analyze based on vote counts
                    if ($data['a'] > $data['b']) {
                        // Variant A has more votes
                        if (count($data['reasons_a']) >= 2) {
                            $themeAnalysis = $this->textAnalysisService->summarizeReasons($data['reasons_a']);
                            if ($themeAnalysis) {
                                $results[$groupName][$comparisonId]['theme_analysis'] = [
                                    'variant_a' => $themeAnalysis,
                                    'single_variant' => true,
                                    'analyzed_variant' => 'a'
                                ];
                            }
                        }
                    } elseif ($data['b'] > $data['a']) {
                        // Variant B has more votes
                        if (count($data['reasons_b']) >= 2) {
                            $themeAnalysis = $this->textAnalysisService->summarizeReasons($data['reasons_b']);
                            if ($themeAnalysis) {
                                $results[$groupName][$comparisonId]['theme_analysis'] = [
                                    'variant_b' => $themeAnalysis,
                                    'single_variant' => true,
                                    'analyzed_variant' => 'b'
                                ];
                            }
                        }
                    } else {
                        // It's a tie - analyze both if they have enough reasons
                        if (count($data['reasons_a']) >= 2 && count($data['reasons_b']) >= 2) {
                            $themeAnalysis = $this->textAnalysisService->extractThemes(
                                $data['reasons_a'],
                                $data['reasons_b']
                            );

                            if ($themeAnalysis) {
                                $results[$groupName][$comparisonId]['theme_analysis'] = $themeAnalysis;
                            }
                        }
                    }
                }

                // Add reason summaries if there are enough reasons
                // if (count($data['reasons_a']) >= 5) {
                //     $reasonSummaryA = $this->textAnalysisService->summarizeReasons($data['reasons_a']);
                //     if ($reasonSummaryA) {
                //         $results[$groupName][$comparisonId]['reason_summary_a'] = $reasonSummaryA;
                //     }
                // }

                // if (count($data['reasons_b']) >= 5) {
                //     $reasonSummaryB = $this->textAnalysisService->summarizeReasons($data['reasons_b']);
                //     if ($reasonSummaryB) {
                //         $results[$groupName][$comparisonId]['reason_summary_b'] = $reasonSummaryB;
                //     }
                // }
                // Replace the existing theme analysis code with this simpler approach
                // Add text summaries for reasons
                if (count($data['reasons_a']) >= 2) {
                    $textSummaryA = $this->textAnalysisService->generateSummary($data['reasons_a']);
                    if ($textSummaryA) {
                        $results[$groupName][$comparisonId]['text_summary_a'] = $textSummaryA;
                    }
                }

                if (count($data['reasons_b']) >= 2) {
                    $textSummaryB = $this->textAnalysisService->generateSummary($data['reasons_b']);
                    if ($textSummaryB) {
                        $results[$groupName][$comparisonId]['text_summary_b'] = $textSummaryB;
                    }
                }
            }
        }

        return $results;
    }

    private function getABTestResults($responses)
    {
        $abTestSurveyResults = [];

        foreach ($responses as $response) {
            $responseData = json_decode($response->response_data, true);

            if (!isset($responseData['ab_testing'])) {
                continue;
            }

            $abTestSurveyResults[] = [
                'id' => $response->id,
                'respondentName' => $response->first_name . " " . $response->surname,
                'answerData' => $responseData['ab_testing'],
            ];
        }

        return $abTestSurveyResults;
    }

    public function export($survey_id)
    {
        $survey = Survey::find($survey_id);
        $surveyName = $survey->title;
        $dateTime = now()->format('Y-m-d H.i');
        $dateTimeFormatted = str_replace(' ', '-', $dateTime);
        $fileName = $surveyName . '_' . $dateTimeFormatted . '_ABTest_export.xlsx';

        return Excel::download(new ResponsesABTestExport($survey_id), $fileName);
    }
}
