<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Models\Survey;
use App\Models\SurveyResponses;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\WcagTestExport;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WcagTestController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        if (auth()->user()->hasPermissionTo('wcag_test.index.full')) {
            $surveyTitles = Survey::whereHas('methods', function ($query) {
                $query->where('method_id', 4); // WCAG Testing method ID
            })
                ->get(['surveys.id', 'surveys.title']);
        } else {
            $surveyTitles = Survey::where('user_id', $user->id)
                ->whereHas('methods', function ($query) {
                    $query->where('method_id', 4); // WCAG Testing method ID
                })
                ->get(['surveys.id', 'surveys.title']);

            if ($surveyTitles->isEmpty()) {
                return redirect()->route('account.surveys.create');
            }
        }

        $sortedSurveyTitles = $surveyTitles->sortBy('id');
        $lowestTitleId = $sortedSurveyTitles->first()->id;

        return redirect()->route('account.wcag_test.id', ['id' => $lowestTitleId]);
    }

    public function show(Request $request, $id)
    {
        $userID = auth()->user()->id;
        $survey = Survey::find($id);

        if (!$survey) {
            return abort(404, 'Survey not found');
        }

        if (!auth()->user()->hasPermissionTo('wcag_test.index.full') && $survey->user_id != $userID) {
            return abort(403, 'Unauthorized');
        }

        if (auth()->user()->hasPermissionTo('wcag_test.index.full')) {
            $surveyTitles = Survey::whereHas('methods', function ($query) {
                    $query->where('method_id', 4);
                })
                ->get(['surveys.id', 'surveys.title']);
        } else {
            $surveyTitles = Survey::where('user_id', $userID)
                ->whereHas('methods', function ($query) {
                    $query->where('method_id', 4);
                })
                ->get(['surveys.id', 'surveys.title']);
        }

        // Get WCAG test results from cache or run new test
        $wcagResults = Cache::remember('wcag-test-' . $id, 60 * 24, function () use ($survey) {
            return $this->runWcagTest($survey->url_website);
        });

        // If the test failed, return with error
        if (!$wcagResults['success']) {
            return inertia('Account/WcagTest/Index', [
                'surveyTitles' => $surveyTitles,
                'survey' => $survey,
                'wcagResults' => $wcagResults,
                'complianceScore' => 0,
                'issuesByCategory' => [],
                'issuesByLevel' => []
            ]);
        }

        $complianceScore = $this->calculateComplianceScore($wcagResults);
        $issuesByCategory = $this->categorizeIssuesByPrinciple($wcagResults);
        $issuesByLevel = $this->categorizeIssuesByLevel($wcagResults);

        return inertia('Account/WcagTest/Index', [
            'surveyTitles' => $surveyTitles,
            'survey' => $survey,
            'wcagResults' => $wcagResults,
            'complianceScore' => $complianceScore,
            'issuesByCategory' => $issuesByCategory,
            'issuesByLevel' => $issuesByLevel
        ]);
    }

    private function runWcagTest($url)
    {
        try {
            // Call our Node.js accessibility testing service
            $response = Http::timeout(60)->post('http://localhost:3000/analyze', [
                'url' => $url,
                'standard' => 'wcag21',
                'level' => 'aaa' // Test against all levels (A, AA, AAA)
            ]);

            if ($response->successful()) {
                return $response->json();
            } else {
                Log::error('WCAG testing API error: ' . $response->body());
                return [
                    'success' => false,
                    'error' => 'Failed to analyze website: ' . $response->body(),
                    'issues' => []
                ];
            }
        } catch (\Exception $e) {
            Log::error('WCAG testing failed: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => 'Failed to analyze website: ' . $e->getMessage(),
                'issues' => []
            ];
        }
    }

    private function calculateComplianceScore($results)
    {
        if (!isset($results['issues']) || !is_array($results['issues']) || empty($results['issues'])) {
            return 100; // Perfect score if no issues
        }

        // Count issues by impact and level
        $issuesByImpact = [
            'critical' => 0,
            'serious' => 0,
            'moderate' => 0,
            'minor' => 0
        ];

        $issuesByLevel = [
            'A' => 0,
            'AA' => 0,
            'AAA' => 0
        ];

        foreach ($results['issues'] as $issue) {
            $impact = $issue['impact'] ?? 'moderate';
            $level = $issue['conformance_level'] ?? 'A';

            $issuesByImpact[$impact]++;
            $issuesByLevel[$level]++;
        }

        // Calculate weighted score
        // Critical issues have the highest weight, especially at level A
        $weights = [
            'critical' => ['A' => 10, 'AA' => 8, 'AAA' => 5],
            'serious' => ['A' => 7, 'AA' => 5, 'AAA' => 3],
            'moderate' => ['A' => 4, 'AA' => 3, 'AAA' => 2],
            'minor' => ['A' => 2, 'AA' => 1, 'AAA' => 0.5]
        ];

        $totalWeight = 0;
        $maxPossibleWeight = 0;

        foreach ($results['issues'] as $issue) {
            $impact = $issue['impact'] ?? 'moderate';
            $level = $issue['conformance_level'] ?? 'A';

            $totalWeight += $weights[$impact][$level];
        }

        // Calculate maximum possible weight based on total issues
        $totalIssues = count($results['issues']);
        $maxPossibleWeight = $totalIssues * $weights['critical']['A']; // Worst case: all issues are critical level A

        // Calculate score (higher is better)
        // Base score of 100, subtract weighted percentage
        if ($maxPossibleWeight > 0) {
            $score = 100 - (($totalWeight / $maxPossibleWeight) * 100);
        } else {
            $score = 100;
        }

        return round($score, 1);
    }

    private function categorizeIssuesByPrinciple($results)
    {
        if (!isset($results['issues']) || !is_array($results['issues'])) {
            return [];
        }

        $categories = [
            'Perceivable' => [],
            'Operable' => [],
            'Understandable' => [],
            'Robust' => []
        ];

        foreach ($results['issues'] as $issue) {
            $criteria = explode(', ', $issue['wcag_criterion']);

            foreach ($criteria as $criterion) {
                $firstDigit = substr($criterion, 0, 1);

                switch ($firstDigit) {
                    case '1':
                        $categories['Perceivable'][] = $issue;
                        break;
                    case '2':
                        $categories['Operable'][] = $issue;
                        break;
                    case '3':
                        $categories['Understandable'][] = $issue;
                        break;
                    case '4':
                        $categories['Robust'][] = $issue;
                        break;
                }
            }
        }

        return $categories;
    }

    private function categorizeIssuesByLevel($results)
    {
        if (!isset($results['issues']) || !is_array($results['issues'])) {
            return [];
        }

        $levels = [
            'A' => [],
            'AA' => [],
            'AAA' => []
        ];

        foreach ($results['issues'] as $issue) {
            $level = $issue['conformance_level'] ?? 'A';
            $levels[$level][] = $issue;
        }

        return $levels;
    }

    public function export($survey_id)
    {
        $survey = Survey::find($survey_id);
        $surveyName = $survey->title;
        $dateTime = now()->format('Y-m-d H.i');
        $dateTimeFormatted = str_replace(' ', '-', $dateTime);
        $fileName = $surveyName . '_' . $dateTimeFormatted . '_WCAG_export.xlsx';

        return Excel::download(new WcagTestExport($survey_id), $fileName);
    }
}
