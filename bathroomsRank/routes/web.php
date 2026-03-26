<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\SugerenciaLocal;

// Mostrar la página
Route::get('/contacto', function () {
    return view('contacto'); // Esto busca resources/views/contacto.blade.php
});

// Recibir el formulario y enviar correo
Route::post('/enviar-sugerencia', function (Request $request) {
    $nombre = $request->input('nombreLocal');
    $direccion = $request->input('direccionLocal');

    // Envío del correo
    Mail::to('mickprofesional@gmail.com')->send(new App\Mail\SugerenciaLocal($nombre, $direccion));

    // Redirigimos atrás con un mensaje de éxito
    return back()->with('status', 'Tu sugerencia para ' . $nombre . ' se ha enviado correctamente.');
})->name('enviar.sugerencia');