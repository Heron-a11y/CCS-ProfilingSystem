<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Affiliation extends Model
{
    protected $guarded = [];

    protected $casts = [
        'date_joined' => 'date',
        'date_ended' => 'date',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
