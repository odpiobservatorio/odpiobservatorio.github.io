function iniTables() {
    document.getElementById('panel-escritorio').hidden = true;
    document.getElementById('panel-escritorio').hidden = true;
    document.getElementById('element-to-print').hidden = true;
    document.getElementById('panel-Tablas').hidden = false;

    //Cargamos la base de datos actual
    const proyectos = GLOBAL.state.proyectos;
    ActiveDB = clsObservatorio.loadAsInstance(proyectos[0]);
    data = ActiveDB

    makerTable(ActiveDB.clsCasos)
}
function makerTable(data) {
    const contenedor = document.getElementById('panel-Tablas')
    contenedor.innerHTML = ""
    //Creamos uan tabla general
    const tableParent = document.createElement("table")
    tableParent.className = "table table-hover table-bordered mt-4"

    //========================================================
    const thead = document.createElement("thead")

    thead.innerHTML =
        `
    <tr class="sticky-top">
        <th scope="col"></th>
        <th class="bg-secondary text-white">

        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            MACROREGION
        </a>
        <ul class="dropdown-menu menu-group-scroll shadow" id="menuMacroregion">
            <li class="sticky-top bg-white" id="lifilterMacroregion">
                <a class="dropdown-item" href="#">
                <i class="bi bi-funnel-fill me-2"></i>
                Aplicar filtro
                </a>
            </li>
            <li class="sticky-top bg-white" id="lifilterNullMacroregion">
                <a class="dropdown-item" href="#">
                <i class="bi bi-funnel me-2"></i>
                    Vertodo
                </a>
            </li>
            <hr>       
        </ul>
      
        </th>
        <th class="bg-secondary text-white">
        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            DEPARTAMENTOS
        </a>
        <ul class="dropdown-menu menu-group-scroll shadow" id="menuDepartamento">
            <li class="sticky-top bg-white" id="lifilterDepartamento">
                <a class="dropdown-item" href="#">
                <i class="bi bi-funnel-fill me-2"></i>
                Aplicar filtro
                </a>
            </li>
            <li class="sticky-top bg-white" id="lifilterNull">
                <a class="dropdown-item" href="#">
                <i class="bi bi-funnel me-2"></i>
                    Vertodo
                </a>
            </li>
            <hr>       
        </ul>
        
        </th>
        <th class="bg-secondary text-white">
         <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            LUGAR
        </a>
        <ul class="dropdown-menu menu-group-scroll shadow" id="menuLugar">
            <li class="sticky-top bg-white" id="lifilterLugar">
                <a class="dropdown-item" href="#">
                <i class="bi bi-funnel-fill me-2"></i>
                Aplicar filtro
                </a>
            </li>
            <li class="sticky-top bg-white" id="lifilterNullLugar">
                <a class="dropdown-item" href="#">
                <i class="bi bi-funnel me-2"></i>
                    Vertodo
                </a>
            </li>
            <hr>       
        </ul>
        </th>
        <th class="bg-secondary text-white">
        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            PUEBLO ÉTNIA
        </a>
        <ul class="dropdown-menu menu-group-scroll shadow" id="menuPueblo">
            <li class="sticky-top bg-white" id="lifilterPueblo">
                <a class="dropdown-item" href="#">
                <i class="bi bi-funnel-fill me-2"></i>
                Aplicar filtro
                </a>
            </li>
            <li class="sticky-top bg-white" id="lifilterNullPueblo">
                <a class="dropdown-item" href="#">
                <i class="bi bi-funnel me-2"></i>
                    Vertodo
                </a>
            </li>
            <hr>       
        </ul>
        </th>
        <th class="bg-secondary text-white">
        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            MACROTIPO
        </a>
        <ul class="dropdown-menu menu-group-scroll shadow" id="menuMacrotipo">
            <li class="sticky-top bg-white" id="lifilterMacrotipo">
                <a class="dropdown-item" href="#">
                <i class="bi bi-funnel-fill me-2"></i>
                Aplicar filtro
                </a>
            </li>
            <li class="sticky-top bg-white" id="lifilterNullMacrotipo">
                <a class="dropdown-item" href="#">
                <i class="bi bi-funnel me-2"></i>
                    Vertodo
                </a>
            </li>
            <hr>       
        </ul>
        </th>
        <th class="bg-secondary text-white">
        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            SUB TIPO
        </a>
        <ul class="dropdown-menu menu-group-scroll shadow" id="menuTipo">
            <li class="sticky-top bg-white" id="lifilterTipo">
                <a class="dropdown-item" href="#">
                <i class="bi bi-funnel-fill me-2"></i>
                Aplicar filtro
                </a>
            </li>
            <li class="sticky-top bg-white" id="lifilterNullTipo">
                <a class="dropdown-item" href="#">
                <i class="bi bi-funnel me-2"></i>
                    Vertodo
                </a>
            </li>
            <hr>       
        </ul>
        </th>
        <th class="bg-secondary text-white">
        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            FECHA
        </a>
        <ul class="dropdown-menu menu-group-scroll shadow" id="menuFecha">
            <li class="sticky-top bg-white" id="lifilterFecha">
                <a class="dropdown-item" href="#">
                <i class="bi bi-funnel-fill me-2"></i>
                Aplicar filtro
                </a>
            </li>
            <li class="sticky-top bg-white" id="lifilterNullFecha">
                <a class="dropdown-item" href="#">
                <i class="bi bi-funnel me-2"></i>
                    Vertodo
                </a>
            </li>
            <hr>       
        </ul>
        </th>
        <th class="bg-secondary text-white">
        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            MACROACTOR
        </a>
        <ul class="dropdown-menu menu-group-scroll shadow" id="menuMacroactor">
            <li class="sticky-top bg-white" id="lifilterMacroactor">
                <a class="dropdown-item" href="#">
                <i class="bi bi-funnel-fill me-2"></i>
                Aplicar filtro
                </a>
            </li>
            <li class="sticky-top bg-white" id="lifilterNullMacroactor">
                <a class="dropdown-item" href="#">
                <i class="bi bi-funnel me-2"></i>
                    Vertodo
                </a>
            </li>
            <hr>       
        </ul>
        </th>
        <th class="bg-secondary text-white">
        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            OTROS ACTORES
        </a>
        <ul class="dropdown-menu menu-group-scroll shadow" id="menuActores">
            <li class="sticky-top bg-white" id="lifilterActores">
                <a class="dropdown-item" href="#">
                <i class="bi bi-funnel-fill me-2"></i>
                Aplicar filtro
                </a>
            </li>
            <li class="sticky-top bg-white" id="lifilterNullActores">
                <a class="dropdown-item" href="#">
                <i class="bi bi-funnel me-2"></i>
                    Vertodo
                </a>
            </li>
            <hr>       
        </ul>
        </th>
        <th class="bg-secondary text-white">DESPLAZAMIENTO</th>
        <th class="bg-secondary text-white">AFECTADOS</th>
        <th class="bg-secondary text-white">MUJERES</th>
        <th class="bg-secondary text-white">HOMBRES</th>
        <th class="bg-secondary text-white">MENORES</th>
        <th class="bg-secondary text-white">ACCIONES</th>
        <th class="bg-secondary text-white">FUENTE</th>
        <th class="bg-secondary text-white">FECHA</th>
        <th class="bg-secondary text-white">CONTACTO</th>
    </tr>
    `
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

    //Ahora configuramos los encabezados para filtro
    _configHeaders.hd_macroregional(data)
    _configHeaders.hd_departamento(data)
    _configHeaders.hd_Macrotipo(data)
    _configHeaders.hd_Lugar(data)
    _configHeaders.hd_Pueblo(data)
    _configHeaders.hd_Tipos(data)
    _configHeaders.hd_Fecha(data)
    _configHeaders.hd_Macroactor(data)
    _configHeaders.hd_Actores(data)
    



}
let departamentosfilter = []
let macroregionfilter = []
let macrotipofilter = []
let lugarfilter = []
let pueblofilter = []
let tipofilter = []
let fechafilter = []
let macroactorfilter = []
let actoresfilter = []

const _configHeaders = {
    hd_macroregional(parent) {


        var unicos = {};
        newData = parent.filter(function (caso) {
            var exists = !unicos[caso.macroregion];
            unicos[caso.macroregion] = true;
            return exists;
        });
        function porDato(a, b) {
            return a.macroregion.localeCompare(b.macroregion);
        }

        // Sort the array by name in ascending order
        let newDataOrdenado= newData.sort(porDato);


        newDataOrdenado.forEach(item => {
            const mncontenedor = document.getElementById("menuMacroregion")
            const elemento = document.createElement("div")
            elemento.className = "ms-3 me-3"
            elemento.style.fontWeight = "normal"
            elemento.innerHTML =
                `
                <input class="fst-normal" type="checkbox" value="${item.macroregion}" id="check${item.macroregion}macro">
                 ${item.macroregion}
            `
            mncontenedor.appendChild(elemento)

            const checkers = document.getElementById(`check${item.macroregion}macro`)

            checkers.onchange = () => {
                if (checkers.checked == true) {
                    macroregionfilter.push(checkers.value)
                } else {
                    const eliminados = macroregionfilter.filter(elemento => elemento != checkers.value);
                    macroregionfilter = eliminados
                }
            }
        })

        const filtrador = document.getElementById("lifilterMacroregion")
        filtrador.onclick = () => {
            //Creamos cadena de criterios
            let criterios = ""
            macroregionfilter.forEach(filtro => {

                criterios = criterios + `value.macroregion == '${filtro}' || `
            })
            criterios = criterios + `value.macroregion ==""`


            let filtered = parent.filter(value => eval(criterios));

            makerTable(filtered)

        }

        const nofiltrar = document.getElementById("lifilterNullMacroregion")
        nofiltrar.onclick = () => {
            macroregionfilter = []
            makerTable(ActiveDB.clsCasos)
        }





    },
    hd_departamento(parent) {


        var unicos = {};
        newData = parent.filter(function (caso) {
            var exists = !unicos[caso.departamento];
            unicos[caso.departamento] = true;
            return exists;
        });

        function porDato(a, b) {
            return a.departamento.localeCompare(b.departamento);
        }

        // Sort the array by name in ascending order
        let newDataOrdenado= newData.sort(porDato);

        newDataOrdenado.forEach(item => {
            const mncontenedor = document.getElementById("menuDepartamento")
            const elemento = document.createElement("div")
            elemento.className = "ms-3 me-3"
            elemento.style.fontWeight = "normal"
            elemento.innerHTML =
                `
                <input class="fst-normal" type="checkbox" value="${item.departamento}" id="check${item.departamento}dep">
                 ${item.departamento}
            `
            mncontenedor.appendChild(elemento)

            const checkers = document.getElementById(`check${item.departamento}dep`)
            checkers.onchange = () => {

                if (checkers.checked == true) {
                    departamentosfilter.push(checkers.value)
                } else {
                    const eliminados = departamentosfilter.filter(elemento => elemento != checkers.value);
                    departamentosfilter = eliminados
                }
            }
        })

        const filtrador = document.getElementById("lifilterDepartamento")
        filtrador.onclick = () => {
            //Creamos cadena de criterios
            let criterios = ""
            departamentosfilter.forEach(filtro => {
                criterios = criterios + `value.departamento == '${filtro}' || `
            })
            criterios = criterios + `value.departamento ==""`

            let filtered = parent.filter(value => eval(criterios));

            makerTable(filtered)

        }

        const nofiltrar = document.getElementById("lifilterNull")
        nofiltrar.onclick = () => {
            departamentosfilter = []
            makerTable(ActiveDB.clsCasos)
        }






    },
    hd_Macrotipo(parent) {


        var unicos = {};
        newData = parent.filter(function (caso) {
            var exists = !unicos[caso.macrotipo];
            unicos[caso.macrotipo] = true;
            return exists;
        });


        function porDato(a, b) {
            return a.macrotipo.localeCompare(b.macrotipo);
        }

        // Sort the array by name in ascending order
        let newDataOrdenado= newData.sort(porDato);

        newDataOrdenado.forEach(item => {
            const mncontenedor = document.getElementById("menuMacrotipo")
            const elemento = document.createElement("div")
            elemento.className = "ms-3 me-3"
            elemento.style.fontWeight = "normal"
            elemento.innerHTML =
                `
                <input class="fst-normal" type="checkbox" value="${item.macrotipo}" id="check${item.macrotipo}mtipo">
                 ${item.macrotipo}
            `
            mncontenedor.appendChild(elemento)

            const checkers = document.getElementById(`check${item.macrotipo}mtipo`)
            checkers.onchange = () => {

                if (checkers.checked == true) {
                    macrotipofilter.push(checkers.value)
                } else {
                    const eliminados = macrotipofilter.filter(elemento => elemento != checkers.value);
                    macrotipofilter = eliminados
                }
            }
        })

        const filtrador = document.getElementById("lifilterMacrotipo")
        filtrador.onclick = () => {
            //Creamos cadena de criterios
            let criterios = ""
            macrotipofilter.forEach(filtro => {
                criterios = criterios + `value.macrotipo == '${filtro}' || `
            })
            criterios = criterios + `value.macrotipo ==""`

            let filtered = parent.filter(value => eval(criterios));

            makerTable(filtered)

        }

        const nofiltrar = document.getElementById("lifilterNullMacrotipo")
        nofiltrar.onclick = () => {
            macrotipofilter = []
            makerTable(ActiveDB.clsCasos)
        }


    },
    hd_Lugar(parent) {


        let newData = []

        parent.forEach(caso => {
            caso.clsLugares.forEach(lugar => {
                if (newData.includes(lugar.municipio) == false) {
                    newData.push(lugar.municipio)
                }
            })
        })



        function porDato(a, b) {
            return a.localeCompare(b);
        }

        // Sort the array by name in ascending order
        let newDataOrdenado= newData.sort(porDato);

        newDataOrdenado.forEach(item => {
            const mncontenedor = document.getElementById("menuLugar")
            const elemento = document.createElement("div")
            elemento.className = "ms-3 me-3"
            elemento.style.fontWeight = "normal"
            elemento.innerHTML =
                `
                <input class="fst-normal" type="checkbox" value="${item}" id="check${item}lugar">
                 ${item}
            `
            mncontenedor.appendChild(elemento)

            const checkers = document.getElementById(`check${item}lugar`)
            checkers.onchange = () => {

                if (checkers.checked == true) {
                    lugarfilter.push(checkers.value)
                } else {
                    const eliminados = lugarfilter.filter(elemento => elemento != checkers.value);
                    lugarfilter = eliminados
                }
            }
        })

        const filtrador = document.getElementById("lifilterLugar")
        filtrador.onclick = () => {
            //Creamos cadena de criterios
            let criterios = ""
            lugarfilter.forEach(filtro => {
                criterios = criterios + `value.municipio == '${filtro}' || `
            })
            criterios = criterios + `value.municipio ==""`
            console.log(criterios)

            let datafiltered = []

            parent.forEach(caso => {
                if (caso.clsLugares.length != 0) {
                    let filtered = caso.clsLugares.filter(value => eval(criterios));
                    if (filtered.length != 0) {
                        datafiltered.push(caso)
                    }
                }
            })
            makerTable(datafiltered)
        }

        const nofiltrar = document.getElementById("lifilterNullLugar")
        nofiltrar.onclick = () => {
            lugarfilter = []
            makerTable(ActiveDB.clsCasos)
        }





    },
    hd_Pueblo(parent) {


        let newData = []

        parent.forEach(caso => {
            caso.clsPueblos.forEach(elemento => {
                if (newData.includes(elemento.nombre) == false) {
                    newData.push(elemento.nombre)
                }
            })
        })



        function porDato(a, b) {
            return a.localeCompare(b);
        }

        // Sort the array by name in ascending order
        let newDataOrdenado= newData.sort(porDato);

        newDataOrdenado.forEach(item => {
            const mncontenedor = document.getElementById("menuPueblo")
            const elemento = document.createElement("div")
            elemento.className = "ms-3 me-3"
            elemento.style.fontWeight = "normal"
            elemento.innerHTML =
                `
                <input class="fst-normal" type="checkbox" value="${item}" id="check${item}pueblo">
                 ${item}
            `
            mncontenedor.appendChild(elemento)

            const checkers = document.getElementById(`check${item}pueblo`)
            checkers.onchange = () => {

                if (checkers.checked == true) {
                    pueblofilter.push(checkers.value)
                } else {
                    const eliminados = pueblofilter.filter(elemento => elemento != checkers.value);
                    pueblofilter = eliminados
                }
            }
        })

        const filtrador = document.getElementById("lifilterPueblo")
        filtrador.onclick = () => {
            //Creamos cadena de criterios
            let criterios = ""
            pueblofilter.forEach(filtro => {
                criterios = criterios + `value.nombre == '${filtro}' || `
            })
            criterios = criterios + `value.nombre ==""`

            let datafiltered = []

            parent.forEach(caso => {
                if (caso.clsPueblos.length != 0) {
                    let filtered = caso.clsPueblos.filter(value => eval(criterios));
                    if (filtered.length != 0) {
                        datafiltered.push(caso)
                    }
                }
            })
            makerTable(datafiltered)
        }

        const nofiltrar = document.getElementById("lifilterNullPueblo")
        nofiltrar.onclick = () => {
            pueblofilter = []
            makerTable(ActiveDB.clsCasos)
        }





    },
    hd_Tipos(parent) {


        let newData = []

        parent.forEach(caso => {
            caso.clsTipos.forEach(elemento => {
                if (newData.includes(elemento.nombre) == false) {
                    newData.push(elemento.nombre)
                }
            })
        })



        function porDato(a, b) {
            return a.localeCompare(b);
        }

        // Sort the array by name in ascending order
        let newDataOrdenado= newData.sort(porDato);

        newDataOrdenado.forEach(item => {
            const mncontenedor = document.getElementById("menuTipo")
            const elemento = document.createElement("div")
            elemento.className = "ms-3 me-3"
            elemento.style.fontWeight = "normal"
            elemento.innerHTML =
                `
                <input class="fst-normal" type="checkbox" value="${item}" id="check${item}tipo">
                 ${item}
            `
            mncontenedor.appendChild(elemento)

            const checkers = document.getElementById(`check${item}tipo`)
            checkers.onchange = () => {

                if (checkers.checked == true) {
                    tipofilter.push(checkers.value)
                } else {
                    const eliminados = tipofilter.filter(elemento => elemento != checkers.value);
                    tipofilter = eliminados
                }
            }
        })

        const filtrador = document.getElementById("lifilterTipo")
        filtrador.onclick = () => {
            //Creamos cadena de criterios
            let criterios = ""
            tipofilter.forEach(filtro => {
                criterios = criterios + `value.nombre == '${filtro}' || `
            })
            criterios = criterios + `value.nombre ==""`

            let datafiltered = []

            parent.forEach(caso => {
                if (caso.clsTipos.length != 0) {
                    let filtered = caso.clsTipos.filter(value => eval(criterios));
                    if (filtered.length != 0) {
                        datafiltered.push(caso)
                    }
                }
            })
            makerTable(datafiltered)
        }

        const nofiltrar = document.getElementById("lifilterNullTipo")
        nofiltrar.onclick = () => {
            tipofilter = []
            makerTable(ActiveDB.clsCasos)
        }





    },//Este es de tipo no anidado
    hd_Fecha(parent) {


        let newData = []

        parent.forEach(caso => {

            if (newData.includes(caso.fecha) == false) {
                newData.push(caso.fecha)
               
            }
        })



        function porDato(a, b) {
            return a.localeCompare(b);
        }

        // Sort the array by name in ascending order
        let newDataOrdenado= newData.sort(porDato);

        newDataOrdenado.forEach(item => {
            const mncontenedor = document.getElementById("menuFecha")
            const elemento = document.createElement("div")
            elemento.className = "ms-3 me-3"
            elemento.style.fontWeight = "normal"
            elemento.innerHTML =
                `
                <input class="fst-normal" type="checkbox" value="${item}" id="check${item}fecha">
                 ${item}
            `
            mncontenedor.appendChild(elemento)

            const checkers = document.getElementById(`check${item}fecha`)
            checkers.onchange = () => {

                if (checkers.checked == true) {
                    fechafilter.push(checkers.value)
                } else {
                    const eliminados = fechafilter.filter(elemento => elemento != checkers.value);
                    fechafilter = eliminados
                }
            }
        })

        const filtrador = document.getElementById("lifilterFecha")
        filtrador.onclick = () => {
            //Creamos cadena de criterios
            let criterios = ""
            fechafilter.forEach(filtro => {
                criterios = criterios + `value.fecha == '${filtro}' || `
            })
            criterios = criterios + `value.fecha ==""`


            let filtered = parent.filter(value => eval(criterios));
            makerTable(filtered)
        }

        const nofiltrar = document.getElementById("lifilterNullFecha")
        nofiltrar.onclick = () => {
            fechafilter = []
            makerTable(ActiveDB.clsCasos)
        }





    },
    hd_Macroactor(parent) {


        let newData = []

        parent.forEach(caso => {

            if (newData.includes(caso.macroactor) == false) {
                newData.push(caso.macroactor)
               
            }
        })



        function porDato(a, b) {
            return a.localeCompare(b);
        }

        // Sort the array by name in ascending order
        let newDataOrdenado= newData.sort(porDato);

        newDataOrdenado.forEach(item => {
            const mncontenedor = document.getElementById("menuMacroactor")
            const elemento = document.createElement("div")
            elemento.className = "ms-3 me-3"
            elemento.style.fontWeight = "normal"
            elemento.innerHTML =
                `
                <input class="fst-normal" type="checkbox" value="${item}" id="check${item}macroactor">
                 ${item}
            `
            mncontenedor.appendChild(elemento)

            const checkers = document.getElementById(`check${item}macroactor`)
            checkers.onchange = () => {

                if (checkers.checked == true) {
                    macroactorfilter.push(checkers.value)
                } else {
                    const eliminados = macroactorfilter.filter(elemento => elemento != checkers.value);
                    macroactorfilter = eliminados
                }
            }
        })

        const filtrador = document.getElementById("lifilterMacroactor")
        filtrador.onclick = () => {
            //Creamos cadena de criterios
            let criterios = ""
            macroactorfilter.forEach(filtro => {
                criterios = criterios + `value.macroactor == '${filtro}' || `
            })
            criterios = criterios + `value.macroactor ==""`

            let filtered = parent.filter(value => eval(criterios));
            makerTable(filtered)
        }

        const nofiltrar = document.getElementById("lifilterNullMacroactor")
        nofiltrar.onclick = () => {
            macroactorfilter = []
            makerTable(ActiveDB.clsCasos)
        }





    },
    hd_Actores(parent) {
        let newData = []
        parent.forEach(caso => {
            caso.clsActores.forEach(elemento => {
                if (newData.includes(elemento.nombre) == false) {
                    newData.push(elemento.nombre)
                }
            })
        })
        function porDato(a, b) {
            return a.localeCompare(b);
        }

        // Sort the array by name in ascending order
        let newDataOrdenado= newData.sort(porDato);

        newDataOrdenado.forEach(item => {
            const mncontenedor = document.getElementById("menuActores")
            const elemento = document.createElement("div")
            elemento.className = "ms-3 me-3"
            elemento.style.fontWeight = "normal"
            elemento.innerHTML =
                `
                <input class="fst-normal" type="checkbox" value="${item}" id="check${item}actores">
                 ${item}
            `
            mncontenedor.appendChild(elemento)

            const checkers = document.getElementById(`check${item}actores`)
            checkers.onchange = () => {

                if (checkers.checked == true) {
                    actoresfilter.push(checkers.value)
                } else {
                    const eliminados = actoresfilter.filter(elemento => elemento != checkers.value);
                    actoresfilter = eliminados
                }
            }
        })

        const filtrador = document.getElementById("lifilterActores")
        filtrador.onclick = () => {
            //Creamos cadena de criterios
            let criterios = ""
            actoresfilter.forEach(filtro => {
                criterios = criterios + `value.nombre == '${filtro}' || `
            })
            criterios = criterios + `value.nombre ==""`

            let datafiltered = []

            parent.forEach(caso => {
                if (caso.clsActores.length != 0) {
                    let filtered = caso.clsActores.filter(value => eval(criterios));
                    if (filtered.length != 0) {
                        datafiltered.push(caso)
                    }
                }
            })
            makerTable(datafiltered)
        }

        const nofiltrar = document.getElementById("lifilterNullActores")
        nofiltrar.onclick = () => {
            actoresfilter = []
            makerTable(ActiveDB.clsCasos)
        }





    }


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
