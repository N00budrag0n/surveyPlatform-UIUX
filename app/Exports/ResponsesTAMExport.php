<?php

namespace App\Exports;

use App\Models\SurveyResponses;
use App\Models\Survey;
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

class ResponsesTAMExport implements WithMultipleSheets
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

        foreach ($this->survey_ids as $survey_id) {
            $survey = Survey::find($survey_id);
            if ($survey) {
                $sheets[] = new TAMResponseSheet($survey_id, $survey->title);
            }
        }

        // If multiple surveys, add a summary sheet
        if (count($this->survey_ids) > 1) {
            $sheets[] = new TAMSummarySheet($this->survey_ids);
        }

        return $sheets;
    }
}

class TAMResponseSheet implements FromCollection, ShouldAutoSize, WithHeadings, WithStyles, WithEvents, WithTitle
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
        $responses = SurveyResponses::select('first_name', 'surname', 'email', 'birth_date', 'gender', 'profession', 'educational_background', 'created_at', 'response_data')
            ->where('survey_id', $this->survey_id)
            ->where('response_data', 'LIKE', '%"tam"%')
            ->get();

        $formattedResponses = $responses->map(function ($response) {
            $responseData = json_decode($response->response_data, true);

            $result = [
                'Full Name' => $response->first_name . ' ' . $response->surname,
                'Email' => $response->email,
                'Birth Date' => $response->birth_date,
                'Gender' => $response->gender,
                'Profession' => $response->profession,
                'Educational Background' => $response->educational_background,
                'Created At' => $response->created_at,
            ];

            // Extract TAM responses
            if (isset($responseData['tam'])) {
                $tamData = [];
                foreach ($responseData['tam'] as $variable) {
                    foreach ($variable['responses'] as $indicator) {
                        if (isset($indicator['value']) && is_array($indicator['value'])) {
                            foreach ($indicator['value'] as $value) {
                                $tamData[$value[0]] = $value[1];
                            }
                        }
                    }
                }

                // Add TAM responses to result
                foreach ($tamData as $key => $value) {
                    $result[$key] = $value;
                }
            }

            return $result;
        });

        return $formattedResponses;
    }

    public function headings(): array
    {
        // Get a sample response to determine TAM question keys
        $sampleResponse = SurveyResponses::where('survey_id', $this->survey_id)
            ->where('response_data', 'LIKE', '%"tam"%')
            ->first();

        $baseHeadings = [
            'Full Name',
            'Email',
            'Birth Date',
            'Gender',
            'Profession',
            'Educational Background',
            'Created At',
        ];

        if ($sampleResponse) {
            $responseData = json_decode($sampleResponse->response_data, true);
            if (isset($responseData['tam'])) {
                $tamKeys = [];
                foreach ($responseData['tam'] as $variable) {
                    foreach ($variable['responses'] as $indicator) {
                        if (isset($indicator['value']) && is_array($indicator['value'])) {
                            foreach ($indicator['value'] as $value) {
                                $tamKeys[] = $value[0];
                            }
                        }
                    }
                }
                $baseHeadings = array_merge($baseHeadings, $tamKeys);
            }
        }

        return $baseHeadings;
    }

    public function styles(Worksheet $sheet)
    {
        $styles = [];
        $collection = $this->collection();
        $totalRows = count($collection);

        $styles[1] = [
            'font' => ['bold' => true],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '4472C4']],
        ];

        $fillColor1 = 'FFFFFF';
        $fillColor2 = 'D3D3D3';

        for ($rowNumber = 2; $rowNumber <= $totalRows + 1; $rowNumber++) {
            $fillColor = ($rowNumber % 2 == 0) ? $fillColor1 : $fillColor2;
            $styles[$rowNumber] = ['fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => $fillColor]]];
        }

        return $styles;
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet;
                $totalRows = count($this->collection());

                $sheet->setCellValue('A' . ($totalRows + 3), 'Survey: ' . $this->survey_title);
                $titleCell = $sheet->getCell('A' . ($totalRows + 3));
                $titleCell->getStyle()->getFont()->setBold(true)->setSize(14);
            },
        ];
    }
}

class TAMSummarySheet implements FromCollection, ShouldAutoSize, WithHeadings, WithStyles, WithTitle
{
    use Exportable;

    protected $survey_ids;

    public function __construct($survey_ids)
    {
        $this->survey_ids = $survey_ids;
    }

    public function title(): string
    {
        return 'Summary';
    }

    public function collection()
    {
        $summaryData = [];

        foreach ($this->survey_ids as $survey_id) {
            $survey = Survey::find($survey_id);
            if (!$survey)
                continue;

            $responses = SurveyResponses::where('survey_id', $survey_id)
                ->where('response_data', 'LIKE', '%"tam"%')
                ->get();

            $totalResponses = $responses->count();

            $summaryData[] = [
                'Survey ID' => $survey_id,
                'Survey Title' => $survey->title,
                'Total Responses' => $totalResponses,
                'Created At' => $survey->created_at,
            ];
        }

        return collect($summaryData);
    }

    public function headings(): array
    {
        return [
            'Survey ID',
            'Survey Title',
            'Total Responses',
            'Created At',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '4472C4']],
            ],
        ];
    }
}
