<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Course>
 */
class CourseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'course_code' => fake()->unique()->bothify('CC-####'),
            'course_name' => fake()->words(3, true) . ' Fundamentals',
            'total_units' => fake()->randomElement([3, 4, 5]),
            'department_id' => \App\Models\Department::factory(),
        ];
    }
}
