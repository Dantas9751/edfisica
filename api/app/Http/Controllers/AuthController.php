<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'matricula' => 'required|string',
            'password'  => 'required|string',
        ]);

        if (!Auth::attempt($request->only('matricula', 'password'))) {
            return response()->json(['message' => 'Matrícula ou senha incorretos'], 401);
        }

        $user = User::where('matricula', $request->matricula)->firstOrFail();
        
        $user->tokens()->delete();

        $token = $user->createToken('mobile_app')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => $user,
        ]);
    }
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Deslogado com sucesso']);
    }
}