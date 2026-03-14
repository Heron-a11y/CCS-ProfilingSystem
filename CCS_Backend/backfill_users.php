<?php
// Run: php backfill_users.php (from CCS_Backend root)
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Get first available course and department IDs
$firstCourse = \App\Models\Course::first();
$firstDept   = \App\Models\Department::first();

$users = \App\Models\User::whereIn('role', ['faculty', 'student'])->get();

foreach ($users as $user) {
    // Split name
    $parts     = explode(' ', trim($user->name), 2);
    $firstName = $parts[0];
    $lastName  = $parts[1] ?? $parts[0];

    if ($user->role === 'faculty') {
        $exists = \App\Models\Faculty::where('email', $user->email)->first();
        if (!$exists) {
            \App\Models\Faculty::create([
                'first_name'        => $firstName,
                'last_name'         => $lastName,
                'email'             => $user->email,
                'position'          => 'Faculty Member',
                'employment_status' => 'Full-Time',
                'hire_date'         => now()->toDateString(),
                'department_id'     => $firstDept?->id,
            ]);
            echo "Created faculty record for: {$user->name}\n";
        } else {
            echo "Faculty already exists: {$user->name}\n";
        }
    }

    if ($user->role === 'student') {
        $exists = \App\Models\Student::where('email', $user->email)->first();
        if (!$exists) {
            \App\Models\Student::create([
                'first_name'        => $firstName,
                'last_name'         => $lastName,
                'email'             => $user->email,
                'gender'            => 'Unknown',
                'birth_date'        => '2000-01-01',
                'nationality'       => 'Filipino',
                'civil_status'      => 'Single',
                'contact_number'    => 'N/A',
                'year_level'        => '1st Year',
                'student_type'      => 'Regular',
                'enrollment_status' => 'Enrolled',
                'date_enrolled'     => now()->toDateString(),
                'course_id'         => $firstCourse?->id,
                'department_id'     => $firstDept?->id,
            ]);
            echo "Created student record for: {$user->name}\n";
        } else {
            echo "Student already exists: {$user->name}\n";
        }
    }
}

echo "Done!\n";
