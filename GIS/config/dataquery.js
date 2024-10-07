
let marcas_consulta = []
let filterList = []
let now_data_filter

let criteria_items = []
//Será la variable global que administra 
let Active_data_monitor
function cinfigIni_data() {

    let MultiCasos = {
        "clsCasos": []
    }

    GLOBAL.state.proyectos.forEach(proyecto => {
        proyecto.clsCasos.forEach(caso => {
            MultiCasos.clsCasos.push(caso)
        })
    })

    Active_data_monitor = MultiCasos;

    //Inicia la lista con ese criterio
    crear_listas("clsCasos_macroregion")
    document.getElementById("btnConsulta").value = 1



}
function ver_todo() {
    const cont_Resultados = document.getElementById("lstResGisNew")
    cont_Resultados.innerHTML = ""

    //Leer todos los cass primero
    Active_data_monitor.clsCasos.forEach(caso => {
        make_label_resultados(caso, cont_Resultados)
        //Por cada caso listo los lugares
        caso.clsLugares.forEach(lugar => {
            try {
                const marca = PutMarkCicle(
                    true, //Indica si el marcador es fijo
                    color_marca_busqueda, //Define el color de la marca en ese momento
                    colorline_marca_busqueda, //Define el color de la linea en ese momento 
                    opacidad_marca_busqueda, //Define el nivel de opacidad
                    size_marca_busqueda, //Define el tamaño del marcador  
                    lugar.lat,
                    lugar.lng,
                    "7" //Pane
                )
                    .bindPopup(PutPopUpZ(put_label_resultado(caso, lugar)),
                        { pane: "labels" }
                    )
                marcas_consulta.push(marca)
            } catch (error) {
                console.log(caso)
            }
        })
    });

    //Carga los datos en un DB para el mapa calor y posiblemente para las estadisticas
    now_data_filter = Active_data_monitor.clsCasos
}

function limpiar_todo_marcas() {
    marcas_consulta.forEach(marca => {
        map.removeLayer(marca)
    })
    marcas_consulta = []
    now_data_filter = Active_data_monitor
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
            try {
                Active_data_monitor.clsCasos.forEach(caso => {
                    if (newCriteria.includes(caso[criterio[1]]) == false) {
                        newCriteria.push(caso[criterio[1]])
                    }
                })
            } catch (error) {
                mensajes("Aún no se cargan los datos", "orange")
            }
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
            mensajes("error en listas sub")
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
                let tituloboton = ""
                filterList.forEach(palabra => {
                    tituloboton = tituloboton + "[" + palabra.value + "]"
                })
                const btnCriterios = document.getElementById("btnCriterios")
                btnCriterios.textContent = tituloboton
            }
        })

        document.getElementById("intOpentCriterio").oninput = () => {
            const criterios = {
                "clase": criterio[0],
                "field": criterio[1],
                "operador": document.getElementById("lstOperadores").value,
                "value": document.getElementById("intOpentCriterio").value
            }
            filterList = []
            filterList.push(criterios)
        }


        //Ahora trabajamos con los filtros
        const filtrador = document.getElementById("btnConsulta")
        //Debemos construir las cadenas de filtro según las listas en filterlist
        filtrador.onclick = () => {
            add_criterio_extendido()
            filter_extend()
            LimpiarConsulta()
            //document.getElementById("intOpentCriterio").value = ""
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

    let cadena = ""

    if (filterList[0].clase !== "clsCasos") {
        const registros = Active_data_monitor.clsCasos[0]
        line.forEach(item => {
            if (typeof registros[item.clase][0][item.field] === "number") {
                cadena = cadena + `registro["${item.clase}"].some((objTipo) => objTipo["${item.field}"]${item.operador}(${item.value}) ${item.link})`
                //alert(typeof registros[item.clase][0].edad)
            } else {
                cadena = cadena + `registro["${item.clase}"].some((objTipo) => objTipo["${item.field}"]${item.operador}("${item.value}") ${item.link})`
            }
        })
        criteria_items.push([filterList[0].clase, cadena])
    } else {
        const registros = Active_data_monitor.clsCasos[0]
        line.forEach(item => {
            if (typeof registros[item.field] === "number") {
                cadena = cadena + `registro["${item.field}"]${item.operador}(${item.value}) ${item.link}`
            } else {
                cadena = cadena + `registro["${item.field}"]${item.operador}("${item.value}") ${item.link}`
            }
        })
        criteria_items.push([filterList[0].clase, cadena])
    }
    document.getElementById("intOpentCriterio").value = ""
    fromOpenText = ""

}

function LimpiarConsulta() {
    criteria_items = []
    const contenedorlistas = document.getElementById("listconsultaextendida")
    contenedorlistas.innerHTML = ""
    const btnCriterios = document.getElementById("btnCriterios")
    btnCriterios.textContent = "Criterios"
    document.getElementById("intOpentCriterio").value = ""
    fromOpenText = ""

}

function filter_extend() {
    const registros = Active_data_monitor.clsCasos
    /* CODIGO DE PARTIDA DE INICIO */

    let datafilter = []
    const filtrados = registros.filter((registro) => {
        let condiciones = []

        criteria_items.forEach(criterio => {
            condiciones.push(eval(criterio[1]))
            console.log(criterio[1])
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



    now_data_filter = datafilter
    mostrar_resultados(datafilter)
    crear_consolidado_resultado(datafilter, criteria_items)


}

function crear_consolidado_resultado(datafilter, criteria_items) {
    let casos = 0
    let victimas = 0
    let nombres = []
    for (id in datafilter) {
        casos++
        victimas = victimas + datafilter[id].npersonas
        const personas = datafilter[id].clsPersonas
        for (id in personas) {
            nombres.push(personas[id].nombres)
        }
    }

    //Para mostrar consolidados
    const capo_contexto = document.getElementById("col_contexto")
    const capo_casos = document.getElementById("col_res_casos")
    const capo_victimas = document.getElementById("col_res_victimas")
    const control_criterio = criteria_items[0][1]
    capo_contexto.textContent = `${control_criterio.toUpperCase()}`
    capo_casos.textContent = casos
    capo_victimas.textContent = victimas

    const div_resultados_nombre = document.getElementById("pivot_lis_resultados")
    div_resultados_nombre.textContent = nombres

}
function make_label_resultados(caso, contenedor) {

    const li = document.createElement("li")
    li.className = "list-group-item d-flex justify-content-between align-items-start"

    const div = document.createElement("div")
    div.className = "ms-2 me-auto"
    div.innerHTML = `
        <div class="label-hand fw-bold" 
            data-bs-toggle="collapse" 
            href="#collapse${caso.id}">${caso.macrotipo}
        </div>
    `
    const collapse = document.createElement("div")
    collapse.id = `collapse${caso.id}`
    collapse.className = "collapse ms-2"
    collapse.innerHTML = `
    <div class="row mt-1">
            <div class="col text-secondary me-2">
                Macroregión
            </div>
            <div class="col">
                ${caso.macroregion}
            </div>
        </div>
        <div class="row mt-1">
            <div class="col text-secondary me-2">
                Departamento
            </div>
            <div class="col">
                ${caso.departamento}
            </div>
        </div>
        <div class="row mt-1">
            <div class="col text-secondary me-2">
                Macroactor
            </div>
            <div class="col">
                ${caso.macroactor}
            </div>
        </div>
        <div class="row mt-1">
            <div class="col text-secondary me-2">
                Víctimas
            </div>
            <div class="col">
                ${caso.npersonas}
            </div>
        </div>`

    const btnVer = document.createElement("div")
    btnVer.className = "btn_label"
    btnVer.textContent = "Ver caso"
    collapse.appendChild(btnVer)
    btnVer.onclick = () => {
        mostrar_caso(caso)
    }

    div.appendChild(collapse)



    li.appendChild(div)
    const span = document.createElement("span")
    span.className = "badge bg-primary rounded-pill"
    span.textContent = caso.vigencia
    li.appendChild(span)

    contenedor.appendChild(li)

}
function mostrar_resultados(data) {
    const cont_Resultados = document.getElementById("lstResGisNew")
    cont_Resultados.innerHTML = ""
    //Leer todos los cass primero
    data.forEach(caso => {
        make_label_resultados(caso, cont_Resultados)

        //Por cada caso listo los lugares
        caso.clsLugares.forEach(lugar => {
            try {
                const marca = PutMarkCicle(
                    true, //Indica si el marcador es fijo
                    color_marca_busqueda, //Define el color de la marca en ese momento 
                    colorline_marca_busqueda, //Define el color de la linea en ese momento 
                    opacidad_marca_busqueda, //Define el nivel de opacidad
                    size_marca_busqueda, //Define el tamaño del marcador  
                    lugar.lat,
                    lugar.lng,
                    "7" //Define lugar de la capa en pane
                )
                    .bindPopup(PutPopUpZ(put_label_resultado(caso, lugar)),
                        { pane: "labels" }
                    )
                marcas_consulta.push(marca)
            } catch (error) {
                console.log(caso, lugar)
            }

        })

    });


}

function mostrar_caso(caso) {
    const contenedor = document.getElementById("body_consolta_caso")

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
function put_label_resultado(caso, lugar) {
    const div = document.createElement("div")
    div.style.width = "200px"
    div.innerHTML = `
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
        <div class="row">
            <div class="col">Caso</div>
            <div class="col-auto">${caso.id}</div>
        </div>
        <div class="text-end text-success">${caso.fecha}</div>
    `

    const btn = document.createElement("a")
    btn.className = "mt-2 nav-link border border-1 bg-success text-white text-center rounded-pill"
    btn.textContent = "Ver"
    btn.onclick = () => {
        mostrar_caso(caso)
    }
    div.appendChild(btn)


    return div

}

function ver_calor_dep(value, id) {
    marcas_consulta.forEach(marca => {
        map.removeLayer(marca)
    })

    let data

    //VErificamos si hay datos abiertos
    if (now_data_filter == null) {
        data = Active_data_monitor.clsCasos
    } else {
        data = now_data_filter
    }


    if (value == true) {
        let cont_departamentos = []
        let consolidados = {}
        const casoItem = data
        let nCasos = 0
        //Encontramos los departamentos y contamos cada uno de sus registros
        //Genera uan data de consolidados por departamento
        for (caso in data) {
            if (cont_departamentos.includes(casoItem[caso].departamento.toLowerCase()) !== true) {
                cont_departamentos.push(casoItem[caso].departamento.toLowerCase())
                consolidados[casoItem[caso].departamento.toLowerCase()] = {
                    "lugar": casoItem[caso].departamento.toLowerCase(),
                    "valor": 1,
                    "porcentajeT": "0%",
                    "porcentajeV": 0,
                    "victimas": casoItem[caso].npersonas,
                }
            } else {
                const cont = consolidados[casoItem[caso].departamento.toLowerCase()].valor + 1
                consolidados[casoItem[caso].departamento.toLowerCase()].valor = cont
                consolidados[casoItem[caso].departamento.toLowerCase()].victimas = consolidados[casoItem[caso].departamento.toLowerCase()].victimas + casoItem[caso].npersonas
            }
            nCasos++
        }

        //Ahora comparamos ese valor frente al valor tototal
        //Esto para crear los porcentajes
        for (dep in consolidados) {
            const PorcentajV = (parseInt(consolidados[dep].valor) / parseInt(nCasos)).toFixed(2)
            const PorcentajT = parseInt(consolidados[dep].valor) / parseInt(nCasos) * 100
            consolidados[dep].porcentajeV = PorcentajV
            consolidados[dep].porcentajeT = parseInt(PorcentajT).toFixed(2) + "%"
        }

        //Preparamso el mapa base
        const layer = L.geoJSON(layer_departamentos, {
            style: function (feature) {
                let opacidad = 0
                let linea = 0
                try {
                    let o = consolidados[feature.properties.DPTO_CNMBR.toLowerCase()].porcentajeV
                    opacidad = o * 5
                    linea = eval(format_layer["layer_" + id].format.ancho_linea)
                } catch (error) {
                    linea = 0
                    //console.log(error)
                }
                return {
                    color: eval(format_layer["layer_" + id].format.color_linea),
                    fillColor: eval(format_layer['layer_' + id].format.color_fondo),
                    fillOpacity: opacidad,
                    weight: linea,
                    pane: eval(format_layer["layer_" + id].format.pane),
                };
            }
        }).bindPopup(function (layer) {
            const contenido = document.createElement("div")
            contenido.style.width = "300px"
            contenido.innerHTML = `
            <div class="fs-6 text-info">Porcentajes * departamento</div>
                <div class="row">
                    <div class="col fw-bold">Departamento</div>
                    <div class="col text-end">${layer.feature.properties.DPTO_CNMBR}</div>
                </div>
                <div class="row">
                    <div class="col fw-bold">Porcentaje</div>
                    <div class="col text-end">${consolidados[layer.feature.properties.DPTO_CNMBR.toLowerCase()].porcentajeT}</div>
                </div>
                <div class="row">
                    <div class="col fw-bold">Victimas</div>
                    <div class="col fw-bold text-end">
                    ${consolidados[layer.feature.properties.DPTO_CNMBR.toLowerCase()].victimas}
                    </div>
                 </div>
                                 <div class="row">
                    <div class="col fw-bold">Casos</div>
                    <div class="col fw-bold text-end">
                    ${consolidados[layer.feature.properties.DPTO_CNMBR.toLowerCase()].valor}
                    </div>
                 </div>
            `
            return contenido.innerHTML;
        }, { pane: "labels" }
        ).addTo(map);

        //Agrega esta capa a la lista de capas para activar o desactivar
        lis_layers.push(["layer_" + id, layer])
    } else {
        //Crear dos filtros para mostrar o quitar la capa
        //Solo para capas locales fijas, que siempre se presentarán en el programa
        let layer_remove = lis_layers.filter(value => value[0] == "layer_" + id)
        let layer_noremove = lis_layers.filter(value => value[0] !== "layer_" + id)
        map.removeLayer(layer_remove[0][1])
        lis_layers = layer_noremove
    }




}
function ver_calor_dep_victimas(value, id) {
    marcas_consulta.forEach(marca => {
        map.removeLayer(marca)
    })

    let data

    //VErificamos si hay datos abiertos
    if (now_data_filter == null) {
        data = Active_data_monitor.clsCasos
    } else {
        data = now_data_filter
    }


    if (value == true) {
        let cont_departamentos = []
        let consolidados = {}
        const casoItem = data
        let nCasos = 0
        //Encontramos los departamentos y contamos cada uno de sus registros
        //Genera uan data de consolidados por departamento
        for (caso in data) {
            if (cont_departamentos.includes(casoItem[caso].departamento.toLowerCase()) !== true) {
                cont_departamentos.push(casoItem[caso].departamento.toLowerCase())
                consolidados[casoItem[caso].departamento.toLowerCase()] = {
                    "lugar": casoItem[caso].departamento.toLowerCase(),
                    "valor": 1,
                    "porcentajeT": "0%",
                    "porcentajeV": 0,
                    "victimas": casoItem[caso].npersonas,
                }
            } else {
                const cont = consolidados[casoItem[caso].departamento.toLowerCase()].valor + 1
                consolidados[casoItem[caso].departamento.toLowerCase()].valor = cont
                consolidados[casoItem[caso].departamento.toLowerCase()].victimas = consolidados[casoItem[caso].departamento.toLowerCase()].victimas + casoItem[caso].npersonas
            }
            nCasos = nCasos + casoItem[caso].npersonas
        }

        //Ahora comparamos ese valor frente al valor tototal
        //Esto para crear los porcentajes
        for (dep in consolidados) {
            const PorcentajV = (parseInt(consolidados[dep].victimas) / parseInt(nCasos)).toFixed(2)
            const PorcentajT = parseInt(consolidados[dep].victimas) / parseInt(nCasos) * 100
            consolidados[dep].porcentajeV = PorcentajV
            consolidados[dep].porcentajeT = parseInt(PorcentajT).toFixed(2) + "%"
        }

        //Preparamso el mapa base
        const layer = L.geoJSON(layer_departamentos, {
            style: function (feature) {
                let opacidad = 0
                let linea = 0
                try {
                    let o = consolidados[feature.properties.DPTO_CNMBR.toLowerCase()].porcentajeV
                    opacidad = o * 5
                    linea = eval(format_layer["layer_" + id].format.ancho_linea)
                } catch (error) {
                    linea = 0
                    //console.log(error)
                }
                return {
                    color: eval(format_layer["layer_" + id].format.color_linea),
                    fillColor: eval(format_layer['layer_' + id].format.color_fondo),
                    fillOpacity: opacidad,
                    weight: linea,
                    pane: eval(format_layer["layer_" + id].format.pane),
                };
            }
        }).bindPopup(function (layer) {
            const contenido = document.createElement("div")
            contenido.style.width = "300px"
            contenido.innerHTML = `
            <div class="fs-6 text-info">Porcentajes * departamento</div>
                <div class="row">
                    <div class="col fw-bold">Departamento</div>
                    <div class="col text-end">${layer.feature.properties.DPTO_CNMBR}</div>
                </div>
                <div class="row">
                    <div class="col fw-bold">Porcentaje</div>
                    <div class="col text-end">${consolidados[layer.feature.properties.DPTO_CNMBR.toLowerCase()].porcentajeT}</div>
                </div>
                <div class="row">
                    <div class="col fw-bold">Victimas</div>
                    <div class="col fw-bold text-end">
                    ${consolidados[layer.feature.properties.DPTO_CNMBR.toLowerCase()].victimas}
                    </div>
                 </div>
                                 <div class="row">
                    <div class="col fw-bold">Casos</div>
                    <div class="col fw-bold text-end">
                    ${consolidados[layer.feature.properties.DPTO_CNMBR.toLowerCase()].valor}
                    </div>
                 </div>
            `
            return contenido.innerHTML;
        }, { pane: "labels" }
        ).addTo(map);

        //Agrega esta capa a la lista de capas para activar o desactivar
        lis_layers.push(["layer_" + id, layer])

    } else {
        //Crear dos filtros para mostrar o quitar la capa
        //Solo para capas locales fijas, que siempre se presentarán en el programa
        let layer_remove = lis_layers.filter(value => value[0] == "layer_" + id)
        let layer_noremove = lis_layers.filter(value => value[0] !== "layer_" + id)
        map.removeLayer(layer_remove[0][1])
        lis_layers = layer_noremove
    }
}
function ver_calor_mun(value, id) {
    marcas_consulta.forEach(marca => {
        //map.removeLayer(marca)
    })

    let data

    //VErificamos si hay datos abiertos
    if (now_data_filter == null) {
        data = Active_data_monitor.clsCasos
    } else {
        data = now_data_filter
    }

    if (value == true) {
        let cont_lugares = []
        let consolidados = []

        let nCasos = 0
        //Encontramos los departamentos y contamos cada uno de sus registros
        //Genera uan data de consolidados por departamento
        for (caso in data) {
            nCasos++
            for (lugar in data[caso].clsLugares) {
                const LugarItem = data[caso].clsLugares[lugar]
                if (cont_lugares.includes(LugarItem.municipio.toLowerCase()) !== true) {
                    cont_lugares.push(LugarItem.municipio.toLowerCase())
                    consolidados[LugarItem.municipio.toLowerCase()] = {
                        "lugar": LugarItem.municipio.toLowerCase(),
                        "valor": 1,
                        "porcentajeT": "0%",
                        "porcentajeV": 0,
                        "victimas": data[caso].npersonas,
                        "departamento": data[caso].departamento,
                    }
                } else {
                    const cont = consolidados[LugarItem.municipio.toLowerCase()].valor + 1
                    consolidados[LugarItem.municipio.toLowerCase()].valor = cont
                    consolidados[LugarItem.municipio.toLowerCase()].victimas = consolidados[LugarItem.municipio.toLowerCase()].victimas + data[caso].npersonas

                }

            }

        }
        let ppp = []

        for (lugar in consolidados) {
            ppp.push([consolidados[lugar].lugar, parseInt(consolidados[lugar].valor)])
        }

        function compareByAge(a, b) {
            if (a[1] < b[1]) {
                return -1;
            }
            if (a[1] > b[1]) {
                return 1;
            }
            return 0;
        }
        let g = ppp.sort(compareByAge);


        g.forEach(lugar => {
            txtconsola.textContent = txtconsola.textContent + "\n" + `${lugar[0]}:${lugar[1]}`
        })


        txtconsola.textContent = txtconsola.textContent + "\n" + "Total Casos:" + nCasos

        //Ahora comparamos ese valor frente al valor tototal
        //Esto para crear los porcentajes
        for (mun in consolidados) {
            const PorcentajV = (parseInt(consolidados[mun].valor) / parseInt(nCasos)).toFixed(2)
            const PorcentajT = parseInt(consolidados[mun].valor) / parseInt(nCasos) * 100

            txtconsola.textContent = txtconsola.textContent + "\n" + `${consolidados[mun].lugar}: ${consolidados[mun].valor} - %${(PorcentajV * 10).toFixed(1)}`

            consolidados[mun].porcentajeV = PorcentajV
            consolidados[mun].porcentajeT = parseInt(PorcentajT).toFixed(2) + "%"
        }

        //Preparamso el mapa base
        const layer = L.geoJSON(layer_municipios, {
            style: function (feature) {
                let opacidad = 0
                let linea = 0
                let pane = "4"
                try {
                    let featureDep = feature.properties.DEPTO.toLowerCase()
                    let consDep = consolidados[feature.properties.MPIO_CNMBR.toLowerCase()].departamento.toLowerCase()

                    if (featureDep == consDep) {
                        let o = consolidados[feature.properties.MPIO_CNMBR.toLowerCase()].porcentajeV
                        opacidad = o * 10
                        linea = eval(format_layer["layer_" + id].format.ancho_linea)
                        pane = eval(format_layer["layer_" + id].format.pane)
                    } else {
                        opacidad = 0
                        linea = 0
                        pane = "1"
                    }
                } catch (error) {
                    opacidad = 0
                    linea = 0
                    pane = "1"

                }
                return {
                    color: eval(format_layer["layer_" + id].format.color_linea),
                    fillColor: eval(format_layer["layer_" + id].format.color_fondo),
                    fillOpacity: opacidad,
                    weight: linea,
                    pane: pane,
                };
            }
        }).bindPopup(function (layer) {
            const contenido = document.createElement("div")
            contenido.width = "350px"
            contenido.innerHTML = `
                <div class="fs-6 text-info">Porcentajes * departamento</div>
                    <div class="row">
                        <div class="col fw-bold">Departamento</div>
                        <div class="col text-end">${layer.feature.properties.DEPTO}</div>
                    </div>
                    <div class="row">
                        <div class="col fw-bold">Municipio</div>
                        <div class="col text-end">${layer.feature.properties.MPIO_CNMBR}</div>
                    </div>
                    <div class="row">
                        <div class="col fw-bold">Porcentaje</div>
                        <div class="col text-end">${consolidados[layer.feature.properties.MPIO_CNMBR.toLowerCase()].porcentajeT}</div>
                    </div>
                <div class="row">
                    <div class="col fw-bold">Victimas</div>
                    <div class="col fw-bold text-end">
                    ${consolidados[layer.feature.properties.MPIO_CNMBR.toLowerCase()].victimas}
                    </div>
                 </div>
                    <div class="row">
                    <div class="col fw-bold">Casos</div>
                    <div class="col fw-bold text-end">
                    ${consolidados[layer.feature.properties.MPIO_CNMBR.toLowerCase()].valor}
                    </div>
                 </div>
                `
            return contenido.innerHTML;
        }, { pane: "labels" }
        ).addTo(map);

        //Agrega esta capa a la lista de capas para activar o desactivar
        lis_layers.push(["layer_" + id, layer])


    } else {
        //Crear dos filtros para mostrar o quitar la capa
        //Solo para capas locales fijas, que siempre se presentarán en el programa
        let layer_remove = lis_layers.filter(value => value[0] == "layer_" + id)
        let layer_noremove = lis_layers.filter(value => value[0] !== "layer_" + id)
        map.removeLayer(layer_remove[0][1])
        lis_layers = layer_noremove

    }






}
function ver_calor_mun_victimas(value, id) {
    marcas_consulta.forEach(marca => {
        //map.removeLayer(marca)
    })

    let data

    //VErificamos si hay datos abiertos
    if (now_data_filter == null) {
        data = Active_data_monitor.clsCasos
    } else {
        data = now_data_filter
    }

    if (value == true) {
        let cont_lugares = []
        let consolidados = []

        let nCasos = 0
        //Encontramos los departamentos y contamos cada uno de sus registros
        //Genera uan data de consolidados por departamento
        for (caso in data) {

            for (lugar in data[caso].clsLugares) {
                const LugarItem = data[caso].clsLugares[lugar]
                if (cont_lugares.includes(LugarItem.municipio.toLowerCase()) !== true) {
                    cont_lugares.push(LugarItem.municipio.toLowerCase())
                    consolidados[LugarItem.municipio.toLowerCase()] = {
                        "lugar": LugarItem.municipio.toLowerCase(),
                        "valor": 1,
                        "porcentajeT": "0%",
                        "porcentajeV": 0,
                        "victimas": data[caso].npersonas,
                        "departamento": data[caso].departamento,
                    }
                } else {
                    const cont = consolidados[LugarItem.municipio.toLowerCase()].valor + 1
                    consolidados[LugarItem.municipio.toLowerCase()].valor = cont
                    consolidados[LugarItem.municipio.toLowerCase()].victimas = consolidados[LugarItem.municipio.toLowerCase()].victimas + data[caso].npersonas
                }
            }
            nCasos = nCasos + data[caso].npersonas
        }
        let ppp = []

        for (lugar in consolidados) {
            ppp.push([consolidados[lugar].lugar, parseInt(consolidados[lugar].valor)])
        }

        function compareByAge(a, b) {
            if (a[1] < b[1]) {
                return -1;
            }
            if (a[1] > b[1]) {
                return 1;
            }
            return 0;
        }
        let g = ppp.sort(compareByAge);


        g.forEach(lugar => {
            txtconsola.textContent = txtconsola.textContent + "\n" + `${lugar[0]}:${lugar[1]}`
        })


        txtconsola.textContent = txtconsola.textContent + "\n" + "Total Casos:" + nCasos

        //Ahora comparamos ese valor frente al valor tototal
        //Esto para crear los porcentajes
        for (mun in consolidados) {
            const PorcentajV = (parseInt(consolidados[mun].victimas) / parseInt(nCasos)).toFixed(2)
            const PorcentajT = parseInt(consolidados[mun].victimas) / parseInt(nCasos) * 100

            txtconsola.textContent = txtconsola.textContent + "\n" + `${consolidados[mun].lugar}: ${consolidados[mun].victimas} - %${(PorcentajV * 10).toFixed(1)}`

            consolidados[mun].porcentajeV = PorcentajV
            consolidados[mun].porcentajeT = parseInt(PorcentajT).toFixed(2) + "%"
        }

        //Preparamso el mapa base
        const layer = L.geoJSON(layer_municipios, {
            style: function (feature) {
                let opacidad = 0
                let linea = 0
                let pane = "4"
                try {
                    let featureDep = feature.properties.DEPTO.toLowerCase()
                    let consDep = consolidados[feature.properties.MPIO_CNMBR.toLowerCase()].departamento.toLowerCase()

                    if (featureDep == consDep) {
                        let o = consolidados[feature.properties.MPIO_CNMBR.toLowerCase()].porcentajeV
                        opacidad = o * 10
                        linea = eval(format_layer["layer_" + id].format.ancho_linea)
                        pane = eval(format_layer["layer_" + id].format.pane)
                    } else {
                        opacidad = 0
                        linea = 0
                        pane = "1"
                    }
                } catch (error) {
                    opacidad = 0
                    linea = 0
                    pane = "1"

                }
                return {
                    color: eval(format_layer["layer_" + id].format.color_linea),
                    fillColor: eval(format_layer['layer_' + id].format.color_fondo),
                    fillOpacity: opacidad,
                    weight: linea,
                    pane: pane,
                };
            }
        }).bindPopup(function (layer) {
            const contenido = document.createElement("div")
            contenido.width = "350px"
            contenido.innerHTML = `
                <div class="fs-6 text-info">Porcentajes * departamento</div>
                    <div class="row">
                        <div class="col fw-bold">Departamento</div>
                        <div class="col text-end">${layer.feature.properties.DEPTO}</div>
                    </div>
                    <div class="row">
                        <div class="col fw-bold">Municipio</div>
                        <div class="col text-end">${layer.feature.properties.MPIO_CNMBR}</div>
                    </div>
                    <div class="row">
                        <div class="col fw-bold">Porcentaje</div>
                        <div class="col text-end">${consolidados[layer.feature.properties.MPIO_CNMBR.toLowerCase()].porcentajeT}</div>
                    </div>
                <div class="row">
                    <div class="col fw-bold">Victimas</div>
                    <div class="col fw-bold text-end">
                    ${consolidados[layer.feature.properties.MPIO_CNMBR.toLowerCase()].victimas}
                    </div>
                 </div>
                    <div class="row">
                    <div class="col fw-bold">Casos</div>
                    <div class="col fw-bold text-end">
                    ${consolidados[layer.feature.properties.MPIO_CNMBR.toLowerCase()].valor}
                    </div>
                 </div>
                `
            return contenido.innerHTML;
        }, { pane: "labels" }
        ).addTo(map);

        //Agrega esta capa a la lista de capas para activar o desactivar
        lis_layers.push(["layer_" + id, layer])



    } else {
        //Crear dos filtros para mostrar o quitar la capa
        //Solo para capas locales fijas, que siempre se presentarán en el programa
        let layer_remove = lis_layers.filter(value => value[0] == "layer_" + id)
        let layer_noremove = lis_layers.filter(value => value[0] !== "layer_" + id)
        map.removeLayer(layer_remove[0][1])
        lis_layers = layer_noremove
    }






}
function config_formatcalor(id) {
    const cCollapseBody = document.getElementById("collapse" + id)
    cCollapseBody.innerHTML = ""


    const btngroup = document.createElement("div")
    btngroup.role = "group"
    btngroup.className = "btn-group border-1 border border-info p-2 ms-4"


    cCollapseBody.appendChild(btngroup)
    maker_control_backcolor()
    maker_control_linecolor()
    maker_control_lineWeight()
    maker_control_pane()
    function maker_control_backcolor() {
        //Crearemos un control desplegable de color personalizado
        const dropdown = document.createElement("div")
        dropdown.className = "dropdown me-1"
        dropdown.innerHTML =
            `
        <button class="dropdown-toggle border-0 
        border-0 btn-outline-secondary p-1 tooltip-container" 
            type="button" 
            data-bs-toggle="dropdown"
            id="btnColor${id}">
        </button>
        `
        const ul = document.createElement("ul")
        ul.className = "dropdown-menu container-fluid p-1 shadow"
        ul.style.width = "300px"
        dropdown.appendChild(ul)
        btngroup.appendChild(dropdown)

        const btnColor = document.getElementById("btnColor" + id)
        //Colocamos un icono que cambiará de color cuando cambie la selección
        const i = document.createElement("i")
        i.className = "bi bi-square-fill rounded"
        i.style.color = eval(format_layer["layer_" + id].format.color_fondo)
        btnColor.appendChild(i)
        tooltip(btnColor, "Color polígono", "gray")

        //Colocamos los colores en el ul control

        ColorList.forEach(color => {
            const iColor = document.createElement("i")
            iColor.className = "bi bi-square-fill fs-5"
            iColor.style.color = color
            iColor.style.margin = "2px"
            ul.appendChild(iColor)
            iColor.onclick = () => {
                i.style.color = color
                format_layer["layer_" + id].format.color_fondo = `'${color}'`
                const checkLayer = document.getElementById(id)

                if (checkLayer.checked == true) {
                    //Crear dos filtros para mostrar o quitar la capa
                    //Solo para capas locales fijas, que siempre se presentarán en el programa

                    if (format_layer["layer_" + id].target.local == "nolocal") {
                        let layer_remove = lis_layers.filter(value => value[0] == "layer_" + id)

                        let layer_noremove = lis_layers.filter(value => value[0] !== "layer_" + id)
                        map.removeLayer(layer_remove[0][1])
                        lis_layers = layer_noremove
                        if (id == "munvictimascalor") {
                            ver_calor_mun_victimas(true, id)
                        } else if (id == "muncasoscalor") {
                            ver_calor_mun(true, id)
                        } else if (id == "depcasoscalor") {
                            ver_calor_dep(true, id)
                        } else if (id == "depvictimascalor") {
                            ver_calor_dep_victimas(true, id)
                        }
                    }

                }
            }
        })

    }
    function maker_control_linecolor() {
        //Crearemos un control desplegable de color linea personalizado
        const dropdown = document.createElement("div")
        dropdown.className = "dropdown me-1"
        dropdown.innerHTML =
            `
        <button class="border-0 btn-outline-secondary p-1
            dropdown-toggle tooltip-container" 
            type="button" 
            data-bs-toggle="dropdown"
            id="btnLineColor${id}">
        </button>
        `
        const ul = document.createElement("ul")
        ul.className = "dropdown-menu container-fluid p-1"
        ul.style.width = "300px"
        dropdown.appendChild(ul)
        btngroup.appendChild(dropdown)

        //Colocamos un icono que cambiará de color cuando cambie la selección
        const i = document.createElement("i")
        i.className = "bi bi-square fw-bold"
        const btnLineColor = document.getElementById("btnLineColor" + id)
        try {
            i.style.color = eval(format_layer["layer_" + id].format.color_linea)
        } catch (error) {
            btnLineColor.hidden = true
        }

        btnLineColor.appendChild(i)
        tooltip(btnLineColor, "Color línea", "gray")

        //Colocamos los colores en el ul control

        ColorList.forEach(color => {
            const iColor = document.createElement("i")
            iColor.className = "bi bi-square-fill fs-5"
            iColor.style.color = color
            iColor.style.margin = "2px"
            ul.appendChild(iColor)
            iColor.onclick = () => {
                i.style.color = color
                format_layer["layer_" + id].format.color_linea = `'${color}'`
                const checkLayer = document.getElementById(id)

                if (checkLayer.checked == true) {
                    //Crear dos filtros para mostrar o quitar la capa
                    //Solo para capas locales fijas, que siempre se presentarán en el programa

                    if (format_layer["layer_" + id].target.local == "nolocal") {
                        let layer_remove = lis_layers.filter(value => value[0] == "layer_" + id)

                        let layer_noremove = lis_layers.filter(value => value[0] !== "layer_" + id)
                        map.removeLayer(layer_remove[0][1])
                        lis_layers = layer_noremove
                        if (id == "munvictimascalor") {
                            ver_calor_mun_victimas(true, id)
                        } else if (id == "muncasoscalor") {
                            ver_calor_mun(true, id)
                        } else if (id == "depcasoscalor") {
                            ver_calor_dep(true, id)
                        } else if (id == "depvictimascalor") {
                            ver_calor_dep_victimas(true, id)
                        }
                    }

                }


            }
        })

    }
    function maker_control_lineWeight() {
        //Crearemos un control desplegable de color linea personalizado
        const dropdown = document.createElement("div")
        dropdown.className = "dropdown me-1"
        dropdown.innerHTML =
            `
        <button class="border-0 btn-outline-secondary p-1
            dropdown-toggle tooltip-container" 
            type="button" 
            data-bs-toggle="dropdown"
            id="btnLineWeight${id}">
        </button>
        `
        const ul = document.createElement("ul")
        ul.className = "dropdown-menu container-fluid p-1"
        dropdown.appendChild(ul)
        btngroup.appendChild(dropdown)

        //Colocamos un icono que cambiará de color cuando cambie la selección
        const i = document.createElement("i")
        i.className = "bi-arrows-collapse-vertical"
        i.textContent = " " + format_layer["layer_" + id].format.ancho_linea + "px"
        i.style.color = "black"


        const btnLineColor = document.getElementById("btnLineWeight" + id)
        btnLineColor.appendChild(i)
        tooltip(btnLineColor, "Grueso línea", "gray")

        //Colocamos los colores en el ul control
        const lineWight = [
            [0, "0px"],
            [1, "1px"],
            [2, "2px"],
            [3, "3px"],
            [4, "4px"],
        ]

        lineWight.forEach(value => {
            const li = document.createElement("li")
            li.className = "ms-2"

            const a = document.createElement("a")
            a.className = "dropdown-item"
            a.href = "#"
            a.textContent = value[1]
            li.appendChild(a)

            ul.appendChild(li)
            a.onclick = () => {
                format_layer["layer_" + id].format.ancho_linea = value[0]
                const checkLayer = document.getElementById(id)
                i.textContent = " " + value[0] + "px"

                if (checkLayer.checked == true) {
                    //Crear dos filtros para mostrar o quitar la capa
                    //Solo para capas locales fijas, que siempre se presentarán en el programa

                    if (format_layer["layer_" + id].target.local == "nolocal") {
                        let layer_remove = lis_layers.filter(value => value[0] == "layer_" + id)

                        let layer_noremove = lis_layers.filter(value => value[0] !== "layer_" + id)
                        map.removeLayer(layer_remove[0][1])
                        lis_layers = layer_noremove
                        if (id == "munvictimascalor") {
                            ver_calor_mun_victimas(true, id)
                        } else if (id == "muncasoscalor") {
                            ver_calor_mun(true, id)
                        } else if (id == "depcasoscalor") {
                            ver_calor_dep(true, id)
                        } else if (id == "depvictimascalor") {
                            ver_calor_dep_victimas(true, id)
                        }
                    }

                }
            }
        })

    }
    function maker_control_pane() {
        //Crearemos un control desplegable de color linea personalizado
        const dropdown = document.createElement("div")
        dropdown.className = "dropdown me-1"
        dropdown.innerHTML =
            `
        <button class="border-0 btn-outline-secondary p-1
            dropdown-toggle tooltip-container" 
            type="button" 
            data-bs-toggle="dropdown"
            id="btnPane${id}">
        </button>
        `
        const ul = document.createElement("ul")
        ul.className = "dropdown-menu container-fluid p-1"
        dropdown.appendChild(ul)
        btngroup.appendChild(dropdown)

        //Colocamos un icono que cambiará de color cuando cambie la selección
        const i = document.createElement("i")
        i.className = "bi-intersect"
        i.textContent = eval(format_layer["layer_" + id].format.pane)
        i.style.color = "black"


        const btnPane = document.getElementById("btnPane" + id)
        btnPane.appendChild(i)
        tooltip(btnPane, "Posición capa", "gray")

        //Colocamos los colores en el ul control
        const Pane = ["1", "2", "3", "4", "5", "6"]

        Pane.forEach(value => {
            const li = document.createElement("li")
            li.className = "ms-2"

            const a = document.createElement("a")
            a.className = "dropdown-item"
            a.href = "#"
            a.textContent = value
            li.appendChild(a)

            ul.appendChild(li)
            a.onclick = () => {
                format_layer["layer_" + id].format.pane = `'${value}'`
                const checkLayer = document.getElementById(id)
                i.textContent = " " + value

                if (checkLayer.checked == true) {
                    //Crear dos filtros para mostrar o quitar la capa
                    //Solo para capas locales fijas, que siempre se presentarán en el programa

                    if (format_layer["layer_" + id].target.local == "nolocal") {
                        let layer_remove = lis_layers.filter(value => value[0] == "layer_" + id)

                        let layer_noremove = lis_layers.filter(value => value[0] !== "layer_" + id)
                        map.removeLayer(layer_remove[0][1])
                        lis_layers = layer_noremove
                        if (id == "munvictimascalor") {
                            ver_calor_mun_victimas(true, id)
                        } else if (id == "muncasoscalor") {
                            ver_calor_mun(true, id)
                        } else if (id == "depcasoscalor") {
                            ver_calor_dep(true, id)
                        } else if (id == "depvictimascalor") {
                            ver_calor_dep_victimas(true, id)
                        }
                    }

                }


            }
        })

    }

}


