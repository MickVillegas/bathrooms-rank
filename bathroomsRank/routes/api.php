<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LocalController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/crearLocal', [LocalController::class, 'crearLocal']);
Route::get('/mostrarLocales', [LocalController::class, 'mostrarLocales']);
Route::get('/mostrarUnLocal/{id}', [LocalController::class, 'mostrarUnLocal']);