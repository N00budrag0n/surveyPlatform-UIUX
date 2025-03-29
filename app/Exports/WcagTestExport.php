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
use Illuminate\Support\Facades\Http;

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
            try {
                // Call our Node.js accessibility testing service
                $response = Http::timeout(60)->post('http://localhost:3000/analyze', [
                    'url' => $survey->url_website,
                    'standard' => 'wcag21',
                    'level' => 'aaa' // Test against all levels (A, AA, AAA)
                ]);

                if ($response->successful()) {
                    return $response->json();
                } else {
                    return [
                        'success' => false,
                        'error' => 'Failed to analyze website: ' . $response->body(),
                        'issues' => []
                    ];
                }
            } catch (\Exception $e) {
                return [
                    'success' => false,
                    'error' => 'Failed to analyze website: ' . $e->getMessage(),
                    'issues' => []
                ];
            }
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
            'WCAG Level',
            'Description',
            'WCAG Criterion',
            'Element',
            'Location',
            'Failure Summary'
        ];
    }

    public function map($issue): array
    {
        return [
            $issue['id'],
            ucfirst($issue['impact']),
            $issue['conformance_level'] ?? 'A',
            $issue['description'],
            $issue['wcag_criterion'],
            $issue['element'],
            $issue['location'],
            $issue['failureSummary'] ?? ''
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
}
