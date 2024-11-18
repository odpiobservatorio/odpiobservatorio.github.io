
let filterList = []


let dataWfilter = []

const campos = [
    ["clsCasos", "macroregion", "MACROREGIÓN", "1"],
    ["clsCasos", "departamento", "DEPARTAMENTO", "1"],
    ["clsLugares", "municipio", "LUGARES", "1"],
    ["clsLugares", "lat", "LAT", "1"],
    ["clsLugares", "lng", "LNG", "1"],
    ["clsPueblos", "nombre", "PUEBLO/ÉTNIA", "1"],
    ["clsCasos", "macrotipo", "MACROTIPO", "1"],
    ["clsTipos", "nombre", "SUBTIPOS", "1"],
    ["clsCasos", "fecha", "FECHA", "1"],
    ["clsCasos", "vigencia", "AÑO", "1"],
    ["clsCasos", "macroactor", "MACROACTOR", "1"],
    ["clsActores", "nombre", "ACTORES", "1"],
    ["clsDesplazamiento", "tipo", "TIPO DESPLAZAMIENTO", "1"],
    ["clsPersonas", "nombres", "NOMBRES", "1"],
    ["clsPersonas", "genero", "GÉNERO", "1"],
    ["clsPersonas", "edad", "EDAD", "1"],
    ["clsCasos", "npersonas", "VICTIMAS", "1"],
    ["clsCasos", "nmujeres", "MUJERES", "1"],
    ["clsCasos", "nhombres", "HOMBRES", "1"],
    ["clsCasos", "nmenores", "MENORES DE EDAD", "1"],
    ["clsAccJuridica", "accion", "ACCIONES", "1"],
    ["clsCasos", "fuente", "FUENTE", "1"],
    ["clsCasos", "fechafuente", "FECHA FUENTE", "1"],
    ["clsCasos", "enlace", "ENLACE", "1"],
    ["clsCasos", "detalle", "DETALLE", "1"],
]


function loadProyectoTabla(value) {
    if (PublicID !== 2016) {
        iniTables(PublicID, 1)
    } else {
        iniTables(0, 1)

    }
}

function iniTables(value, ini) {
    document.getElementById("sel_vigencia_tabla").hidden=false
    document.getElementById("panel-concordancia").hidden = true
    document.getElementById('panel-escritorio').hidden = true;
    document.getElementById('element-to-print').hidden = true;
    document.getElementById('panel-graficos').hidden = true;
    document.getElementById('panel-Tablas-inicio').hidden = false;


    //Creamos y cargamos la lista de campos para hacerlos visibles
    const contenedorUl = document.getElementById("ulCampos")
    contenedorUl.innerHTML = ""


    campos.forEach(campo => {
        const elemento = document.createElement("div")
        elemento.className = "ms-3 me-3 hchange-gray"
        elemento.style.fontWeight = "normal"

        elemento.innerHTML =
            `
        <input class="fst-normal form-check-input ms-1" type="checkbox" value="${campo[1]}" id="check${campo[2]}">
         ${campo[2]}
        `
        contenedorUl.appendChild(elemento)
        const check = document.getElementById("check" + campo[2])
        if (campo[3] == 1) {
            check.checked = true
        } else {
            check.checked = false
        }

        check.onchange = () => {
            if (check.checked == false) {
                campo[3] = 0
            } else {
                campo[3] = 1
            }
            makerTable(ActiveDB.clsCasos)
            console.log(campos)
        }

    })


    //Cargamos la base de datos actual
    const proyectos = GLOBAL.state.proyectos;

    for (id in proyectos) {
        if (proyectos[id].id == value) {
            ActiveDB = clsObservatorio.loadAsInstance(proyectos[id]);
            console.log(ActiveDB.id, value, ActiveDB.clsCasos.length)
        }
    }
    //
    document.getElementById("sel_vigencia").value = value
    PublicID = value
    //




    if (ini == 0) {
        dataWfilter = []
        makerTable(ActiveDB.clsCasos)
    } else {
        if (dataWfilter.length !== 0) {
            makerTable(dataWfilter)

        } else {
            makerTable(ActiveDB.clsCasos)
        }
    }




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

    const thscope = document.createElement("th")
    thscope.scope = "col"
    trHead.appendChild(thscope)

    //Toma cada elemento de visibles y crea un encabezado
    campos.forEach(campo => {
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
        div.onclick = (e) => {
            e.stopPropagation();
        }

        const ul = document.createElement("ul")
        const div1ul = document.createElement("div")
        div1ul.className="p-2"
        const div1u2 = document.createElement("div")
        div1u2.className="p-2"

        ul.className = "dropdown-menu menu-group-scroll shadow p-1"
        div.appendChild(ul)

        //Este botón aplicará el filto según lo que se encuentre adentro
        const lifilter = document.createElement("li")
        lifilter.className = "sticky-top bg-white"
        lifilter.innerHTML = `                
                <a class="dropdown-item" href="#">
                    <i class="bi bi-funnel-fill me-2"></i>
                      Aplicar filtro
                </a>`
        div1ul.appendChild(lifilter)

        lifilter.onclick = () => {
            //Creamos cadena de criterios
            let criterios = ""
            activeHeadfilter.forEach(filtro => {
                criterios = criterios + `value["${campo[1]}"] == '${filtro}' || `
            })
            criterios = criterios + `value["${campo[1]}"]  ==""`

            if (campo[0] == "clsCasos") {
                let filtered = data.filter(value => eval(criterios));
                dataWfilter = filtered
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
                dataWfilter = datafiltered
                makerTable(datafiltered)
            }
            activeHeadfilter = []
        }

        const lifilternull = document.createElement("li")
        lifilternull.className = "bg-white"
        lifilternull.innerHTML = `                
            <a class="dropdown-item" href="#">
                <i class="bi bi-funnel me-2"></i>
                    Ver todo
             </a>
             <hr>
             `
        div1ul.appendChild(lifilternull)
        lifilternull.onclick = () => {
            dataWfilter = ActiveDB.clsCasos

            iniTables(PublicID, 2016)
            activeHeadfilter = []
        }

        
        
        const smFilter = document.createElement("small")
        smFilter.textContent = "Contiene"
        smFilter.className = "fw-bold ms-2 me-2"
        ul.appendChild(smFilter)

        const infilter = document.createElement("input")
        infilter.className = "form-control ms-2 me-2"
        div1ul.appendChild(infilter)

        ul.appendChild(div1ul)
        ul.appendChild(div1u2)

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

        const mncontenedor = div1u2
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


        //=============================================================
        infilter.onchange = () => {
            div1u2.innerHTML = ""
            const mncontenedor = div1u2
            newDataOrdenado.forEach(item => {
                if (item.includes(infilter.value)) {
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
                }

            })
        }
        //============================================================

        th.appendChild(div)
        if (campo[3] == 1) {
            th.hidden = false
        } else {
            th.hidden = true
        }

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

        //=========================================================
        //             Se crea el boton de fila para acceder al registro en formulario
        const td_scope = document.createElement("td")
        td_scope.style.verticalAlign = "middle"
        td_scope.style.width = "50px"
        td_scope.className = "bg-secondary text-center text-white"
        td_scope.scope = "row"

        const td_btn = document.createElement("a")
        td_btn.className = "nav-link active"
        td_btn.style.width = "50px"
        td_btn.href = "#"
        td_btn.innerHTML = `<i class="me-2 bi bi-link-45deg"></i>${caso.id + 1} `
        td_scope.appendChild(td_btn)

        td_scope.onclick = () => {
            loadProyecto(document.getElementById("sel_vigencia_tabla").value)

            gotoCaso(caso.id)
        }
        tr.appendChild(td_scope)
        //=========================================================



        campos.forEach(campo => {
            if (campo[0] == "clsCasos") {
                try {
                    let longitud = caso[campo[1]].length

                    if (longitud > 15) {

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
                                        data-bs-target="#collapse${caso.id}" 
                                        aria-expanded="true" 
                                        >
                            ${campo[2]} ...
                        </button>
                        `
                        acordeon.appendChild(accordionbutton)
                        const collapse = document.createElement("div")
                        collapse.className = "accordion-collapse collapse"
                        collapse.id = "collapse" + caso.id
                        collapse.textContent = caso[campo[1]]

                        acordeon.appendChild(collapse)
                        const td = document.createElement("td")
                        td.appendChild(acordeon)
                        if (campo[3] == 1) {
                            tr.appendChild(td)
                        }


                    } else {

                        if (campo[3] == 1) {

                            const td = document.createElement("td")
                            td.className = "td-wrap"
                            td.style.verticalAlign = "middle"
                            td.textContent = caso[campo[1]]
                            tr.appendChild(td)
                        }

                    }
                } catch (error) {

                }


            } else {

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
                                    data-bs-target="#collapse${caso.id}${campo[1]}" 
                                    aria-expanded="true" 
                                    >
                        ${campo[2]} (${caso[campo[0]].length})
                    </button>
                    `
                acordeon.appendChild(accordionbutton)

                const collapse = document.createElement("div")
                collapse.className = "accordion-collapse collapse"
                collapse.id = "collapse" + caso.id + campo[1]
                acordeon.appendChild(collapse)

                caso[campo[0]].forEach(lugar => {
                    const itemlugar = document.createElement("div")
                    itemlugar.textContent = lugar[campo[1]]
                    itemlugar.className = "m-2"
                    collapse.appendChild(itemlugar)

                })
                const td = document.createElement("td")
                td.className = "td-wrap"

                if (campo[3] == 1) {

                    if (caso[campo[0]].length != 0) {
                        td.appendChild(acordeon)
                    }
                    tr.appendChild(td)
                } else {

                }

            }

        })

        tbody.appendChild(tr)

    });


    //Agregamos la tabla al contenedor
    contenedor.appendChild(tableParent)

}
function show_campos(value) {
    campos.forEach(campo => {
        campo[3] = value
    })

    const contenedorUl = document.getElementById("ulCampos")
    contenedorUl.innerHTML = ""


    campos.forEach(campo => {
        const elemento = document.createElement("div")
        elemento.className = "ms-3 me-3 hchange-gray"
        elemento.style.fontWeight = "normal"

        elemento.innerHTML =
            `
        <input class="fst-normal form-check-input ms-1" type="checkbox" value="${campo[1]}" id="check${campo[2]}">
         ${campo[2]}
        `
        contenedorUl.appendChild(elemento)
        const check = document.getElementById("check" + campo[2])
        if (campo[3] == 1) {
            check.checked = true
        } else {
            check.checked = false
        }

        check.onchange = () => {
            if (check.checked == false) {
                campo[3] = 0
            } else {
                campo[3] = 1
            }
            makerTable(ActiveDB.clsCasos)
        }

    })


    makerTable(ActiveDB.clsCasos)
}

function quitar_filtro() {
    makerTable(ActiveDB.clsCasos)
    dataWfilter = []
    add_consulta(ActiveDB.clsCasos)
}

async function bulk_replace() {
    const clase = document.getElementById("lstCampos_replace").value.split("_")
    const intOriginal = document.getElementById("intOriginal").value
    const intNuevo = document.getElementById("intNuevoValor").value
    const lstTipo_replace = document.getElementById("lstTipo_replace").value

    let i = 0
    if (clase[0] == "clsCasos") {
        i = 0
        const data = ActiveDB.clsCasos
        data.forEach(caso => {
            const valOriginal = caso[clase[1]]
            if (intOriginal == "*null*") {
                if (valOriginal >= 0) {
                } else {
                    caso[clase[1]] = intNuevo
                    GuardarDatos()
                    i++
                }
            } else {
                if (lstTipo_replace == "igual") {
                    if (intOriginal == valOriginal) {
                        caso[clase[1]] = intNuevo
                        GuardarDatos()
                        i++
                    }
                } else if (lstTipo_replace == "contiene") {
                    if (valOriginal.includes(intOriginal)) {
                        caso[clase[1]].replace(valOriginal, intNuevo)
                        GuardarDatos()
                        i++
                    }
                }
            }
        })
    } else {
        const data = ActiveDB.clsCasos
        i = 0
        data.forEach(caso => {
            caso[clase[0]].forEach(subclase => {
                const valOriginal = subclase[clase[1]]
                if (intOriginal == "*null*") {
                    if (valOriginal >= 0) {
                    } else {
                        subclase[clase[1]] = intNuevo
                        GuardarDatos()
                        i++
                    }
                } else {
                    if (lstTipo_replace == "igual") {
                        if (intOriginal == valOriginal) {
                            subclase[clase[1]] = intNuevo
                            console.log(subclase[clase[1]])
                            GuardarDatos()
                            i++
                        }
                    } else if (lstTipo_replace == "contiene") {
                        if (valOriginal.includes(intOriginal)) {
                            subclase[clase[1]].replace(valOriginal, intNuevo)
                            GuardarDatos()
                            i++
                        }
                    }
                }
            })
        })
    }
    GuardarDatos()
    mensajes("Se han realizado " + i + " cambios")
    makerTable(ActiveDB.clsCasos)

}






