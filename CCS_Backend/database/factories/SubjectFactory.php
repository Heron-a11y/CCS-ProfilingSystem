<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Subject>
 */
class SubjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $prefixes = ['IT', 'CS', 'IS', 'MATH', 'GE'];
        $lec = $this->faker->numberBetween(2, 3);
        $lab = $this->faker->randomElement([0, 1]);
        
        return [
            'subject_code' => $this->faker->randomElement($prefixes) . ' ' . $this->faker->unique()->numberBetween(100, 499),
            'descriptive_title' => ucwords($this->faker->words(3, true)) . ' ' . $this->faker->word(),
            'lec_units' => $lec,
            'lab_units' => $lab,
            'total_units' => $lec + $lab,
            'pre_requisites' => $this->faker->boolean(30) ? $this->faker->randomElement($prefixes) . ' ' . $this->faker->numberBetween(100, 200) : null,
        ];
    }
}
