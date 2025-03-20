<?php

namespace App\Exports;

use App\Models\SurveyResponses;
use App\Models\Survey;
use App\Models\SurveyQuestions;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ResponsesABTestExport implements FromCollection, WithHeadings, WithMapping, WithTitle, ShouldAutoSize, WithStyles
{
    protected $survey_id;
    protected $questions;
    protected $abTestingGroups = [];
    protected $headings = [];

    public function __construct($survey_id)
    {
        $this->survey_id = $survey_id;
        $this->loadQuestions();
    }

    private function loadQuestions()
    {
        $surveyQuestions = SurveyQuestions::where('survey_id', $this->survey_id)->first();

        if ($surveyQuestions) {
            $questionsData = json_decode($surveyQuestions->questions_data, true);

            if (isset($questionsData['ab_testing'])) {
                $this->abTestingGroups = $questionsData['ab_testing'];
            }
        }
    }

    public function collection()
    {
        return SurveyResponses::where('survey_id', $this->survey_id)
            ->where('response_data', 'LIKE', '%"ab_testing"%')
            ->get();
    }

    public function headings(): array
    {
        $headings = [
            'ID',
            'Respondent Name',
            'Email',
            'Gender',
            'Age',
            'Profession',
            'Education',
            'Date Submitted'
        ];

        // Add headings for each AB testing comparison
        foreach ($this->abTestingGroups as $group) {
            foreach ($group['comparisons'] as $comparison) {
                $headings[] = $group['name'] . ' - ' . $comparison['title'] . ' (Choice)';
                $headings[] = $group['name'] . ' - ' . $comparison['title'] . ' (Reason)';
            }
        }

        $this->headings = $headings;
        return $headings;
    }

    public function map($response): array
    {
        $responseData = json_decode($response->response_data, true);
        $abTestingData = isset($responseData['ab_testing']) ? $responseData['ab_testing'] : [];

        // Calculate age from birth date
        $birthDate = new \DateTime($response->birth_date);
        $today = new \DateTime();
        $age = $birthDate->diff($today)->y;

        $row = [
            $response->id,
            $response->first_name . ' ' . $response->surname,
            $response->email,
            $response->gender,
            $age,
            $response->profession,
            $response->educational_background,
            $response->created_at->format('Y-m-d H:i:s')
        ];

        // Map AB testing responses
        foreach ($this->abTestingGroups as $group) {
            $groupName = $group['name'];
            $groupResponses = $this->findGroupResponses($abTestingData, $groupName);

            foreach ($group['comparisons'] as $comparison) {
                $comparisonId = $comparison['id'];
                $comparisonResponse = $this->findComparisonResponse($groupResponses, $comparisonId);

                if ($comparisonResponse) {
                    $selected = $comparisonResponse['selected'];
                    $selectedLabel = $selected === 'a' ? $comparison['variant_a']['title'] : $comparison['variant_b']['title'];
                    $reason = isset($comparisonResponse['reason']) ? $comparisonResponse['reason'] : '';

                    $row[] = $selectedLabel;
                    $row[] = $reason;
                } else {
                    $row[] = 'No response';
                    $row[] = '';
                }
            }
        }

        return $row;
    }

    private function findGroupResponses($abTestingData, $groupName)
    {
        foreach ($abTestingData as $group) {
            if ($group['name'] === $groupName) {
                return isset($group['responses']) ? $group['responses'] : [];
            }
        }
        return [];
    }

    private function findComparisonResponse($groupResponses, $comparisonId)
    {
        foreach ($groupResponses as $response) {
            if ($response['id'] === $comparisonId) {
                return $response;
            }
        }
        return null;
    }

    public function title(): string
    {
        $survey = Survey::find($this->survey_id);
        return 'A/B Testing - ' . $survey->title;
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
