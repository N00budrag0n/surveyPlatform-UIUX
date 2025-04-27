<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\TextAnalysisService;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(TextAnalysisService::class, function ($app) {
            return new TextAnalysisService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot()
    {
        // C:\Users\naufa\AppData\Local\ngrok
        // Setting ngrok hanya untuk lingkungan lokal
        // if ($this->app->environment('local')) {
        //     URL::forceScheme('https');
        // }
    }
}
