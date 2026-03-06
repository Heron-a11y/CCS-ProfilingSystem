<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function index()
    {
        return response()->json(\App\Models\Subject::orderBy('subject_code')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject_code' => 'required|string|unique:subjects',
            'descriptive_title' => 'required|string',
            'lab_units' => 'required|integer|min:0',
            'lec_units' => 'required|integer|min:0',
            'pre_requisites' => 'nullable|string',
        ]);
        
        $validated['total_units'] = $validated['lab_units'] + $validated['lec_units'];
        $subject = \App\Models\Subject::create($validated);
        return response()->json($subject, 201);
    }
}
