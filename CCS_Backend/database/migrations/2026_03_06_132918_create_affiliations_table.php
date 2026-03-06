<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('affiliations', function (Blueprint $table) {
            $table->id();
            $table->string('organization_name');
            $table->string('position');
            $table->date('date_joined');
            $table->date('date_ended')->nullable();
            $table->string('status');
            $table->string('adviser_name')->nullable();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('affiliations');
    }
};
