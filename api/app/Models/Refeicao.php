<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Refeicao extends Model
{
     /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'tipo',
        'data',
        'horario_inicio',
        'horario_termino',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'data' => 'string',
            'horario_inicio' => 'datetime:H:i',
            'horario_termino' => 'datetime:H:i',
        ];
    }



    /**
   * @return BelongsToMany
   */
   public function users(): BelongsToMany
   {
       return $this->belongsToMany(Refeicao::class, 'token', 'refeicao_id', 'user_id')
           ->withPivot('id', 'created_at', 'updated_at');
   }
}
