<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Local extends Model
{
    /** @use HasFactory<\Database\Factories\LocalFactory> */

    public function comments(){
        return $this->hasMany(Comment::class);
    }

    use HasFactory;

    protected $fillable = ['nombre_local', 'lugar', 'descripcion', 'valoracion_positiva', 'valoracion_negativa', 'imagen'];
    public $timestamps = false;

    protected function imagen(): Attribute{
        return Attribute::make(
            get: fn ($value) => $value ? asset(Storage::url($value)) : null,
        );
    }
    
}
