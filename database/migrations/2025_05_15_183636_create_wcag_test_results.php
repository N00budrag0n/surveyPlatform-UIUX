<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('wcag_test_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('survey_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('url');
            $table->decimal('compliance_score', 5, 2);
            $table->string('conformance_level'); // A, AA, AAA
            $table->json('summary_data'); // Issues count by category, level, etc.
            $table->json('issues_data'); // Detailed issues
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('wcag_test_results');
    }
};
