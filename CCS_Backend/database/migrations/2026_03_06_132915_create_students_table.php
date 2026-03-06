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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('suffix')->nullable();
            $table->string('gender');
            $table->date('birth_date');
            $table->string('place_of_birth')->nullable();
            $table->string('nationality');
            $table->string('civil_status');
            $table->string('religion')->nullable();
            $table->string('email')->unique();
            $table->string('contact_number');
            $table->string('alternate_contact_number')->nullable();
            $table->string('street')->nullable();
            $table->string('barangay')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('zip_code')->nullable();
            $table->string('year_level');
            $table->string('section')->nullable();
            $table->string('student_type');
            $table->string('enrollment_status');
            $table->date('date_enrolled');
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('department_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
