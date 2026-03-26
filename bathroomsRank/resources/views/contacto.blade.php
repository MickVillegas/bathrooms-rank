<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contacto</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>

    <link rel="stylesheet" href="css/styles.css">

</head>
<body>
    
    <header class = "mb-5 shadow pt-5 pb-3">

        <div class = "ms-5">
            <h1>PooRank</h1>
        </div>

        <div class = "ms-5 row justify-content-end" style = "display: flex;">

          <div class="col-3"><a class="link-dark link-underline link-underline-opacity-0" href="./info.html">Inicio</a></div>
          <div class="col-3"><a class="link-dark link-underline link-underline-opacity-0" href="./index.html">Ver baños</a></div>
          <div class="col-3"><a class="link-primary link-underline link-underline-opacity-0" href="./contacto.html">Contacto</a></div>

        </div>

    </header>

    <div class = "container">

        <div class="row mb-5">
            <div class="col-4"><hr></div>
                <h2 class="col-4 text-center">Contacto</h2>
            <div class="col-4"><hr></div>
        </div>

        <h3 class = "text-center">¿No aparece su local favorito? Escriba aquí su sugerencia.</h3>

<form action="{{ route('enviar.sugerencia') }}" method="POST" class="mb-5">
    @csrf
    <div class="mb-3">
        <label for="nombreLocal" class="form-label">Nombre del local</label>
        <input type="text" name="nombreLocal" class="form-control" id="nombreLocal" required>
    </div>
    <div class="mb-3">
        <label for="direccionLocal" class="form-label">Dirección del local</label>
        <input type="text" name="direccionLocal" class="form-control" id="direccionLocal" required>
    </div>
    <button type="submit" class="btn btn-primary">Enviar sugerencia</button>
</form>

        <h3 class = "text-center mb-5">También se puede poner en contacto con nosotros por:</h3>

        <div class="row justify-content-evenly">
            <div class = "col-4 text-center bg-body shadow rounded pt-3 pb-3">Correo electrónico: mickprofesional@gmail.com</div>
            <div class = "col-4 text-center bg-body shadow rounded pt-3 pb-3">Número de teléfono: 666 66 66 66</div>
        </div>

    </div>

    <footer class="pt-5 pb-5">
        <div class="container">
            <p class="text-center">&copy; 2026 PooRank. Todos los derechos reservados.</p>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

@if(session('status'))
<script>
    Swal.fire({
        title: '¡Correo enviado!',
        text: '{{ session('status') }}',
        icon: 'success',
        confirmButtonText: 'Volver al inicio',
        confirmButtonColor: '#0d6efd', // El azul de tu botón primario
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "/info.html";
        }
    });
</script>
@endif

</body>
</html>