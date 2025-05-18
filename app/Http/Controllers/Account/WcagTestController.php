<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Survey;
use App\Models\WcagTestResult;
use App\Models\AccessibilitySolution;
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

            if ($surveyTitles->isEmpty()) {
                return redirect()->route('account.surveys.create');
            }
        } else {
            $surveyTitles = Survey::where('user_id', $user->id)
                ->whereHas('methods', function ($query) {
                    $query->where('method_id', 4); // WCAG Testing method ID
                })
                ->get(['surveys.id', 'surveys.title']);

            if ($surveyTitles->isEmpty()) {
                return redirect()->route('account.surveys.create')->with('info', 'Create a survey with WCAG Testing method to use this feature.');
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

        // Get the latest test result from the database
        $latestResult = WcagTestResult::where('survey_id', $id)
            ->latest()
            ->first();

        // Get all historical results for this survey for the chart
        $historicalResults = WcagTestResult::where('survey_id', $id)
            ->select('id', 'compliance_score', 'conformance_level', 'created_at')
            ->orderBy('created_at')
            ->get();

        // Prepare chart data
        $chartData = [
            'labels' => $historicalResults->pluck('created_at')->map(function ($date) {
                return $date->format('M d, Y');
            }),
            'scores' => $historicalResults->pluck('compliance_score'),
            'levels' => $historicalResults->pluck('conformance_level'),
        ];

        // If no test has been run yet, run one now
        if (!$latestResult && $survey->url_website) {
            // Run the test
            $wcagResults = $this->runWcagTest($survey->url_website);

            if ($wcagResults['success']) {
                $complianceScore = $this->calculateComplianceScore($wcagResults);
                $conformanceLevel = $this->determineConformanceLevel($complianceScore);

                // Save the results to the database
                $latestResult = WcagTestResult::create([
                    'survey_id' => $survey->id,
                    'user_id' => auth()->user()->id,
                    'url' => $survey->url_website,
                    'compliance_score' => $complianceScore,
                    'conformance_level' => $conformanceLevel,
                    'summary_data' => $wcagResults['summary'] ?? [],
                    'issues_data' => $wcagResults['issues'] ?? [],
                ]);

                // Update chart data
                $chartData = [
                    'labels' => [$latestResult->created_at->format('M d, Y')],
                    'scores' => [$complianceScore],
                    'levels' => [$conformanceLevel],
                ];
            }
        }

        // Parse the detailed issues data if we have results
        if ($latestResult) {
            $wcagResults = [
                'success' => true,
                'url' => $latestResult->url,
                'timestamp' => $latestResult->created_at->toIso8601String(),
                'standard' => 'WCAG 2.1',
                'level' => $latestResult->conformance_level,
                'summary' => $latestResult->summary_data,
                'issues' => $latestResult->issues_data,
            ];

            $complianceScore = $latestResult->compliance_score;
            $issuesByCategory = $this->categorizeIssuesByPrinciple($wcagResults);
            $issuesByLevel = $this->categorizeIssuesByLevel($wcagResults);

            // Get solutions for the issues
            $issues = $wcagResults['issues'];
            $issuesWithSolutions = $this->addSolutionsToIssues($issues);
            $wcagResults['issues'] = $issuesWithSolutions;
        } else {
            $wcagResults = [
                'success' => false,
                'error' => $survey->url_website ? 'Testing failed or no test results available.' : 'No website URL provided in the survey.',
                'issues' => []
            ];
            $complianceScore = 0;
            $issuesByCategory = [];
            $issuesByLevel = [];
        }

        return inertia('Account/WcagTest/Index', [
            'surveyTitles' => $surveyTitles,
            'survey' => $survey,
            'wcagResults' => $wcagResults,
            'complianceScore' => $complianceScore,
            'issuesByCategory' => $issuesByCategory,
            'issuesByLevel' => $issuesByLevel,
            'chartData' => $chartData,
            'canRetest' => !empty($survey->url_website),
            'lastTestedAt' => $latestResult ? $latestResult->created_at->diffForHumans() : null
        ]);
    }

    public function retest(Request $request, $id)
    {
        $survey = Survey::findOrFail($id);

        // Check permissions
        if (!auth()->user()->hasPermissionTo('wcag_test.index.full') && $survey->user_id != auth()->user()->id) {
            return abort(403, 'Unauthorized');
        }

        if (empty($survey->url_website)) {
            return redirect()->route('account.wcag_test.id', ['id' => $id])
                ->with('error', 'No website URL provided in the survey. Please edit the survey to add a URL.');
        }

        // Clear the cache for this survey
        Cache::forget('wcag-test-' . $id);

        // Run the test and store the results
        $wcagResults = $this->runWcagTest($survey->url_website);

        if ($wcagResults['success']) {
            $complianceScore = $this->calculateComplianceScore($wcagResults);
            $conformanceLevel = $this->determineConformanceLevel($complianceScore);

            // Save the results to the database
            WcagTestResult::create([
                'survey_id' => $survey->id,
                'user_id' => auth()->user()->id,
                'url' => $survey->url_website,
                'compliance_score' => $complianceScore,
                'conformance_level' => $conformanceLevel,
                'summary_data' => $wcagResults['summary'] ?? [],
                'issues_data' => $wcagResults['issues'] ?? [],
            ]);

            return redirect()->route('account.wcag_test.id', ['id' => $id])
                ->with('success', 'Website re-tested successfully!');
        } else {
            return redirect()->route('account.wcag_test.id', ['id' => $id])
                ->withErrors(['error', 'Failed to test website: ' . ($wcagResults['error'] ?? 'Unknown error')]);
        }
    }

    private function runWcagTest($url)
    {
        try {
            // Call our Node.js accessibility testing service
            $response = Http::timeout(60)->post(env('WCAG_TESTING_SERVICE_URL', 'http://localhost:3000/analyze'), [
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
        if ($maxPossibleWeight > 0) {
            $score = 100 - (($totalWeight / $maxPossibleWeight) * 100);
        } else {
            $score = 100;
        }

        return round($score, 1);
    }

    private function determineConformanceLevel($score)
    {
        if ($score >= 95)
            return 'AAA';
        if ($score >= 85)
            return 'AA';
        if ($score >= 70)
            return 'A';
        return 'Non-conformant';
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

    private function addSolutionsToIssues($issues)
    {
        // Get the accessibility solutions database
        $solutions = $this->getAccessibilitySolutions();

        // Add solutions to each issue
        foreach ($issues as &$issue) {
            $issueId = $issue['id'];
            if (isset($solutions[$issueId])) {
                $issue['solution'] = $solutions[$issueId];
            } else {
                $issue['solution'] = $this->getGenericSolution($issue);
            }
        }

        return $issues;
    }

    private function getAccessibilitySolutions()
    {
        // Fetch from database if available
        $dbSolutions = AccessibilitySolution::all();
        $solutions = [];

        if ($dbSolutions->count() > 0) {
            foreach ($dbSolutions as $solution) {
                $solutions[$solution->issue_id] = [
                    'title' => $solution->title,
                    'description' => $solution->description,
                    'example' => $solution->example,
                    'resources' => $solution->resources,
                ];
            }
            return $solutions;
        }

        // Fallback to hardcoded solutions
        return [
            'image-alt' => [
                'title' => 'Add Alternative Text to Images',
                'description' => 'All images must have an alt attribute that describes the image. If the image is decorative, use alt="".',
                'example' => '<img src="logo.png" alt="Company Logo">',
                'resources' => [
                    'WAI Tutorial - Images' => 'https://www.w3.org/WAI/tutorials/images/',
                    'WebAIM - Alternative Text' => 'https://webaim.org/techniques/alttext/'
                ]
            ],
            'color-contrast' => [
                'title' => 'Improve Color Contrast',
                'description' => 'Text must have sufficient contrast against its background. For normal text, the contrast ratio should be at least 4.5:1. For large text, it should be at least 3:1.',
                'example' => 'Use tools like the WebAIM Contrast Checker to verify your color combinations.',
                'resources' => [
                    'WebAIM Contrast Checker' => 'https://webaim.org/resources/contrastchecker/',
                    'Understanding WCAG 1.4.3' => 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html'
                ]
            ],
            'keyboard-nav' => [
                'title' => 'Ensure Keyboard Accessibility',
                'description' => 'All functionality must be available using only a keyboard. Replace "onclick" handlers with proper button or link elements, or add keyboard event handlers.',
                'example' => '<button onclick="doSomething()">Click me</button> instead of <div onclick="doSomething()">Click me</div>',
                'resources' => [
                    'WebAIM - Keyboard Accessibility' => 'https://webaim.org/techniques/keyboard/',
                    'Understanding WCAG 2.1.1' => 'https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html'
                ]
            ],
            'heading-order' => [
                'title' => 'Fix Heading Structure',
                'description' => 'Headings should form a logical outline, and heading levels should only increase by one. Never skip heading levels (e.g., from h1 to h3).',
                'example' => '<h1>Title</h1>\n<h2>Subtitle</h2> instead of <h1>Title</h1>\n<h3>Subtitle</h3>',
                'resources' => [
                    'WebAIM - Semantic Structure' => 'https://webaim.org/techniques/semanticstructure/',
                    'Understanding WCAG 1.3.1' => 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html'
                ]
            ],
            'form-labels' => [
                'title' => 'Add Labels to Form Controls',
                'description' => 'All form controls must have associated label elements. Use the "for" attribute to associate labels with form controls.',
                'example' => '<label for="name">Name:</label>\n<input type="text" id="name">',
                'resources' => [
                    'WebAIM - Creating Accessible Forms' => 'https://webaim.org/techniques/forms/',
                    'Understanding WCAG 3.3.2' => 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html'
                ]
            ],
            'aria-required-attr' => [
                'title' => 'Add Required ARIA Attributes',
                'description' => 'ARIA roles require specific attributes to function correctly. Make sure all required attributes are present.',
                'example' => '<div role="checkbox" aria-checked="false">Option</div>',
                'resources' => [
                    'WAI-ARIA Authoring Practices' => 'https://www.w3.org/TR/wai-aria-practices-1.1/',
                    'MDN: ARIA' => 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA'
                ]
            ],
            'aria-roles' => [
                'title' => 'Use Correct ARIA Roles',
                'description' => 'ARIA roles must be valid and appropriate for the element they are applied to.',
                'example' => '<nav role="navigation">...</nav> (though in this example, the role is redundant with the nav element)',
                'resources' => [
                    'WAI-ARIA Roles Model' => 'https://www.w3.org/TR/wai-aria-1.1/#roles',
                    'Using ARIA' => 'https://www.w3.org/TR/using-aria/'
                ]
            ]
        ];
    }

    private function getGenericSolution($issue)
    {
        // Generate a generic solution based on the issue type
        $impact = $issue['impact'] ?? 'moderate';
        $description = $issue['description'] ?? '';
        $criterion = $issue['wcag_criterion'] ?? '';

        return [
            'title' => 'Fix ' . ucfirst($impact) . ' Issue: ' . $description,
            'description' => 'This issue violates WCAG 2.1 criterion ' . $criterion . '. Review the element and make necessary changes to ensure it meets accessibility standards.',
            'example' => 'Refer to the WCAG guidelines for specific implementation examples.',
            'resources' => [
                'WCAG Understanding ' . $criterion => 'https://www.w3.org/WAI/WCAG21/Understanding/' . str_replace('.', '-', $criterion),
                'WebAIM Articles' => 'https://webaim.org/articles/'
            ]
        ];
    }

    public function export($survey_id)
    {
        $survey = Survey::find($survey_id);
        if (!$survey) {
            return abort(404, 'Survey not found');
        }

        $surveyName = $survey->title;
        $dateTime = now()->format('Y-m-d H.i');
        $dateTimeFormatted = str_replace(' ', '-', $dateTime);
        $fileName = $surveyName . '_' . $dateTimeFormatted . '_WCAG_export.xlsx';

        return Excel::download(new WcagTestExport($survey_id), $fileName);
    }
}
