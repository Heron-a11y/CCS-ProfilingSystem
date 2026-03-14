<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index()
    {
        return response()->json(\App\Models\Schedule::with(['subject', 'faculty', 'section'])->get());
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'day_of_week' => 'required|string',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'room' => 'required|string',
            'subject_id' => 'required|exists:subjects,id',
            'faculty_id' => 'required|exists:faculties,id',
            'section_id' => 'required|exists:sections,id',
        ]);

        $schedule = \App\Models\Schedule::create($validatedData);

        return response()->json($schedule, 201);
    }

    public function show($id)
    {
        $schedule = \App\Models\Schedule::with(['subject', 'faculty', 'section'])->findOrFail($id);
        return response()->json($schedule);
    }

    public function update(Request $request, $id)
    {
        $schedule = \App\Models\Schedule::findOrFail($id);

        $validatedData = $request->validate([
            'day_of_week' => 'required|string',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'room' => 'required|string',
            'subject_id' => 'required|exists:subjects,id',
            'faculty_id' => 'required|exists:faculties,id',
            'section_id' => 'required|exists:sections,id',
        ]);

        $schedule->update($validatedData);
        return response()->json($schedule);
    }

    public function destroy($id)
    {
        $schedule = \App\Models\Schedule::findOrFail($id);
        $schedule->delete();
        return response()->json(null, 204);
    }
}
