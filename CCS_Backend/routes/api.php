<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\StudentController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('students', StudentController::class);
Route::apiResource('courses', \App\Http\Controllers\CourseController::class);
Route::apiResource('departments', \App\Http\Controllers\DepartmentController::class);
Route::apiResource('faculties', \App\Http\Controllers\FacultyController::class);
Route::apiResource('subjects', \App\Http\Controllers\SubjectController::class);
Route::apiResource('sections', \App\Http\Controllers\SectionController::class);
Route::apiResource('schedules', \App\Http\Controllers\ScheduleController::class);
Route::apiResource('events', \App\Http\Controllers\EventController::class);
