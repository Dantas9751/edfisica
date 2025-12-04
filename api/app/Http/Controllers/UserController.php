<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->tipo !== 'admin') {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        $query = User::where('tipo', 'aluno');

        if ($request->has('search') && $request->search) {
            $term = $request->search;
            $query->where(function($q) use ($term) {
                $q->where('name', 'like', "%{$term}%")
                  ->orWhere('matricula', 'like', "%{$term}%");
            });
        }

        // Retorna ordenado por nome
        return response()->json($query->orderBy('name')->get());
    }
}