<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LocalController;
use App\Http\Controllers\CommentsController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/crearLocal', [LocalController::class, 'crearLocal']);
Route::get('/mostrarLocales', [LocalController::class, 'mostrarLocales']);
Route::get('/mostrarUnLocal/{id}', [LocalController::class, 'mostrarUnLocal']);
Route::put('/unaValoracionPositiva/{id}', [LocalController::class, 'unaValoracionPositiva']);
Route::put('/unaValoracionNegativa/{id}', [LocalController::class, 'unaValoracionNegativa']);

Route::post('/crearComentario', [CommentsController::class, 'crearComentario']);
Route::get('/mostrarComentarios/{id_local}', [CommentsController::class, 'mostrarComentarios']);






/*
http://localhost:8000/api/crearLocal

{
  "nombre_local": "MC Donalds",
  "lugar": "CC Mediterraneo",
  "descripcion": "otro local de mc dolands"
}





http://localhost:8000/api/crearComentario

{
  "nombre_local": "MC Donalds",
  "comentario": "baños asquerosos, encontre una mierda en la pared restregada",
  "valoracion_dada": "negativo",
  "nombre_usuario": "Pepe Fuentes",
  "id_local": 1
}

{
  "nombre_local": "MC Donalds",
  "comentario": "la gente mea en el suelo",
  "valoracion_dada": "negativo",
  "nombre_usuario": "Alfonso Torrecillas",
  "id_local": 1
}
*/