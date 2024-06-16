let filterList = []

let criteria_items = []

function iniTables() {
    document.getElementById('panel-escritorio').hidden = true;
    document.getElementById('panel-escritorio').hidden = true;
    document.getElementById('element-to-print').hidden = true;
    document.getElementById('panel-Tablas-inicio').hidden = false;

    //Cargamos la base de datos actual
    const proyectos = GLOBAL.state.proyectos;
    ActiveDB = clsObservatorio.loadAsInstance(proyectos[0]);
    data = ActiveDB

    makerTable(ActiveDB.clsCasos)

    //Inicia la lista con ese criterio
    crear_listas("clsCasos_macroregion")
    document.getElementById("btnConsulta").value = 1
}
let activeHeadfilter = []
function makerTable(data) {
    const contenedor = document.getElementById('panel-Tablas')
    contenedor.innerHTML = ""
    //Creamos uan tabla general
    const tableParent = document.createElement("table")
    tableParent.className = "table table-hover table-bordered mt-4"

    //========================================================
    const thead = document.createElement("thead")


    //Crear los encabezados dinámicamente
    const trHead = document.createElement("tr")
    thead.appendChild(trHead)

    const visibles = [
        ["clsCasos", "macroregion", "MACROREGIÓN"],
        ["clsCasos", "departamento", "DEPARTAMENTO"],
        ["clsLugares", "municipio", "LUGARES"],
        ["clsPueblos", "nombre", "PUEBLO/ÉTNIA"],
        ["clsCasos", "macrotipo", "MACROTIPO"],
        ["clsTipos", "nombre", "SUBTIPOS"],
        ["clsCasos", "fecha", "FECHA"],
        ["clsCasos", "vigencia", "AÑO"],
        ["clsCasos", "macroactor", "MACROACTOR"],
        ["clsActores", "nombre", "ACTORES"],
        ["clsDesplazamiento", "tipo", "TIPO DESPLAZAMIENTO"],
        ["clsCasos", "npersonas", "VICTIMAS"],
        ["clsCasos", "nmujeres", "MUJERES"],
        ["clsCasos", "nhombres", "HOMBRES"],
        ["clsCasos", "nmenores", "MENORES DE EDAD"],
        ["clsAccJuridica", "accion", "ACCIONES"],
        ["clsCasos", "fuente", "FUENTE"],
        ["clsCasos", "fechafuente", "FECHA FUENTE"],
        ["clsCasos", "enlace", "ENLACE"],
        


    ]

    const thscope = document.createElement("th")
    thscope.scope = "col"
    trHead.appendChild(thscope)

    visibles.forEach(campo => {
        const th = document.createElement("th")
        th.className = "bg-secondary text-white"
        trHead.appendChild(th)

        const div = document.createElement("div")
        div.style.fontSize = "10pt"
        div.innerHTML = `
        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            ${campo[2]}
        </a>
        `
        const ul = document.createElement("ul")
        ul.className = "dropdown-menu menu-group-scroll shadow"
        div.appendChild(ul)

        //Este botón aplicará el filto según lo que se encuentre adentro
        const lifilter = document.createElement("li")
        lifilter.className = "sticky-top bg-white"
        lifilter.innerHTML = `                
                <a class="dropdown-item" href="#">
                    <i class="bi bi-funnel-fill me-2"></i>
                    Aplicar filtro
                </a>`
        ul.appendChild(lifilter)

        lifilter.onclick = () => {
            //Creamos cadena de criterios
            let criterios = ""
            activeHeadfilter.forEach(filtro => {

                criterios = criterios + `value["${campo[1]}"] == '${filtro}' || `
            })
            criterios = criterios + `value["${campo[1]}"]  ==""`

            if (campo[0] == "clsCasos") {
                let filtered = data.filter(value => eval(criterios));
                makerTable(filtered)

            } else {
                let datafiltered = []
                data.forEach(caso => {
                    if (caso[campo[0]].length != 0) {
                        let filtered = caso[campo[0]].filter(value => eval(criterios));
                        if (filtered.length != 0) {
                            datafiltered.push(caso)
                        }
                    }
                })
                makerTable(datafiltered)
            }
            activeHeadfilter = []
        }

        const lifilternull = document.createElement("li")
        lifilternull.className = "sticky-top bg-white"
        lifilternull.innerHTML = `                
            <a class="dropdown-item" href="#">
                <i class="bi bi-funnel me-2"></i>
                    Vertodo
             </a>
             <hr>
             `
        ul.appendChild(lifilternull)
        lifilternull.onclick = () => {
            makerTable(ActiveDB.clsCasos)
            activeHeadfilter = []
        }

        //Se extraen los elemento únicos para crear las listas del control
        let newData = []
        if (campo[0] == "clsCasos") {
            data.forEach(item => {
                if (newData.includes(item[campo[1]]) == false) {
                    newData.push(item[campo[1]])
                }
            }
            )

        } else {
            data.forEach(caso => {
                caso[campo[0]].forEach(item => {
                    if (newData.includes(item[campo[1]]) == false) {
                        newData.push(item[campo[1]])
                    }
                })
            })
        }

        //Se ordenan los elementos según sea número o letra
        let newDataOrdenado;
        try {
            function porDato(a, b) {
                return a.localeCompare(b);
            }
            newDataOrdenado = newData.sort(porDato);

        } catch (error) {
            //Esto en el caso que los valores sean solo numérico, entonces se ordena por número
            newDataOrdenado = newData.sort();
            newDataOrdenado.sort(function (a, b) {
                return a - b;
            });
            //Al identificar esta variacón, indica que es un valor tipo número, entonces
        }

        const mncontenedor = ul
        newDataOrdenado.forEach(item => {
            const div = document.createElement("div")
            div.className = "ms-2 form-check"
            mncontenedor.appendChild(div)

            const checkers = document.createElement("input")
            checkers.className = "form-check-input"
            checkers.type = "checkbox"
            checkers.value = item
            div.appendChild(checkers)

            checkers.onchange = () => {
                if (checkers.checked == true) {
                    activeHeadfilter.push(checkers.value)
                } else {
                    const eliminados = activeHeadfilter.filter(elemento => elemento != checkers.value);
                    activeHeadfilter = eliminados
                }
            }

            const label = document.createElement("label")
            label.className = "form-check-label"
            label.style.fontSize = "12pt"
            label.style.fontWeight = "normal"
            label.textContent = item
            div.appendChild(label)

        })






        th.appendChild(div)
        //console.log(campo[0])
    })

    tableParent.appendChild(thead)
    //========================================================
    //Agregar un body table
    const tbody = document.createElement("tbody")
    tableParent.appendChild(tbody)
    //========================================================

    //========================================================
    //POR CADA REGISTRO SE CREA UNA FILA EN LA TABLA TR
    data.forEach(caso => {
        const tr = document.createElement("tr")

        const td_scope = document.createElement("td")
        td_scope.style.verticalAlign = "middle"
        td_scope.className = "bg-secondary text-center text-white"
        td_scope.scope = "row"

        const td_btn = document.createElement("a")
        td_btn.className = "nav-link active"
        td_btn.href = "#"
        td_btn.innerHTML = `<i class="bi bi-link-45deg"></i>`
        td_scope.appendChild(td_btn)

        td_scope.onclick = () => {
            loadProyecto()
            gotoCaso(caso.id)
        }


        tr.appendChild(td_scope)

        const td_macroregion = document.createElement("td")
        td_macroregion.style.verticalAlign = "middle"
        td_macroregion.textContent = caso.macroregion
        tr.appendChild(td_macroregion)

        const td_departamento = document.createElement("td")
        td_departamento.style.verticalAlign = "middle"
        td_departamento.textContent = caso.departamento
        tr.appendChild(td_departamento)


        const td_lugar = _crearCelda.data_lugar(caso)
        tr.appendChild(td_lugar)

        const td_pueblo = _crearCelda.data_pueblo(caso)
        tr.appendChild(td_pueblo)

        const td_macrotipo = document.createElement("td")
        td_macrotipo.style.verticalAlign = "middle"
        td_macrotipo.textContent = caso.macrotipo
        tr.appendChild(td_macrotipo)

        const td_tipos = _crearCelda.data_tipos(caso)
        tr.appendChild(td_tipos)

        const td_fecha = document.createElement("td")
        td_fecha.style.verticalAlign = "middle"
        td_fecha.textContent = caso.fecha
        tr.appendChild(td_fecha)

        const td_vigencia = document.createElement("td")
        td_vigencia.style.verticalAlign = "middle"
        td_vigencia.textContent = caso.vigencia
        tr.appendChild(td_vigencia)

        const td_macroactor = document.createElement("td")
        td_macroactor.style.verticalAlign = "middle"
        td_macroactor.textContent = caso.macroactor
        tr.appendChild(td_macroactor)

        const td_actores = _crearCelda.data_actores(caso)
        tr.appendChild(td_actores)

        const td_desplazamiento = _crearCelda.data_desplazamiento(caso)
        tr.appendChild(td_desplazamiento)

        const td_tpersonas = document.createElement("td")
        td_tpersonas.style.verticalAlign = "middle"
        td_tpersonas.textContent = caso.npersonas
        tr.appendChild(td_tpersonas)

        const td_tmujeres = document.createElement("td")
        td_tmujeres.style.verticalAlign = "middle"
        td_tmujeres.style.backgroundColor = "pink"
        td_tmujeres.textContent = caso.nmujeres
        tr.appendChild(td_tmujeres)

        const td_thombres = document.createElement("td")
        td_thombres.style.verticalAlign = "middle"
        td_thombres.textContent = caso.nhombres
        tr.appendChild(td_thombres)

        const td_tmenores = document.createElement("td")
        td_tmenores.style.verticalAlign = "middle"
        td_tmenores.textContent = caso.nmenores
        tr.appendChild(td_tmenores)

        const td_acciones = _crearCelda.data_acciones(caso)
        tr.appendChild(td_acciones)

        const td_fuente = document.createElement("td")
        td_fuente.style.verticalAlign = "middle"
        td_fuente.textContent = caso.fuente
        tr.appendChild(td_fuente)

        const td_fechafuente = document.createElement("td")
        td_fechafuente.style.verticalAlign = "middle"
        td_fechafuente.textContent = caso.fechafuente
        tr.appendChild(td_fechafuente)

        const td_enlace = document.createElement("td")
        td_enlace.style.verticalAlign = "middle"
        td_enlace.textContent = caso.enlace
        tr.appendChild(td_enlace)

        tbody.appendChild(tr)

    });


    //Agregamos la tabla al contenedor
    contenedor.appendChild(tableParent)

}



const _crearCelda = {
    data_lugar(parent) {

        const acordeon = document.createElement("div")
        acordeon.className = ""

        const acordeonitem = document.createElement("div")
        acordeonitem.className = "accordion-item"
        acordeon.appendChild(acordeonitem)

        const accordionheader = document.createElement("h3")
        accordionheader.className = "accordion-header"
        acordeon.appendChild(accordionheader)

        const accordionbutton = document.createElement("div")
        accordionbutton.innerHTML =
            `
                    <button class="accordion-button ps-2 border-1 rounded bg-warning-subtle" type="button"
                                    data-bs-toggle="collapse" 
                                    data-bs-target="#collapse${parent.id}" 
                                    aria-expanded="true" 
                                    >
                        Lugares (${parent.clsLugares.length})
                    </button>
        `
        acordeon.appendChild(accordionbutton)

        const collapse = document.createElement("div")
        collapse.className = "accordion-collapse collapse"
        collapse.id = "collapse" + parent.id
        acordeon.appendChild(collapse)

        parent.clsLugares.forEach(lugar => {
            const itemlugar = document.createElement("div")
            itemlugar.textContent = lugar.municipio
            itemlugar.className = "m-2"
            collapse.appendChild(itemlugar)

        })
        const td = document.createElement("td")
        if (parent.clsLugares.length != 0) {
            td.appendChild(acordeon)
        }
        return td
    },
    data_pueblo(parent) {

        const acordeon = document.createElement("div")
        acordeon.className = ""

        const acordeonitem = document.createElement("div")
        acordeonitem.className = "accordion-item"
        acordeon.appendChild(acordeonitem)

        const accordionheader = document.createElement("h3")
        accordionheader.className = "accordion-header"
        acordeon.appendChild(accordionheader)

        const accordionbutton = document.createElement("div")
        accordionbutton.innerHTML =
            `
                    <button class="accordion-button ps-2 border-1 rounded bg-warning-subtle" type="button" 
                                    data-bs-toggle="collapse" 
                                    data-bs-target="#collapsepueblo${parent.id}" 
                                    aria-expanded="true" 
                                    >
                        Pueblos (${parent.clsPueblos.length})
                    </button>
        `
        acordeon.appendChild(accordionbutton)

        const collapse = document.createElement("div")
        collapse.className = "accordion-collapse collapse"
        collapse.id = "collapsepueblo" + parent.id
        acordeon.appendChild(collapse)

        parent.clsPueblos.forEach(pueblo => {
            const itempueblo = document.createElement("div")
            itempueblo.textContent = pueblo.nombre
            itempueblo.className = "m-2"
            collapse.appendChild(itempueblo)

        })
        const td = document.createElement("td")
        if (parent.clsPueblos.length != 0) {
            td.appendChild(acordeon)
        }
        return td

    },
    data_tipos(parent) {

        const acordeon = document.createElement("div")
        acordeon.className = ""

        const acordeonitem = document.createElement("div")
        acordeonitem.className = "accordion-item"
        acordeon.appendChild(acordeonitem)

        const accordionheader = document.createElement("h3")
        accordionheader.className = "accordion-header"
        acordeon.appendChild(accordionheader)

        const accordionbutton = document.createElement("div")
        accordionbutton.innerHTML =
            `
                    <button class="accordion-button ps-2 border-1 rounded bg-warning-subtle" type="button"
                                    data-bs-toggle="collapse" 
                                    data-bs-target="#collapsetipo${parent.id}" 
                                    aria-expanded="true" 
                                    >
                        Tipos (${parent.clsTipos.length})
                    </button>
        `
        acordeon.appendChild(accordionbutton)

        const collapse = document.createElement("div")
        collapse.className = "accordion-collapse collapse"
        collapse.id = "collapsetipo" + parent.id
        acordeon.appendChild(collapse)

        parent.clsTipos.forEach(tipo => {
            const item = document.createElement("div")
            item.textContent = tipo.nombre
            item.className = "m-2"
            collapse.appendChild(item)

        })
        const td = document.createElement("td")
        if (parent.clsTipos.length != 0) {
            td.appendChild(acordeon)
        }
        return td

    },
    data_actores(parent) {

        const acordeon = document.createElement("div")
        acordeon.className = ""

        const acordeonitem = document.createElement("div")
        acordeonitem.className = "accordion-item"
        acordeon.appendChild(acordeonitem)

        const accordionheader = document.createElement("h3")
        accordionheader.className = "accordion-header"
        acordeon.appendChild(accordionheader)

        const accordionbutton = document.createElement("div")
        accordionbutton.innerHTML =
            `
                    <button class="accordion-button ps-2 border-1 rounded bg-warning-subtle" type="button"
                                    data-bs-toggle="collapse" 
                                    data-bs-target="#collapseactor${parent.id}" 
                                    aria-expanded="true" 
                                    >
                        Actores (${parent.clsActores.length})
                    </button>
        `
        acordeon.appendChild(accordionbutton)

        const collapse = document.createElement("div")
        collapse.className = "accordion-collapse collapse"
        collapse.id = "collapseactor" + parent.id
        acordeon.appendChild(collapse)

        parent.clsActores.forEach(actor => {
            const item = document.createElement("div")
            item.textContent = actor.nombre
            item.className = "m-2"
            collapse.appendChild(item)

        })
        const td = document.createElement("td")
        if (parent.clsActores.length != 0) {
            td.appendChild(acordeon)
        }
        return td

    },
    data_desplazamiento(parent) {

        const acordeon = document.createElement("div")
        acordeon.className = ""

        const acordeonitem = document.createElement("div")
        acordeonitem.className = "accordion-item"
        acordeon.appendChild(acordeonitem)

        const accordionheader = document.createElement("h3")
        accordionheader.className = "accordion-header"
        acordeon.appendChild(accordionheader)

        const accordionbutton = document.createElement("div")
        accordionbutton.innerHTML =
            `
                    <button class="accordion-button ps-2 border-1 rounded bg-warning-subtle" type="button"
                                    data-bs-toggle="collapse" 
                                    data-bs-target="#collapseactor${parent.id}" 
                                    aria-expanded="true" 
                                    >
                        Hechos (${parent.clsDesplazamiento.length})
                    </button>
        `
        acordeon.appendChild(accordionbutton)

        const collapse = document.createElement("div")
        collapse.className = "accordion-collapse collapse"
        collapse.id = "collapseactor" + parent.id
        acordeon.appendChild(collapse)

        parent.clsDesplazamiento.forEach(hecho => {
            const item = document.createElement("div")
            item.textContent = hecho.tipo
            item.className = "m-2"
            collapse.appendChild(item)

        })
        const td = document.createElement("td")
        if (parent.clsDesplazamiento.length != 0) {
            td.appendChild(acordeon)
        }
        return td

    },
    data_acciones(parent) {

        const acordeon = document.createElement("div")
        acordeon.className = ""

        const acordeonitem = document.createElement("div")
        acordeonitem.className = "accordion-item"
        acordeon.appendChild(acordeonitem)

        const accordionheader = document.createElement("h3")
        accordionheader.className = "accordion-header"
        acordeon.appendChild(accordionheader)

        const accordionbutton = document.createElement("div")
        accordionbutton.innerHTML =
            `
                    <button class="accordion-button ps-2 border-1 rounded bg-warning-subtle" type="button"
                                    data-bs-toggle="collapse" 
                                    data-bs-target="#collapseaccion${parent.id}" 
                                    aria-expanded="true" 
                                    >
                        Acciones (${parent.clsAccJuridica.length})
                    </button>
        `
        acordeon.appendChild(accordionbutton)

        const collapse = document.createElement("div")
        collapse.className = "accordion-collapse collapse"
        collapse.id = "collapseaccion" + parent.id
        acordeon.appendChild(collapse)

        parent.clsAccJuridica.forEach(accion => {
            const item = document.createElement("div")
            item.textContent = accion.accion
            item.className = "m-2"
            collapse.appendChild(item)

        })
        const td = document.createElement("td")
        if (parent.clsAccJuridica.length != 0) {
            td.appendChild(acordeon)
        }
        return td

    }

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
            ActiveDB.clsCasos.forEach(caso => {
                if (newCriteria.includes(caso[criterio[1]]) == false) {
                    newCriteria.push(caso[criterio[1]])
                }
            })
        } else {
            //Aquí es la derivación en caso de que la clase no sea CASOS (Padre)
            //Busca en la clase hija.
            ActiveDB.clsCasos.forEach(caso => {
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
                let filtered = ActiveDB.clsCasos.filter(value => eval(criterios_filter));
                makerTable(filtered)

            } else {
                ActiveDB.clsCasos.forEach(caso => {
                    let filtered = caso[criterio[0]].filter(value => eval(criterios_filter));
                    //Si el filtro en ese momento no dice nada, entonces no agrego
                    if (filtered.length != 0) {
                        filtros_ampliados.push(caso)
                    }

                })
                makerTable(filtros_ampliados)

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
function LimpiarConsulta() {
    criteria_items = []
    const contenedorlistas = document.getElementById("listconsultaextendida")
    contenedorlistas.innerHTML = ""
}
function filter_extend() {
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
    let dataParentFilter = ActiveDB.clsCasos.filter(value => eval(criterio_Join))

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

    console.log(datachieldFilter)
    makerTable(datachieldFilter)


}
function testfilter() {



}