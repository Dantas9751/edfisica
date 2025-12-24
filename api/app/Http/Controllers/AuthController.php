<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
  public function login(Request $request)
  {
    $request->validate([
      'matricula' => 'required|string',
      'password' => 'required|string',
    ], [
      'matricula.required' => 'O campo matrícula é obrigatório.',
      'password.required'  => 'O campo senha é obrigatório.',
    ]);

    if (!Auth::attempt($request->only('matricula', 'password'))) {
      return response()->json([
        'message' => 'Matrícula ou senha inválidos.'
      ], 401);
    }

    $user = User::where('matricula', $request->matricula)->firstOrFail();

    $token = $user->createToken('auth_token_for_' . $user->matricula)->plainTextToken;

    return response()->json([
      'access_token' => $token,
      'token_type' => 'Bearer',
      'user' => [
        'matricula' => $user->matricula,
        'name' => $user->name,
        'qtd_token' => $user->qtd_token,
        'tipo' => $user->tipo,
        'isAdm' => $user->isAdm(),
      ],
    ]);
  }

  public function logout(Request $request)
  {
    $request->user()->currentAccessToken()->delete();

    return response()->json(['message' => 'Logout realizado com sucesso']);
  }

  public function VerifyPassword(Request $request)
  {
    $request->validate([
      'password' => 'required|string',
    ]);

    $user = $request->user();

    if (!Hash::check($request->password, $user->password)) {
      return response()->json([
        'message' => 'Senha incorreta.'
      ], 401);
    }
    return response()->json([
      'message' => 'Senha verificada com sucesso.'
    ]);
  }
}
