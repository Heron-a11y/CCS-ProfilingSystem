<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicalHistory extends Model
{
    protected $guarded = [];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
