<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Generate 3 Departments
        \App\Models\Department::factory(3)->create()->each(function ($department) {
            
            // For each department, generate 2-4 Courses
            \App\Models\Course::factory(rand(2, 4))->create(['department_id' => $department->id])->each(function ($course) use ($department) {
                // For each course, generate 5-15 Students
                \App\Models\Student::factory(rand(5, 15))->create([
                    'department_id' => $department->id,
                    'course_id' => $course->id
                ]);
            });

            // For each department, generate 3-5 Faculty members
            \App\Models\Faculty::factory(rand(3, 5))->create(['department_id' => $department->id]);
        });

        // Generate 20 Subjects independent of departments
        \App\Models\Subject::factory(20)->create();

        // Generate 10 Sections
        \App\Models\Section::factory(10)->create();

        // Generate 30 Schedules randomly assigning subjects, sections, and faculties
        \App\Models\Schedule::factory(30)->create();

        // Generate Events and attach random students
        $students = \App\Models\Student::all();
        \App\Models\Event::factory(8)->create()->each(function ($event) use ($students) {
            // Attach 5-20 students to each event
            $eventStudents = $students->random(rand(5, 20));
            foreach ($eventStudents as $student) {
                $event->students()->attach($student->id, [
                    'role' => fake()->randomElement(['Attendee', 'Attendee', 'Attendee', 'Organizer', 'Participant'])
                ]);
            }
        });
    }
}
