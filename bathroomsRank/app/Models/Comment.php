<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    /** @use HasFactory<\Database\Factories\CommentFactory> */

    public function local(){
        return $this->belongsTo(Local::class);
    }

    use HasFactory;
    
    protected $fillable = ['nombre_local', 'comentario', 'valoracion_dada', 'nombre_usuario', 'id_local'];
    public $timestamps = false;
}
