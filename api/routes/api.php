<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SyncController;
use App\Http\Controllers\UserController;

//rota aberta
Route::post('/auth/login', [AuthController::class, 'login']);

//rotas protegidas
Route::middleware('auth:sanctum')->group(function () {
    
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/sync/down', [SyncController::class, 'syncDown']);
    Route::post('/sync/up', [SyncController::class, 'syncUp']);
    Route::get('/alunos', [UserController::class, 'index']);
});