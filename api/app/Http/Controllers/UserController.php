<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Controlador para gerenciar usuários.
 */

class UserController extends Controller
{
    public function indexAlunos(){
        $alunos = User::where('tipo', 'aluno')
            ->select('id', 'name', 'matricula')
            ->orderBy('name', 'asc')
            ->get();
            
        return response()->json($alunos, 200);
    }
}
