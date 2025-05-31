<?php

namespace App\Exports;

use App\Models\Survey;
use App\Models\WcagTestResult;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;

class WcagTestExport implements WithMultipleSheets
{
    use Exportable;
    
    protected $survey_ids;

    public function __construct($survey_ids)
    {
        $this->survey_ids = is_array($survey_ids) ? $survey_ids : [$survey_ids];
    }

    public function sheets(): array
    {
        $sheets = [];
        
        // Add summary sheet first if multiple surveys
        if (count($this->survey_ids) > 1) {
            $sheets[] = new WcagSummarySheet($this->survey_ids);
        }
        
        // Add individual survey sheets
        foreach ($this->survey_ids as $survey_id) {
            $survey = Survey::find($survey_id);
            if ($survey) {
                $sheets[] = new WcagTestResultSheet($survey_id, $survey->title);
            }
        }
        
        return $sheets;
    }
}

class WcagSummarySheet implements FromCollection, ShouldAutoSize, WithHeadings, WithStyles, WithTitle
{
    use Exportable;
    
    protected $survey_ids;

    public function __construct($survey_ids)
    {
        $this->survey_ids = $survey_ids;
    }

    public function title(): string
    {
        return 'WCAG Summary';
    }

    public function collection()
    {
        $summaryData = [];
        
        foreach ($this->survey_ids as $survey_id) {
            $survey = Survey::find($survey_id);
            if (!$survey) continue;

            $latestResult = WcagTestResult::where('survey_id', $survey_id)
                ->latest()
                ->first();

            $summaryData[] = [
                'Survey ID' => $survey_id,
                'Survey Title' => $survey->title,
                'Website URL' => $survey->url_website ?? 'N/A',
                'Compliance Score' => $latestResult ? $latestResult->compliance_score . '%' : 'Not tested',
                'Conformance Level' => $latestResult ? 'WCAG ' . $latestResult->conformance_level : 'Not tested',
                'Total Issues' => $latestResult ? count($latestResult->issues_data ?? []) : 0,
                'Last Tested' => $latestResult ? $latestResult->created_at->format('Y-m-d H:i:s') : 'Never',
                'Test Count' => WcagTestResult::where('survey_id', $survey_id)->count(),
            ];
        }

        return collect($summaryData);
    }

    public function headings(): array
    {
        return [
            'Survey ID',
            'Survey Title',
            'Website URL',
            'Compliance Score',
            'Conformance Level',
            'Total Issues',
            'Last Tested',
            'Test Count',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true, 'size' => 12],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '4472C4']],
            ],
        ];
    }
}

class WcagTestResultSheet implements FromCollection, ShouldAutoSize, WithHeadings, WithStyles, WithEvents, WithTitle
{
    use Exportable;
    
    protected $survey_id;
    protected $survey_title;

    public function __construct($survey_id, $survey_title)
    {
        $this->survey_id = $survey_id;
        $this->survey_title = $survey_title;
    }

    public function title(): string
    {
        $cleanTitle = preg_replace('/[^A-Za-z0-9\-_]/', '_', $this->survey_title);
        return substr($cleanTitle, 0, 31);
    }

    public function collection()
    {
        $survey = Survey::find($this->survey_id);
        $wcagResults = WcagTestResult::where('survey_id', $this->survey_id)
            ->orderBy('created_at', 'desc')
            ->get();

        if ($wcagResults->isEmpty()) {
            return collect([
                [
                    'Message' => 'No WCAG test results found for this survey',
                    'Survey Title' => $this->survey_title,
                    'Website URL' => $survey->url_website ?? 'N/A',
                ]
            ]);
        }

        $formattedData = [];

        foreach ($wcagResults as $result) {
            // Add test summary row
            $formattedData[] = [
                'Type' => 'Test Summary',
                'Test Date' => $result->created_at,
                'URL Tested' => $result->url,
                'Compliance Score' => $result->compliance_score . '%',
                'Conformance Level' => 'WCAG ' . $result->conformance_level,
                'Total Issues' => count($result->issues_data ?? []),
                'Issue ID' => '',
                'Issue Description' => '',
                'WCAG Criterion' => '',
                'Impact Level' => '',
                'Element' => '',
                'Solution Title' => '',
                'Solution Description' => '',
            ];

            // Add individual issues
            if (!empty($result->issues_data)) {
                foreach ($result->issues_data as $issue) {
                    $formattedData[] = [
                        'Type' => 'Issue Detail',
                        'Test Date' => $result->created_at,
                        'URL Tested' => $result->url,
                        'Compliance Score' => '',
                        'Conformance Level' => '',
                        'Total Issues' => '',
                        'Issue ID' => $issue['id'] ?? '',
                        'Issue Description' => $issue['description'] ?? '',
                        'WCAG Criterion' => $issue['wcag_criterion'] ?? '',
                        'Impact Level' => $issue['impact'] ?? '',
                        'Element' => $this->cleanElement($issue['element'] ?? ''),
                        'Solution Title' => $issue['solution']['title'] ?? '',
                        'Solution Description' => $issue['solution']['description'] ?? '',
                    ];
                }
            }

            // Add separator row
            $formattedData[] = [
                'Type' => '---',
                'Test Date' => '---',
                'URL Tested' => '---',
                'Compliance Score' => '---',
                'Conformance Level' => '---',
                'Total Issues' => '---',
                'Issue ID' => '---',
                'Issue Description' => '---',
                'WCAG Criterion' => '---',
                'Impact Level' => '---',
                'Element' => '---',
                'Solution Title' => '---',
                'Solution Description' => '---',
            ];
        }

        return collect($formattedData);
    }

    public function headings(): array
    {
        return [
            'Type',
            'Test Date',
            'URL Tested',
            'Compliance Score',
            'Conformance Level',
            'Total Issues',
            'Issue ID',
            'Issue Description',
            'WCAG Criterion',
            'Impact Level',
            'Element',
            'Solution Title',
            'Solution Description',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $styles = [];
        $collection = $this->collection();
        $totalRows = count($collection);

        // Header style
        $styles[1] = [
            'font' => ['bold' => true, 'size' => 12],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '4472C4']],
        ];

        // Apply different styles based on row type
        for ($rowNumber = 2; $rowNumber <= $totalRows + 1; $rowNumber++) {
            $rowData = $collection->get($rowNumber - 2);
            
            if ($rowData && isset($rowData['Type'])) {
                switch ($rowData['Type']) {
                    case 'Test Summary':
                        $styles[$rowNumber] = [
                            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'E7F3FF']],
                            'font' => ['bold' => true],
                        ];
                        break;
                    case 'Issue Detail':
                        $styles[$rowNumber] = [
                            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'FFF2E7']],
                        ];
                        break;
                    case '---':
                        $styles[$rowNumber] = [
                            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F0F0F0']],
                        ];
                        break;
                }
            }
        }

        return $styles;
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet;
                $totalRows = count($this->collection());

                // Add survey information at the bottom
                $sheet->setCellValue('A' . ($totalRows + 3), 'Survey Information');
                $sheet->setCellValue('A' . ($totalRows + 4), 'Survey Title: ' . $this->survey_title);
                $sheet->setCellValue('A' . ($totalRows + 5), 'Survey ID: ' . $this->survey_id);
                
                $survey = Survey::find($this->survey_id);
                if ($survey) {
                    $sheet->setCellValue('A' . ($totalRows + 6), 'Website URL: ' . ($survey->url_website ?? 'N/A'));
                    $sheet->setCellValue('A' . ($totalRows + 7), 'Survey Created: ' . $survey->created_at);
                }

                // Style the survey information section
                $infoRange = 'A' . ($totalRows + 3) . ':A' . ($totalRows + 7);
                $sheet->getStyle($infoRange)->getFont()->setBold(true);
                $sheet->getStyle('A' . ($totalRows + 3))->getFont()->setSize(14);
            },
        ];
    }

    private function cleanElement($element)
    {
        // Remove HTML tags and limit length for readability
        $cleaned = strip_tags($element);
        return strlen($cleaned) > 100 ? substr($cleaned, 0, 100) . '...' : $cleaned;
    }
}
