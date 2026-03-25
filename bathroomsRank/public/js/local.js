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

        async function subirComentario(){

            let seccionComentarios = document.querySelector(".comentariosNuevos");

            if(valoracion == "positivo"){
                await fetch("http://localhost:8000/api/unaValoracionPositiva/" + localStorage.getItem("id_local"), {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json"
                    }
                })
            }
            else{
                await fetch("http://localhost:8000/api/unaValoracionNegativa/" + localStorage.getItem("id_local"), {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json"
                    }
                })
            }

            let comentario = document.getElementById("comentario").value;
            let nombre = document.getElementById("nombre").value;

            if(valoracion == "positivo"){
                let comentarioEnFrontend = document.createElement("div");
                let hr = document.createElement("hr");
                comentarioEnFrontend.innerHTML = '<div class = "row"><div class = "col-6"><strong>'+ nombre +'</strong></div><div class = "col-6 text-success"><strong>Valoración: '+ valoracion +'</strong></div></div><p>'+ comentario +'</p>'
                seccionComentarios.appendChild(comentarioEnFrontend);
                seccionComentarios.appendChild(hr);
            }
            else{
                let comentarioEnFrontend = document.createElement("div");
                let hr = document.createElement("hr");
                comentarioEnFrontend.innerHTML = '<div class = "row"><div class = "col-6"><strong>'+ nombre +'</strong></div><div class = "col-6 text-danger"><strong>Valoración: '+ valoracion +'</strong></div></div><p>'+ comentario +'</p>'
                seccionComentarios.appendChild(comentarioEnFrontend);
                seccionComentarios.appendChild(hr);
            }


            const subirCXomentario = {
                nombre_local: nombreLocal,
                comentario: comentario,
                valoracion_dada: valoracion,
                nombre_usuario: nombre,
                id_local:localStorage.getItem("id_local")
            }
        
            const repositorio = await fetch ("http://localhost:8000/api/crearComentario" ,{
                method: "POST",
                body: JSON.stringify(subirCXomentario),
                headers: {
                    "Content-type": "application/json"
                }
            })
        }

        document.getElementById("botonSubirComentario").addEventListener("click", subirComentario);