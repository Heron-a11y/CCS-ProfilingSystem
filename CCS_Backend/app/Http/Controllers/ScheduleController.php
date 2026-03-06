<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index()
    {
        return response()->json(\App\Models\Schedule::with(['subject', 'faculty', 'section'])->get());
    }
}
