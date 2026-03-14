<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->string('lrn', 12)->nullable()->after('zip_code');
            $table->string('last_school_attended')->nullable()->after('lrn');
            $table->string('last_year_attended', 20)->nullable()->after('last_school_attended');
            $table->text('honors_received')->nullable()->after('last_year_attended');
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn(['lrn', 'last_school_attended', 'last_year_attended', 'honors_received']);
        });
    }
};
