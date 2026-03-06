<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Section>
 */
class SectionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $year = $this->faker->numberBetween(1, 4);
        $section = $this->faker->randomLetter();
        return [
            'section_name' => "{$year}{$section}",
            'year_level' => $year . ($year === 1 ? 'st' : ($year === 2 ? 'nd' : ($year === 3 ? 'rd' : 'th'))) . ' Year',
            'semester' => $this->faker->randomElement(['1st Semester', '2nd Semester']),
            'course_id' => \App\Models\Course::inRandomOrder()->first()?->id ?? \App\Models\Course::factory(),
        ];
    }
}
