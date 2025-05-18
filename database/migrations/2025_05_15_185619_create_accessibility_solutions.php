<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('accessibility_solutions', function (Blueprint $table) {
            $table->id();
            $table->string('issue_id')->unique();
            $table->string('title');
            $table->text('description');
            $table->text('example')->nullable();
            $table->json('resources')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('accessibility_solutions');
    }
};
