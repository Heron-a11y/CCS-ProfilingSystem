<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SectionController extends Controller
{
    public function index()
    {
        return response()->json(\App\Models\Section::with('course')->get());
    }
}
