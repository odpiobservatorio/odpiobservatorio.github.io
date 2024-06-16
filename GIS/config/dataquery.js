
let marcas_consulta = []
let filterList = []

let criteria_items = []
//Será la variable global que administra 
let Active_data_monitor
function cinfigIni_data() {
    //Inicia la lista con ese criterio
    crear_listas("clsCasos_macroregion")
    document.getElementById("btnConsulta").value = 1
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
    filterList = []
    makerList["newOpen_list"](opcion)
}
//Guarda en esta variable las cadenas de criterios de filto js
const makerList = {
    "newOpen_list": (opcion) => {
        //Contenedor delas listas
        const contenedor = document.getElementById("contenedor_criterios")
        contenedor.innerHTML = ""
        //Toma el criterio y los divide por _ para obtener el campo y la clase
        const criterio = opcion.split("_")
        //Aquí obtengo la clase y el campo, deriva la acción si es la clase Padre o Hija
        let newCriteria = [] //Esta variable guarda la lista según la clase
        if (criterio[0] == "clsCasos") {
            Active_data_monitor.clsCasos.forEach(caso => {
                if (newCriteria.includes(caso[criterio[1]]) == false) {
                    newCriteria.push(caso[criterio[1]])
                }
            })
        } else {
            //Aquí es la derivación en caso de que la clase no sea CASOS (Padre)
            //Busca en la clase hija.
            Active_data_monitor.clsCasos.forEach(caso => {
                caso[criterio[0]].forEach(item => {
                    if (newCriteria.includes(item[criterio[1]]) == false) {
                        newCriteria.push(item[criterio[1]])
                    }
                })
            })
        }


        //Ordenamos la lsita de AZ
        let newDataOrdenado;
        try {
            function porDato(a, b) {
                return a.localeCompare(b);
            }
            newDataOrdenado = newCriteria.sort(porDato);


        } catch (error) {
            //Esto en el caso que los valores sean solo numérico, entonces se ordena por número
            newDataOrdenado = newCriteria.sort();
            newDataOrdenado.sort(function (a, b) {
                return a - b;
            });
            //Al identificar esta variacón, indica que es un valor tipo número, entonces

        }

        //Con base a essa lista creamos una lista de selección on check
        newDataOrdenado.forEach(item => {
            let realvalue;
            if (typeof item === "number") {
                realvalue = parseInt(item)
            } else {
                realvalue = (item)
            }
            const elemento = document.createElement("div")
            elemento.className = "ms-3 me-3"
            elemento.style.fontWeight = "normal"
            elemento.innerHTML =
                `
            <input class="fst-normal form-check-input" type="checkbox" value="${realvalue}" id="check${item}${criterio[1]}">
             ${item}
        `
            //Coloca un elemento en la lista, estos elementos tienen un control chekc que lo detecta el programa
            contenedor.appendChild(elemento)
            const checkers = document.getElementById(`check${item}${criterio[1]}`)
            //Miramos si el valor viene de la lista o viene de el campo abirto

            //Se detecta un cambio en el control, agrega o elimina un elemento de la lista de filtros.
            checkers.onchange = () => {
                //Validamos si la clase es mayor o menor

                if (checkers.checked == true) {

                    const criterios = {
                        "clase": criterio[0],
                        "field": criterio[1],
                        "operador": document.getElementById("lstOperadores").value,
                        "value": checkers.value
                    }
                    filterList.push(criterios)
                } else {
                    const eliminados = filterList.filter(elemento => elemento.value != checkers.value);
                    filterList = eliminados
                }
            }
        })

        document.getElementById("intOpentCriterio").oninput = () => {
            let valor_buscar = ""
            filterList = []
            valor_buscar = document.getElementById("intOpentCriterio").value
            criterios_filter = `value.${criterio[1]}${document.getElementById("lstOperadores").value}("${valor_buscar}")`

            let tipo;
            if (criterio[0] == "clsCasos") {
                tipo = "a"
            } else {
                tipo = "b"
            }
            const criterios = {
                "tipo": tipo,
                "clase": criterio[0],
                "field": criterio[1],
                "operador": document.getElementById("lstOperadores").value,
                "value": document.getElementById("intOpentCriterio").value
            }
            filterList.push(criterios)

        }


        //Ahora trabajamos con los filtros
        const filtrador = document.getElementById("btnConsulta")
        //Debemos construir las cadenas de filtro según las listas en filterlist
        filtrador.onclick = () => {
            let criterios_filter = ""
            let operador_link = "" //Esta variable guarda el operador de vinculo

            if (filterList.length == 0) {
                operador_link = ""
            }
            //Miramos todos los elementos de filtros creados
            let i = 0
            filterList.forEach(elemento => {
                if (i == filterList.length - 1) {
                    operador_link = ""
                }
                if (i < filterList.length - 1) {
                    operador_link = "||"
                }
                i = i + 1
                //Unimos los elementos en uan cadena final de filtro
                criterios_filter = criterios_filter + `value.${elemento.field}${elemento.operador}("${elemento.value}")${operador_link}`
            })


            //Se verifica que clase es y se deriba la construcción del filtro
            let filtros_ampliados = []
            if (criterio[0] == "clsCasos") {
                let filtered = Active_data_monitor.clsCasos.filter(value => eval(criterios_filter));
                mostrar_resultados(filtered)

            } else {
                Active_data_monitor.clsCasos.forEach(caso => {
                    let filtered = caso[criterio[0]].filter(value => eval(criterios_filter));
                    //Si el filtro en ese momento no dice nada, entonces no agrego
                    if (filtered.length != 0) {
                        filtros_ampliados.push(caso)
                    }

                })
                mostrar_resultados(filtros_ampliados)

            }
            //Limpiamos el campo abierto
            document.getElementById("intOpentCriterio").value = ""
        }

    }
}

function add_criterio_extendido() {
    const contenedorlistas = document.getElementById("listconsultaextendida")

    if (filterList.length == 0) {
        operador_link = ""
    }
    //Miramos todos los elementos de filtros creados
    let i = 0
    let line = []
    filterList.forEach(texto => {
        const item = document.createElement("li")
        item.className = "list-group-item"
        item.textContent = texto.clase + " " + texto.operador + " " + texto.value
        contenedorlistas.appendChild(item)
        if (i == filterList.length - 1) {
            operador_link = ""
        }
        if (i < filterList.length - 1) {
            operador_link = "||"
        }
        i = i + 1

        const newItemCriterio =
        {
            "clase": texto.clase,
            "field": texto.field,
            "operador": texto.operador,
            "value": texto.value,
            "link": operador_link
        }

        line.push(newItemCriterio)

    })

    const registros = Active_data_monitor.clsCasos[0]
    let cadena = ""

    if (filterList[0].clase !== "clsCasos") {
        line.forEach(item => {
            if (typeof registros[item.field] === "number") {
                cadena = cadena + `registro["${item.clase}"].some((objTipo) => objTipo["${item.field}"] ${item.operador} ${item.value} ${item.link})`

            } else{
                cadena = cadena + `registro["${item.clase}"].some((objTipo) => objTipo["${item.field}"] ${item.operador} "${item.value}" ${item.link})`
            }
         })
        criteria_items.push([filterList[0].clase, cadena])
    } else {
        
        line.forEach(item => {
            if (typeof registros[item.field] === "number") {
                cadena = cadena + `registro["${item.field}"] ${item.operador} ${item.value} ${item.link}`
            } else{
                cadena = cadena + `registro["${item.field}"] ${item.operador} "${item.value}" ${item.link}`
            }
        })
        criteria_items.push([filterList[0].clase, cadena])
    }

}



function LimpiarConsulta() {
    criteria_items = []
    const contenedorlistas = document.getElementById("listconsultaextendida")
    contenedorlistas.innerHTML = ""
}

const operadores = {
    "operadorIgual": (registro, campo, valor) => {
        if (typeof registro[campo] === "number") {
            return registro[campo] === parseInt(valor)
        }

        return registro[campo] === valor
    },

    "operadorMayor": (registro, campo, valor) => {
        if (typeof registro[campo] === "number") {
            return registro[campo] > parseInt(valor)
        }

        return registro[campo] > valor
    },

    "operadorMenor": (registro, campo, valor) => {
        if (typeof registro[campo] === "number") {
            return registro[campo] < parseInt(valor)
        }

        return registro[campo] < valor
    },

    "operadorDiferente": (registro, campo, valor) => {
        if (typeof registro[campo] === "number") {
            return registro[campo] !== parseInt(valor)
        }

        return registro[campo] !== valor
    },
    "operadorAlguno": (registro, campo, label, valor) => {
        return registro[campo].some((objeto) => objeto[label] === valor);
    },
}

function filter_extend() {
    const registros = Active_data_monitor.clsCasos
    /* CODIGO DE PARTIDA DE INICIO */

    let datafilter = []
    const filtrados = registros.filter((registro) => {
        let condiciones = []

        criteria_items.forEach(criterio => {
            //console.log(eval(criterio[1]))
            condiciones.push(eval(criterio[1]))
        })

        let score = 0
        condiciones.forEach(valor => {
            score = score + valor
        })

        if (score == condiciones.length) {
            datafilter.push(registro)
        }
        score = []
    });

    mostrar_resultados(datafilter)

}

function consola_command() {
    try {
        const criterios = document.getElementById("txtconsola").value
        let filtered = eval(criterios)
        mostrar_resultados(filtered)
    } catch (error) {

    }

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
function mostrar_resultadosII(data) {
    //Leer todos los cass primero
    data.forEach(caso => {
        console.log(caso)
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
        document.getElementById("tl_index_caso").textContent = "Caso número " + (caso.id + 1)
        document.getElementById("spanvigencia").textContent = new Date(caso.fecha).getFullYear()

        document.getElementById("consulta_macrotipo").textContent = caso.macrotipo
        document.getElementById("consulta_macroregion").textContent = "Macroregión " + caso.macroregion
        document.getElementById("consulta_departamento").textContent = "Departamento " + caso.departamento
        document.getElementById("consulta_lugares").innerHTML = ""
        caso.clsLugares.forEach(lugar => {
            const div = document.createElement("div")
            div.className = "label-org-yellow-light p-2"
            div.textContent = lugar.municipio
            document.getElementById("consulta_lugares").appendChild(div)

        })
        document.getElementById("consulta_tipos").innerHTML = ""
        caso.clsTipos.forEach(item => {
            const div = document.createElement("div")
            div.className = "label-org-yellow-light p-2"
            div.textContent = item.nombre
            document.getElementById("consulta_tipos").appendChild(div)

        })
        document.getElementById("consulta_detalle").textContent = caso.detalle

        document.getElementById("consulta_pueblos").innerHTML = ""
        caso.clsPueblos.forEach(item => {
            const div = document.createElement("div")
            div.className = "label-org-yellow-light p-2"
            div.textContent = item.nombre
            document.getElementById("consulta_pueblos").appendChild(div)

        })
        document.getElementById("consulta_macroactor").textContent = "Macro actor " + caso.macroactor

        document.getElementById("consulta_actores").innerHTML = ""
        caso.clsActores.forEach(item => {
            const div = document.createElement("div")
            div.className = "label-org-yellow-light p-2"
            div.textContent = item.nombre
            document.getElementById("consulta_actores").appendChild(div)
        })

    } catch (error) {

    }


    bootstrap.Modal.getOrCreateInstance(document.getElementById("modalconsultacaso")).show();
}

