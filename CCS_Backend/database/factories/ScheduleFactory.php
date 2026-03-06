<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Schedule>
 */
class ScheduleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startHour = $this->faker->numberBetween(7, 16);
        $start = sprintf('%02d:00:00', $startHour);
        $end = sprintf('%02d:00:00', $startHour + $this->faker->randomElement([1, 2, 3]));

        return [
            'day_of_week' => $this->faker->randomElement(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
            'start_time' => $start,
            'end_time' => $end,
            'room' => 'Room ' . $this->faker->numberBetween(100, 500),
            'subject_id' => \App\Models\Subject::inRandomOrder()->first()?->id ?? \App\Models\Subject::factory(),
            'faculty_id' => \App\Models\Faculty::inRandomOrder()->first()?->id ?? \App\Models\Faculty::factory(),
            'section_id' => \App\Models\Section::inRandomOrder()->first()?->id ?? \App\Models\Section::factory(),
        ];
    }
}
