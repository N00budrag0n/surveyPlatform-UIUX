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
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use Maatwebsite\Excel\Concerns\WithTitle;

class ResponsesSUSExport implements WithMultipleSheets
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
                $sheets[] = new SUSResponseSheet($survey_id, $survey->title);
            }
        }

        // If multiple surveys, add a summary sheet
        if (count($this->survey_ids) > 1) {
            $sheets[] = new SUSSummarySheet($this->survey_ids);
        }

        return $sheets;
    }
}

class SUSResponseSheet implements FromCollection, ShouldAutoSize, WithHeadings, WithStyles, WithEvents, WithTitle
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
        // Clean the title for sheet name (Excel has limitations)
        $cleanTitle = preg_replace('/[^A-Za-z0-9\-_]/', '_', $this->survey_title);
        return substr($cleanTitle, 0, 31); // Excel sheet name limit is 31 characters
    }

    public function collection()
    {
        // Mendapatkan data SurveyResponses
        $responses = SurveyResponses::select('first_name', 'surname', 'email', 'birth_date', 'gender', 'profession', 'educational_background', 'created_at', 'response_data')
            ->where('survey_id', $this->survey_id)
            ->get();

        // Memanipulasi data sebelum diekspor
        $formattedResponses = $responses->filter(function ($response) {
            // Menguraikan response_data dari format JSON
            $responseData = json_decode($response['response_data']);

            // Mengambil hanya data "sus" jika tersedia
            return isset($responseData->sus);
        })->map(function ($response) {
            // Menggabungkan first_name dan surname
            $response['Full Name'] = $response['first_name'] . ' ' . $response['surname'];

            // Menguraikan response_data dari format JSON
            $responseData = json_decode($response['response_data']);
            $susData = (array) $responseData->sus;

            // Looping untuk mengambil SUS1 hingga SUS10
            for ($i = 1; $i <= 10; $i++) {
                $response['SUS' . $i] = isset($susData['sus' . $i]) ? $susData['sus' . $i] : null;
            }

            // Calculate SUS Score
            $response['SUS Score'] = $this->calculateSUSScore($susData);
            // Hapus kolom first_name, surname, dan response_data
            unset($response['first_name']);
            unset($response['surname']);
            unset($response['response_data']);

            return $response;
        });

        return $formattedResponses->map(function ($response) {
            return [
                'Full Name' => $response['Full Name'],
                'Email' => $response['email'],
                'Birth Date' => $response['birth_date'],
                'Gender' => $response['gender'],
                'Profession' => $response['profession'],
                'Educational Background' => $response['educational_background'],
                'Created At' => $response['created_at'],
                'SUS1' => $response['SUS1'],
                'SUS2' => $response['SUS2'],
                'SUS3' => $response['SUS3'],
                'SUS4' => $response['SUS4'],
                'SUS5' => $response['SUS5'],
                'SUS6' => $response['SUS6'],
                'SUS7' => $response['SUS7'],
                'SUS8' => $response['SUS8'],
                'SUS9' => $response['SUS9'],
                'SUS10' => $response['SUS10'],
                'SUS Score' => $response['SUS Score'],
            ];
        });
    }

    private function calculateSUSScore($susData)
    {
        $susScore = 0;
        $susScore += ($susData['sus1'] ?? 0) - 1;
        $susScore += 5 - ($susData['sus2'] ?? 0);
        $susScore += ($susData['sus3'] ?? 0) - 1;
        $susScore += 5 - ($susData['sus4'] ?? 0);
        $susScore += ($susData['sus5'] ?? 0) - 1;
        $susScore += 5 - ($susData['sus6'] ?? 0);
        $susScore += ($susData['sus7'] ?? 0) - 1;
        $susScore += 5 - ($susData['sus8'] ?? 0);
        $susScore += ($susData['sus9'] ?? 0) - 1;
        $susScore += 5 - ($susData['sus10'] ?? 0);

        return $susScore * 2.5;
    }

    public function headings(): array
    {
        return [
            'Full Name',
            'Email',
            'Birth Date',
            'Gender',
            'Profession',
            'Educational Background',
            'Created At',
            'Question 1',
            'Question 2',
            'Question 3',
            'Question 4',
            'Question 5',
            'Question 6',
            'Question 7',
            'Question 8',
            'Question 9',
            'Question 10',
            'SUS Score',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $styles = [];
        $collection = $this->collection();
        $totalRows = count($collection);

        // Mengatur warna header menjadi coklat
        $styles[1] = [
            'font' => ['bold' => true],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'cc6633']],
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
                // Mendapatkan sheet
                $sheet = $event->sheet;
                // Mendapatkan total baris dalam data
                $totalRows = count($this->collection());

                // Add survey title
                $sheet->setCellValue('A' . ($totalRows + 3), 'Survey: ' . $this->survey_title);
                $titleCell = $sheet->getCell('A' . ($totalRows + 3));
                $titleCell->getStyle()->getFont()->setBold(true)->setSize(14);

                // Add average SUS score
                $sheet->setCellValue('Q' . ($totalRows + 2), 'Hasil SUS Rata-rata');
                $resultTitleCell = $sheet->getCell('Q' . ($totalRows + 2));
                $resultTitleCell->getStyle()->getFont()->setBold(true);

                // Hitung rata-rata SUS
                $averageSUSFormula = '=AVERAGE(R2:R' . ($totalRows + 1) . ')';
                // Menambahkan rata-rata SUS di akhir data
                $sheet->setCellValue('R' . ($totalRows + 2), $averageSUSFormula);
                // Mendapatkan sel rata-rata SUS
                $averageSUSCell = $sheet->getCell('R' . ($totalRows + 2));

                $averageSUSCell->getStyle()->getFont()->setBold(true);
                $averageSUSCell->getStyle()->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('cc6633');

                // Add SUS calculation formula for each row
                for ($rowNumber = 2; $rowNumber <= $totalRows + 1; $rowNumber++) {
                    $averageSUSFormula = '=(((H' . $rowNumber . '-1)+(5-I' . $rowNumber . ')+(J' . $rowNumber . '-1)+(5-K' . $rowNumber . ')+(L' . $rowNumber . '-1)+(5-M' . $rowNumber . ')+(N' . $rowNumber . '-1)+(5-O' . $rowNumber . ')+(P' . $rowNumber . '-1)+(5-Q' . $rowNumber . '))*2.5)';
                    $sheet->setCellValue('R' . $rowNumber, $averageSUSFormula);
                }
            },
        ];
    }
}

class SUSSummarySheet implements FromCollection, ShouldAutoSize, WithHeadings, WithStyles, WithTitle
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
                ->where('response_data', 'LIKE', '%"sus"%')
                ->get();

            $totalResponses = $responses->count();
            $totalSUS = 0;
            $validResponses = 0;

            foreach ($responses as $response) {
                $responseData = json_decode($response->response_data, true);
                if (isset($responseData['sus'])) {
                    $susData = $responseData['sus'];
                    $susScore = $this->calculateSUSScore($susData);
                    $totalSUS += $susScore;
                    $validResponses++;
                }
            }

            $averageSUS = $validResponses > 0 ? round($totalSUS / $validResponses, 2) : 0;
            $grade = $this->classifySUSGrade($averageSUS);

            $summaryData[] = [
                'Survey ID' => $survey_id,
                'Survey Title' => $survey->title,
                'Total Responses' => $totalResponses,
                'Valid SUS Responses' => $validResponses,
                'Average SUS Score' => $averageSUS,
                'SUS Grade' => $grade,
                'Created At' => $survey->created_at,
            ];
        }

        return collect($summaryData);
    }

    private function calculateSUSScore($susData)
    {
        $susScore = 0;
        $susScore += ($susData['sus1'] ?? 0) - 1;
        $susScore += 5 - ($susData['sus2'] ?? 0);
        $susScore += ($susData['sus3'] ?? 0) - 1;
        $susScore += 5 - ($susData['sus4'] ?? 0);
        $susScore += ($susData['sus5'] ?? 0) - 1;
        $susScore += 5 - ($susData['sus6'] ?? 0);
        $susScore += ($susData['sus7'] ?? 0) - 1;
        $susScore += 5 - ($susData['sus8'] ?? 0);
        $susScore += ($susData['sus9'] ?? 0) - 1;
        $susScore += 5 - ($susData['sus10'] ?? 0);

        return $susScore * 2.5;
    }

    private function classifySUSGrade($averageSUS)
    {
        if ($averageSUS >= 90) {
            return 'A';
        } elseif ($averageSUS >= 80) {
            return 'B';
        } elseif ($averageSUS >= 70) {
            return 'C';
        } elseif ($averageSUS >= 60) {
            return 'D';
        } else {
            return 'F';
        }
    }

    public function headings(): array
    {
        return [
            'Survey ID',
            'Survey Title',
            'Total Responses',
            'Valid SUS Responses',
            'Average SUS Score',
            'SUS Grade',
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
