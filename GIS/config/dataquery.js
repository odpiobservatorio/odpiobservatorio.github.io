
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
            const elemento = document.createElement("div")
            elemento.className = "ms-3 me-3"
            elemento.style.fontWeight = "normal"
            elemento.innerHTML =
                `
            <input class="fst-normal form-check-input" type="checkbox" value="${item}" id="check${item}${criterio[1]}">
             ${item}
        `
            //Coloca un elemento en la lista, estos elementos tienen un control chekc que lo detecta el programa
            contenedor.appendChild(elemento)
            const checkers = document.getElementById(`check${item}${criterio[1]}`)
            //Miramos si el valor viene de la lista o viene de el campo abirto

            //Se detecta un cambio en el control, agrega o elimina un elemento de la lista de filtros.
            checkers.onchange = () => {
                //Validamos si la clase es mayor o menor
                let tipo;
                if (criterio[0] == "clsCasos") {
                    tipo = "a"
                } else {
                    tipo = "b"
                }

                if (checkers.checked == true) {
                    const criterios = {
                        "tipo": tipo,
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
    filterList.forEach(texto => {
        const item = document.createElement("li")
        item.className = "list-group-item"
        item.textContent = texto.field + "" + texto.operador + "" + texto.value
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
            "tipo": texto.tipo,
            "clase": texto.clase,
            "field": texto.field,
            "operador": texto.operador,
            "value": texto.value,
            "link": operador_link
        }
        criteria_items.push(newItemCriterio)
    })
}
//Obsoleto
function add_operador(operador) {
    const newItemCriterio =
    {
        "tipo": "d",
        "clase": "",
        "field": "",
        "operador": operador,
        "value": "",
        "link": ""
    }
    criteria_items.push(newItemCriterio)

    const contenedorlistas = document.getElementById("listconsultaextendida")
    const item = document.createElement("li")
    item.className = "list-group-item text-center bg-warning"
    item.textContent = "{AND}"
    contenedorlistas.appendChild(item)
}
function LimpiarConsulta() {
    criteria_items = []
    const contenedorlistas = document.getElementById("listconsultaextendida")
    contenedorlistas.innerHTML = ""
}
function filter_extend() {
    const txt = document.getElementById("txtconsola")
    let operador_join = ""

    let dataCondensed = []
    Active_data_monitor.clsCasos.forEach(caso => {
        let tipos = []
        caso.clsTipos.forEach(item => {
            tipos.push(item.nombre)
        })
        let lugares = []
        caso.clsLugares.forEach(item => {
            lugares.push(item.municipio)
        })
        let pueblos = []
        caso.clsPueblos.forEach(item => {
            pueblos.push(item.nombre)
        })
        let personas = []
        caso.clsPersonas.forEach(item => {
            personas.push(item.genero)
        })
        let actores = []
        caso.clsActores.forEach(item => {
            actores.push(item.nombre)
        })
        let desplazamientos = []
        caso.clsDesplazamiento.forEach(item => {
            desplazamientos.push(item.tipo)
        })
        let acciones = []
        caso.clsAccJuridica.forEach(item => {
            desplazamientos.push(item.accion)
        })

        const item = {
            "score": 0,
            "id": caso.id,
            "macrotipo": caso.macrotipo,
            "detalle": caso.detalle,
            "departamento": caso.departamento,
            "macroregion": caso.macroregion,
            "detalleLugar": caso.detalleLugar,
            "fecha": caso.fecha,
            "vigencia": caso.vigencia,
            "macroactor": caso.macroactor,
            "nmujeres": caso.nmujeres,
            "nmenores": caso.nhombres,
            "npersonas": caso.nmenores,
            "fuente": caso.fuente,
            "fechafuente": caso.fechafuente,
            "enlace": caso.enlace,
            "clsTipos": tipos,
            "clsLugares": lugares,
            "clsPueblos": pueblos,
            "clsPersonas": personas,
            "clsActores": actores,
            "clsDesplazamiento": desplazamientos,
            "clsAccJuridica": acciones,
        }
        dataCondensed.push(item)

    })

    if (criteria_items.length == 0) {
        operador_join = ""
    }
    //Miramos todos los elementos de filtros creados
    let i = 0
    let cadena_filtro = ""
    criteria_items.forEach(filtro => {
        if (i == criteria_items.length - 1) {
            operador_join = ""
        }
        if (i < criteria_items.length - 1) {
            operador_join = "&&"
        }
        i = i + 1

        if (filtro.clase == "clsCasos") {
            cadena_filtro = cadena_filtro + `value.${filtro.field}.includes("${filtro.value}")${filtro.link}`
        } else {
            cadena_filtro = cadena_filtro + `value.${filtro.clase}.includes("${filtro.value}")${filtro.link}`
        }
        cadena_filtro = cadena_filtro + operador_join

    })

    let fullfilter = cadena_filtro.replace("||&&", "||")

    let primerfiltro = dataCondensed.filter(function (value) {
        let filtrosincambios = eval(fullfilter)
        return filtrosincambios
    }
    )
    let o = 0
    primerfiltro.forEach(caso => {
        criteria_items.forEach(item => {
            if (item.clase != "clsCaso") {
                caso[item.clase].forEach(clase => {
                    let formula = `clase ${item.operador} "${item.value}"`
                    if (eval(formula))
                        caso.score = o++
                })
            }
        })
    })

    console.log(primerfiltro)


    let dataMostar = []
    primerfiltro.forEach(caso => {
        let filtrado = Active_data_monitor.clsCasos.filter(value => value.id == caso.id)
        if (filtrado.length != 0) {
            dataMostar.push(Active_data_monitor.clsCasos[caso.id])
        }
    })

    //txt.value = fullfilter
    mostrar_resultados(dataMostar)





}
function filter_extend2() {


    let config_filer = ""


    function sortJSON(data, key, orden) {
        return data.sort(function (a, b) {
            var x = a[key],
                y = b[key];

            if (orden === 'asc') {
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            }

            if (orden === 'desc') {
                return ((x > y) ? -1 : ((x < y) ? 1 : 0));
            }
        });
    }
    var oJSON = sortJSON(criteria_items, 'tipo', 'asc');


    let criterio_Join = ""
    oJSON.forEach(filtro => {
        if (filtro.tipo == "a") {
            criterio_Join = criterio_Join + `value.${filtro.field}${filtro.operador}("${filtro.value}")${filtro.link}`
        } else if (filtro.tipo == "c") {

        }
    })
    let dataParentFilter = Active_data_monitor.clsCasos.filter(value => eval(criterio_Join))

    criterio_Join = ""
    let clase = ""
    let datachieldFilter = []
    oJSON.forEach(filtro => {
        if (filtro.tipo == "b") {
            criterio_Join = criterio_Join + `value.${filtro.field}${filtro.operador}("${filtro.value}")${filtro.link}`
            clase = filtro.clase
        }

    })
    //let datachieldFilter= dataParentFilter.clsCasos[clase].filter(value=>eval(criterio_Join))
    dataParentFilter.forEach(caso => {
        const filtered = caso[clase].filter(value => eval(criterio_Join))
        if (filtered.length != 0) {
            datachieldFilter.push(caso)
        }
    })

    mostrar_resultados(datachieldFilter)


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

