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
                    'model' => 'mixtral-8x7b-32768',
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
                return $response->json()['choices'][0]['message']['content'];
            }

            throw new \Exception('Groq API request failed: ' . $response->body());

        } catch (\Exception $e) {
            Log::error('Groq AI Recommendation Error: ' . $e->getMessage());
            return 'Maaf, rekomendasi AI sementara tidak tersedia. Silakan coba lagi nanti.';
        }
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
            $prompt .= "   - Identifikasi area yang perlu diperbaiki berdasarkan rata-rata jawaban\n";
            $prompt .= "   - Analisis pola respons pengguna\n\n";

            $prompt .= "2. **Rekomendasi Perbaikan UI/UX**\n";
            $prompt .= "   - Solusi spesifik untuk meningkatkan usability\n";
            $prompt .= "   - Perbaikan desain interface yang disarankan\n";
            $prompt .= "   - Optimisasi user flow dan navigasi\n\n";

            $prompt .= "3. **Langkah Implementasi**\n";
            $prompt .= "   - Prioritas perbaikan (high, medium, low)\n";
            $prompt .= "   - Timeline implementasi yang realistis\n";
            $prompt .= "   - Metrik untuk mengukur keberhasilan perbaikan\n\n";

            $prompt .= "4. **Saran Pengujian Lanjutan**\n";
            $prompt .= "   - Metode testing tambahan yang disarankan\n";
            $prompt .= "   - Target skor SUS yang realistis untuk iterasi berikutnya\n";
        } else {
            $prompt .= "Berdasarkan hasil analisis TAM di atas, berikan:\n\n";
            $prompt .= "1. **Analisis Hubungan Variabel**\n";
            $prompt .= "   - Interpretasi koefisien regresi dan hubungan antar variabel\n";
            $prompt .= "   - Identifikasi faktor yang paling berpengaruh terhadap penerimaan teknologi\n";
            $prompt .= "   - Analisis area yang perlu diperkuat\n\n";

            $prompt .= "2. **Strategi Peningkatan Penerimaan**\n";
            $prompt .= "   - Cara meningkatkan Perceived Usefulness (PU)\n";
            $prompt .= "   - Strategi untuk memperbaiki Perceived Ease of Use (PEU)\n";
            $prompt .= "   - Pendekatan untuk meningkatkan Attitude Toward Use (ATU)\n";
            $prompt .= "   - Metode untuk memperkuat Behavioral Intention (BI)\n\n";

            $prompt .= "3. **Rekomendasi Desain dan Fitur**\n";
            $prompt .= "   - Perbaikan fitur berdasarkan feedback pengguna\n";
            $prompt .= "   - Optimisasi user experience untuk meningkatkan kemudahan penggunaan\n";
            $prompt .= "   - Penambahan fitur yang dapat meningkatkan perceived usefulness\n\n";

            $prompt .= "4. **Strategi Adopsi Pengguna**\n";
            $prompt .= "   - Pendekatan untuk meningkatkan actual system use\n";
            $prompt .= "   - Program pelatihan atau onboarding yang disarankan\n";
            $prompt .= "   - Komunikasi value proposition yang lebih efektif\n";
        }

        $prompt .= "\nBerikan jawaban yang terstruktur, praktis, dan dapat ditindaklanjuti. Gunakan bahasa Indonesia yang profesional dan mudah dipahami.";

        return $prompt;
    }
}
