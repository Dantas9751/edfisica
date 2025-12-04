<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Meal;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Criar Admin
        User::create([
            'name' => 'Administrador',
            'matricula' => 'admin',
            'password' => Hash::make('admin123'),
            'tipo' => 'admin',
        ]);

        // 2. Criar Aluno de Teste
        User::create([
            'name' => 'Aluno Exemplo',
            'matricula' => '20241001', // Use essa matrícula para logar no app
            'password' => Hash::make('123456'),
            'tipo' => 'aluno',
        ]);

        // 3. Criar Refeições de Hoje
        $hoje = Carbon::now()->format('Y-m-d');
        
        Meal::create([
            'nome' => 'Almoço de Hoje',
            'tipo' => 'almoco',
            'data' => $hoje,
            'horario_inicio' => '11:00:00',
            'horario_fim' => '14:00:00',
            'qr_code_hash' => 'almoco-' . $hoje, // Este é o texto que o QR Code deve conter
        ]);

        Meal::create([
            'nome' => 'Jantar de Hoje',
            'tipo' => 'jantar',
            'data' => $hoje,
            'horario_inicio' => '18:00:00',
            'horario_fim' => '20:00:00',
            'qr_code_hash' => 'jantar-' . $hoje,
        ]);
    }
}