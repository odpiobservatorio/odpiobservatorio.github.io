const campos = [
    ["clsCasos", "macroregion", "MACROREGIÓN", true, false],
    ["clsCasos", "departamento", "DEPARTAMENTO", true, false],
    ["clsLugares", "municipio", "LUGARES", true, false],
    ["clsLugares", "lat", "LAT", false, true],
    ["clsLugares", "lng", "LNG", false, true],
    ["clsPueblos", "nombre", "PUEBLO/ÉTNIA", true, false],
    ["clsCasos", "macrotipo", "MACROTIPO", true], false,
    ["clsTipos", "nombre", "SUBTIPOS", true, false],
    ["clsCasos", "fecha", "FECHA", true, false],
    ["clsCasos", "vigencia", "AÑO", true, true],
    ["clsCasos", "macroactor", "MACROACTOR", true, false],
    ["clsActores", "nombre", "ACTORES", true, false],
    ["clsDesplazamiento", "tipo", "TIPO DESPLAZAMIENTO", true, false],
    ["clsPersonas", "nombres", "NOMBRES", true, false],
    ["clsPersonas", "genero", "GÉNERO", true, false],
    ["clsPersonas", "edad", "EDAD", true, true],
    ["clsCasos", "npersonas", "VICTIMAS", true, true],
    ["clsCasos", "nmujeres", "MUJERES", true, true],
    ["clsCasos", "nhombres", "HOMBRES", true, true],
    ["clsCasos", "nmenores", "MENORES DE EDAD", true, true],
    ["clsAccJuridica", "accion", "ACCIONES", true, false],
    ["clsCasos", "fuente", "FUENTE", true, false],
    ["clsCasos", "fechafuente", "FECHA FUENTE", true, false],
    ["clsCasos", "enlace", "ENLACE", false, false],
    ["clsCasos", "detalle", "DETALLE", false, false],
]
let filtro_tabla = {
    "clase": "",
    "campo": "",
    "valores": []
}
function run_tabla() {
    const contenedor = byE("panel_escritorio")
    contenedor.innerHTML = ""
    const formulario = newE("div", "formulario", "container")

    const row0 = newE("div", "row0", "row bg-secondary ms-2 align-items-center")
    contenedor.appendChild(row0)
    const col_vigencias = newE("div", "col1", "col-md-6")
    row0.appendChild(col_vigencias)

    //Creamos un selector de vigencias
    const titulo = newE("small", "titulo_vigencias", "fw-bold mb-2 text-white")
    titulo.textContent = "Vigencias"
    col_vigencias.appendChild(titulo)

    const selVigencias = newE("select", "selVigencias", "form-control mb-3")
    col_vigencias.appendChild(selVigencias)
    //Ahora agregamos las vigencias
    let last_vigencia; //Guarda el índice de la última vigencia en la lista
    let contador = 0
    split_Data.forEach(vigencia => {
        const item = newE("option", "option" + vigencia.id, "")
        item.value = contador
        item.textContent = vigencia.id
        selVigencias.appendChild(item)
        last_vigencia = contador
        contador++
    })
    //Automatiza al iniciar el módulo, colocando en el primer registro de la vigencia y últiam vigencia
    selVigencias.value = last_vigencia //Este dato es numérico de la última vigencia
    for (id in split_Data[last_vigencia].clsCasos) {
        split_Data[last_vigencia].clsCasos[id].id = parseInt(id)
    }
    _make_tabla(split_Data[selVigencias.value])
    selVigencias.onchange = () => {
        for (id in split_Data[selVigencias.value].clsCasos) {
            split_Data[selVigencias.value].clsCasos[id].id = parseInt(id)
        }
        _make_tabla(split_Data[selVigencias.value])

    }
    /////////////CONTENEDOR MENUS Y BOTONES///////////////
    const row1 = newE("div", "row1", "row bg-secondary ms-2 align-items-center")
    contenedor.appendChild(row1)
    const col_Campos = newE("div", "col_Campos", "col-md-3")
    row1.appendChild(col_Campos)

    //Boton y control para visibilidad de columnas en la tabla
    const divCampos = newE("div", "divCampos", "dropdown mb-2")
    col_Campos.appendChild(divCampos)

    const btnCampos = newE("button", "btnCampos", "btn btn-secondary dropdown-toggle")
    btnCampos.type = "button"
    btnCampos.setAttribute("data-bs-toggle", "dropdown");
    btnCampos.textContent = "CAMPOS"
    divCampos.appendChild(btnCampos)

    const ulCampos = newE("ul", "ulCampos", "dropdown-menu p-2 shadow")
    ulCampos.style.width = "200px"
    divCampos.appendChild(ulCampos)

    ulCampos.onclick = (e) => {
        e.stopPropagation();
    }

    const crVer_todos = newE("div", "crVer_todos", "item-menu")
    crVer_todos.textContent = "Ver todos"
    crVer_todos.style.fontSize = "10pt"
    ulCampos.appendChild(crVer_todos)


    const crOcultar_todos = newE("div", "crOcultar_todos", "item-menu mb-2")
    crOcultar_todos.textContent = "Ocultar todos"
    crOcultar_todos.style.fontSize = "10pt"
    ulCampos.appendChild(crOcultar_todos)


    const ulLista_Campos = newE("ul", "ulLista_Campos", "list-group menu-group-scroll")
    ulCampos.appendChild(ulLista_Campos)


    for (i in campos) {
        const li = newE("li", "li" + i, "list-group-item")
        li.style.fontSize = "9pt"
        //li.textContent=campos[i][2]
        //ulLista_Campos.appendChild(li)

        const check = newE("div", "fc" + i, "form-check")
        check.style.fontSize = "9pt"
        ulLista_Campos.appendChild(check)

        const inCampo = newE("input", "inCampo" + i, "form-check-input")
        inCampo.type = "checkbox"
        inCampo.checked = campos[i][3]
        check.appendChild(inCampo)

        const ind_campo = i
        inCampo.onchange = () => {
            campos[ind_campo][3] = inCampo.checked
            _make_tabla(split_Data[selVigencias.value])
        }

        const label_campo = newE("label", "label_campo" + i, "form-check-label")
        label_campo.for = "inCampo" + i
        label_campo.textContent = campos[i][2]
        check.appendChild(label_campo)


    }

    crOcultar_todos.onclick = () => {
        for (i in campos) {
            campos[i][3] = false
            byE("inCampo" + i).checked = false
        }
        _make_tabla(split_Data[selVigencias.value])
    }

    crVer_todos.onclick = () => {
        for (i in campos) {
            campos[i][3] = true
            byE("inCampo" + i).checked = true
        }
        _make_tabla(split_Data[selVigencias.value])
    }
    //======================================================================================


    contenedor.appendChild(formulario)
    function _make_tabla(vigencia) {
        formulario.innerHTML = ""
        const data_tabla = newE("table", "data_tabla", "table table-hover mt-2")
        //data_tabla.style.width = "2000px"
        formulario.appendChild(data_tabla)

        const data_Encabezados = newE("thead", "data_Encabezados", "m-3")
        data_tabla.appendChild(data_Encabezados)

        //Crear los encabezados dinámicamente
        const fila_Encabezado = newE("tr", "fila_Encabezado", "mb-2 bg-secondary")
        data_Encabezados.appendChild(fila_Encabezado)

        const thscope_col = newE("th", "thscope_col", "td-fitwidth-scope bg-secondary")
        thscope_col.scope = "col"
        thscope_col.textContent = "#"
        fila_Encabezado.appendChild(thscope_col)

        campos.forEach(campo => {
            if (campo[3] == true) {
                const th = newE("th", "th" + campo[2], "tabla-cell td-fitwidth")

                const divHColumna = newE("div", "", "dropdown")
                th.appendChild(divHColumna)

                const btnHColumna = newE("button", "btnCampos", "btn btn-secondary dropdown-toggle fw-bold")
                btnHColumna.type = "button"
                btnHColumna.style.fontSize = "9pt"
                btnHColumna.setAttribute("data-bs-toggle", "dropdown");
                btnHColumna.textContent = campo[2]
                divHColumna.appendChild(btnHColumna)
                fila_Encabezado.appendChild(th)
                divHColumna.appendChild(_make_filter_head(campo[0], campo[1], campo[4]))
            }
        }
        )
        //Crear cuerpo de la tabla
        const data_tbody = newE("tbody", "data_tbody", "mt-2")
        data_tabla.appendChild(data_tbody)
        let nCaso = 0 //Inicia un contador por cada caso
        vigencia.clsCasos.forEach(caso => { //Mira cada caso de la vigencia
            const tr = newE("tr", "tr" + caso.id, "") //Por cada caso crea una fila y la agrega a la tabla
            data_tbody.appendChild(tr)

            const th = newE("th", "", "td-fitwidth-scope") //Aquí está el numerador indice por caso
            th.scope = "row"
            th.textContent = caso.id + 1
            th.onmouseover = () => {
                //mensajes_tool("Abrir registro", "black")
            }
            tr.appendChild(th)

            let nCol = 0 //Inicia el contador según la columna o campo 
            campos.forEach(data_columna => { //Busca en la tabla de los campos
                if (data_columna[3] == true) { //Si el campo está visible true crear la columna
                    const td = newE("td", "", "tabla-cell td-fitwidth")
                    if (data_columna[0] == "clsCasos") { //Si la columna está en clsCasos idnicar el campo
                        td.textContent = caso[data_columna[1]]
                    } else { //Si no entonces colocar el caso y la subcategoria
                        const into_data = caso[data_columna[0]]
                        if (into_data.length > 1) { //Si la subcategoria tiene más de 1 resgistro, crear lista
                            const btn_columna = newE("div", "", "btn-cell tabla-cell") //Creamos un control que se sexpande
                            btn_columna.setAttribute("data-bs-toggle", "collapse");
                            btn_columna.setAttribute("data-bs-target", `#collapse${nCaso}${nCol}`);
                            btn_columna.textContent = `Ver ${into_data.length}`

                            const collapse_Celda = newE("div", "", "collapse p-2")
                            collapse_Celda.id = `collapse${nCaso}${nCol}`

                            into_data.forEach(subClase => { //Por cada registro agregamos un dato
                                const div_columna = newE("div", "", "")
                                div_columna.textContent = subClase[data_columna[1]]
                                //console.log(subClase[data_columna[1]])
                                collapse_Celda.appendChild(div_columna)
                            })
                            td.appendChild(btn_columna)
                            td.appendChild(collapse_Celda)

                        } else if (into_data.length == 1) {//Si no entonces solo mostrar un dato
                            td.textContent = into_data[0][data_columna[1]]
                        }

                    }
                    tr.appendChild(td)
                    nCol++
                }

            })
            nCaso++
        })


        function _make_filter_head(clase, campo, numeric) {
            const ulFiler_Head = newE("ul", "", "dropdown-menu p-2 shadow")
            ulFiler_Head.style.width = "200px"
            ulFiler_Head.onclick = (e) => {
                e.stopPropagation();
            }

            //Colocamos una opciòn de ver todos los registros de la lista
            const crl_ClearFiltro = newE("div", "", "item-menu")
            crl_ClearFiltro.textContent = "Ver todos"
            crl_ClearFiltro.style.fontSize = "10pt"
            ulFiler_Head.appendChild(crl_ClearFiltro)

            const crl_AplyFiltro = newE("div", "", "item-menu")
            crl_AplyFiltro.textContent = "Filtrar"
            crl_AplyFiltro.style.fontSize = "10pt"
            ulFiler_Head.appendChild(crl_AplyFiltro)
            crl_AplyFiltro.onclick = () => {
                _filter_tabla()
            }



            //Filtra que elementos se ven en la lista

            const int_Filtro_listas = newE("input", campo + clase, "form-control")
            int_Filtro_listas.type = "text"
            int_Filtro_listas.style.fontSize = "10pt"
            ulFiler_Head.appendChild(int_Filtro_listas)


            const ulLista_datos = newE("ul", "", "list-group menu-group-scroll mt-2")
            ulFiler_Head.appendChild(ulLista_datos)

            //Limpiamso algún tipo de filtro actual
            crl_ClearFiltro.onclick = () => {
                //_make_listados(clase, campo, "",numeric)
                filtro_tabla.valores = []
                filtro_tabla.campo = ""
                filtro_tabla.clase = ""
                _make_tabla(split_Data[selVigencias.value])

            }
            _make_listados(clase, campo, "", numeric)

            int_Filtro_listas.oninput = () => {
                _make_listados(clase, campo, int_Filtro_listas.value, numeric)
            }


            function _make_listados(claseA, campoA, filtroA, numero) {
                ulLista_datos.innerHTML = ""
                //Determina si el elemento pertencese o no a una clase superior de lso datos
                if (claseA == "clsCasos") {
                    //Creamos un alisata de "ùnicos" que se mostrará en el menú
                    let listasTemp = []
                    let listas = []
                    vigencia.clsCasos.forEach(caso => {
                        if (listasTemp.includes(caso[campoA]) != true) {
                            listasTemp.push(caso[campoA])
                        }
                    })
                    let i = 0

                    //Mira si el listado a mostrar está filtrado
                    if (filtroA !== "") {
                        if (numero == true) {
                            const filtered = listasTemp.filter(ele => ele == (filtroA))
                            listas = filtered
                        } else {
                            const filtered = listasTemp.filter(ele => ele.includes(filtroA))
                            listas = filtered
                        }

                    } else {
                        listas = listasTemp
                    }

                    //Tomamso al lista de únicos y los mostramso en formato de check
                    listas.forEach(ele => {
                        const checkE = newE("div", "fcE" + i, "form-check")
                        checkE.style.fontSize = "9pt"
                        ulLista_datos.appendChild(checkE)

                        const inCampoE = newE("input", "inCampoE" + i, "form-check-input")
                        inCampoE.type = "checkbox"
                        inCampoE.checked = false
                        inCampoE.value = ele
                        checkE.appendChild(inCampoE)

                        inCampoE.onchange = () => {
                            if (inCampoE.checked == true) {
                                filtro_tabla.valores.push(inCampoE.value)
                                filtro_tabla.campo = campo
                                filtro_tabla.clase = clase
                            } else {
                                const filtered = filtro_tabla.valores.filter(ele => ele !== inCampoE.value)
                                filtro_tabla.valores = filtered
                                filtro_tabla.campo = campo
                                filtro_tabla.clase = clase
                            }
                        }
                        const label_campoE = newE("label", "label_campoE" + i, "form-check-label fw-normal")
                        label_campoE.for = "inCampoE" + i
                        label_campoE.textContent = ele
                        checkE.appendChild(label_campoE)
                        i++
                    })
                } else {
                    let listasTemp = []
                    let listas = []
                    vigencia.clsCasos.forEach(caso => {
                        caso[claseA].forEach(sub => {
                            if (listasTemp.includes(sub[campoA]) != true) {
                                listasTemp.push(sub[campoA])
                            }
                        })
                    })
                    //Mira si el listado a mostrar está filtrado
                    if (filtroA !== "") {
                        if (numero == true) {
                            const filtered = listasTemp.filter(ele => ele == (filtroA))
                            listas = filtered
                        } else {
                            const filtered = listasTemp.filter(ele => ele.includes(filtroA))
                            listas = filtered
                        }

                    } else {
                        listas = listasTemp
                    }
                    let i = 0
                    listas.forEach(ele => {
                        const checkE = newE("div", "fcE" + i, "form-check")
                        checkE.style.fontSize = "9pt"
                        ulLista_datos.appendChild(checkE)

                        const inCampoE = newE("input", "inCampoE" + i, "form-check-input")
                        inCampoE.type = "checkbox"
                        inCampoE.checked = false
                        inCampoE.value = ele
                        checkE.appendChild(inCampoE)

                        inCampoE.onchange = () => {
                            if (inCampoE.checked == true) {
                                filtro_tabla.valores.push(inCampoE.value)
                                filtro_tabla.campo = campo
                                filtro_tabla.clase = clase
                            } else {
                                const filtered = filtro_tabla.valores.filter(ele => ele !== inCampoE.value)
                                filtro_tabla.valores = filtered
                                filtro_tabla.campo = campo
                                filtro_tabla.clase = clase
                            }
                        }
                        const label_campoE = newE("label", "label_campoE" + i, "form-check-label fw-normal")
                        label_campoE.for = "inCampoE" + i
                        label_campoE.textContent = ele
                        checkE.appendChild(label_campoE)
                        i++
                    })
                }
            }



            //console.log(vigencia.clsCasos)



            return ulFiler_Head
        }
    }
    function _filter_tabla() {
        const data_ini = split_Data[selVigencias.value]
        //Creamos las cadenas para el filtro
        let cadena = ""
        filtro_tabla.valores.forEach(item => {
            cadena = cadena + `ele['${filtro_tabla.campo}']=='${item}' || `
        })
        const Criterio_clear = cadena.slice(0, -4)
        if (filtro_tabla.clase == "clsCasos") {
            const filtered = data_ini.clsCasos.filter(ele => eval(Criterio_clear))
            let data_fin={
                "clsCasos":filtered
            };
            _make_tabla(data_fin)
        } else {
            let data_fin={
                "clsCasos":[]
            };
            data_ini.clsCasos.forEach(caso=>{
                const filtered = caso[filtro_tabla.clase].filter(ele => eval(Criterio_clear))
                if (filtered.length>0){
                    data_fin.clsCasos.push(caso)
                }

            })
            _make_tabla(data_fin)
        }


    }
}