<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index()
    {
        return response()->json(\App\Models\Event::orderBy('eventDate', 'desc')->get());
    }

    public function show($id)
    {
        return response()->json(\App\Models\Event::with(['students' => function($q) {
            $q->select('id', 'first_name', 'last_name', 'year_level', 'student_type');
        }])->findOrFail($id));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'eventName' => 'required|string|max:255',
            'description' => 'nullable|string',
            'eventType' => 'required|in:Academic,Sports,Cultural,CommunityService,Other',
            'eventDate' => 'required|date',
            'location' => 'required|string|max:255',
            'status' => 'required|in:Upcoming,Ongoing,Completed,Cancelled'
        ]);

        $event = \App\Models\Event::create($validated);
        return response()->json($event, 201);
    }

    public function update(Request $request, $id)
    {
        $event = \App\Models\Event::findOrFail($id);

        $validated = $request->validate([
            'eventName' => 'required|string|max:255',
            'description' => 'nullable|string',
            'eventType' => 'required|in:Academic,Sports,Cultural,CommunityService,Other',
            'eventDate' => 'required|date',
            'location' => 'required|string|max:255',
            'status' => 'required|in:Upcoming,Ongoing,Completed,Cancelled'
        ]);

        $event->update($validated);
        return response()->json($event);
    }

    public function destroy($id)
    {
        $event = \App\Models\Event::findOrFail($id);
        $event->delete();
        return response()->json(null, 204);
    }
}
