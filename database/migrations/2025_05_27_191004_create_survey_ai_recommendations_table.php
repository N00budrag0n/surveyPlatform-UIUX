<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('survey_ai_recommendations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('survey_id')->references('id')->on('surveys')->cascadeOnDelete();
            $table->enum('method_type', ['SUS', 'TAM']);
            $table->longText('resume_description'); // Store the original resume description
            $table->longText('ai_recommendation'); // Store AI generated recommendation
            $table->timestamp('generated_at');
            $table->timestamps();

            $table->unique(['survey_id', 'method_type']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('survey_ai_recommendations');
    }
};
