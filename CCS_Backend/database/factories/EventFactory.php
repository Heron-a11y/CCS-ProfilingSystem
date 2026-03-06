<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $events = [
            'Tech Symposium 2026', 'Annual Hackathon', 'Freshmen Assembly', 
            'Esports Tournament', 'Cultural Dance Night', 'Blood Drive',
            'Alumni Homecoming', 'Coding Workshop', 'IT Week Celebration'
        ];

        return [
            'eventName' => $this->faker->unique()->randomElement($events),
            'description' => $this->faker->paragraph(),
            'eventType' => $this->faker->randomElement(['Academic', 'Sports', 'Cultural', 'CommunityService', 'Other']),
            'eventDate' => $this->faker->dateTimeBetween('-1 month', '+2 months'),
            'location' => $this->faker->randomElement(['Main Auditorium', 'IT Lab 1', 'University Gym', 'CCS Lobby', 'Virtual/Online']),
            'status' => $this->faker->randomElement(['Upcoming', 'Ongoing', 'Completed']),
        ];
    }
}
