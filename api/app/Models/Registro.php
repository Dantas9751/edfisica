<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Registro extends Model
{
  use HasFactory;

  /**
   * Os atributos que podem ser preenchidos em massa (Mass Assignment).
   * Isso permite usar o comando Registro::create([]) no Controller.
   */
  protected $fillable = [
    'user_id',
    'tipo_refeicao', // Ex: 'CAFE', 'ALMOCO', 'JANTAR'
    'data_hora',     // O momento exato do registro
  ];

  /**
   * Conversões automáticas de tipos (Casting).
   * Isso garante que 'data_hora' retorne um objeto Carbon (data),
   * facilitando formatações no frontend (ex: $registro->data_hora->format('d/m/Y')).
   */
  protected $casts = [
    //'data_hora' => 'datetime',
  ];

  /**
   * Relacionamento: Um Registro pertence a um Usuário.
   * Uso: $registro->user->name
   */
  public function user()
  {
    return $this->belongsTo(User::class);
  }
}
