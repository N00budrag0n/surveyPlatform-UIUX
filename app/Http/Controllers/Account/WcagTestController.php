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

        $complianceScore = $this->calculateComplianceScore($wcagResults);
        $issuesByCategory = $this->categorizeIssues($wcagResults);

        return inertia('Account/WcagTest/Index', [
            'surveyTitles' => $surveyTitles,
            'survey' => $survey,
            'wcagResults' => $wcagResults,
            'complianceScore' => $complianceScore,
            'issuesByCategory' => $issuesByCategory
        ]);
    }

    private function runWcagTest($url)
    {
        // For a real implementation, you would integrate with an accessibility testing API
        // such as axe-core, WAVE API, or similar services

        // Example using a hypothetical API (replace with actual API integration)
        try {
            // This is a placeholder. In a real implementation, you would:
            // 1. Call an external WCAG testing API
            // 2. Process the results
            // 3. Return structured data

            // Simulated API call (replace with actual implementation)
            // $response = Http::get('https://wcag-testing-api.example.com/analyze', [
            //     'url' => $url,
            //     'standard' => 'WCAG2.1',
            //     'level' => 'AA'
            // ]);

            // For demonstration, return mock data
            return $this->getMockWcagResults($url);

        } catch (\Exception $e) {
            \Log::error('WCAG testing failed: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => 'Failed to analyze website: ' . $e->getMessage(),
                'issues' => []
            ];
        }
    }

    private function getMockWcagResults($url)
    {
        // This is mock data for demonstration purposes
        // In a real implementation, this would come from an actual WCAG testing service
        return [
            'success' => true,
            'url' => $url,
            'timestamp' => now()->toIso8601String(),
            'standard' => 'WCAG 2.1',
            'level' => 'AA',
            'issues' => [
                [
                    'id' => 'image-alt',
                    'impact' => 'critical',
                    'description' => 'Images must have alternate text',
                    'wcag_criterion' => '1.1.1',
                    'element' => '<img src="logo.png">',
                    'location' => 'header',
                    'count' => 3
                ],
                [
                    'id' => 'color-contrast',
                    'impact' => 'serious',
                    'description' => 'Elements must have sufficient color contrast',
                    'wcag_criterion' => '1.4.3',
                    'element' => '<p style="color: #aaa; background-color: #eee;">Text</p>',
                    'location' => 'main content',
                    'count' => 5
                ],
                [
                    'id' => 'keyboard-nav',
                    'impact' => 'critical',
                    'description' => 'All functionality must be available from a keyboard',
                    'wcag_criterion' => '2.1.1',
                    'element' => '<div onclick="doSomething()">Click me</div>',
                    'location' => 'navigation',
                    'count' => 2
                ],
                [
                    'id' => 'heading-order',
                    'impact' => 'moderate',
                    'description' => 'Heading levels should only increase by one',
                    'wcag_criterion' => '1.3.1',
                    'element' => '<h1>Title</h1><h3>Subtitle</h3>',
                    'location' => 'article',
                    'count' => 1
                ],
                [
                    'id' => 'form-labels',
                    'impact' => 'serious',
                    'description' => 'Form elements must have labels',
                    'wcag_criterion' => '3.3.2',
                    'element' => '<input type="text">',
                    'location' => 'contact form',
                    'count' => 4
                ]
            ]
        ];
    }

    private function calculateComplianceScore($results)
    {
        if (!isset($results['issues']) || !is_array($results['issues'])) {
            return 0;
        }

        $issues = $results['issues'];
        $totalIssues = count($issues);

        if ($totalIssues === 0) {
            return 100; // Perfect score if no issues
        }

        // Weight issues by impact
        $weightedIssues = 0;
        foreach ($issues as $issue) {
            switch ($issue['impact']) {
                case 'critical':
                    $weightedIssues += 3 * $issue['count'];
                    break;
                case 'serious':
                    $weightedIssues += 2 * $issue['count'];
                    break;
                case 'moderate':
                    $weightedIssues += 1 * $issue['count'];
                    break;
                case 'minor':
                    $weightedIssues += 0.5 * $issue['count'];
                    break;
            }
        }

        // Calculate score (higher is better)
        // Base score of 100, subtract weighted issues
        $score = max(0, 100 - ($weightedIssues * 2));

        return round($score, 1);
    }

    private function categorizeIssues($results)
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
            $criterion = $issue['wcag_criterion'];
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

        return $categories;
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
