        let valoracion;
        let nombreLocal;

        function valoracionPositiva() {

            document.getElementById("like").classList.remove("btn-outline-success");
            document.getElementById("like").classList.add("btn-success");
            valoracion = "positivo";
            document.getElementById("dislike").classList.remove("btn-danger");
            document.getElementById("dislike").classList.add("btn-outline-danger");

        }

        function valoracionNegativa() {

            document.getElementById("dislike").classList.remove("btn-outline-danger");
            document.getElementById("dislike").classList.add("btn-danger");
            valoracion = "negativo";
            document.getElementById("like").classList.remove("btn-success");
            document.getElementById("like").classList.add("btn-outline-success");

        }

        async function mostrarInfo() {

            let busca = await fetch("http://localhost:8000/api/mostrarUnLocal/" + localStorage.getItem("id_local"));
            let datos = await busca.json();

            document.getElementById("titulo").textContent = datos.nombre_local;
            document.getElementById("nombreLocal").textContent = datos.nombre_local;
            document.getElementById("descripcion").textContent = datos.descripcion;
            document.getElementById("direccion").textContent = "Dirección: " + datos.lugar;
            document.getElementById("imagenLocal").src = "./storage/" + datos.imagen;
            //document.getElementById("Resenas").textContent = "Reseñas: ";

            const pos = parseInt(datos.valoracion_positiva) || 0;
            const neg = parseInt(datos.valoracion_negativa) || 0;
            const total = pos + neg;
            const diferencia = pos - neg;

            let resultadoTexto = "";
            let colorTexto = "black"; // Color por defecto

            if (total === 0) {
                resultadoTexto = "Sin valoraciones aún";
            } 
            else if (pos === neg) {
                resultadoTexto = "Neutral";
                colorTexto = "orange";
            } 
            else if (diferencia > 0) {
                // Es positiva
                const ratio = pos / total;
                if (ratio >= 0.8 && total >= 5) {
                    resultadoTexto = "Muy buena";
                    colorTexto = "darkgreen";
                } 
                else {
                    resultadoTexto = "Buena";
                    colorTexto = "green";
                }
            } 
            else {
                // Es negativa
                const ratio = neg / total;
                if (ratio >= 0.8 && total >= 5) {
                    resultadoTexto = "Muy mala";
                    colorTexto = "darkred";
                } 
                else {
                    resultadoTexto = "Mala";
                    colorTexto = "red";
                }
            }
        
            // 3. Mostrar el resultado en el HTML
            const spanValoracion = document.getElementById("Valoracion");
            spanValoracion.textContent = "Valoración general: " + resultadoTexto;
            spanValoracion.style.color = colorTexto;
            spanValoracion.style.fontWeight = "bold";

            nombreLocal = datos.nombre_local;

        }

        mostrarInfo()

        // 1. Variable global para saber qué página cargar
        let paginaComentarios = 1;

        async function comentarios() {
            let idLocal = localStorage.getItem("id_local");
            let buscar = await fetch(`http://localhost:8000/api/mostrarComentarios/${idLocal}?page=${paginaComentarios}`);
            let datos = await buscar.json();
        
            // 2. Mostrar el total real de comentarios (Laravel lo da en datos.total)
            // Esto solucionará que te marque 8 en lugar de 5
            if (datos.total !== undefined) {
                document.getElementById("Resenas").textContent = "Reseñas: (" + datos.total + ")";
            }
        
            if (buscar.status === 404 && paginaComentarios === 1) {
                document.querySelector(".comentarios").innerHTML = '<center class="mb-5"><h3>(No hay comentarios para este local)</h3></center>';
                return;
            }
        
            // 3. Bucle FOR para añadir comentarios sin borrar los anteriores
            for (let i = 0; i < datos.data.length; i++) {
                let comentarioDiv = document.createElement("div");
                let hr = document.createElement("hr");

                // Determinamos la clase de color según la valoración
                let colorClase = (datos.data[i].valoracion_dada == "positivo") ? "text-success" : "text-danger";
            
                comentarioDiv.innerHTML = `
                    <div class="row">
                        <div class="col-6"><strong>${datos.data[i].nombre_usuario}</strong></div>
                        <div class="col-6 ${colorClase}"><strong>Valoración: ${datos.data[i].valoracion_dada}</strong></div>
                    </div>
                    <p>${datos.data[i].comentario}</p>
                `;
                
                document.querySelector(".comentarios").appendChild(comentarioDiv);
                document.querySelector(".comentarios").appendChild(hr);
            }
        
            // 4. Lógica del botón "Ver más"
            gestionarBotonVerMas(datos);
        }

        function gestionarBotonVerMas(datos) {
            // Eliminamos el botón anterior si existe para que no se duplique
            let botonExistente = document.getElementById("btnCargarMas");
            if (botonExistente) botonExistente.remove();
        
            // Si hay una página siguiente, creamos el botón
            if (datos.next_page_url !== null) {
                let btn = document.createElement("button");
                btn.id = "btnCargarMas";
                btn.className = "btn btn-outline-secondary d-block mx-auto mb-5";
                btn.textContent = "Mostrar más comentarios";

                btn.onclick = function() {
                    paginaComentarios++; // Incrementamos la página
                    comentarios();      // Llamamos de nuevo a la función
                };
            
                document.querySelector(".comentarios").appendChild(btn);
            }
        }

        // Llamada inicial
        comentarios();

        async function subirComentario() {
            const errVal = document.getElementById("error-valoracion");
            const errNom = document.getElementById("error-nombre");
            const errCom = document.getElementById("error-comentario");
            
            // Obtenemos los valores de texto directamente
            const nombreValue = document.getElementById("nombre").value.trim();
            const comentarioValue = document.getElementById("comentario").value.trim();
        
            errVal.classList.add("d-none");
            errNom.classList.add("d-none");
            errCom.classList.add("d-none");
        
            let hayError = false;
        
            if (!valoracion) {
                errVal.classList.remove("d-none");
                hayError = true;
            }
            if (nombreValue === "") {
                errNom.classList.remove("d-none");
                hayError = true;
            }
            if (comentarioValue === "") {
                errCom.classList.remove("d-none");
                hayError = true;
            }
        
            if (hayError) return;
        
            // --- PROCESO DE ENVÍO ---
            
            // 1. Actualizar contadores (PUT)
            const urlValoracion = valoracion === "positivo" 
                ? "http://localhost:8000/api/unaValoracionPositiva/" 
                : "http://localhost:8000/api/unaValoracionNegativa/";
        
            await fetch(urlValoracion + localStorage.getItem("id_local"), {
                method: "PUT",
                headers: { "Content-type": "application/json" }
            });
        
            // 2. Pintar en el frontend (Usando nombreValue y comentarioValue)
            let seccionComentarios = document.querySelector(".comentariosNuevos");
            let colorClass = valoracion === "positivo" ? "text-success" : "text-danger";
            let comentarioEnFrontend = document.createElement("div");
            comentarioEnFrontend.innerHTML = `
                <div class="row">
                    <div class="col-6"><strong>${nombreValue}</strong></div>
                    <div class="col-6 ${colorClass}"><strong>Valoración: ${valoracion}</strong></div>
                </div>
                <p>${comentarioValue}</p>
                <hr>`;
            seccionComentarios.appendChild(comentarioEnFrontend);
        
            // 3. ENVIAR A LA BASE DE DATOS (POST)
            const objetoComentario = {
                nombre_local: nombreLocal, // Asegúrate de que nombreLocal tenga valor globalmente
                comentario: comentarioValue, // ¡Importante usar el valor!
                valoracion_dada: valoracion,
                nombre_usuario: nombreValue, // ¡Importante usar el valor!
                id_local: localStorage.getItem("id_local")
            };
        
            try {
                const respuesta = await fetch("http://localhost:8000/api/crearComentario", {
                    method: "POST",
                    body: JSON.stringify(objetoComentario),
                    headers: { "Content-type": "application/json" }
                });
            
                if (respuesta.ok) {
                    let botonEnviado = document.getElementById("botonSubirComentario")
                    botonEnviado.textContent = "";
                    botonEnviado.classList.remove("btn-primary");
                    botonEnviado.classList.add("btn-success");
                    botonEnviado.textContent = "Comentario enviado";
                    botonEnviado.disabled = true;
                    document.getElementById("comentario").value = "";
                    document.getElementById("nombre").value = "";
                    // Resetear valoración para el próximo comentario
                    valoracion = null; 
                    document.getElementById("like").classList.replace("btn-success", "btn-outline-success");
                    document.getElementById("dislike").classList.replace("btn-danger", "btn-outline-danger");
                }
            } catch (error) {
                console.error("Error al subir:", error);
            }
        }

        document.getElementById("botonSubirComentario").addEventListener("click", subirComentario);