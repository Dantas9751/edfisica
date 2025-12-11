<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Models\Registro;
use Carbon\Carbon;

class TokenController extends Controller
{
    private function getRefeicao()
    {
        return [
            'CAFE' => [
                'label'  => 'Café da Manhã',
                'inicio' => '07:00',
                'fim'    => '08:30'
            ],
            'ALMOCO' => [
                'label'  => 'Almoço',
                'inicio' => '11:00',
                'fim'    => '13:00'
            ],
            'LANCHE' => [
                'label'  => 'Lanche',
                'inicio' => '15:00',
                'fim'    => '17:00'
            ],
        ];
    }

    private function determinarRefeicaoAtual()
    {
        $agora = now();
        $grade = $this->getRefeicao();

        foreach ($grade as $tipo => $dados) {
            $inicio = Carbon::createFromTimeString($dados['inicio']);
            $fim    = Carbon::createFromTimeString($dados['fim']);

            if ($agora->between($inicio, $fim)) {
                return $tipo;
            }
        }

        return null;
    }

    public function perfil(Request $request)
    {
        $user = $request->user();
        $grade = $this->getRefeicao();

        $refeicoesHoje = Registro::where('user_id', $user->id)
            ->whereDate('created_at', now())
            ->pluck('tipo_refeicao')
            ->toArray();

        $tipoAtual = $this->determinarRefeicaoAtual();

        $agendaVisual = [];

        foreach ($grade as $tipo => $dados) {
            $status = in_array($tipo, $refeicoesHoje) ? 'REALIZADO' : 'PENDENTE';

            $agendaVisual[] = [
                'tipo_codigo' => $tipo,
                'nome'        => $dados['label'],
                'horario'     => "{$dados['inicio']} às {$dados['fim']}",
                'status'      => $status,
                'disponivel_agora' => ($tipo === $tipoAtual)
            ];
        }

        return response()->json([
            'usuario' => [
                'nome' => $user->name,
                'tokens' => $user->qtd_token
            ],
            'agenda' => $agendaVisual
        ]);
    }

    public function store(Request $request)
    {
        /** @var User $user */
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Não autorizado.'], 401);
        }

        $tipoRefeicao = $this->determinarRefeicaoAtual();

        if (!$tipoRefeicao) {
            return response()->json(['message' => 'Não há refeição disponível neste horário.'], 422);
        }

        try {
            return DB::transaction(function () use ($user, $tipoRefeicao) {
                
                $userLocked = User::lockForUpdate()->find($user->id);

                if ($userLocked->qtd_token <= 0) {
                    return response()->json([
                        'message' => 'Saldo insuficiente.'
                    ], 403);
                }

                $jaComeu = Registro::where('user_id', $userLocked->id)
                    ->where('tipo_refeicao', $tipoRefeicao)
                    ->whereDate('created_at', now())
                    ->exists();

                if ($jaComeu) {
                    return response()->json([
                        'message' => 'Você já registrou esta refeição hoje.',
                        'tipo_refeicao' => $tipoRefeicao
                    ], 409);
                }

                Registro::create([
                    'user_id' => $userLocked->id,
                    'tipo_refeicao' => $tipoRefeicao,
                    'data_hora' => now()
                ]);

                $userLocked->decrement('qtd_token');

                return response()->json([
                    'message' => 'Refeição validada com sucesso!',
                    'tokens_restantes' => $userLocked->qtd_token,
                    'refeicao_registrada' => $tipoRefeicao
                ], 200);
            });

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro interno ao processar solicitação.'
            ], 500);
        }
    }
}