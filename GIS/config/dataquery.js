
let marcas_consulta = []
//Será la variable global que administra 
let Active_data_monitor
function cinfigIni_data() {
    //Inicia la lista con ese criterio
    crear_listas("clsCasos_macroregion")
}
function ver_todo() {
    //Leer todos los cass primero
    Active_data_monitor.clsCasos.forEach(caso => {
        //Por cada caso listo los lugares
        caso.clsLugares.forEach(lugar => {

            const marca = PutMarkCicle(
                true, //Indica si el marcador es fijo
                color_marca_busqueda, //Define el color de la marca en ese momento 
                1, //Define el nivel de opacidad
                10, //Define el tamaño del marcador  
                lugar.lat,
                lugar.lng
            )
                .bindPopup(PutPopUpZ(
                    //Contenido del popup cuanod se hace click
                    `
                    <div style="width: 200px;">
                        <div class="row">
                            <div class="col fw-bold">${lugar.municipio}</div>
                            <div class="col-auto"><span class="badge bg-warning rounded-pill">${new Date(caso.fecha).getFullYear()}</span></div>
                        </div>
                        <div class="fst-italic fw-bold text-primary">${caso.macrotipo}</div>
                        <div class="row">
                            <div class="col">Victimas</div>
                            <div class="col-auto">${caso.npersonas}</div>
                        </div>
                        <div class="row">
                            <div class="col">Mujeres</div>
                            <div class="col-auto">${caso.nmujeres}</div>
                        </div>
                        <div class="row">
                            <div class="col">Hombres</div>
                            <div class="col-auto">${caso.nhombres}</div>
                        </div>
                        <div class="row">
                            <div class="col">Menores</div>
                            <div class="col-auto">${caso.nmenores}</div>
                        </div>
                        <div class="text-end text-success">${caso.fecha}</div>
                        <a class="mt-2 nav-link 
                            border border-1 bg-success 
                            text-white text-center
                            rounded-pill" 
                            href="#"
                            id="btncaso${caso.id}"
                            onclick="mostrar_caso(${caso.id})"
                            >Ver</a>
                    </div>
                        `)
                )
            marcas_consulta.push(marca)

        })

    });
}

function limpiar_todo_marcas() {
    marcas_consulta.forEach(marca => {
        map.removeLayer(marca)
    })
    marcas_consulta = []
}
function crear_listas(opcion) {
    const clase = opcion.split("_")

    if (clase[0] == "clsCasos") {
        makerList["simple_list"](opcion)
    } else {

    }

}
//Guarda en esta variable las cadenas de criterios de filto js
let filterList = []
const makerList = {
    "simple_list": (opcion) => {
        //Toma el criterio y los divide por _ para obtener el campo y la clase
        const criterio = opcion.split("_")
        //Contenedor delas listas
        const contenedor = document.getElementById("contenedor_criterios")
        contenedor.innerHTML = ""

        //Genera una lista de todos los campos sin que se repita un elemento
        let newCriteria = []
        Active_data_monitor.clsCasos.forEach(caso => {
            if (newCriteria.includes(caso[criterio[1]]) == false) {
                newCriteria.push(caso[criterio[1]])
            }
        })

        let detectNumero = false
        //Ordenamos la lsita de AZ
        let newDataOrdenado;
        try {
            function porDato(a, b) {
                return a.localeCompare(b);
            }
            newDataOrdenado = newCriteria.sort(porDato);
            detectNumero = false

        } catch (error) {
            newDataOrdenado = newCriteria.sort();
            newDataOrdenado.sort(function (a, b) {
                return a - b;
            });
            //Al identificar esta variacón, indica que es un valor tipo número, entonces
            detectNumero = true
        }




        //Con base a essa lista creamos una lista de selección on check
        newDataOrdenado.forEach(item => {
            const elemento = document.createElement("div")
            elemento.className = "ms-3 me-3"
            elemento.style.fontWeight = "normal"
            elemento.innerHTML =
                `
            <input class="fst-normal form-check-input" type="checkbox" value="${item}" id="check${item}${criterio[1]}">
             ${item}
        `
            contenedor.appendChild(elemento)

            const checkers = document.getElementById(`check${item}${criterio[1]}`)
            checkers.onchange = () => {
                if (checkers.checked == true) {
                    filterList.push(checkers.value)
                } else {
                    const eliminados = filterList.filter(elemento => elemento != checkers.value);
                    filterList = eliminados
                }
            }
        })

        const filtrador = document.getElementById("btnConsulta")
        filtrador.onclick = () => {
            //Creamos cadena de criterios
            let criterios = ""
            if (detectNumero == true) {
                filterList.forEach(filtro => {
                    criterios = criterios + `value.${criterio[1]} == ${filtro} || `
                })
                criterios = criterios + `value.${criterio[1]} ==100000000`
            } else {
                filterList.forEach(filtro => {
                    criterios = criterios + `value.${criterio[1]} == "${filtro}" || `
                })
                criterios = criterios + `value.${criterio[1]} ==""`
            }
            let filtered = Active_data_monitor.clsCasos.filter(value => eval(criterios));
            mostrar_resultados(filtered)
        }
        filterList = []

    },
}

function mostrar_resultados(data) {

    //Leer todos los cass primero
    data.forEach(caso => {
        //Por cada caso listo los lugares
        caso.clsLugares.forEach(lugar => {

            const marca = PutMarkCicle(
                true, //Indica si el marcador es fijo
                color_marca_busqueda, //Define el color de la marca en ese momento 
                1, //Define el nivel de opacidad
                10, //Define el tamaño del marcador  
                lugar.lat,
                lugar.lng
            )
                .bindPopup(PutPopUpZ(
                    //Contenido del popup cuanod se hace click
                    `
                <div style="width: 200px;">
                    <div class="row">
                        <div class="col fw-bold">${lugar.municipio}</div>
                        <div class="col-auto"><span class="badge bg-warning rounded-pill">${new Date(caso.fecha).getFullYear()}</span></div>
                    </div>
                    <div class="fst-italic fw-bold text-primary">${caso.macrotipo}</div>
                    <div class="row">
                        <div class="col">Victimas</div>
                        <div class="col-auto">${caso.npersonas}</div>
                    </div>
                    <div class="row">
                        <div class="col">Mujeres</div>
                        <div class="col-auto">${caso.nmujeres}</div>
                    </div>
                    <div class="row">
                        <div class="col">Hombres</div>
                        <div class="col-auto">${caso.nhombres}</div>
                    </div>
                    <div class="row">
                        <div class="col">Menores</div>
                        <div class="col-auto">${caso.nmenores}</div>
                    </div>
                    <div class="text-end text-success">${caso.fecha}</div>
                    <a class="mt-2 nav-link 
                        border border-1 bg-success 
                        text-white text-center
                        rounded-pill" 
                        href="#"
                        id="btncaso${caso.id}"
                        onclick="mostrar_caso(${caso.id})"
                        >Ver</a>
                </div>
                    `

                )

                )
            marcas_consulta.push(marca)
        })

    });
}
function mostrar_caso(id) {
    const contenedor = document.getElementById("body_consolta_caso")
    const caso = Active_data_monitor.clsCasos[id]

    try {
        document.getElementById("tl_index_caso").textContent="Caso número " + (caso.id + 1)
        document.getElementById("spanvigencia").textContent= new Date(caso.fecha).getFullYear()
        
        document.getElementById("consulta_macrotipo").textContent=caso.macrotipo
        document.getElementById("consulta_macroregion").textContent="Macroregión " + caso.macroregion
        document.getElementById("consulta_departamento").textContent="Departamento " + caso.departamento
        document.getElementById("consulta_lugares").innerHTML=""
        caso.clsLugares.forEach(lugar=>{
            const div = document.createElement("div")
            div.className="label-org-yellow-light p-2"
            div.textContent=lugar.municipio
            document.getElementById("consulta_lugares").appendChild(div)

        })
        document.getElementById("consulta_tipos").innerHTML=""
        caso.clsTipos.forEach(item=>{
            const div = document.createElement("div")
            div.className="label-org-yellow-light p-2"
            div.textContent=item.nombre
            document.getElementById("consulta_tipos").appendChild(div)

        })
        document.getElementById("consulta_detalle").textContent=caso.detalle

        document.getElementById("consulta_pueblos").innerHTML=""
        caso.clsPueblos.forEach(item=>{
            const div = document.createElement("div")
            div.className="label-org-yellow-light p-2"
            div.textContent=item.nombre
            document.getElementById("consulta_pueblos").appendChild(div)

        })

    } catch (error) {
        
    }
    

    bootstrap.Modal.getOrCreateInstance(document.getElementById("modalconsultacaso")).show();
}
