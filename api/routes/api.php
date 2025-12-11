<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TokenController;
use App\Http\Controllers\UserController;

Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/verify-password', [AuthController::class, 'VerifyPassword']);

    Route::get('/perfil', [TokenController::class, 'perfil']);
    Route::post('/store', [TokenController::class, 'store']);
    
    Route::get('/alunos', [UserController::class, 'indexAlunos']);
});