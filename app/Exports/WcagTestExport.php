<?php

namespace App\Exports;

use App\Models\Survey;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Illuminate\Support\Facades\Cache;

class WcagTestExport implements FromCollection, WithHeadings, WithMapping, WithTitle, ShouldAutoSize, WithStyles
{
    protected $survey_id;
    protected $wcagResults;

    public function __construct($survey_id)
    {
        $this->survey_id = $survey_id;
        $survey = Survey::find($survey_id);

        // Get cached WCAG results or run the test again
        $this->wcagResults = Cache::remember('wcag-test-' . $survey_id, 60 * 24, function () use ($survey) {
            // This would call the same testing logic as in the controller
            // For simplicity, we'll use mock data here
            return $this->getMockWcagResults($survey->url_website);
        });
    }

    public function collection()
    {
        // Convert the issues array to a collection
        return collect($this->wcagResults['issues'] ?? []);
    }

    public function headings(): array
    {
        return [
            'Issue ID',
            'Impact Level',
            'Description',
            'WCAG Criterion',
            'Element',
            'Location',
            'Occurrences'
        ];
    }

    public function map($issue): array
    {
        return [
            $issue['id'],
            ucfirst($issue['impact']),
            $issue['description'],
            $issue['wcag_criterion'],
            $issue['element'],
            $issue['location'],
            $issue['count']
        ];
    }

    public function title(): string
    {
        $survey = Survey::find($this->survey_id);
        return 'WCAG Testing - ' . $survey->title;
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }

    private function getMockWcagResults($url)
    {
        // Same mock data function as in the controller
        // In a real implementation, this would be a shared service
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
}
