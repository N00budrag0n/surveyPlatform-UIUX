<?php

namespace App\Exports;

use App\Models\SurveyResponses;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;

class ResponsesABExport implements FromCollection, ShouldAutoSize, WithHeadings, WithStyles
{
    use Exportable;
    protected $survey_id;

    public function __construct($survey_id)
    {
        $this->survey_id = $survey_id;
    }

    public function collection()
    {
        // Mendapatkan data SurveyResponses
        $responses = SurveyResponses::select('first_name', 'surname', 'email', 'birth_date', 'gender', 'profession', 'educational_background', 'created_at', 'response_data')->where('survey_id', $this->survey_id)->get();

        // Memanipulasi data sebelum diekspor
        $formattedResponses = $responses->filter(function ($response) {
            // Menguraikan response_data dari format JSON
            $responseData = json_decode($response['response_data']);

            // Mengambil hanya data "tam" jika tersedia
            return isset($responseData->tam);
        })->map(function ($response) {
            // Menggabungkan first_name dan surname
            $response['Full Name'] = $response['first_name'] . ' ' . $response['surname'];

            // Menguraikan response_data dari format JSON
            $responseData = json_decode($response['response_data']);
            $tamData = (array) $responseData->tam;
            foreach ($tamData as  $variable) {
                foreach ($variable->responses as $indicator) {
                    foreach ($indicator->value as $value) {
                        $response[$value[0]] = isset($value[1]) ? $value[1] : null;
                    }
                }
            }

            // Hapus kolom first_name, surname, dan response_data
            unset($response['first_name']);
            unset($response['surname']);
            unset($response['response_data']);

            return $response;
        });

        $formattedResponses = $formattedResponses->map(function ($response) {
            $formattedResponse = [
                'Full Name' => $response['Full Name'],
                'Email' => $response['email'],
                'Birth Date' => $response['birth_date'],
                'Gender' => $response['gender'],
                'Profession' => $response['profession'],
                'Educational Background' => $response['educational_background'],
                'Created At' => $response['created_at'],
            ];

            for ($i = 1; $i <= 23; $i++) {
                $tamKey = 'tam' . $i;
                if (isset($response[$tamKey])) {
                    $formattedResponse[$tamKey] = $response[$tamKey];
                }
            }

            return $formattedResponse;
        });

        return $formattedResponses;
    }

    public function headings(): array
    {
        $headings = [
            'Full Name',
            'Email',
            'Birth Date',
            'Gender',
            'Profession',
            'Educational Background',
            'Created At',
        ];

        $exampleResponse = SurveyResponses::select('response_data')->where('survey_id', $this->survey_id)->first();
        if ($exampleResponse) {
            $responseData = json_decode($exampleResponse->response_data);
            $index = 1;
            if (isset($responseData->tam)) {
                foreach ($responseData->tam as $tam) {
                    foreach ($tam->responses as $variable) {
                        foreach ($variable->value as $value) {
                            $headings[] = "Question " . $index++;
                        }
                    }
                }
            }
        }

        return $headings;
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
}
