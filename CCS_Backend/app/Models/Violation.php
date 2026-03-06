<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Violation extends Model
{
    protected $guarded = [];

    protected $casts = [
        'date_reported' => 'date',
        'resolution_date' => 'date',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
