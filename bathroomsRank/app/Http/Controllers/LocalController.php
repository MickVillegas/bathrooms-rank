<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use \App\Models\Local;

class LocalController extends Controller
{
    public function crearLocal(Request $request){

        Local::create([
            'nombre_local' => $request->nombre_local,
            'lugar' => $request->lugar,
            'descripcion' => $request->descripcion,
            'valoracion_positiva' => "0",
            'valoracion_negativa' => "0"
        ]);

        return response()->json(['mensaje' => "Local creado correctamente"], 200);

    }


    public function mostrarLocales(){

         $locales = Local::orderBy('id', 'DESC')->paginate(5);

        if($locales->isEmpty()){
            return response()->json(["respuesta" => "No hay locales en la lista, añade un local a la lista"], 404);
        }

        return response()->json($locales);

    }

    
    public function mostrarUnLocal($id){

        $unLocal = Local::where('id', $id)->first();

        if (!$unLocal) {
            return response()->json(["respuesta" => "No se ha encontrado el local con el id: $id"], 404);
        }

        return response()->json($unLocal);
        
    }

    public function unaValoracionPositiva($id){
        $local = Local::where('id', $id)->first();

        if (!$local) {
            return response()->json(["respuesta" => "No se ha encontrado el local con el id: $id"], 404);
        }

        $actual = (int) $local->valoracion_positiva; 
        $local->valoracion_positiva = (string) ($actual + 1);
        $local->save();

        return response()->json(["respuesta" => "Valoración positiva añadida correctamente"], 200);
    }

    public function unaValoracionNegativa($id){
        $local = Local::where('id', $id)->first();

        if (!$local) {
            return response()->json(["respuesta" => "No se ha encontrado el local con el id: $id"], 404);
        }

        $actual = (int) $local->valoracion_negativa;
        $local->valoracion_negativa = (string) ($actual + 1);
        $local->save();

        return response()->json(["respuesta" => "Valoración negativa añadida correctamente"], 200);
    }
}
