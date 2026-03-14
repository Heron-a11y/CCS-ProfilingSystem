<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== USERS (faculty/student) ===\n";
foreach (\App\Models\User::whereIn('role', ['faculty','student'])->get() as $u)
    echo "  [{$u->role}] {$u->name} — {$u->email}\n";

echo "\n=== FACULTY TABLE (last 5) ===\n";
foreach (\App\Models\Faculty::latest()->limit(5)->get() as $f)
    echo "  #{$f->id} {$f->first_name} {$f->last_name} — {$f->email}\n";

echo "\n=== STUDENTS TABLE (last 5) ===\n";
foreach (\App\Models\Student::latest()->limit(5)->get() as $s)
    echo "  #{$s->id} {$s->first_name} {$s->last_name} — {$s->email}\n";
