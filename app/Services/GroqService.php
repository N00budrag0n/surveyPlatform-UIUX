<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GroqService
{
    protected $baseUrl = 'https://api.groq.com/openai/v1/chat/completions';

    public function generateSurveyRecommendation($methodType, $resumeDescription, $surveyTheme)
    {
        try {
            $prompt = $this->buildRecommendationPrompt($methodType, $resumeDescription, $surveyTheme);

            $response = Http::withToken(env('GROQ_API_KEY'))
                ->timeout(60)
                ->post($this->baseUrl, [
                    'model' => 'deepseek-r1-distill-llama-70b',
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => 'Anda adalah seorang ahli UX/UI dan peneliti pengalaman pengguna yang berpengalaman. Berikan analisis mendalam, solusi praktis, dan rekomendasi yang dapat ditindaklanjuti dalam bahasa Indonesia yang profesional dan mudah dipahami.'
                        ],
                        [
                            'role' => 'user',
                            'content' => $prompt
                        ]
                    ],
                    'max_tokens' => 3000,
                    'temperature' => 0.7
                ]);

            if ($response->successful()) {
                $content = $response->json()['choices'][0]['message']['content'];

                // Clean the response from any think tags
                $cleanedContent = $this->cleanAiResponse($content);

                return $cleanedContent;
            }

            throw new \Exception('Groq API request failed: ' . $response->body());

        } catch (\Exception $e) {
            Log::error('Groq AI Recommendation Error: ' . $e->getMessage());
            return 'Maaf, rekomendasi AI sementara tidak tersedia. Silakan coba lagi nanti.';
        }
    }

    private function cleanAiResponse($content)
    {
        // Remove <think> tags and their content
        $cleaned = preg_replace('/<think>.*?<\/think>/is', '', $content);

        // Remove any remaining think tags
        $cleaned = preg_replace('/<\/?think>/i', '', $cleaned);

        // Clean up extra whitespace
        $cleaned = preg_replace('/\n{3,}/', "\n\n", $cleaned);

        return trim($cleaned);
    }

    private function buildRecommendationPrompt($methodType, $resumeDescription, $surveyTheme)
    {
        $methodName = $methodType === 'SUS' ? 'System Usability Scale (SUS)' : 'Technology Acceptance Model (TAM)';

        $prompt = "Berilah solusi dan saran dari hasil survey dengan metode {$methodName} berikut ini:\n\n";
        $prompt .= "Tema Survey: {$surveyTheme}\n\n";
        $prompt .= "Hasil Analisis:\n{$resumeDescription}\n\n";

        if ($methodType === 'SUS') {
            $prompt .= "Berdasarkan hasil analisis SUS di atas, berikan:\n\n";
            $prompt .= "1. **Analisis Mendalam**\n";
            $prompt .= "   - Interpretasi skor SUS dan kategori yang dicapai\n";
            $prompt .= "   - Identifikasi area yang perlu diperbaiki berdasarkan rata-rata jawaban\n\n";

            $prompt .= "2. **Rekomendasi Perbaikan UI/UX**\n";
            $prompt .= "   - Solusi spesifik untuk meningkatkan usability\n";
            $prompt .= "   - Perbaikan desain interface yang disarankan\n";
            $prompt .= "   - Prioritas perbaikan (high, medium, low)\n\n";

            $prompt .= "3. **Saran Pengujian Lanjutan**\n";
            $prompt .= "   - Target skor SUS yang realistis untuk iterasi berikutnya\n";
        } else {
            $prompt .= "Berdasarkan hasil analisis TAM di atas, berikan:\n\n";
            $prompt .= "1. **Analisis Hubungan Variabel**\n";
            $prompt .= "   - Identifikasi faktor yang paling berpengaruh terhadap penerimaan teknologi\n";
            $prompt .= "   - Analisis area yang perlu diperkuat\n\n";

            $prompt .= "2. **Rekomendasi Desain dan Fitur**\n";
            $prompt .= "   - Perbaikan fitur berdasarkan feedback pengguna\n";
            $prompt .= "   - Optimisasi user experience untuk meningkatkan kemudahan penggunaan\n";
            $prompt .= "   - Penambahan fitur yang dapat meningkatkan perceived usefulness\n\n";

            $prompt .= "3. **Strategi Adopsi Pengguna**\n";
            $prompt .= "   - Pendekatan untuk meningkatkan actual system use\n";
            $prompt .= "   - Program pelatihan atau onboarding yang disarankan\n";
            $prompt .= "   - Komunikasi value proposition yang lebih efektif\n";
        }

        $prompt .= "\nBerikan jawaban yang terstruktur, praktis, dan dapat ditindaklanjuti. Gunakan bahasa Indonesia yang profesional dan mudah dipahami.";

        return $prompt;
    }
}
