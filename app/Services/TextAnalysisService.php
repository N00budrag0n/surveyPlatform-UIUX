<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class TextAnalysisService
{
    protected $client;
    protected $baseUrl;

    public function __construct()
    {
        $this->client = new Client([
            'timeout' => 10,
            'connect_timeout' => 5
        ]);
        $this->baseUrl = env('TEXT_ANALYSIS_SERVICE_URL', 'http://localhost:3001');
    }

    /**
     * Summarize AB testing reasons
     *
     * @param array $reasons
     * @return array|null
     */
    public function summarizeReasons(array $reasons)
    {
        if (empty($reasons)) {
            return null;
        }

        // Generate a cache key based on the content of reasons
        $cacheKey = 'reason_summary_' . md5(json_encode($reasons));

        return Cache::remember($cacheKey, 60 * 24 * 7, function () use ($reasons) {
            try {
                $response = $this->client->post($this->baseUrl . '/summarize-reasons', [
                    'json' => [
                        'reasons' => $reasons
                    ]
                ]);

                $result = json_decode($response->getBody(), true);

                if ($result['success']) {
                    return $result['result'];
                } else {
                    Log::error('Text analysis failed: ' . ($result['error'] ?? 'Unknown error'));
                    return null;
                }
            } catch (\Exception $e) {
                Log::error('Error calling text analysis service: ' . $e->getMessage());
                return null;
            }
        });
    }

    /**
     * Extract themes from AB testing reasons
     *
     * @param array $variantAReasons
     * @param array $variantBReasons
     * @return array|null
     */
    public function extractThemes(array $variantAReasons, array $variantBReasons)
    {
        if (empty($variantAReasons) || empty($variantBReasons)) {
            return null;
        }

        // Generate a cache key based on the content of both reason sets
        $cacheKey = 'theme_analysis_' . md5(json_encode($variantAReasons) . json_encode($variantBReasons));

        return Cache::remember($cacheKey, 60 * 24 * 7, function () use ($variantAReasons, $variantBReasons) {
            try {
                $response = $this->client->post($this->baseUrl . '/extract-themes', [
                    'json' => [
                        'variant_a_reasons' => $variantAReasons,
                        'variant_b_reasons' => $variantBReasons
                    ]
                ]);

                $result = json_decode($response->getBody(), true);

                if ($result['success']) {
                    return $result['result'];
                } else {
                    Log::error('Theme extraction failed: ' . ($result['error'] ?? 'Unknown error'));
                    return null;
                }
            } catch (\Exception $e) {
                Log::error('Error calling text analysis service: ' . $e->getMessage());
                return null;
            }
        });
    }
}
