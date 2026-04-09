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
    // 1. Validar los datos
    $request->validate([
        'nombreLocal' => 'required|min:3',
        'direccionLocal' => 'required|min:5',
    ], [
        // Mensajes personalizados (opcional)
        'nombreLocal.required' => '* El nombre del local es obligatorio.',
        'direccionLocal.required' => '* La dirección es necesaria para encontrar el local.',
    ]);

    // 2. Si la validación pasa, enviar el mail
    Mail::to('mickprofesional@gmail.com')->send(new SugerenciaLocal($request->nombreLocal, $request->direccionLocal));

    // Redirigimos atrás con un mensaje de éxito
    return back()->with('status', 'Tu sugerencia para ' . $request->nombreLocal . ' se ha enviado correctamente.');
})->name('enviar.sugerencia');