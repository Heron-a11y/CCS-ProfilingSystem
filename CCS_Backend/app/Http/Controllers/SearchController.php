<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\Subject;
use App\Models\Event;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->query('query');

        if (!$query) {
            return response()->json([
                'students' => [],
                'faculties' => [],
                'subjects' => [],
                'events' => []
            ]);
        }

        $students = Student::where('first_name', 'like', "%{$query}%")
            ->orWhere('last_name', 'like', "%{$query}%")
            ->orWhere('email', 'like', "%{$query}%")
            ->limit(5)
            ->get(['id', 'first_name', 'last_name', 'email']);

        $faculties = Faculty::where('first_name', 'like', "%{$query}%")
            ->orWhere('last_name', 'like', "%{$query}%")
            ->orWhere('email', 'like', "%{$query}%")
            ->limit(5)
            ->get(['id', 'first_name', 'last_name', 'position', 'email']);

        $subjects = Subject::where('subject_code', 'like', "%{$query}%")
            ->orWhere('descriptive_title', 'like', "%{$query}%")
            ->limit(5)
            ->get(['id', 'subject_code', 'descriptive_title']);

        $events = Event::where('eventName', 'like', "%{$query}%")
            ->orWhere('eventType', 'like', "%{$query}%")
            ->limit(5)
            ->get(['id', 'eventName', 'eventType', 'eventDate']);

        return response()->json([
            'students' => $students,
            'faculties' => $faculties,
            'subjects' => $subjects,
            'events' => $events
        ]);
    }
}
