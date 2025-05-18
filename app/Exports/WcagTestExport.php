<?php

namespace App\Exports;

use App\Models\Survey;
use App\Models\WcagTestResult;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class WcagTestExport implements FromCollection, WithHeadings, WithMapping, WithTitle, ShouldAutoSize, WithStyles
{
    protected $survey_id;
    protected $wcagResults;

    public function __construct($survey_id)
    {
        $this->survey_id = $survey_id;

        // Get the latest test result from the database
        $latestResult = WcagTestResult::where('survey_id', $survey_id)
            ->latest()
            ->first();

        if ($latestResult) {
            $this->wcagResults = [
                'issues' => $latestResult->issues_data,
                'url' => $latestResult->url,
                'timestamp' => $latestResult->created_at,
            ];
        } else {
            $this->wcagResults = [
                'issues' => [],
                'url' => '',
                'timestamp' => now(),
            ];
        }
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
            'Solution',
            'Resources'
        ];
    }

    public function map($issue): array
    {
        $resources = '';
        if (isset($issue['solution']['resources'])) {
            foreach ($issue['solution']['resources'] as $title => $url) {
                $resources .= "{$title}: {$url}\n";
            }
        }

        return [
            $issue['id'] ?? 'N/A',
            ucfirst($issue['impact'] ?? 'unknown'),
            $issue['conformance_level'] ?? 'A',
            $issue['description'] ?? 'No description',
            $issue['wcag_criterion'] ?? 'Unknown',
            $issue['element'] ?? 'Unknown',
            $issue['location'] ?? 'Unknown',
            $issue['solution']['description'] ?? 'No solution provided',
            $resources
        ];
    }

    public function title(): string
    {
        $survey = Survey::find($this->survey_id);
        return 'WCAG Testing - ' . ($survey ? $survey->title : 'Unknown');
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
