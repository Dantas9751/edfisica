<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 1. Login Route (Requested by useAuth.tsx)
Route::post('/auth/login', function (Request $request) {
    // Validate input
    $request->validate([
        'registration_number' => 'required',
        'password' => 'required',
    ]);

    // TODO: Implement real authentication logic here.
    // For now, we return a mock successful response so the app works.
    
    return response()->json([
        'token' => 'mock-token-12345',
        'user' => [
            'id' => 1,
            'name' => 'Test User',
            'email' => 'test@example.com',
            'registration_number' => $request->registration_number,
            'role' => 'student'
        ]
    ]);
});

// 2. Sync Registrations (Requested by useOfflineSync.tsx)
Route::post('/sync-registrations', function (Request $request) {
    // Log the data coming from the app
    // Log::info('Syncing:', $request->all());
    
    return response()->json(['message' => 'Sync successful'], 200);
});

// 3. Register Single Meal (Requested by useOfflineSync.tsx)
Route::post('/register-meal', function (Request $request) {
    return response()->json(['message' => 'Meal registered successfully'], 201);
});

// 4. Get Authenticated User
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});