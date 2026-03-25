<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use \App\Models\Local;

class LocalController extends Controller
{
public function crearLocal(Request $request){
    // 1. Validamos que el archivo sea una imagen (máximo 2MB en este ejemplo)
    $request->validate([
        'nombre_local' => 'required|string',
        'lugar' => 'required|string',
        'descripcion' => 'required|string',
        'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
    ]);

    $rutaImagen = null;

    // 2. Comprobamos si viene una imagen en la petición
    if ($request->hasFile('imagen')) {
        // Guarda la imagen en storage/app/public/locales y devuelve la ruta
        $rutaImagen = $request->file('imagen')->store('locales', 'public');
    }

    // 3. Creamos el registro con la ruta de la imagen
    Local::create([
        'nombre_local' => $request->nombre_local,
        'lugar' => $request->lugar,
        'descripcion' => $request->descripcion,
        'valoracion_positiva' => "0",
        'valoracion_negativa' => "0",
        'imagen' => $rutaImagen // Aquí guardamos el string con la ruta
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

    
    public function buscarLocal($nombreLocal){
        $local = Local::where('nombre_local', 'LIKE', "%$nombreLocal%")->get();

        if ($local->isEmpty()) {
            return response()->json(["respuesta" => "No se ha encontrado ningún local con el nombre: $nombreLocal"], 404);
        }

        return response()->json($local);

    }
}
