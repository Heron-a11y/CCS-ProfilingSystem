<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    /** @use HasFactory<\Database\Factories\EventFactory> */
    use HasFactory;

    protected $fillable = [
        'eventName',
        'description',
        'eventType',
        'eventDate',
        'location',
        'status',
    ];

    public function students()
    {
        return $this->belongsToMany(Student::class, 'event_student')
            ->withPivot('role')
            ->withTimestamps();
    }
}
