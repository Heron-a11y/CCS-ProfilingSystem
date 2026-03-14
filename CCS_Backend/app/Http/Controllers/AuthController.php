<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Faculty;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user.
     * For students, accepts full profile fields and checks OTP verification.
     */
    public function register(Request $request)
    {
        $roleRules = [
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role'     => 'required|in:admin,student,faculty',
        ];

        // Extra student fields
        $studentRules = [
            'first_name'           => 'required|string|max:100',
            'last_name'            => 'required|string|max:100',
            'middle_name'          => 'nullable|string|max:100',
            'suffix'               => 'nullable|string|max:20',
            'gender'               => 'required|in:Male,Female',
            'civil_status'         => 'required|string|max:50',
            'nationality'          => 'required|string|max:100',
            'religion'             => 'nullable|string|max:100',
            'birth_date'           => 'required|date',
            'place_of_birth'       => 'nullable|string|max:200',
            'contact_number'       => 'required|string|max:20',
            'present_address'      => 'nullable|string|max:300',
            'program'              => 'required|in:Information Technology,Computer Science',
            'year_level'           => 'required|string|max:20',
            'last_school_attended' => 'nullable|string|max:200',
            'last_year_attended'   => 'nullable|string|max:10',
            'lrn'                  => 'nullable|string|max:30',
            // Family
            'father_name'          => 'nullable|string|max:200',
            'father_occupation'    => 'nullable|string|max:200',
            'mother_name'          => 'nullable|string|max:200',
            'mother_occupation'    => 'nullable|string|max:200',
            'guardian_contact'     => 'nullable|string|max:20',
        ];

        $rules = ($request->role === 'student')
            ? array_merge($roleRules, $studentRules)
            : $roleRules;

        $validated = $request->validate($rules);

        // ── For students, require OTP verification ──────────────────
        if ($validated['role'] === 'student') {
            $email = strtolower(trim($validated['email']));
            if (!Cache::get("otp_verified:{$email}")) {
                return response()->json([
                    'message' => 'Email address has not been verified. Please complete OTP verification.',
                ], 422);
            }
            Cache::forget("otp_verified:{$email}");
        }

        // ── Create User ─────────────────────────────────────────────
        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => $validated['role'],
        ]);

        // ── Auto-create Faculty record ──────────────────────────────
        if ($validated['role'] === 'faculty') {
            $nameParts = explode(' ', trim($validated['name']), 2);
            $dept = \App\Models\Department::first();
            Faculty::create([
                'first_name'        => $nameParts[0],
                'last_name'         => $nameParts[1] ?? $nameParts[0],
                'email'             => $validated['email'],
                'position'          => 'Faculty Member',
                'employment_status' => 'Full-Time',
                'hire_date'         => now()->toDateString(),
                'department_id'     => $dept?->id,
            ]);
        }

        // ── Auto-create Student record with full details ────────────
        if ($validated['role'] === 'student') {
            $course = \App\Models\Course::whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($validated['program']) . '%'])->first()
                   ?? \App\Models\Course::first();
            $dept   = \App\Models\Department::first();

            $student = Student::create([
                'first_name'           => $validated['first_name'],
                'middle_name'          => $validated['middle_name']    ?? null,
                'last_name'            => $validated['last_name'],
                'suffix'               => $validated['suffix']          ?? null,
                'email'                => $validated['email'],
                'gender'               => $validated['gender'],
                'birth_date'           => $validated['birth_date'],
                'place_of_birth'       => $validated['place_of_birth'] ?? null,
                'nationality'          => $validated['nationality'],
                'civil_status'         => $validated['civil_status'],
                'religion'             => $validated['religion']        ?? null,
                'contact_number'       => $validated['contact_number'],
                'street'               => $validated['present_address'] ?? null,
                'program'              => $validated['program'],
                'year_level'           => $validated['year_level'],
                'student_type'         => 'Regular',
                'enrollment_status'    => 'Enrolled',
                'date_enrolled'        => now()->toDateString(),
                'last_school_attended' => $validated['last_school_attended'] ?? null,
                'last_year_attended'   => $validated['last_year_attended']   ?? null,
                'lrn'                  => $validated['lrn']                  ?? null,
                'course_id'            => $course?->id,
                'department_id'        => $dept?->id,
            ]);

            // Store guardian/family data if provided
            $guardians = [];
            if ($validated['father_name'] ?? null) {
                $guardians[] = [
                    'full_name'      => $validated['father_name'],
                    'relationship'   => 'Father',
                    'occupation'     => $validated['father_occupation'] ?? null,
                    'contact_number' => null,
                ];
            }
            if ($validated['mother_name'] ?? null) {
                $guardians[] = [
                    'full_name'      => $validated['mother_name'],
                    'relationship'   => 'Mother',
                    'occupation'     => $validated['mother_occupation'] ?? null,
                    'contact_number' => $validated['guardian_contact']  ?? null,
                ];
            }
            foreach ($guardians as $g) {
                $student->guardians()->create($g);
            }

            // Link user to student record
            $user->update(['student_id' => $student->id]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => [
                'id'         => $user->id,
                'name'       => $user->name,
                'email'      => $user->email,
                'role'       => $user->role,
                'student_id' => $user->student_id ?? null,
            ],
            'token' => $token,
        ], 201);
    }

    /**
     * Login an existing user.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        // Resolve student_id if student
        $studentId = null;
        if ($user->role === 'student') {
            $student   = \App\Models\Student::where('email', $user->email)->first();
            $studentId = $student?->id;
        }

        return response()->json([
            'user'  => [
                'id'         => $user->id,
                'name'       => $user->name,
                'email'      => $user->email,
                'role'       => $user->role,
                'student_id' => $studentId,
            ],
            'token' => $token,
        ]);
    }

    /**
     * Logout (revoke token).
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully.']);
    }
}
