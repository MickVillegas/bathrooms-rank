<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use \App\Models\Comment;

class CommentsController extends Controller
{
    public function crearComentario(Request $request){

        $request->validate([
            'nombre_local' => 'required',
            'comentario' => 'required|min:5',
            'valoracion_dada' => 'required',
            'nombre_usuario' => 'required',
            'id_local' => 'required'
        ]);

        Comment::create([
            'nombre_local' => $request->nombre_local,
            'comentario' => $request->comentario,
            'valoracion_dada' => $request->valoracion_dada,
            'nombre_usuario' => $request->nombre_usuario,
            'id_local' => $request->id_local
        ]);

        return response()->json(['mensaje' => "Comentario creado correctamente"], 200);

    }

    public function mostrarComentarios($id_local){

        $comentarios = Comment::where('id_local', $id_local)->orderBy('id', 'DESC')->paginate(5);

        if($comentarios->isEmpty()){
            return response()->json(["respuesta" => "No hay comentarios para este local, sé el primero en comentar"], 404);
        }

        return response()->json($comentarios);

    }

}
