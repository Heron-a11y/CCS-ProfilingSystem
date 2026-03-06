<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    protected $guarded = [];

    public function students()
    {
        return $this->belongsToMany(Student::class)
            ->withPivot('skill_level', 'certification', 'certification_name', 'certification_date')
            ->withTimestamps();
    }
}
