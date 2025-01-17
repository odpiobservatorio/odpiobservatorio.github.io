const campos = [
    ["clsCasos", "macroregion", "MACROREGIÓN", true],
    ["clsCasos", "departamento", "DEPARTAMENTO", true],
    ["clsLugares", "municipio", "LUGARES", true],
    ["clsLugares", "lat", "LAT", false],
    ["clsLugares", "lng", "LNG", false],
    ["clsPueblos", "nombre", "PUEBLO/ÉTNIA", true],
    ["clsCasos", "macrotipo", "MACROTIPO", true],
    ["clsTipos", "nombre", "SUBTIPOS", true],
    ["clsCasos", "fecha", "FECHA", true],
    ["clsCasos", "vigencia", "AÑO", true],
    ["clsCasos", "macroactor", "MACROACTOR", true],
    ["clsActores", "nombre", "ACTORES", true],
    ["clsDesplazamiento", "tipo", "TIPO DESPLAZAMIENTO", true],
    ["clsPersonas", "nombres", "NOMBRES", true],
    ["clsPersonas", "genero", "GÉNERO", true],
    ["clsPersonas", "edad", "EDAD", true],
    ["clsCasos", "npersonas", "VICTIMAS", true],
    ["clsCasos", "nmujeres", "MUJERES", true],
    ["clsCasos", "nhombres", "HOMBRES", true],
    ["clsCasos", "nmenores", "MENORES DE EDAD", true],
    ["clsAccJuridica", "accion", "ACCIONES", true],
    ["clsCasos", "fuente", "FUENTE", true],
    ["clsCasos", "fechafuente", "FECHA FUENTE", true],
    ["clsCasos", "enlace", "ENLACE", false],
    ["clsCasos", "detalle", "DETALLE", false],
]
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
                divHColumna.appendChild(_make_filter_head(campo[0], campo[1]))
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

        function _make_filter_head(clase, campo) {
            const ulFiler_Head = newE("ul", "", "dropdown-menu p-2 shadow")
            ulFiler_Head.style.width = "200px"
            ulFiler_Head.onclick = (e) => {
                e.stopPropagation();
            }

            const crl_ClearFiltro = newE("div", "", "item-menu")
            crl_ClearFiltro.textContent = "Ver todos"
            crl_ClearFiltro.style.fontSize = "10pt"
            ulFiler_Head.appendChild(crl_ClearFiltro)

            const int_Filtro_listas = newE("input", "", "form-control")
            int_Filtro_listas.type = "text"
            int_Filtro_listas.style.fontSize = "10pt"
            ulFiler_Head.appendChild(int_Filtro_listas)


            const ulLista_datos = newE("ul", "", "list-group menu-group-scroll")
            ulFiler_Head.appendChild(ulLista_datos)


            if (clase == "clsCasos") {
                let listas = []
                vigencia.clsCasos.forEach(caso => {
                    if (listas.includes(caso[campo]) != true) {
                        listas.push(caso[campo])
                    }
                })
                listas.forEach(ele => {
                    const item = newE("div", "", "item-menu fw-normal")
                    item.textContent = ele
                    item.style.fontSize = "10pt"
                    ulLista_datos.appendChild(item)
                })

            } else {
                let listas = []
                vigencia.clsCasos.forEach(caso => {
                    caso[clase].forEach(sub => {
                        if(listas.includes(sub[campo])!=true){
                            listas.push(sub[campo])
                        }
                    })
                })
                listas.forEach(ele => {
                    const item = newE("div", "", "item-menu fw-normal")
                    item.textContent = ele
                    item.style.fontSize = "10pt"
                    ulLista_datos.appendChild(item)
                })
            }


            //console.log(vigencia.clsCasos)



            return ulFiler_Head
        }
    }
}