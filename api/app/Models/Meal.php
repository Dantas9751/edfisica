<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meal extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'tipo',
        'data',
        'horario_inicio',
        'horario_fim',
        'qr_code_hash',
    ];

    public function records()
    {
        return $this->hasMany(MealRecord::class);
    }
}