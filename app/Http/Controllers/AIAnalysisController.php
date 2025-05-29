<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Models\Survey;
use App\Models\SurveyResponse;
use App\Services\GroqService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AIAnalysisController extends Controller
{
    protected $groqService;

    public function __construct(GroqService $groqService)
    {
        $this->groqService = $groqService;
    }

    public function analyzeSurvey(Request $request, $surveyId)
    {
        $survey = Survey::with(['responses.answers'])->findOrFail($surveyId);

        // Check if user owns the survey
        if ($survey->user_id !== auth()->id()) {
            abort(403);
        }

        // Prepare data for AI analysis
        $surveyData = [
            'title' => $survey->title,
            'theme' => $survey->theme,
            'description' => $survey->description,
            'responses' => $this->formatResponsesForAI($survey->responses)
        ];

        $analysis = $this->groqService->analyzeSurveyData($surveyData);

        return response()->json([
            'analysis' => $analysis,
            'survey_id' => $surveyId
        ]);
    }

    public function generateQuestions(Request $request)
    {
        $request->validate([
            'theme' => 'required|string|max:255',
            'target_audience' => 'nullable|string|max:255'
        ]);

        $questions = $this->groqService->generateSurveyQuestions(
            $request->theme,
            $request->target_audience
        );

        return response()->json([
            'questions' => $questions
        ]);
    }

    public function showAnalysis($surveyId)
    {
        $survey = Survey::with(['responses'])->findOrFail($surveyId);

        if ($survey->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Account/Survey/AIAnalysis', [
            'survey' => $survey,
            'responseCount' => $survey->responses->count()
        ]);
    }

    private function formatResponsesForAI($responses)
    {
        $formattedResponses = [];

        foreach ($responses as $response) {
            $responseData = [];
            foreach ($response->answers as $answer) {
                $responseData[$answer->question] = $answer->answer;
            }
            $formattedResponses[] = $responseData;
        }

        return $formattedResponses;
    }
}
