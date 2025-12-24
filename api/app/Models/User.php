<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
  /** @use HasFactory<\Database\Factories\UserFactory> */
  use HasApiTokens, HasFactory, Notifiable;

  /**
   * The attributes that are mass assignable.
   *
   * @var list<string>
   */
  protected $fillable = [
    'name',
    'matricula',
    'tipo',
    'password',
    'qtd_token',
  ];

  /**
   * The attributes that should be hidden for serialization.
   *
   * @var list<string>
   */
  protected $hidden = [
    'password',
    'remember_token',
  ];

  /**
   * Get the attributes that should be cast.
   *
   * @return array<string, string>
   */
  protected function casts(): array
  {
    return [
      'email_verified_at' => 'datetime',
      'password' => 'hashed',
    ];
  }

  public function isAdm(): bool
  {
    return $this->tipo === 'adm';
  }

  /**
   * @return BelongsToMany
   */
  public function refeicao(): BelongsToMany
  {
    return $this->belongsToMany(Refeicao::class, 'token', 'user_id', 'refeicao_id')
      ->withPivot('id', 'created_at', 'updated_at');
  }

  /**
   * @return HasMany
   */
  public function registros()
  {
    return $this->hasMany(Registro::class);
  }
}
