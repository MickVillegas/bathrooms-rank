let paginaActual = 1;

async function obtenerLocales(pagina = 1) {

    // 1. Limpiamos el contenedor para que no se acumulen los locales de la página anterior
    let container = document.querySelectorAll(".container");
    container[1].innerHTML = "";

    // 2. Hacemos la petición pasando el parámetro de página
    let busca = await fetch(`http://localhost:8000/api/mostrarLocales?page=${pagina}`);
    let datos = await busca.json();

    // IMPORTANTE: Al usar paginate(), los datos reales están en datos.data
    // Usamos el bucle for tal cual lo tenías, apuntando a datos.data.length
    for (let i = 0; i < datos.data.length; i++) {
        
        // Mantenemos tu lógica de valoraciones
        const pos = parseInt(datos.data[i].valoracion_positiva) || 0;
        const neg = parseInt(datos.data[i].valoracion_negativa) || 0;
        const total = pos + neg;
        const diferencia = pos - neg;

        let resultadoTexto = "";
        let colorTexto = "black";

        if (total === 0) {
            resultadoTexto = "Sin valoraciones aún";
        } 
        else if (pos === neg) {
            resultadoTexto = "Neutral";
            colorTexto = "orange";
        } 
        else if (diferencia > 0) {
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

        // Creamos la card
        let cards = document.createElement("div");
        cards.className = "card mb-5 shadow"; 
        cards.style.width = "70%";
        cards.style.margin = "0 auto";
        cards.innerHTML = `
            <div class="row g-0 align-items-center">
                <div class="col-md-3">
                    <img src="./storage/${datos.data[i].imagen}" class="img-fluid rounded-start" alt="Imagen local">
                </div>
                <div class="col-md-6">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-8">
                                <h5 class="card-title mb-0">${datos.data[i].nombre_local}</h5>
                            </div>
                            <div class="col-4 text-end">
                                <span style="color: ${colorTexto}; font-weight: bold;">Valoración: ${resultadoTexto}</span>
                            </div>
                        </div>
                        <hr> 
                        <p class="card-text mt-2">${datos.data[i].descripcion}</p>
                    </div>
                </div>
                <div class="col-md-3 text-center">
                    <a href="#" class="btn btn-outline-primary botonVerInformacion" id="${datos.data[i].id}">Ver información</a>
                </div>
            </div>
        `;

        container[1].appendChild(cards);
    }

    // 3. Agregamos los botones de navegación (Siguiente/Anterior)
    crearBotonesPaginacion(datos);

    // 4. Asignamos los eventos a los botones de "Ver información" (tu bucle for original)
    let botones = document.querySelectorAll(".botonVerInformacion");
    for (let i = 0; i < botones.length; i++) {
        botones[i].addEventListener("click", verInfo);
    }

    console.log("Locales renderizados: " + datos.data.length);
    console.log("Página actual: " + datos.current_page);
}

// Función auxiliar para los botones de pasar página
function crearBotonesPaginacion(datos) {
    let container = document.querySelectorAll(".container");
    let navDiv = document.createElement("div");
    navDiv.className = "text-center my-4";
    
    // Botón Anterior (se deshabilita si no hay página previa)
    let btnPrev = `<button class="btn btn-outline-primary me-2" id="btnPrev" ${datos.prev_page_url ? "" : "disabled"}>Anterior</button>`;
    
    // Texto de página actual
    let infoPagina = `<span>Página ${datos.current_page} de ${datos.last_page}</span>`;
    
    // Botón Siguiente (se deshabilita si no hay más páginas)
    let btnNext = `<button class="btn btn-outline-primary ms-2" id="btnNext" ${datos.next_page_url ? "" : "disabled"}>Siguiente</button>`;

    navDiv.innerHTML = btnPrev + infoPagina + btnNext;
    container[1].appendChild(navDiv);

    // Eventos para los botones
    document.getElementById("btnPrev").addEventListener("click", () => {
        paginaActual--;
        obtenerLocales(paginaActual);
    });

    document.getElementById("btnNext").addEventListener("click", () => {
        paginaActual++;
        obtenerLocales(paginaActual);
    });
}


obtenerLocales(paginaActual);

        function verInfo(event){
            let nodoClick
            if(event){
                nodoClick = event.target;
                localStorage.setItem("id_local", nodoClick.id);
                window.location.href = "local.html";
            }
        }

        async function buscarLocal(){

            let inputBusqueda = document.getElementById("inputBusqueda").value;
            console.log("Buscando local: " + inputBusqueda);
            let busca = await fetch(`http://localhost:8000/api/buscarLocal/${inputBusqueda}`);
            let datos = await busca.json();
            console.log("Respuesta de búsqueda:", datos);
            console.log("aaaaaa:", datos[0].nombre_local);

            let container = document.querySelectorAll(".container");
            container[1].innerHTML = "";

                if (datos.length === 0) {
                    alert("No se encontró ningún local con ese nombre.");
                    return;
                }
                else{

                    for (let i = 0; i < datos.length; i++) {
        
                        const pos = parseInt(datos[i].valoracion_positiva) || 0;
                        const neg = parseInt(datos[i].valoracion_negativa) || 0;
                        const total = pos + neg;
                        const diferencia = pos - neg;

                        let resultadoTexto = "";
                        let colorTexto = "black";

                        if (total === 0) {
                            resultadoTexto = "Sin valoraciones aún";
                        } 
                        else if (pos === neg) {
                            resultadoTexto = "Neutral";
                            colorTexto = "orange";
                        } 
                        else if (diferencia > 0) {
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
                    
                        let cards = document.createElement("div");
                        cards.className = "card mb-5 shadow"; 
                        cards.style.width = "70%";
                        cards.style.margin = "0 auto";
                        cards.innerHTML = `
                            <div class="row g-0 align-items-center">
                                <div class="col-md-3">
                                    <img src="./storage/${datos[i].imagen}" class="img-fluid rounded-start" alt="Imagen local">
                                </div>
                                <div class="col-md-6">
                                    <div class="card-body">
                                        <div class="row align-items-center">
                                            <div class="col-8">
                                                <h5 class="card-title mb-0">${datos[i].nombre_local}</h5>
                                            </div>
                                            <div class="col-4 text-end">
                                                <span style="color: ${colorTexto}; font-weight: bold;">Valoración: ${resultadoTexto}</span>
                                            </div>
                                        </div>
                                        <hr> 
                                        <p class="card-text mt-2">${datos[i].descripcion}</p>
                                    </div>
                                </div>
                                <div class="col-md-3 text-center">
                                    <a href="#" class="btn btn-primary botonVerInformacion" id="${datos[i].id}">Ver información</a>
                                </div>
                            </div>
                        `;
                        
                        container[1].appendChild(cards);
                    }
                }
                    let botones = document.querySelectorAll(".botonVerInformacion");
                    
                    for (let i = 0; i < botones.length; i++) {
                        botones[i].addEventListener("click", verInfo);
                    }
        }