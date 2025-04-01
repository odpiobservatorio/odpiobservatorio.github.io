let join_Data = [];
let split_Data;
let filtrado = false
let data_filtrado = []

function openIni() {
    //Muestra los menus de cada módulo y oculta el de registro
    byE("menu_general").hidden = false
    byE("btnRegistrarse").hidden = true
    //alert("ingresamos")

    const temp_vigencias = GLOBAL.state.vigencias
    temp_vigencias.forEach(vigencia => {

        vigencia.clsCasos.forEach(caso => {
            join_Data.push({
                "clsCasos": caso
            })
        })
    })
    split_Data = GLOBAL.state.vigencias
    load_info_public()
}
function run_casos(ind_vigencia=-1, ind_registro=-1) {
    const contenedor = byE("panel_escritorio")
    contenedor.innerHTML = ""

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

    if (ind_vigencia!==-1){
        last_vigencia=ind_vigencia
    }

    //Este es el contador de registros visual
    const col_pos_registros = newE("div", "col_pos_registros", "col-md-6 text-white fs-5 pb-2")
    col_pos_registros.textContent = "Sin registros"
    row0.appendChild(col_pos_registros)


    //Crear la barra de botones del módulo
    const row_botones = newE("div", "row0", "row bg-secondary ms-2 align-items-center pb-2 sticky-top")
    contenedor.appendChild(row_botones)
    const bar_botones = newE("div", "barra_botones", "btn-group", "300px")
    bar_botones.role = "group"
    row_botones.appendChild(bar_botones)

    const btn_Inicio = newE("div", "btn_Inicio", "btn btn-secondary")
    btn_Inicio.type = "button"
    bar_botones.appendChild(btn_Inicio)

    const i_Inicio = newE("i", "i_Inicio", "bi bi-skip-start fs-5")
    btn_Inicio.appendChild(i_Inicio)

    const btn_Previo = newE("div", "btn_Previo", "btn btn-secondary")
    btn_Previo.type = "button"
    bar_botones.appendChild(btn_Previo)

    const i_Previo = newE("i", "i_Previo", "bi bi-skip-backward fs-5")
    btn_Previo.appendChild(i_Previo)

    const btn_Siguiente = newE("div", "btn_Siguiente", "btn btn-secondary")
    btn_Siguiente.type = "button"
    bar_botones.appendChild(btn_Siguiente)

    const i_Siguiente = newE("i", "i_Siguiente", "bi bi-skip-forward fs-5")
    btn_Siguiente.appendChild(i_Siguiente)

    const btn_Ultimo = newE("div", "btn_Ultimo", "btn btn-secondary")
    btn_Ultimo.type = "button"
    bar_botones.appendChild(btn_Ultimo)

    const i_Ultimo = newE("i", "i_Ultimo", "bi bi-skip-end fs-5")
    btn_Ultimo.appendChild(i_Ultimo)

    const btn_Nuevo = newE("div", "btn_Nuevo", "ms-2 btn btn-secondary")
    btn_Nuevo.type = "button"
    bar_botones.appendChild(btn_Nuevo)

    const i_Nuevo = newE("i", "i_Nuevo", "bi bi-file-earmark-plus fs-5")
    btn_Nuevo.appendChild(i_Nuevo)

    const btn_Eliminar = newE("div", "btn_Eliminar", "btn btn-secondary")
    btn_Eliminar.type = "button"
    bar_botones.appendChild(btn_Eliminar)

    const i_Eliminar = newE("i", "i_Eliminar", "bi bi-trash3-fill fs-5")
    btn_Eliminar.appendChild(i_Eliminar)

    //Aquì el botòn que administra los filtros
    const divbtnFiltrar = newE("div", "divbtnFiltrar", "dropdown")
    bar_botones.appendChild(divbtnFiltrar)

    const btnFiltrar = newE("button", "btnFiltrar", "btn btn-secondary dropdown-toggle")
    btnFiltrar.type = "button"
    btnFiltrar.setAttribute("data-bs-toggle", "dropdown");
    btnFiltrar.textContent = "Filtrar"
    divbtnFiltrar.appendChild(btnFiltrar)

    const ulFiltrar = newE("ul", "ulFiltrar", "dropdown-menu p-2")
    ulFiltrar.style.width="300px"
    divbtnFiltrar.appendChild(ulFiltrar)

    const sm_clase = newE("small", "sm_clase", "fw-bold")
    sm_clase.textContent = "Campo"
    ulFiltrar.appendChild(sm_clase)

    const sel_clase = newE("select", "sel_clase", "form-control")
    ulFiltrar.appendChild(sel_clase)
    //Cargamos las listas de clases en este selector
    list_clases.forEach(ele => {
        const item = newE("option", ele.label, "")
        item.textContent = ele.label
        item.value = ele.clase
        sel_clase.appendChild(item)
    })


    const sm_operador = newE("small", "sm_operador", "fw-bold")
    sm_operador.textContent = "Operador"
    ulFiltrar.appendChild(sm_operador)

    const sel_operador = newE("select", "sel_operador", "form-control")
    ulFiltrar.appendChild(sel_operador)

    list_opearadores.forEach(ele => {
        const item = newE("option", ele.label, "")
        item.textContent = ele.label
        item.value = ele.operador
        sel_operador.appendChild(item)
    })

    const sm_valor = newE("small", "sm_valor", "fw-bold")
    sm_valor.textContent = "Valor"
    ulFiltrar.appendChild(sm_valor)

    const int_valor = newE("input", "int_valor", "form-control")
    int_valor.type = "text"
    ulFiltrar.appendChild(int_valor)

    const btnBuscar = newE("button", "btnBuscar", "btn btn-secondary m-1")
    btnBuscar.type = "button"
    btnBuscar.textContent = "Filtrar"
    ulFiltrar.appendChild(btnBuscar)
    ////////////////////////////////////////////////////
    //Boton para eliminar filtro
    const btn_Eliminar_filtro = newE("div", "btn_Eliminar_filtro", "btn btn-secondary")
    btn_Eliminar_filtro.style.visibility = "hidden"
    btn_Eliminar.type = "button"
    bar_botones.appendChild(btn_Eliminar_filtro)

    const i_Eliminar_filtro = newE("i", "i_Eliminar_filtro", "bi bi-eraser-fill fs-5")
    btn_Eliminar_filtro.appendChild(i_Eliminar_filtro)



    //======================================================================================


    //Crear un contenedor para todos los controles de entrada por registro
    const formulario = newE("div", "formulario", "container")
    contenedor.appendChild(formulario)

    //Automatiza al iniciar el módulo, colocando en el primer registro de la vigencia y últiam vigencia
    selVigencias.value = last_vigencia //Este dato es numérico de la última vigencia

    
    for (id in split_Data[last_vigencia].clsCasos) {
        split_Data[last_vigencia].clsCasos[id].id = parseInt(id)
    }
    if (split_Data[last_vigencia].clsCasos.length !== 0) {
        //Numeramos los registros de esta vigencia
        //Llama a la función que crea todo el registro
        //--------------De la base de datos FB toma según el indx + numero último número
        if(ind_registro!==-1){
            _make_registros(split_Data[last_vigencia], ind_registro, last_vigencia)
            _contador_registros(split_Data[last_vigencia], ind_registro)
        }else{
            _make_registros(split_Data[last_vigencia], 0, last_vigencia)
            _contador_registros(split_Data[last_vigencia], 0)
        }

    } else {
        mensajes("No hay registros en esta vigencia", "orange")
        let newVig = split_Data[last_vigencia].id
        //formulario.innerHTML = ""
        template_new_vig.vigencia = newVig
        template_new_vig.fecha = "0000-1-1"
        split_Data[last_vigencia].clsCasos = template_new_vig
        split_Data[last_vigencia].id = newVig
        _make_registros(split_Data[last_vigencia], 0, last_vigencia)
        _contador_registros(split_Data[last_vigencia], 0)
    }



    //Acciones cuando se cambie la vigencias del selector
    selVigencias.onchange = () => {
        for (id in split_Data[selVigencias.value].clsCasos) {
            split_Data[selVigencias.value].clsCasos[id].id = parseInt(id)
        }
        //Llama a la función que crea todo el registro
        _make_registros(split_Data[selVigencias.value], 0, selVigencias.value)
        _contador_registros(split_Data[selVigencias.value], 0)
    }



    function _mover_aRegistro(criterio, vigencia, index) {

        //Verifica los movimientos de cada registro y su posición
        if (criterio == "ultimo") {
            const ind = vigencia.clsCasos.length
            _make_registros(vigencia, ind - 1)
            _contador_registros(vigencia, ind - 1)
        } else if (criterio == "primero") {
            _make_registros(vigencia, 0)
            _contador_registros(vigencia, 0)
        }
        else if (criterio == "siguiente") {
            const ind = vigencia.clsCasos.length

            if (index >= (ind - 1)) {
                _make_registros(vigencia, ind - 1)
                _contador_registros(vigencia, ind - 1)
                alert("Último registro")
            } else {
                _make_registros(vigencia, index + 1)
                _contador_registros(vigencia, index + 1)
            }
        }
        else if (criterio == "anterior") {
            if (index <= 0) {
                _make_registros(vigencia, 0)
                _contador_registros(vigencia, 0)
                alert("Primer registro")
            } else {
                _make_registros(vigencia, index - 1)
                _contador_registros(vigencia, index - 1)
            }
        }

    }


    function _make_registros(vigencia, index, data_activo) {
        //Configuramos los botones para que apliquen movimiento
        const b_Inicio = byE("btn_Inicio")
        b_Inicio.onclick = () => {
            _mover_aRegistro("primero", vigencia, index)
        }

        const b_Previo = byE("btn_Previo")
        b_Previo.onclick = () => {
            _mover_aRegistro("anterior", vigencia, index)
        }

        const b_Siguiente = byE("btn_Siguiente")
        b_Siguiente.onclick = () => {
            _mover_aRegistro("siguiente", vigencia, index)
        }

        const b_Ultimo = byE("btn_Ultimo")
        b_Ultimo.onclick = () => {
            _mover_aRegistro("ultimo", vigencia, index)
        }

        const btn_Nuevo = byE("btn_Nuevo")
        btn_Nuevo.onclick = () => {
            crear_registro(vigencia, vigencia.clsCasos[index].vigencia)
            _mover_aRegistro("ultimo", vigencia, index)

        }

        const btn_Eliminar = byE("btn_Eliminar")
        btn_Eliminar.onclick = () => {
            modal.modalDelete(
                () => {
                    eliminar_registro(vigencia, index)
                }
            )
        }

        const btnBuscar = byE("btnBuscar")

        btnBuscar.onclick = () => {
            btn_Eliminar_filtro.style.visibility = "visible"
            //Seleccionamos la condición de la clase
            const ver_clase = sel_clase.value.split(",")

            if (ver_clase[0] == "clsCasos") {//En este caso SI es la clase Casos
                //Verificamos si es una búsqueda tipo texto o numérico
                const ver_operador = sel_operador.value.split(",")
                //alert(ver_operador[1])
                if (ver_operador[1] == "string") {
                    const criterioA = ver_operador[0].replace("VALOR", `'${int_valor.value}'`)
                    const criterioB = `ele=>ele['${ver_clase[1]}']${criterioA}`
                    const filtered = vigencia.clsCasos.filter(eval(criterioB))
                    const newData = {
                        'clsCasos': filtered
                    }
                    _make_registros_filter(vigencia, newData, 0, selVigencias.value)
                    _contador_registros(newData, 0)
                    data_filtrado = newData
                    filtrado = true
                } else {
                    const criterioA = ver_operador[0].replace("VALOR", `${parseInt(int_valor.value)}`)
                    const criterioB = `ele=>ele['${ver_clase[1]}']${criterioA}`
                    const filtered = vigencia.clsCasos.filter(eval(criterioB))
                    const newData = {
                        'clsCasos': filtered
                    }
                    _make_registros_filter(vigencia, newData, 0, selVigencias.value)
                    _contador_registros(newData, 0)
                    data_filtrado = newData
                    filtrado = true
                }
            } else {//En este caso NO es la clase Casos
                let Data_filter=[];
                const ver_operador = sel_operador.value.split(",")
                if (ver_operador[1] == "string") {
                    vigencia.clsCasos.forEach(caso => {
                    const criterioA = ver_operador[0].replace("VALOR", `'${int_valor.value}'`)
                    const criterioB = `ele=>ele['${ver_clase[1]}']${criterioA}`
                        const filtered = caso[ver_clase[0]].filter(eval(criterioB))
                        if(filtered.length!=0){  
                            Data_filter.push(caso)
                        }
                    })
                    const newData = {
                        'clsCasos': Data_filter
                    }

                    _make_registros_filter(vigencia, newData, 0, selVigencias.value)
                    _contador_registros(newData, 0)
                    data_filtrado = newData
                    filtrado = true

                } else {
                    vigencia.clsCasos.forEach(caso => {
                        const criterioA = ver_operador[0].replace("VALOR", `${parseInt(int_valor.value)}`)
                        const criterioB = `ele=>ele['${ver_clase[1]}']${criterioA}`
                            const filtered = caso[ver_clase[0]].filter(eval(criterioB))
                            if(filtered.length!=0){  
                                Data_filter.push(caso)
                            }
                        })
                        const newData = {
                            'clsCasos': Data_filter
                        }
                        _make_registros_filter(vigencia, newData, 0, selVigencias.value)
                        _contador_registros(newData, 0)
                        data_filtrado = newData
                        filtrado = true
                }
            }



        }


        //Creamos el entorno de entradas para el registro
        formulario.innerHTML = ""

        const row1 = newE("div", "row1", "row")
        formulario.appendChild(row1)
        const col1 = newE("div", "col1", "col-md-6")
        row1.appendChild(col1)

        const titulo1 = newE("small", "titulo_fecha", "fw-bold mb-2")
        titulo1.textContent = "Fecha del evento"
        col1.appendChild(titulo1)

        const fecha_evento = newE("input", "fecha_evento", "form-control mb-3")
        fecha_evento.type = "date"

        fecha_evento.value = vigencia.clsCasos[index].fecha
        col1.appendChild(fecha_evento)
        fecha_evento.onchange = () => {
            vigencia.clsCasos[index].fecha = fecha_evento.value
            GuardarDatos(data_activo, vigencia)
        }

        const col2 = newE("div", "col2", "col-md-6")
        row1.appendChild(col2)

        const titulo2 = newE("small", "titulo_fecha", "fw-bold mb-2")
        titulo2.textContent = "Macrotipo"
        col2.appendChild(titulo2)

        const selMacrotipo = newE("select", "selMacrotipo", "form-control mb-3")
        col2.appendChild(selMacrotipo)
        //Cargamos la lista de los macrotipos
        macrotipos.forEach(tipo => {
            const item = newE("option", "tipo", "")
            item.value = tipo
            item.textContent = tipo
            selMacrotipo.appendChild(item)
        })
        selMacrotipo.value = vigencia.clsCasos[index].macrotipo
        selMacrotipo.onchange = () => {
            vigencia.clsCasos[index].macrotipo = selMacrotipo.value
            GuardarDatos(data_activo, vigencia)
        }

        //Creamos el detalle del evento
        const titulo3 = newE("small", "titulo_detalle", "fw-bold mb-2")
        titulo3.textContent = "Descripción del caso"
        formulario.appendChild(titulo3)

        const in_detalle = newE("textarea", "in_detalle", "form-control")
        in_detalle.value = vigencia.clsCasos[index].detalle
        in_detalle.rows = 4
        formulario.appendChild(in_detalle)
        in_detalle.onchange = () => {
            vigencia.clsCasos[index].detalle = in_detalle.value
            GuardarDatos(data_activo, vigencia)
        }

        //Creamos la lista de subtipos
        const titulo4 = newE("label", "titulo_subtipos", "fw-bold mt-2 text-secondary fs-5")
        titulo4.textContent = "Afectaciones adicionales"
        formulario.appendChild(titulo4)

        const hr1 = newE("hr", "hr1", "border border-2 border-secondary")
        formulario.appendChild(hr1)

        const titulo5 = newE("small", "", "fw-bold mb-2")
        titulo5.textContent = "Otras afectaciones"
        formulario.appendChild(titulo5)

        const selTipo = newE("select", "seltipo", "form-control mb-3", "300px")
        formulario.appendChild(selTipo)
        //Cargamos la lista de los macrotipos
        tipos.forEach(tipo => {
            const item = newE("option", "tipo", "")
            item.value = tipo
            item.textContent = tipo
            selTipo.appendChild(item)
        })

        //Aquí se listaran los tipos dentro del registro
        const cont_tipos = newE("div", "cont_tipos", "mb-3 border border-1 d-flex")
        //cont_tipos.style.height = "100px"
        formulario.appendChild(cont_tipos)

        _carga_tipos()

        function _carga_tipos() {
            cont_tipos.innerHTML = ""
            const sub_tipos = vigencia.clsCasos[index].clsTipos

            for (id in sub_tipos) {
                sub_tipos[id].id = id
                const el_tipo = newE("div", sub_tipos[id].nombre, "btn-label-gray")
                const i_boton = newE("i", "i_boton", "bi bi-trash3 ms-3")

                i_boton.style.cursor = "pointer"
                el_tipo.textContent = sub_tipos[id].nombre
                el_tipo.appendChild(i_boton)
                cont_tipos.appendChild(el_tipo)

                let criterio = sub_tipos[id].nombre
                i_boton.onclick = () => {
                    delete_item("clsTipos", "nombre", criterio)
                    _carga_tipos()
                    GuardarDatos(data_activo, vigencia)
                }
            }


        }

        selTipo.onchange = () => {
            const sub_tipos = vigencia.clsCasos[index].clsTipos
            sub_tipos.push(
                {
                    "id": 0,
                    "nombre": selTipo.value
                }
            )
            _carga_tipos()
            GuardarDatos(data_activo, vigencia)
        }

        //======================================================================================
        //============CREACIÓN DE SECCIÓN INFORMACIÓN TERRITORIAL
        const titulo6 = newE("label", "titulo_lugares", "fw-bold mt-2 text-secondary fs-5")
        titulo6.textContent = "Información territorial"
        formulario.appendChild(titulo6)

        const hr2 = newE("hr", "hr1", "border border-2 border-secondary")
        formulario.appendChild(hr2)

        const row2 = newE("div", "row2", "row")
        formulario.appendChild(row2)

        const col1_2 = newE("div", "col1_2", "col-md-3")
        row2.appendChild(col1_2)

        const titulo7 = newE("small", "titulo_dep", "fw-bold mb-2")
        titulo7.textContent = "Departamento"
        col1_2.appendChild(titulo7)


        const col2_2 = newE("div", "col2_2", "col-md-3")
        row2.appendChild(col2_2)

        const titulo8 = newE("small", "titulo_macro", "fw-bold mb-2")
        titulo8.textContent = "Macroregión"
        col2_2.appendChild(titulo8)

        const intMacro = newE("input", "intMacro", "form-control")
        intMacro.type = "text"
        intMacro.readOnly = true
        intMacro.value = vigencia.clsCasos[index].macroregion
        col2_2.appendChild(intMacro)

        const col3_2 = newE("div", "col3_2", "col-md-3")
        row2.appendChild(col3_2)

        const titulo9 = newE("small", "titulo_mun", "fw-bold mb-2")
        titulo9.textContent = "Municipio"
        col3_2.appendChild(titulo9)

        const divMunicipios = newE("div", "divMunicipios", "dropdown")
        col3_2.appendChild(divMunicipios)

        const btnMunicipios = newE("button", "btnMunicipios", "btn btn-secondary dropdown-toggle")
        btnMunicipios.type = "button"
        btnMunicipios.setAttribute("data-bs-toggle", "dropdown");
        btnMunicipios.textContent = "municipios"
        divMunicipios.appendChild(btnMunicipios)

        const ulMunicipios = newE("ul", "ulMunicipios", "dropdown-menu p-2")
        divMunicipios.appendChild(ulMunicipios)

        const intMunicipios = newE("input", "intMunicipios", "form-control mb-2")
        ulMunicipios.appendChild(intMunicipios)

        const lstMunicipios = newE("div", "lstMunicipios", "menu-group-scroll")
        ulMunicipios.appendChild(lstMunicipios)

        const selDepartamento = newE("select", "seldep", "form-control mb-3")
        col1_2.appendChild(selDepartamento)
        //Cargamos la lista de los departamentos
        departamentos.forEach(dep => {
            const item = newE("option", "dep", "")
            item.value = dep.departamento
            item.textContent = dep.departamento
            selDepartamento.appendChild(item)
        })

        //====Sección para crear nuevos lugares que no están en la lista
        const col4_2 = newE("div", "col4_2", "col")
        row2.appendChild(col4_2)

        const titulo10 = newE("small", "titulo10", "fw-bold mb-2")
        titulo10.textContent = "Nuevo lugar"
        col4_2.appendChild(titulo10)

        const divNewMunicipios = newE("div", "divNewMunicipios", "dropdown")
        col4_2.appendChild(divNewMunicipios)

        const btnNewMunicipios = newE("button", "btnNewMunicipios", "btn btn-secondary dropdown-toggle")
        btnNewMunicipios.type = "button"
        btnNewMunicipios.setAttribute("data-bs-toggle", "dropdown");
        btnNewMunicipios.textContent = " + "
        divNewMunicipios.appendChild(btnNewMunicipios)

        const ulNewMunicipios = newE("ul", "ulNewMunicipios", "dropdown-menu p-2 mt-1")
        divNewMunicipios.appendChild(ulNewMunicipios)

        const small_nuevo_lugar = newE("small", "small_nuevo_lugar", "fw-bold mb-2")
        small_nuevo_lugar.textContent = "Nombre"
        ulNewMunicipios.appendChild(small_nuevo_lugar)

        const int_newlugar = newE("input", "int_newlugar", "form-control")
        int_newlugar.type = "text"
        ulNewMunicipios.appendChild(int_newlugar)

        const small_coordenada = newE("small", "small_coordenada", "fw-bold mb-2")
        small_coordenada.textContent = "Coordenadas"
        ulNewMunicipios.appendChild(small_coordenada)

        const int_coordenada = newE("input", "int_coordenada", "form-control")
        int_coordenada.type = "text"
        int_coordenada.placeholder = "'0.0,-0.0'"
        ulNewMunicipios.appendChild(int_coordenada)

        const btnNewLugar = newE("button", "btnNewLugar", "btn btn-secondary m-1")
        btnNewLugar.type = "button"
        btnNewLugar.textContent = "Agregar"
        ulNewMunicipios.appendChild(btnNewLugar)

        btnNewLugar.onclick = () => {
            const coorde = int_coordenada.value.split(",")
            vigencia.clsCasos[index].clsLugares.push(
                {
                    "id": 0,
                    "lat": coorde[0].trim(),
                    "lng": coorde[1].trim(),
                    "municipio": int_newlugar.value,
                }
            )
            GuardarDatos(data_activo, vigencia)
            _carga_lugares()

        }


        //Aquí se crea anticipadamente el contenedor de lugares
        const cont_lugares = newE("div", "cont_lugares", "mb-3 border border-1 d-flex")
        //cont_tipos.style.height = "100px"
        formulario.appendChild(cont_lugares)

        //===================================================================
        selDepartamento.value = vigencia.clsCasos[index].departamento
        _make_municipios(selDepartamento.value, "")
        selDepartamento.onchange = () => {
            vigencia.clsCasos[index].departamento = selDepartamento.value
            const filterMacro = departamentos.filter(ele => ele.departamento == selDepartamento.value)
            intMacro.value = filterMacro[0].macroregion
            vigencia.clsCasos[index].macroregion = intMacro.value
            GuardarDatos(data_activo, vigencia)
            _make_municipios(selDepartamento.value, "")

        }
        //===================================================================

        intMunicipios.oninput = () => {
            _make_municipios(selDepartamento.value, intMunicipios.value)
        }

        function _make_municipios(dep, filtro) {
            lstMunicipios.innerHTML = ""
            const filterLugares = lugares.filter(ele => ele.departamento == dep)
            filterLugares.forEach(mun => {
                if (filtro !== "") {
                    if (mun.lugar.includes(filtro) == true) {
                        const item = newE("div", mun.lugar, "item-menu")
                        item.textContent = mun.lugar
                        lstMunicipios.appendChild(item)
                        item.onclick = () => {
                            vigencia.clsCasos[index].clsLugares.push(
                                {
                                    "id": 0,
                                    "lat": mun.lat,
                                    "lng": mun.lng,
                                    "municipio": mun.lugar,
                                }
                            )
                            GuardarDatos(data_activo, vigencia)
                            _carga_lugares()
                        }
                    }
                } else {
                    const item = newE("div", mun.lugar, "item-menu")
                    item.textContent = mun.lugar
                    lstMunicipios.appendChild(item)
                    item.onclick = () => {
                        const newLugar = {
                            "id": 0,
                            "lat": mun.lat,
                            "lng": mun.lng,
                            "municipio": mun.lugar,
                        }
                        vigencia.clsCasos[index].clsLugares.push(newLugar)
                        GuardarDatos(data_activo, vigencia)
                        _carga_lugares()

                    }
                }
            })
        }

        //Cargamos la lista de los lugares
        _carga_lugares()
        function _carga_lugares() {
            cont_lugares.innerHTML = ""
            const lista_lugares = vigencia.clsCasos[index].clsLugares
            for (id in lista_lugares) {
                lista_lugares[id].id = id
                const el_tipo = newE("div", lista_lugares[id].lugar, "btn-label-gray")
                const i_boton = newE("i", "i_boton", "bi bi-trash3 ms-3")

                i_boton.style.cursor = "pointer"
                el_tipo.textContent = lista_lugares[id].municipio
                el_tipo.appendChild(i_boton)
                cont_lugares.appendChild(el_tipo)

                let nombre = lista_lugares[id].municipio
                i_boton.onclick = () => {
                    delete_item("clsLugares", "municipio", nombre)
                    GuardarDatos(data_activo, vigencia)
                    _carga_lugares()
                }
            }
        }

        const titulo11 = newE("small", "titulo11", "fw-bold mb-2")
        titulo11.textContent = "Detalle del lugar"
        formulario.appendChild(titulo11)

        const in_detallelugar = newE("textarea", "in_detallelugar", "form-control")
        in_detallelugar.rows = "2"
        formulario.appendChild(in_detallelugar)
        in_detallelugar.value = vigencia.clsCasos[index].detalleLugar
        in_detallelugar.onchange = () => {
            vigencia.clsCasos[index].detalleLugar = in_detallelugar.value
        }

        //========Seccion demografia
        const titulo12 = newE("label", "titulo12", "fw-bold mt-2 text-secondary fs-5")
        titulo12.textContent = "Información demográfica"
        formulario.appendChild(titulo12)

        const hr3 = newE("hr", "hr3", "border border-2 border-secondary")
        formulario.appendChild(hr3)

        const row3 = newE("div", "row3", "row")
        formulario.appendChild(row3)
        const col_pueblo = newE("div", "col_pueblo", "col-md-6")
        row3.appendChild(col_pueblo)

        const titulo13 = newE("small", "titulo13", "fw-bold mb-2")
        titulo13.textContent = "Pueblo / Étnia"
        col_pueblo.appendChild(titulo13)

        const sel_pueblo = newE("select", "titulo13", "form-control")
        col_pueblo.appendChild(sel_pueblo)
        DataPueblos.forEach(pub => {
            const item = newE("option", pub, "")
            item.textContent = pub
            item.value = pub
            sel_pueblo.appendChild(item)
        })
        sel_pueblo.onchange = () => {
            vigencia.clsCasos[index].clsPueblos.push(
                {
                    "id": 0,
                    "nombre": sel_pueblo.value,
                }
            )
            GuardarDatos(data_activo, vigencia)
            _carga_pueblos()
        }

        const cont_pueblos = newE("div", "cont_pueblos", "mb-3 border border-1 d-flex")
        formulario.appendChild(cont_pueblos)

        _carga_pueblos()
        function _carga_pueblos() {
            cont_pueblos.innerHTML = ""
            const lista_pueblos = vigencia.clsCasos[index].clsPueblos
            for (id in lista_pueblos) {
                lista_pueblos[id].id = id
                const el_tipo = newE("div", lista_pueblos[id].lugar, "btn-label-gray")
                const i_boton = newE("i", "i_boton", "bi bi-trash3 ms-3")

                i_boton.style.cursor = "pointer"
                el_tipo.textContent = lista_pueblos[id].nombre
                el_tipo.appendChild(i_boton)
                cont_pueblos.appendChild(el_tipo)
                sel_pueblo.value = lista_pueblos[id].nombre.trim()
                let nombre = lista_pueblos[id].nombre
                i_boton.onclick = () => {
                    delete_item("clsPueblos", "nombre", nombre)
                    GuardarDatos(data_activo, vigencia)
                    _carga_pueblos()
                }
            }
            if (lista_pueblos.length > 6) {
                //cont_pueblos.style.height="100px"
            }
        }

        const col_newpueblo = newE("div", "col_newpueblo", "col-md-6")
        row3.appendChild(col_newpueblo)

        const titulo14 = newE("small", "titulo14", "fw-bold mb-2")
        titulo14.textContent = "Otro pueblo"
        col_newpueblo.appendChild(titulo14)

        const in_newPueblo = newE("input", "in_newPueblo", "form-control")
        col_newpueblo.appendChild(in_newPueblo)

        in_newPueblo.onchange = () => {
            vigencia.clsCasos[index].clsPueblos.push(
                {
                    "id": 0,
                    "nombre": in_newPueblo.value,
                }
            )
            GuardarDatos(data_activo, vigencia)
            _carga_pueblos()
        }

        ////////==================Numero de personas
        const row4 = newE("div", "row4", "row")
        formulario.appendChild(row4)
        const col_nvictimas = newE("div", "col_nvictimas", "col-md-3")
        row4.appendChild(col_nvictimas)

        /////////////////////
        const titulo15 = newE("small", "titulo15", "fw-bold mb-2")
        titulo15.textContent = "Afectados"
        col_nvictimas.appendChild(titulo15)

        const in_nvictimas = newE("input", "in_nvictimas", "form-control")
        in_nvictimas.type = "number"
        col_nvictimas.appendChild(in_nvictimas)


        in_nvictimas.value = vigencia.clsCasos[index].npersonas
        in_nvictimas.onchange = () => {
            vigencia.clsCasos[index].npersonas = in_nvictimas.value
        }

        /////////////////////

        const col_nmujeres = newE("div", "col_nmujeres", "col-md-3")
        row4.appendChild(col_nmujeres)

        const titulo16 = newE("small", "titulo16", "fw-bold mb-2")
        titulo16.textContent = "Número mujeres"
        col_nmujeres.appendChild(titulo16)

        const in_nmujeres = newE("input", "in_nmujeres", "form-control")
        in_nmujeres.type = "number"
        col_nmujeres.appendChild(in_nmujeres)

        in_nmujeres.value = vigencia.clsCasos[index].nmujeres
        in_nmujeres.onchange = () => {
            vigencia.clsCasos[index].nmujeres = in_nmujeres.value
        }

        /////////////////////
        const col_nhombres = newE("div", "col_nhombres", "col-md-3")
        row4.appendChild(col_nhombres)

        const titulo17 = newE("small", "titulo17", "fw-bold mb-2")
        titulo17.textContent = "Número hombres"
        col_nhombres.appendChild(titulo17)

        const in_nhombres = newE("input", "in_nhombres", "form-control")
        in_nhombres.type = "number"
        col_nhombres.appendChild(in_nhombres)

        in_nhombres.value = vigencia.clsCasos[index].nhombres
        in_nhombres.onchange = () => {
            vigencia.clsCasos[index].nhombres = in_nhombres.value
        }

        //////////////////////////////

        const col_nmenores = newE("div", "col_nmenores", "col-md-3")
        row4.appendChild(col_nmenores)

        const titulo18 = newE("small", "titulo18", "fw-bold mb-2")
        titulo18.textContent = "Número menores"
        col_nmenores.appendChild(titulo18)

        const in_nmenores = newE("input", "in_nmenores", "form-control")
        in_nmenores.type = "number"
        col_nmenores.appendChild(in_nmenores)

        in_nmenores.value = vigencia.clsCasos[index].nmenores
        in_nmenores.onchange = () => {
            vigencia.clsCasos[index].nmenores = in_nmenores.value
        }
        //////////////////////////////

        ////////==================Numero de personas
        const row5 = newE("div", "row5", "row mt-2")
        formulario.appendChild(row5)

        const col_addpersonas = newE("div", "col_addpersonas", "col-md-2")
        row5.appendChild(col_addpersonas)

        const btn_addpersonas = newE("button", "btn_addpersonas", "btn btn-secondary mt-2")
        btn_addpersonas.type = "button"
        btn_addpersonas.textContent = "Agregar nombres"
        col_addpersonas.appendChild(btn_addpersonas)

        btn_addpersonas.onclick = () => {
            vigencia.clsCasos[index].clsPersonas.push(
                {
                    "edad": 0,
                    "documento": "",
                    "nombres": "Nuevo nombre",
                    "genero": "Sin determinar",
                    "cargo": "",
                    "id": 0
                }
            )
            _cargar_personas()
            GuardarDatos(data_activo, vigencia)
        }


        const col_personas = newE("div", "col_personas", "col-md-10")
        row5.appendChild(col_personas)

        _cargar_personas()
        function _cargar_personas() {
            col_personas.innerHTML = ""
            let i = 0
            vigencia.clsCasos[index].clsPersonas.forEach(persona => {
                persona.id = i
                const btn_persona = newE("div", "", "btn btn-light btn-sm m-1")
                btn_persona.setAttribute("data-bs-toggle", "collapse");
                btn_persona.setAttribute("data-bs-target", "#collapse" + i);

                btn_persona.textContent = persona.nombres
                col_personas.appendChild(btn_persona)

                const collapse_persona = newE("div", "", "collapse p-2")
                collapse_persona.id = "collapse" + i
                col_personas.appendChild(collapse_persona)
                i++

                const div_persona = newE("div", "", "card card-body")
                div_persona.style.background = "#f2f4f4"
                collapse_persona.appendChild(div_persona)

                const smnombres = newE("small", "smnombres", "fw-bold")
                smnombres.textContent = "Nombres"
                div_persona.appendChild(smnombres)

                const int_nombres = newE("input", "int_nombres", "form-coltrol m-1")
                //int_nombres.style.display="block"
                //int_nombres.style.width="300px"
                int_nombres.type = "text"
                div_persona.appendChild(int_nombres)
                int_nombres.value = persona.nombres
                int_nombres.onchange = () => {
                    persona.nombres = int_nombres.value
                    btn_persona.textContent = int_nombres.value
                    GuardarDatos(data_activo, vigencia)
                }


                const smdocumento = newE("small", "smdocumento", "fw-bold")
                smdocumento.textContent = "Documento"
                //smdocumento.style.display="block"
                div_persona.appendChild(smdocumento)

                const int_documento = newE("input", "int_documento", "form-coltrol m-1")
                //int_documento.style.width="300px"
                int_documento.type = "text"
                div_persona.appendChild(int_documento)
                int_documento.value = persona.documento
                int_documento.onchange = () => {
                    persona.documento = int_documento.value
                    GuardarDatos(data_activo, vigencia)
                }

                const smgenero = newE("small", "smgenero", "fw-bold")
                smgenero.textContent = "Género"
                //smdocumento.style.display="block"
                div_persona.appendChild(smgenero)

                const int_genero = newE("select", "int_genero", "form-coltrol m-1")

                const generos = ["Hombre", "Mujer", "LGBTI", "Otro", "Sin determinar"]

                int_genero.value = persona.genero
                generos.forEach(ele => {
                    const option = newE("option", "ele", "")
                    option.value = ele
                    option.textContent = ele
                    int_genero.appendChild(option)
                })
                //int_genero.style.display="block"
                //int_genero.style.width="300px"
                int_genero.type = "text"
                div_persona.appendChild(int_genero)
                int_genero.value = persona.genero
                int_genero.onchange = () => {
                    persona.genero = int_genero.value
                    GuardarDatos(data_activo, vigencia)
                }

                const smedad = newE("small", "smedad", "fw-bold")
                smedad.textContent = "Edad"
                //smdocumento.style.display="block"
                div_persona.appendChild(smedad)

                const int_edad = newE("input", "int_edad", "form-coltrol m-1")
                //int_documento.style.width="300px"
                int_edad.type = "number"
                div_persona.appendChild(int_edad)
                int_edad.value = persona.edad
                int_documento.onchange = () => {
                    persona.edad = int_edad.value
                    GuardarDatos(data_activo, vigencia)
                }

                const smcargo = newE("small", "smcargo", "fw-bold")
                smcargo.textContent = "Cargo"
                //smdocumento.style.display="block"
                div_persona.appendChild(smcargo)

                const int_cargo = newE("input", "int_cargo", "form-coltrol m-1")
                //int_documento.style.width="300px"
                int_cargo.type = "text"
                div_persona.appendChild(int_cargo)
                int_cargo.value = persona.cargo
                int_documento.onchange = () => {
                    persona.cargo = int_cargo.value
                    GuardarDatos(data_activo, vigencia)
                }

                const btn_deletepersonas = newE("button", "btn_deletepersonas", "btn btn-secondary mt-2")
                btn_deletepersonas.type = "button"
                btn_deletepersonas.textContent = "Suprimir elemento"
                div_persona.appendChild(btn_deletepersonas)
                btn_deletepersonas.onclick = () => {
                    delete_item("clsPersonas", "id", persona.id)
                    _cargar_personas()
                    GuardarDatos(data_activo, vigencia)
                }

            })
        }

        //================================================
        //Creamos info de afectaciones
        const titulo19 = newE("label", "titulo19", "fw-bold mt-2 text-secondary fs-5")
        titulo19.textContent = "Actores y acciones"
        formulario.appendChild(titulo19)

        const hr4 = newE("hr", "hr4", "border border-2 border-secondary")
        formulario.appendChild(hr4)

        const row6 = newE("div", "row6", "row")
        formulario.appendChild(row6)
        const col_macroactor = newE("div", "col_macroactor", "col-md-4")
        row6.appendChild(col_macroactor)

        const smmacroactor = newE("small", "smmacroactor", "fw-bold")
        smmacroactor.textContent = "Macroactor"
        col_macroactor.appendChild(smmacroactor)

        const sel_macroactor = newE("select", "sel_macroactor", "form-control")
        col_macroactor.appendChild(sel_macroactor)

        DataMacroActor.forEach(ele => {
            const item = newE("option", "ele", "")
            item.value = ele
            item.textContent = ele
            sel_macroactor.appendChild(item)
        })
        sel_macroactor.value = vigencia.clsCasos[index].macroactor
        sel_macroactor.onchange = () => {
            vigencia.clsCasos[index].macroactor = sel_macroactor.value
            GuardarDatos(data_activo, vigencia)
        }
        //
        const col_microactor = newE("div", "col_microactor", "col-md-4")
        row6.appendChild(col_microactor)

        const smmicroactor = newE("small", "smmicroactor", "fw-bold")
        smmicroactor.textContent = "Microactor"
        col_microactor.appendChild(smmicroactor)

        const sel_microactor = newE("select", "sel_microactor", "form-control")
        col_microactor.appendChild(sel_microactor)

        DataActor.forEach(ele => {
            const item = newE("option", "ele", "")
            item.value = ele
            item.textContent = ele
            sel_microactor.appendChild(item)
        })

        try {
            //Verifica si hay una lista de actores para colocr el último
            sel_microactor.value = vigencia.clsCasos[index].clsActores[vigencia.clsCasos[index].clsActores.length - 1].nombre
        } catch (error) {

        }
        sel_microactor.onchange = () => {
            vigencia.clsCasos[index].clsActores.push({
                "id": 0,
                "nombre": sel_microactor.value
            })
            _carga_actores()
            GuardarDatos(data_activo, vigencia)
        }

        const col_otroactor = newE("div", "col_otroactor", "col-md-4")
        row6.appendChild(col_otroactor)

        const smotroactor = newE("small", "smotroactor", "fw-bold")
        smotroactor.textContent = "Otro actor"
        col_otroactor.appendChild(smotroactor)

        const int_otroactor = newE("input", "int_otroactor", "form-control")
        int_otroactor.type = "text"
        col_otroactor.appendChild(int_otroactor)
        int_otroactor.onchange = () => {
            vigencia.clsCasos[index].clsActores.push({
                "id": 0,
                "nombre": int_otroactor.value
            })
            _carga_actores()
            GuardarDatos(data_activo, vigencia)
        }


        const cont_actores = newE("div", "cont_actores", "mb-3 border border-1 d-flex")
        formulario.appendChild(cont_actores)
        _carga_actores()

        function _carga_actores() {
            cont_actores.innerHTML = ""
            const lista_actores = vigencia.clsCasos[index].clsActores
            for (id in lista_actores) {
                lista_actores[id].id = id
                const el_tipo = newE("div", lista_actores[id].nombre, "btn-label-gray")
                const i_boton = newE("i", "i_boton", "bi bi-trash3 ms-3")

                i_boton.style.cursor = "pointer"
                el_tipo.textContent = lista_actores[id].nombre
                el_tipo.appendChild(i_boton)
                cont_actores.appendChild(el_tipo)
                sel_microactor.value = lista_actores[id].nombre.trim()
                let nombre = lista_actores[id].nombre
                i_boton.onclick = () => {
                    delete_item("clsActores", "nombre", nombre)
                    GuardarDatos(data_activo, vigencia)
                    _carga_actores()
                }
            }
        }
        //////////////////////////////////////////////////////////////////////
        // Desplazamientos
        const row7 = newE("div", "row7", "row")
        formulario.appendChild(row7)
        const col_newdesplazamiento = newE("div", "col_newdesplazamiento", "col-md-2")
        row7.appendChild(col_newdesplazamiento)

        const smdesplazamiento = newE("small", "smdesplazamiento", "fw-bold me-3")
        smdesplazamiento.textContent = "Desplazamientos"
        col_newdesplazamiento.appendChild(smdesplazamiento)

        const col_desplazamiento = newE("div", "col_desplazamiento", "col-md-10")
        row7.appendChild(col_desplazamiento)

        _carga_desplazamientos()

        function _carga_desplazamientos() {
            col_desplazamiento.innerHTML = ""
            const deplazamientos = vigencia.clsCasos[index].clsDesplazamiento
            for (id in deplazamientos) {
                const row = newE("div", "rowdes" + id, "row")
                col_desplazamiento.appendChild(row)

                deplazamientos[id].id = id
                const ind_Desplaz=id


                const btn_desplazamiento = newE("div", "", "btn-label-gray-long m-1")
                btn_desplazamiento.style.cursor = "pointer"
                btn_desplazamiento.setAttribute("data-bs-toggle", "collapse");
                btn_desplazamiento.setAttribute("data-bs-target", "#collapse_des" + id);

                btn_desplazamiento.textContent = deplazamientos[id].tipo
                row.appendChild(btn_desplazamiento)

                const collapse_despl = newE("div", "", "collapse p-2")
                collapse_despl.id = "collapse_des" + id
                row.appendChild(collapse_despl)

                const div_desplazamiento = newE("div", "", "card card-body")
                div_desplazamiento.style.background = "#f2f4f4"
                collapse_despl.appendChild(div_desplazamiento)

                const sm_tipo = newE("small", "sm_tipo", "fw-bold")
                sm_tipo.textContent = "Tipo de desplazamiento"
                div_desplazamiento.appendChild(sm_tipo)

                const tipos_despl = ['Colectivo', 'Individual', 'Unifamiliar', 'Multifamiliar', 'Otro', 'Sin determinar']
                const sel_tipo = newE("select", "", "form-control")
                div_desplazamiento.appendChild(sel_tipo)
                tipos_despl.forEach(ele => {
                    const item = newE("option", ele, "")
                    item.value = ele
                    item.textContent = ele
                    sel_tipo.appendChild(item)
                })

                sel_tipo.value = deplazamientos[ind_Desplaz].tipo
                
                sel_tipo.onchange = () => {
                    deplazamientos[ind_Desplaz].tipo = sel_tipo.value
                    btn_desplazamiento.textContent = sel_tipo.value
                    GuardarDatos(data_activo, vigencia)
                }

                const sm_fsalida = newE("small", "sm_fsalida", "fw-bold")
                sm_fsalida.textContent = "Fecha salída"
                div_desplazamiento.appendChild(sm_fsalida)

                const int_fecha_sal = newE("input", "", "form-control")
                int_fecha_sal.type = "date"
                div_desplazamiento.appendChild(int_fecha_sal)
                int_fecha_sal.value = deplazamientos[ind_Desplaz].fechaex
                int_fecha_sal.onchange = () => {
                    deplazamientos[ind_Desplaz].fechaex = int_fecha_sal.value
                    GuardarDatos(data_activo, vigencia)
                }

                //Aquí información del departamento de expulsión
                const sm_depDes = newE("small", "sm_tipo", "fw-bold")
                const sel_lugarOri = newE("select", "", "form-control")

                sm_depDes.textContent = "Departamento origen"
                div_desplazamiento.appendChild(sm_depDes)


                const sel_depDes = newE("select", "", "form-control")
                div_desplazamiento.appendChild(sel_depDes)

                departamentos.forEach(ele => {
                    const item = newE("option", ele.departamento, "")
                    item.value = ele.departamento
                    item.textContent = ele.departamento
                    sel_depDes.appendChild(item)
                })

                try {
                    //  Si no existe un departamento
                    sel_depDes.value = deplazamientos[ind_Desplaz].DepartamentoExp

                } catch (error) {
                    deplazamientos[ind_Desplaz].DepartamentoExp = ""
                }
                _cargar_lugaresDes(deplazamientos[ind_Desplaz].DepartamentoExp)

                /////////////////////////////////////////////////////////////
                //  Lugar de salida

                const sm_lugarOri = newE("small", "sm_lugarOri", "fw-bold")
                sm_lugarOri.textContent = "Lugar de origen"
                div_desplazamiento.appendChild(sm_lugarOri)


                div_desplazamiento.appendChild(sel_lugarOri)

                sel_depDes.onchange = () => {
                    deplazamientos[ind_Desplaz].DepartamentoExp = sel_depDes.value
                    GuardarDatos(data_activo, vigencia)
                    _cargar_lugaresDes(sel_depDes.value)

                }

                function _cargar_lugaresDes(departamento) {
                    sel_lugarOri.innerHTML = ""
                    lugaresNew = lugares.filter(ele => ele.departamento == departamento)
                    lugaresNew.forEach(ele => {
                        const item = newE("option", ele.lugar, "")
                        item.value = [ele.lugar, ele.latlng]
                        item.textContent = ele.lugar
                        sel_lugarOri.appendChild(item)
                    })
                }
                sel_lugarOri.value = deplazamientos[id].lugarOri
                sel_lugarOri.onchange = () => {
                    const datos = sel_lugarOri.value.split(",")
                    deplazamientos[ind_Desplaz].lugarOri = sel_lugarOri.value
                    deplazamientos[ind_Desplaz].coorExp = [datos[1], datos[2]]
                    GuardarDatos(data_activo, vigencia)
                }
                /////////////////////////////////////////////////////////////
                //  Entorno de salida

                const sm_EntornoOri = newE("small", "sm_EntornoOri", "fw-bold")
                sm_EntornoOri.textContent = "Entorno de origen"
                div_desplazamiento.appendChild(sm_EntornoOri)

                const entornos = ["Rural", "Urbano", "Mixto", "Otro"]
                const sel_EntornoOri = newE("select", "", "form-control")
                div_desplazamiento.appendChild(sel_EntornoOri)

                entornos.forEach(ele => {
                    const item = newE("option", ele, "")
                    item.value = ele
                    item.textContent = ele
                    sel_EntornoOri.appendChild(item)
                })
                sel_EntornoOri.value = deplazamientos[ind_Desplaz].entornoOri
                sel_EntornoOri.onchange = () => {
                    deplazamientos[ind_Desplaz].entornoOri = sel_EntornoOri.value
                    GuardarDatos(data_activo, vigencia)
                }

                ///////////////////////////////////////////////////////7
                //Entorno de llegada

                const sm_fllegada = newE("small", "sm_fllegada", "fw-bold")
                sm_fllegada.textContent = "Fecha llegada"
                div_desplazamiento.appendChild(sm_fllegada)

                const int_fecha_lleg = newE("input", "", "form-control")
                int_fecha_lleg.type = "date"
                div_desplazamiento.appendChild(int_fecha_lleg)
                int_fecha_lleg.value = deplazamientos[ind_Desplaz].fechaDes
                int_fecha_lleg.onchange = () => {
                    deplazamientos[ind_Desplaz].fechaDes = int_fecha_lleg.value
                    GuardarDatos(data_activo, vigencia)
                }


                const sm_DepDestino = newE("small", "sm_DepDestino", "fw-bold")
                sm_DepDestino.textContent = "Departamento destino"
                div_desplazamiento.appendChild(sm_DepDestino)

                const sel_depDestino = newE("select", "", "form-control")
                const sel_lugarDestino = newE("select", "", "form-control")
                div_desplazamiento.appendChild(sel_depDestino)

                departamentos.forEach(ele => {
                    const item = newE("option", ele.departamento, "")
                    item.value = ele.departamento
                    item.textContent = ele.departamento
                    sel_depDestino.appendChild(item)
                })

                try {
                    sel_depDestino.value = deplazamientos[ind_Desplaz].DepartamentoDes
                } catch (error) {

                }

                sel_depDestino.onchange = () => {
                    deplazamientos[ind_Desplaz].DepartamentoDes = sel_depDestino.value
                    GuardarDatos(data_activo, vigencia)
                    _cargar_lugaresDestino(sel_depDestino.value)

                }
                _cargar_lugaresDestino(deplazamientos[ind_Desplaz].DepartamentoDes)

                function _cargar_lugaresDestino(departamento) {
                    sel_lugarDestino.innerHTML = ""
                    lugaresNew = lugares.filter(ele => ele.departamento == departamento)
                    lugaresNew.forEach(ele => {
                        const item = newE("option", ele.lugar, "")
                        item.value = [ele.lugar, ele.latlng]
                        item.textContent = ele.lugar
                        sel_lugarDestino.appendChild(item)
                    })
                }

                /////////////////////////////////////////////////////////////
                //  Lugar de salida

                const sm_lugarDestino = newE("small", "sm_lugarDestino", "fw-bold")
                sm_lugarDestino.textContent = "Lugar de destino"
                div_desplazamiento.appendChild(sm_lugarDestino)
                div_desplazamiento.appendChild(sel_lugarDestino)

                sel_lugarDestino.value = deplazamientos[id].LugarDes
                sel_lugarDestino.onchange = () => {
                    const datos = sel_lugarDestino.value.split(",")
                    deplazamientos[ind_Desplaz].LugarDes = sel_lugarDestino.value
                    deplazamientos[ind_Desplaz].coorDes = [datos[1], datos[2]]
                    GuardarDatos(data_activo, vigencia)
                }

                const sm_entornoDestino = newE("small", "sm_entornoDestino", "fw-bold")
                sm_entornoDestino.textContent = "Entorno de destino"
                div_desplazamiento.appendChild(sm_entornoDestino)

                const sel_EntornoLleg = newE("select", "", "form-control")
                div_desplazamiento.appendChild(sel_EntornoLleg)

                entornos.forEach(ele => {
                    const item = newE("option", ele, "")
                    item.value = ele
                    item.textContent = ele
                    sel_EntornoLleg.appendChild(item)
                })
                sel_EntornoLleg.value = deplazamientos[ind_Desplaz].TipoDes
                sel_EntornoLleg.onchange = () => {
                    deplazamientos[ind_Desplaz].TipoDes = sel_EntornoLleg.value
                    GuardarDatos(data_activo, vigencia)
                }

                /////////////////////////////////////////////////////////////////
                const btn_delete = newE("button", "", "btn btn-secondary mt-2")
                btn_delete.type = "button"
                btn_delete.textContent = "Suprimir elemento"
                div_desplazamiento.appendChild(btn_delete)
                btn_delete.onclick = () => {
                    delete_item("clsDesplazamiento", "id", ind_Desplaz)
                    GuardarDatos(data_activo, vigencia)
                    _carga_desplazamientos()
                }

            }

        }

        const btn_adddesplazamiento = newE("button", "btn_adddesplazamiento", "btn btn-secondary mt-2")
        btn_adddesplazamiento.type = "button"
        btn_adddesplazamiento.textContent = "Agregar +"
        col_newdesplazamiento.appendChild(btn_adddesplazamiento)

        btn_adddesplazamiento.onclick = () => {
            vigencia.clsCasos[index].clsDesplazamiento.push(
                {
                    "id": 0,
                    "tipo": "Sin determinar",
                    "DepartamentoExp": "",
                    "lugarOri": "Sin determinar",
                    "coorExp": "",
                    "fechaex": "",
                    "entornoOri": "",

                    "DepartamentoDes": "",
                    "LugarDes": "",
                    "coorDes": "",
                    "fechaDes": "",
                    "TipoDes": "",
                }
            )
            _carga_desplazamientos()
            GuardarDatos(data_activo, vigencia)
        }

        ////////////////////////////////////////////////7
        // Medidas o acciones
        const row8 = newE("div", "row8", "row")
        formulario.appendChild(row8)
        const col_newmedida = newE("div", "col_newmedida", "col-md-2")
        row8.appendChild(col_newmedida)

        const smmedidas = newE("small", "smmedidas", "fw-bold me-3")
        smmedidas.textContent = "Medidas"
        col_newmedida.appendChild(smmedidas)

        const col_medidas = newE("div", "col_medidas", "col-md-10")
        row8.appendChild(col_medidas)

        _carga_medidas()

        function _carga_medidas() {
            col_medidas.innerHTML = ""
            const medidas = vigencia.clsCasos[index].clsAccJuridica
            for (id in medidas) {
                const row = newE("div", "rowmed" + id, "row")
                col_medidas.appendChild(row)

                medidas[id].id = id

                const btn_medidas = newE("div", "", "btn-label-gray-long m-1")
                btn_medidas.style.cursor = "pointer"
                btn_medidas.setAttribute("data-bs-toggle", "collapse");
                btn_medidas.setAttribute("data-bs-target", "#collapse_med" + id);

                btn_medidas.textContent = medidas[id].accion
                row.appendChild(btn_medidas)

                const collapse_med = newE("div", "", "collapse p-2")
                collapse_med.id = "collapse_med" + id
                row.appendChild(collapse_med)

                const div_medidas = newE("div", "", "card card-body")
                div_medidas.style.background = "#f2f4f4"
                collapse_med.appendChild(div_medidas)

                const sm_accion = newE("small", "sm_accion", "fw-bold")
                sm_accion.textContent = "Tipo de acción"
                div_medidas.appendChild(sm_accion)

                const tipos_medidas = ['Acción Urgente', 'Denuncia pública', 'Comunicado', 'Demanda', 'Chat de emergencia', 'Otro', 'Sin determinar']
                const sel_tipoMed = newE("select", "", "form-control")
                div_medidas.appendChild(sel_tipoMed)
                tipos_medidas.forEach(ele => {
                    const item = newE("option", ele, "")
                    item.value = ele
                    item.textContent = ele
                    sel_tipoMed.appendChild(item)
                })

                const ind_medidas=id
                sel_tipoMed.value = medidas[ind_medidas].accion
                sel_tipoMed.onchange = () => {
                    medidas[ind_medidas].accion = sel_tipoMed.value
                    btn_medidas.textContent = sel_tipoMed.value
                    GuardarDatos(data_activo, vigencia)
                }

                const sm_faccion = newE("small", "sm_faccion", "fw-bold")
                sm_faccion.textContent = "Fecha de acción"
                div_medidas.appendChild(sm_faccion)

                const int_fecha_acc = newE("input", "", "form-control")
                int_fecha_acc.type = "date"
                div_medidas.appendChild(int_fecha_acc)
                int_fecha_acc.value = medidas[ind_medidas].fecha
                int_fecha_acc.onchange = () => {
                    medidas[ind_medidas].fecha = int_fecha_acc.value
                    GuardarDatos(data_activo, vigencia)
                }

                const sm_raccion = newE("small", "sm_raccion", "fw-bold")
                sm_raccion.textContent = "Respuesta"
                div_medidas.appendChild(sm_raccion)

                const int_respuesata = newE("input", "", "form-control")
                int_respuesata.type = "text"
                div_medidas.appendChild(int_respuesata)
                int_respuesata.value = medidas[ind_medidas].respuesta
                int_respuesata.onchange = () => {
                    medidas[ind_medidas].respuesta = int_respuesata.value
                    GuardarDatos(data_activo, vigencia)
                }

                /////////////////////////////////////////////////////////////////
                const btn_delete = newE("button", "", "btn btn-secondary mt-2")
                btn_delete.type = "button"
                btn_delete.textContent = "Suprimir elemento"
                div_medidas.appendChild(btn_delete)
                btn_delete.onclick = () => {
                    delete_item("clsAccJuridica", "id", ind_medidas)
                    _carga_medidas()
                    GuardarDatos(data_activo, vigencia)
                }
            }


        }
        const btn_addmedidas = newE("button", "btn_addmedidas", "btn btn-secondary mt-2")
        btn_addmedidas.type = "button"
        btn_addmedidas.textContent = "Agregar +"
        col_newmedida.appendChild(btn_addmedidas)

        btn_addmedidas.onclick = () => {
            vigencia.clsCasos[index].clsAccJuridica.push(
                {
                    "fecha": "",
                    "id": 0,
                    "accion": "Sin determinar",
                    "respuesta": ""
                }
            )
            _carga_medidas()
            GuardarDatos(data_activo, vigencia)
        }
        /////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////
        //               Fuente de la información

        const titulo20 = newE("label", "titulo20", "fw-bold mt-2 text-secondary fs-5")
        titulo20.textContent = "Fuente de la información"
        formulario.appendChild(titulo20)

        const hr5 = newE("hr", "hr5", "border border-2 border-secondary")
        formulario.appendChild(hr5)

        const row9 = newE("div", "row9", "row")
        formulario.appendChild(row9)

        const col_fuente = newE("div", "col_fuente", "col-md-4")
        row9.appendChild(col_fuente)

        const sm_fuente = newE("small", "sm_fuente", "fw-bold mb-2")
        sm_fuente.textContent = "Nombre fuente"
        col_fuente.appendChild(sm_fuente)

        const int_fuente = newE("input", "", "form-control")
        int_fuente.type = "text"
        col_fuente.appendChild(int_fuente)
        int_fuente.value = vigencia.clsCasos[index].fuente
        int_fuente.onchange = () => {
            vigencia.clsCasos[index].fuente = int_fuente.value
            GuardarDatos(data_activo, vigencia)
        }

        const col_ffuente = newE("div", "col_ffuente", "col-md-4")
        row9.appendChild(col_ffuente)

        const sm_ffuente = newE("small", "sm_ffuente", "fw-bold mb-2")
        sm_ffuente.textContent = "Fecha fuente"
        col_ffuente.appendChild(sm_ffuente)

        const int_ffuente = newE("input", "", "form-control")
        int_ffuente.type = "date"
        col_ffuente.appendChild(int_ffuente)
        int_ffuente.value = vigencia.clsCasos[index].fechafuente
        int_ffuente.onchange = () => {
            vigencia.clsCasos[index].fechafuente = int_ffuente.value
            GuardarDatos(data_activo, vigencia)
        }

        const col_efuente = newE("div", "col_ffuente", "col-md-4")
        row9.appendChild(col_efuente)

        const sm_efuente = newE("small", "sm_efuente", "fw-bold mb-2")
        sm_efuente.textContent = "Enlace o contacto fuente"
        col_efuente.appendChild(sm_efuente)

        const div_efuente = newE("div", "div_efuente", "input-group flex-nowrap")
        col_efuente.appendChild(div_efuente)


        const int_efuente = newE("input", "int_efuente", "form-control")
        int_efuente.type = "text"
        div_efuente.appendChild(int_efuente)
        int_efuente.value = vigencia.clsCasos[index].enlace
        int_efuente.onchange = () => {
            vigencia.clsCasos[index].enlace = int_efuente.value
            GuardarDatos(data_activo, vigencia)
        }

        const sp_efuente = newE("span", "sp_efuente", "input-group-text btn-mini-gray")
        div_efuente.appendChild(sp_efuente)


        const i_efuente = newE("i", "i_efuente", "bi bi-link-45deg")
        sp_efuente.appendChild(i_efuente)


        sp_efuente.onclick = () => {
            window.open(int_efuente.value, '_blank')
        }


        //============================================================
        //Borra elementos que están dentro de una subclase del registro
        function delete_item(clase, campo, valor) {

            const filter = vigencia.clsCasos[index][clase].filter(ele => ele[campo] !== valor)
            vigencia.clsCasos[index][clase] = filter
        }

        //===============================================================
        //Función para crear un registro o caso nuevo
        function crear_registro(data, vig) {
            template_caso.vigencia = vig

            data.clsCasos.push(template_caso)

            
            _contador_registros(vigencia,data.length -1)
            GuardarDatos(data_activo, vigencia)
        }
        //============================================================
        //Se borra la totalidad del caso
        function eliminar_registro(data, idx) {
            const filtered = data.clsCasos.filter(ele => ele.id !== idx)

            data.clsCasos = filtered
            GuardarDatos(data_activo, vigencia)
            _contador_registros(vigencia, 0)
            _mover_aRegistro("primero", vigencia, 0)
        }
    }
    function _make_registros_filter(vigencia, filtrados, numerador, data_activo) {
        const index = filtrados.clsCasos[numerador].id
        //Configuramos los botones para que apliquen movimiento
        const b_Inicio = byE("btn_Inicio")
        b_Inicio.onclick = () => {
            _mover_aRegistro("primero", filtrados, numerador)
        }

        const b_Previo = byE("btn_Previo")
        b_Previo.onclick = () => {
            _mover_aRegistro("anterior", filtrados, numerador)
        }

        const b_Siguiente = byE("btn_Siguiente")
        b_Siguiente.onclick = () => {
            _mover_aRegistro("siguiente", filtrados, numerador)
        }

        const b_Ultimo = byE("btn_Ultimo")
        b_Ultimo.onclick = () => {
            _mover_aRegistro("ultimo", filtrados, numerador)
        }

        const btn_Nuevo = byE("btn_Nuevo")
        btn_Nuevo.style.visibility = "hidden"
        btn_Nuevo.onclick = () => {
            crear_registro(vigencia, vigencia.clsCasos[index].vigencia)
            _mover_aRegistro("ultimo", vigencia, index)

        }

        const btn_Eliminar = byE("btn_Eliminar")
        btn_Eliminar.style.visibility = "hidden"
        btn_Eliminar.onclick = () => {
            modal.modalDelete(
                () => {
                    eliminar_registro(vigencia, index)
                }
            )
        }



        const btnBuscar = byE("btnBuscar")

        const divbtnFiltrar = byE("divbtnFiltrar")
        divbtnFiltrar.style.visibility = "hidden"

        btnBuscar.onclick = () => {
            //Seleccionamos la condición de la clase
            const ver_clase = sel_clase.value.split(",")

            if (ver_clase[0] == "clsCasos") {
                //Verificamos si es una búsqueda tipo texto o numérico
                const ver_operador = sel_operador.value.split(",")
                //alert(ver_operador[1])
                if (ver_operador[1] == "string") {
                    const criterioA = ver_operador[0].replace("VALOR", `'${int_valor.value}'`)
                    const criterioB = `ele=>ele['${ver_clase[1]}']${criterioA}`
                    const filtered = vigencia.clsCasos.filter(eval(criterioB))
                    const newData = {
                        'clsCasos': filtered
                    }
                    _make_registros(newData, 0, selVigencias.value)
                    _contador_registros(newData, 0)

                } else {
                    alert("numero")
                }
            } else {
                const ver_operador = sel_operador.value.split(",")
                if (ver_operador[1] == "string") {
                    alert("texto")
                } else {
                    alert("numero")
                }
            }



        }

        //Eliminamos el filtro actual
        const btn_Eliminar_filtro = byE("btn_Eliminar_filtro")
        //btn_Eliminar_filtro.hidden = "false"
        btn_Eliminar_filtro.onclick = () => {
            _make_registros(vigencia, 0, data_activo)
            _mover_aRegistro("primero", vigencia)
            btn_Eliminar.style.visibility = "visible"
            btn_Nuevo.style.visibility = "visible"
            divbtnFiltrar.style.visibility = "visible"
            btn_Eliminar_filtro.style.visibility = "hidden"
        }


        //Creamos el entorno de entradas para el registro
        formulario.innerHTML = ""

        const row1 = newE("div", "row1", "row")
        formulario.appendChild(row1)
        const col1 = newE("div", "col1", "col-md-6")
        row1.appendChild(col1)

        const titulo1 = newE("small", "titulo_fecha", "fw-bold mb-2")
        titulo1.textContent = "Fecha del evento"
        col1.appendChild(titulo1)

        const fecha_evento = newE("input", "fecha_evento", "form-control mb-3")
        fecha_evento.type = "date"

        fecha_evento.value = vigencia.clsCasos[index].fecha
        col1.appendChild(fecha_evento)
        fecha_evento.onchange = () => {
            vigencia.clsCasos[index].fecha = fecha_evento.value
            GuardarDatos(data_activo, vigencia)
        }

        const col2 = newE("div", "col2", "col-md-6")
        row1.appendChild(col2)

        const titulo2 = newE("small", "titulo_fecha", "fw-bold mb-2")
        titulo2.textContent = "Macrotipo"
        col2.appendChild(titulo2)

        const selMacrotipo = newE("select", "selMacrotipo", "form-control mb-3")
        col2.appendChild(selMacrotipo)
        //Cargamos la lista de los macrotipos
        macrotipos.forEach(tipo => {
            const item = newE("option", "tipo", "")
            item.value = tipo
            item.textContent = tipo
            selMacrotipo.appendChild(item)
        })
        selMacrotipo.value = vigencia.clsCasos[index].macrotipo
        selMacrotipo.onchange = () => {
            vigencia.clsCasos[index].macrotipo = selMacrotipo.value
            GuardarDatos(data_activo, vigencia)
        }

        //Creamos el detalle del evento

        const titulo3 = newE("small", "titulo_detalle", "fw-bold mb-2")
        titulo3.textContent = "Descripción del caso"
        formulario.appendChild(titulo3)

        const in_detalle = newE("textarea", "in_detalle", "form-control")
        in_detalle.value = vigencia.clsCasos[index].detalle
        in_detalle.rows = 4
        formulario.appendChild(in_detalle)
        in_detalle.onchange = () => {
            vigencia.clsCasos[index].detalle = in_detalle.value
            GuardarDatos(data_activo, vigencia)
        }

        //Creamos la lista de subtipos
        const titulo4 = newE("label", "titulo_subtipos", "fw-bold mt-2 text-secondary fs-5")
        titulo4.textContent = "Afectaciones adicionales"
        formulario.appendChild(titulo4)

        const hr1 = newE("hr", "hr1", "border border-2 border-secondary")
        formulario.appendChild(hr1)

        const titulo5 = newE("small", "", "fw-bold mb-2")
        titulo5.textContent = "Otras afectaciones"
        formulario.appendChild(titulo5)

        const selTipo = newE("select", "seltipo", "form-control mb-3", "300px")
        formulario.appendChild(selTipo)
        //Cargamos la lista de los macrotipos
        tipos.forEach(tipo => {
            const item = newE("option", "tipo", "")
            item.value = tipo
            item.textContent = tipo
            selTipo.appendChild(item)
        })

        //Aquí se listaran los tipos dentro del registro
        const cont_tipos = newE("div", "cont_tipos", "mb-3 border border-1 d-flex")
        //cont_tipos.style.height = "100px"
        formulario.appendChild(cont_tipos)

        _carga_tipos()

        function _carga_tipos() {
            cont_tipos.innerHTML = ""
            const sub_tipos = vigencia.clsCasos[index].clsTipos

            for (id in sub_tipos) {
                sub_tipos[id].id = id
                const el_tipo = newE("div", sub_tipos[id].nombre, "btn-label-gray")
                const i_boton = newE("i", "i_boton", "bi bi-trash3 ms-3")

                i_boton.style.cursor = "pointer"
                el_tipo.textContent = sub_tipos[id].nombre
                el_tipo.appendChild(i_boton)
                cont_tipos.appendChild(el_tipo)

                let criterio = sub_tipos[id].nombre
                i_boton.onclick = () => {
                    delete_item("clsTipos", "nombre", criterio)
                    _carga_tipos()
                    GuardarDatos(data_activo, vigencia)
                }
            }


        }

        selTipo.onchange = () => {
            const sub_tipos = vigencia.clsCasos[index].clsTipos
            sub_tipos.push(
                {
                    "id": 0,
                    "nombre": selTipo.value
                }
            )
            _carga_tipos()
            GuardarDatos(data_activo, vigencia)
        }

        //======================================================================================
        //============CREACIÓN DE SECCIÓN INFORMACIÓN TERRITORIAL
        const titulo6 = newE("label", "titulo_lugares", "fw-bold mt-2 text-secondary fs-5")
        titulo6.textContent = "Información territorial"
        formulario.appendChild(titulo6)

        const hr2 = newE("hr", "hr1", "border border-2 border-secondary")
        formulario.appendChild(hr2)

        const row2 = newE("div", "row2", "row")
        formulario.appendChild(row2)

        const col1_2 = newE("div", "col1_2", "col-md-3")
        row2.appendChild(col1_2)

        const titulo7 = newE("small", "titulo_dep", "fw-bold mb-2")
        titulo7.textContent = "Departamento"
        col1_2.appendChild(titulo7)


        const col2_2 = newE("div", "col2_2", "col-md-3")
        row2.appendChild(col2_2)

        const titulo8 = newE("small", "titulo_macro", "fw-bold mb-2")
        titulo8.textContent = "Macroregión"
        col2_2.appendChild(titulo8)

        const intMacro = newE("input", "intMacro", "form-control")
        intMacro.type = "text"
        intMacro.readOnly = true
        intMacro.value = vigencia.clsCasos[index].macroregion
        col2_2.appendChild(intMacro)

        const col3_2 = newE("div", "col3_2", "col-md-3")
        row2.appendChild(col3_2)

        const titulo9 = newE("small", "titulo_mun", "fw-bold mb-2")
        titulo9.textContent = "Municipio"
        col3_2.appendChild(titulo9)

        const divMunicipios = newE("div", "divMunicipios", "dropdown")
        col3_2.appendChild(divMunicipios)

        const btnMunicipios = newE("button", "btnMunicipios", "btn btn-secondary dropdown-toggle")
        btnMunicipios.type = "button"
        btnMunicipios.setAttribute("data-bs-toggle", "dropdown");
        btnMunicipios.textContent = "municipios"
        divMunicipios.appendChild(btnMunicipios)

        const ulMunicipios = newE("ul", "ulMunicipios", "dropdown-menu p-2")
        divMunicipios.appendChild(ulMunicipios)

        const intMunicipios = newE("input", "intMunicipios", "form-control mb-2")
        ulMunicipios.appendChild(intMunicipios)

        const lstMunicipios = newE("div", "lstMunicipios", "menu-group-scroll")
        ulMunicipios.appendChild(lstMunicipios)

        const selDepartamento = newE("select", "seldep", "form-control mb-3")
        col1_2.appendChild(selDepartamento)
        //Cargamos la lista de los departamentos
        departamentos.forEach(dep => {
            const item = newE("option", "dep", "")
            item.value = dep.departamento
            item.textContent = dep.departamento
            selDepartamento.appendChild(item)
        })

        //====Sección para crear nuevos lugares que no están en la lista
        const col4_2 = newE("div", "col4_2", "col")
        row2.appendChild(col4_2)

        const titulo10 = newE("small", "titulo10", "fw-bold mb-2")
        titulo10.textContent = "Nuevo lugar"
        col4_2.appendChild(titulo10)

        const divNewMunicipios = newE("div", "divNewMunicipios", "dropdown")
        col4_2.appendChild(divNewMunicipios)

        const btnNewMunicipios = newE("button", "btnNewMunicipios", "btn btn-secondary dropdown-toggle")
        btnNewMunicipios.type = "button"
        btnNewMunicipios.setAttribute("data-bs-toggle", "dropdown");
        btnNewMunicipios.textContent = " + "
        divNewMunicipios.appendChild(btnNewMunicipios)

        const ulNewMunicipios = newE("ul", "ulNewMunicipios", "dropdown-menu p-2 mt-1")
        divNewMunicipios.appendChild(ulNewMunicipios)

        const small_nuevo_lugar = newE("small", "small_nuevo_lugar", "fw-bold mb-2")
        small_nuevo_lugar.textContent = "Nombre"
        ulNewMunicipios.appendChild(small_nuevo_lugar)

        const int_newlugar = newE("input", "int_newlugar", "form-control")
        int_newlugar.type = "text"
        ulNewMunicipios.appendChild(int_newlugar)

        const small_coordenada = newE("small", "small_coordenada", "fw-bold mb-2")
        small_coordenada.textContent = "Coordenadas"
        ulNewMunicipios.appendChild(small_coordenada)

        const int_coordenada = newE("input", "int_coordenada", "form-control")
        int_coordenada.type = "text"
        int_coordenada.placeholder = "'0.0,-0.0'"
        ulNewMunicipios.appendChild(int_coordenada)

        const btnNewLugar = newE("button", "btnNewLugar", "btn btn-secondary m-1")
        btnNewLugar.type = "button"
        btnNewLugar.textContent = "Agregar"
        ulNewMunicipios.appendChild(btnNewLugar)

        btnNewLugar.onclick = () => {
            const coorde = int_coordenada.value.split(",")
            vigencia.clsCasos[index].clsLugares.push(
                {
                    "id": 0,
                    "lat": coorde[0].trim(),
                    "lng": coorde[1].trim(),
                    "municipio": int_newlugar.value,
                }
            )
            GuardarDatos(data_activo, vigencia)
            _carga_lugares()

        }


        //Aquí se crea anticipadamente el contenedor de lugares
        const cont_lugares = newE("div", "cont_lugares", "mb-3 border border-1 d-flex")
        //cont_tipos.style.height = "100px"
        formulario.appendChild(cont_lugares)

        //===================================================================
        selDepartamento.value = vigencia.clsCasos[index].departamento
        _make_municipios(selDepartamento.value, "")
        selDepartamento.onchange = () => {
            vigencia.clsCasos[index].departamento = selDepartamento.value
            const filterMacro = departamentos.filter(ele => ele.departamento == selDepartamento.value)
            intMacro.value = filterMacro[0].macroregion
            vigencia.clsCasos[index].macroregion = intMacro.value
            GuardarDatos(data_activo, vigencia)
            _make_municipios(selDepartamento.value, "")

        }
        //===================================================================

        intMunicipios.oninput = () => {
            _make_municipios(selDepartamento.value, intMunicipios.value)
        }

        function _make_municipios(dep, filtro) {
            lstMunicipios.innerHTML = ""
            const filterLugares = lugares.filter(ele => ele.departamento == dep)
            filterLugares.forEach(mun => {
                if (filtro !== "") {
                    if (mun.lugar.includes(filtro) == true) {
                        const item = newE("div", mun.lugar, "item-menu")
                        item.textContent = mun.lugar
                        lstMunicipios.appendChild(item)
                        item.onclick = () => {
                            vigencia.clsCasos[index].clsLugares.push(
                                {
                                    "id": 0,
                                    "lat": mun.lat,
                                    "lng": mun.lng,
                                    "municipio": mun.lugar,
                                }
                            )
                            GuardarDatos(data_activo, vigencia)
                            _carga_lugares()
                        }
                    }
                } else {
                    const item = newE("div", mun.lugar, "item-menu")
                    item.textContent = mun.lugar
                    lstMunicipios.appendChild(item)
                    item.onclick = () => {
                        const newLugar = {
                            "id": 0,
                            "lat": mun.lat,
                            "lng": mun.lng,
                            "municipio": mun.lugar,
                        }
                        vigencia.clsCasos[index].clsLugares.push(newLugar)
                        GuardarDatos(data_activo, vigencia)
                        _carga_lugares()

                    }
                }
            })
        }

        //Cargamos la lista de los lugares
        _carga_lugares()
        function _carga_lugares() {
            cont_lugares.innerHTML = ""
            const lista_lugares = vigencia.clsCasos[index].clsLugares
            for (id in lista_lugares) {
                lista_lugares[id].id = id
                const el_tipo = newE("div", lista_lugares[id].lugar, "btn-label-gray")
                const i_boton = newE("i", "i_boton", "bi bi-trash3 ms-3")

                i_boton.style.cursor = "pointer"
                el_tipo.textContent = lista_lugares[id].municipio
                el_tipo.appendChild(i_boton)
                cont_lugares.appendChild(el_tipo)

                let nombre = lista_lugares[id].municipio
                i_boton.onclick = () => {
                    delete_item("clsLugares", "municipio", nombre)
                    GuardarDatos(data_activo, vigencia)
                    _carga_lugares()
                }
            }
        }

        const titulo11 = newE("small", "titulo11", "fw-bold mb-2")
        titulo11.textContent = "Detalle del lugar"
        formulario.appendChild(titulo11)

        const in_detallelugar = newE("textarea", "in_detallelugar", "form-control")
        in_detallelugar.rows = "2"
        formulario.appendChild(in_detallelugar)
        in_detallelugar.value = vigencia.clsCasos[index].detalleLugar
        in_detallelugar.onchange = () => {
            vigencia.clsCasos[index].detalleLugar = in_detallelugar.value
        }

        //========Seccion demografia
        const titulo12 = newE("label", "titulo12", "fw-bold mt-2 text-secondary fs-5")
        titulo12.textContent = "Información demográfica"
        formulario.appendChild(titulo12)

        const hr3 = newE("hr", "hr3", "border border-2 border-secondary")
        formulario.appendChild(hr3)

        const row3 = newE("div", "row3", "row")
        formulario.appendChild(row3)
        const col_pueblo = newE("div", "col_pueblo", "col-md-6")
        row3.appendChild(col_pueblo)

        const titulo13 = newE("small", "titulo13", "fw-bold mb-2")
        titulo13.textContent = "Pueblo / Étnia"
        col_pueblo.appendChild(titulo13)

        const sel_pueblo = newE("select", "titulo13", "form-control")
        col_pueblo.appendChild(sel_pueblo)
        DataPueblos.forEach(pub => {
            const item = newE("option", pub, "")
            item.textContent = pub
            item.value = pub
            sel_pueblo.appendChild(item)
        })
        sel_pueblo.onchange = () => {
            vigencia.clsCasos[index].clsPueblos.push(
                {
                    "id": 0,
                    "nombre": sel_pueblo.value,
                }
            )
            GuardarDatos(data_activo, vigencia)
            _carga_pueblos()
        }

        const cont_pueblos = newE("div", "cont_pueblos", "mb-3 border border-1 d-flex")
        formulario.appendChild(cont_pueblos)

        _carga_pueblos()
        function _carga_pueblos() {
            cont_pueblos.innerHTML = ""
            const lista_pueblos = vigencia.clsCasos[index].clsPueblos
            for (id in lista_pueblos) {
                lista_pueblos[id].id = id
                const el_tipo = newE("div", lista_pueblos[id].lugar, "btn-label-gray")
                const i_boton = newE("i", "i_boton", "bi bi-trash3 ms-3")

                i_boton.style.cursor = "pointer"
                el_tipo.textContent = lista_pueblos[id].nombre
                el_tipo.appendChild(i_boton)
                cont_pueblos.appendChild(el_tipo)
                sel_pueblo.value = lista_pueblos[id].nombre.trim()
                let nombre = lista_pueblos[id].nombre
                i_boton.onclick = () => {
                    delete_item("clsPueblos", "nombre", nombre)
                    GuardarDatos(data_activo, vigencia)
                    _carga_pueblos()
                }
            }
            if (lista_pueblos.length > 6) {
                //cont_pueblos.style.height="100px"
            }
        }

        const col_newpueblo = newE("div", "col_newpueblo", "col-md-6")
        row3.appendChild(col_newpueblo)

        const titulo14 = newE("small", "titulo14", "fw-bold mb-2")
        titulo14.textContent = "Otro pueblo"
        col_newpueblo.appendChild(titulo14)

        const in_newPueblo = newE("input", "in_newPueblo", "form-control")
        col_newpueblo.appendChild(in_newPueblo)

        in_newPueblo.onchange = () => {
            vigencia.clsCasos[index].clsPueblos.push(
                {
                    "id": 0,
                    "nombre": in_newPueblo.value,
                }
            )
            GuardarDatos(data_activo, vigencia)
            _carga_pueblos()
        }

        ////////==================Numero de personas
        const row4 = newE("div", "row4", "row")
        formulario.appendChild(row4)
        const col_nvictimas = newE("div", "col_nvictimas", "col-md-3")
        row4.appendChild(col_nvictimas)

        /////////////////////
        const titulo15 = newE("small", "titulo15", "fw-bold mb-2")
        titulo15.textContent = "Afectados"
        col_nvictimas.appendChild(titulo15)

        const in_nvictimas = newE("input", "in_nvictimas", "form-control")
        in_nvictimas.type = "number"
        col_nvictimas.appendChild(in_nvictimas)


        in_nvictimas.value = vigencia.clsCasos[index].npersonas
        in_nvictimas.onchange = () => {
            vigencia.clsCasos[index].npersonas = in_nvictimas.value
        }

        /////////////////////

        const col_nmujeres = newE("div", "col_nmujeres", "col-md-3")
        row4.appendChild(col_nmujeres)

        const titulo16 = newE("small", "titulo16", "fw-bold mb-2")
        titulo16.textContent = "Número mujeres"
        col_nmujeres.appendChild(titulo16)

        const in_nmujeres = newE("input", "in_nmujeres", "form-control")
        in_nmujeres.type = "number"
        col_nmujeres.appendChild(in_nmujeres)

        in_nmujeres.value = vigencia.clsCasos[index].nmujeres
        in_nmujeres.onchange = () => {
            vigencia.clsCasos[index].nmujeres = in_nmujeres.value
        }

        /////////////////////
        const col_nhombres = newE("div", "col_nhombres", "col-md-3")
        row4.appendChild(col_nhombres)

        const titulo17 = newE("small", "titulo17", "fw-bold mb-2")
        titulo17.textContent = "Número hombres"
        col_nhombres.appendChild(titulo17)

        const in_nhombres = newE("input", "in_nhombres", "form-control")
        in_nhombres.type = "number"
        col_nhombres.appendChild(in_nhombres)

        in_nhombres.value = vigencia.clsCasos[index].nhombres
        in_nhombres.onchange = () => {
            vigencia.clsCasos[index].nhombres = in_nhombres.value
        }

        //////////////////////////////

        const col_nmenores = newE("div", "col_nmenores", "col-md-3")
        row4.appendChild(col_nmenores)

        const titulo18 = newE("small", "titulo18", "fw-bold mb-2")
        titulo18.textContent = "Número menores"
        col_nmenores.appendChild(titulo18)

        const in_nmenores = newE("input", "in_nmenores", "form-control")
        in_nmenores.type = "number"
        col_nmenores.appendChild(in_nmenores)

        in_nmenores.value = vigencia.clsCasos[index].nmenores
        in_nmenores.onchange = () => {
            vigencia.clsCasos[index].nmenores = in_nmenores.value
        }
        //////////////////////////////

        ////////==================Numero de personas
        const row5 = newE("div", "row5", "row mt-2")
        formulario.appendChild(row5)

        const col_addpersonas = newE("div", "col_addpersonas", "col-md-2")
        row5.appendChild(col_addpersonas)

        const btn_addpersonas = newE("button", "btn_addpersonas", "btn btn-secondary mt-2")
        btn_addpersonas.type = "button"
        btn_addpersonas.textContent = "Agregar nombres"
        col_addpersonas.appendChild(btn_addpersonas)

        btn_addpersonas.onclick = () => {
            vigencia.clsCasos[index].clsPersonas.push(
                {
                    "edad": 0,
                    "documento": "",
                    "nombres": "Nuevo nombre",
                    "genero": "Sin determinar",
                    "cargo": "",
                    "id": 0
                }
            )
            _cargar_personas()
            GuardarDatos(data_activo, vigencia)
        }


        const col_personas = newE("div", "col_personas", "col-md-10")
        row5.appendChild(col_personas)

        _cargar_personas()
        function _cargar_personas() {
            col_personas.innerHTML = ""
            let i = 0
            vigencia.clsCasos[index].clsPersonas.forEach(persona => {
                persona.id = i
                const btn_persona = newE("div", "", "btn btn-light btn-sm m-1")
                btn_persona.setAttribute("data-bs-toggle", "collapse");
                btn_persona.setAttribute("data-bs-target", "#collapse" + i);

                btn_persona.textContent = persona.nombres
                col_personas.appendChild(btn_persona)

                const collapse_persona = newE("div", "", "collapse p-2")
                collapse_persona.id = "collapse" + i
                //div_persona.style.display="block"
                col_personas.appendChild(collapse_persona)
                i++

                const div_persona = newE("div", "", "card card-body")
                div_persona.style.background = "#f2f4f4"
                collapse_persona.appendChild(div_persona)

                const smnombres = newE("small", "smnombres", "fw-bold")
                smnombres.textContent = "Nombres"
                div_persona.appendChild(smnombres)

                const int_nombres = newE("input", "int_nombres", "form-coltrol m-1")
                //int_nombres.style.display="block"
                //int_nombres.style.width="300px"
                int_nombres.type = "text"
                div_persona.appendChild(int_nombres)
                int_nombres.value = persona.nombres
                int_nombres.onchange = () => {
                    persona.nombres = int_nombres.value
                    btn_persona.textContent = int_nombres.value
                    GuardarDatos(data_activo, vigencia)
                }


                const smdocumento = newE("small", "smdocumento", "fw-bold")
                smdocumento.textContent = "Documento"
                //smdocumento.style.display="block"
                div_persona.appendChild(smdocumento)

                const int_documento = newE("input", "int_documento", "form-coltrol m-1")
                //int_documento.style.width="300px"
                int_documento.type = "text"
                div_persona.appendChild(int_documento)
                int_documento.value = persona.documento
                int_documento.onchange = () => {
                    persona.documento = int_documento.value
                    GuardarDatos(data_activo, vigencia)
                }

                const smgenero = newE("small", "smgenero", "fw-bold")
                smgenero.textContent = "Género"
                //smdocumento.style.display="block"
                div_persona.appendChild(smgenero)

                const int_genero = newE("select", "int_genero", "form-coltrol m-1")

                const generos = ["Hombre", "Mujer", "LGBTI", "Otro", "Sin determinar"]

                int_genero.value = persona.genero
                generos.forEach(ele => {
                    const option = newE("option", "ele", "")
                    option.value = ele
                    option.textContent = ele
                    int_genero.appendChild(option)
                })
                //int_genero.style.display="block"
                //int_genero.style.width="300px"
                int_genero.type = "text"
                div_persona.appendChild(int_genero)
                int_genero.value = persona.genero
                int_genero.onchange = () => {
                    persona.genero = int_genero.value
                    GuardarDatos(data_activo, vigencia)
                }

                const smedad = newE("small", "smedad", "fw-bold")
                smedad.textContent = "Edad"
                //smdocumento.style.display="block"
                div_persona.appendChild(smedad)

                const int_edad = newE("input", "int_edad", "form-coltrol m-1")
                //int_documento.style.width="300px"
                int_edad.type = "number"
                div_persona.appendChild(int_edad)
                int_edad.value = persona.edad
                int_documento.onchange = () => {
                    persona.edad = int_edad.value
                    GuardarDatos(data_activo, vigencia)
                }

                const smcargo = newE("small", "smcargo", "fw-bold")
                smcargo.textContent = "Cargo"
                //smdocumento.style.display="block"
                div_persona.appendChild(smcargo)

                const int_cargo = newE("input", "int_cargo", "form-coltrol m-1")
                //int_documento.style.width="300px"
                int_cargo.type = "text"
                div_persona.appendChild(int_cargo)
                int_cargo.value = persona.cargo
                int_documento.onchange = () => {
                    persona.cargo = int_cargo.value
                    GuardarDatos(data_activo, vigencia)
                }

                const btn_deletepersonas = newE("button", "btn_deletepersonas", "btn btn-secondary mt-2")
                btn_deletepersonas.type = "button"
                btn_deletepersonas.textContent = "Suprimir elemento"
                div_persona.appendChild(btn_deletepersonas)
                btn_deletepersonas.onclick = () => {
                    delete_item("clsPersonas", "id", persona.id)
                    _cargar_personas()
                    GuardarDatos(data_activo, vigencia)
                }

            })
        }

        //================================================
        //Creamos info de afectaciones
        const titulo19 = newE("label", "titulo19", "fw-bold mt-2 text-secondary fs-5")
        titulo19.textContent = "Actores y acciones"
        formulario.appendChild(titulo19)

        const hr4 = newE("hr", "hr4", "border border-2 border-secondary")
        formulario.appendChild(hr4)

        const row6 = newE("div", "row6", "row")
        formulario.appendChild(row6)
        const col_macroactor = newE("div", "col_macroactor", "col-md-4")
        row6.appendChild(col_macroactor)

        const smmacroactor = newE("small", "smmacroactor", "fw-bold")
        smmacroactor.textContent = "Macroactor"
        col_macroactor.appendChild(smmacroactor)

        const sel_macroactor = newE("select", "sel_macroactor", "form-control")
        col_macroactor.appendChild(sel_macroactor)

        DataMacroActor.forEach(ele => {
            const item = newE("option", "ele", "")
            item.value = ele
            item.textContent = ele
            sel_macroactor.appendChild(item)
        })
        sel_macroactor.value = vigencia.clsCasos[index].macroactor
        sel_macroactor.onchange = () => {
            vigencia.clsCasos[index].macroactor = sel_macroactor.value
            GuardarDatos(data_activo, vigencia)
        }
        //
        const col_microactor = newE("div", "col_microactor", "col-md-4")
        row6.appendChild(col_microactor)

        const smmicroactor = newE("small", "smmicroactor", "fw-bold")
        smmicroactor.textContent = "Microactor"
        col_microactor.appendChild(smmicroactor)

        const sel_microactor = newE("select", "sel_microactor", "form-control")
        col_microactor.appendChild(sel_microactor)

        DataActor.forEach(ele => {
            const item = newE("option", "ele", "")
            item.value = ele
            item.textContent = ele
            sel_microactor.appendChild(item)
        })

        try {
            //Verifica si hay una lista de actores para colocr el último
            sel_microactor.value = vigencia.clsCasos[index].clsActores[vigencia.clsCasos[index].clsActores.length - 1].nombre
        } catch (error) {

        }
        sel_microactor.onchange = () => {
            vigencia.clsCasos[index].clsActores.push({
                "id": 0,
                "nombre": sel_microactor.value
            })
            _carga_actores()
            GuardarDatos(data_activo, vigencia)
        }

        const col_otroactor = newE("div", "col_otroactor", "col-md-4")
        row6.appendChild(col_otroactor)

        const smotroactor = newE("small", "smotroactor", "fw-bold")
        smotroactor.textContent = "Otro actor"
        col_otroactor.appendChild(smotroactor)

        const int_otroactor = newE("input", "int_otroactor", "form-control")
        int_otroactor.type = "text"
        col_otroactor.appendChild(int_otroactor)
        int_otroactor.onchange = () => {
            vigencia.clsCasos[index].clsActores.push({
                "id": 0,
                "nombre": int_otroactor.value
            })
            _carga_actores()
            GuardarDatos(data_activo, vigencia)
        }


        const cont_actores = newE("div", "cont_actores", "mb-3 border border-1 d-flex")
        formulario.appendChild(cont_actores)
        _carga_actores()

        function _carga_actores() {
            cont_actores.innerHTML = ""
            const lista_actores = vigencia.clsCasos[index].clsActores
            for (id in lista_actores) {
                lista_actores[id].id = id
                const el_tipo = newE("div", lista_actores[id].nombre, "btn-label-gray")
                const i_boton = newE("i", "i_boton", "bi bi-trash3 ms-3")

                i_boton.style.cursor = "pointer"
                el_tipo.textContent = lista_actores[id].nombre
                el_tipo.appendChild(i_boton)
                cont_actores.appendChild(el_tipo)
                sel_microactor.value = lista_actores[id].nombre.trim()
                let nombre = lista_actores[id].nombre
                i_boton.onclick = () => {
                    delete_item("clsActores", "nombre", nombre)
                    GuardarDatos(data_activo, vigencia)
                    _carga_actores()
                }
            }
        }
        //////////////////////////////////////////////////////////////////////
        // Desplazamientos
        const row7 = newE("div", "row7", "row")
        formulario.appendChild(row7)
        const col_newdesplazamiento = newE("div", "col_newdesplazamiento", "col-md-2")
        row7.appendChild(col_newdesplazamiento)

        const smdesplazamiento = newE("small", "smdesplazamiento", "fw-bold me-3")
        smdesplazamiento.textContent = "Desplazamientos"
        col_newdesplazamiento.appendChild(smdesplazamiento)

        const col_desplazamiento = newE("div", "col_desplazamiento", "col-md-10")
        row7.appendChild(col_desplazamiento)
        _carga_desplazamientos()

        
        function _carga_desplazamientos() {
            col_desplazamiento.innerHTML = ""
            const deplazamientos = vigencia.clsCasos[index].clsDesplazamiento
            for (id in deplazamientos) {
                const row = newE("div", "rowdes" + id, "row")
                col_desplazamiento.appendChild(row)

                deplazamientos[id].id = id
                


                const btn_desplazamiento = newE("div", "", "btn-label-gray-long m-1")
                btn_desplazamiento.style.cursor = "pointer"
                btn_desplazamiento.setAttribute("data-bs-toggle", "collapse");
                btn_desplazamiento.setAttribute("data-bs-target", "#collapse_des" + id);

                btn_desplazamiento.textContent = deplazamientos[id].tipo
                row.appendChild(btn_desplazamiento)

                const collapse_despl = newE("div", "", "collapse p-2")
                collapse_despl.id = "collapse_des" + id
                row.appendChild(collapse_despl)

                const div_desplazamiento = newE("div", "", "card card-body")
                div_desplazamiento.style.background = "#f2f4f4"
                collapse_despl.appendChild(div_desplazamiento)

                const sm_tipo = newE("small", "sm_tipo", "fw-bold")
                sm_tipo.textContent = "Tipo de desplazamiento"
                div_desplazamiento.appendChild(sm_tipo)

                const tipos_despl = ['Colectivo', 'Individual', 'Unifamiliar', 'Multifamiliar', 'Otro', 'Sin determinar']
                const sel_tipo = newE("select", "", "form-control")
                div_desplazamiento.appendChild(sel_tipo)
                tipos_despl.forEach(ele => {
                    const item = newE("option", ele, "")
                    item.value = ele
                    item.textContent = ele
                    sel_tipo.appendChild(item)
                })

                sel_tipo.value = deplazamientos[id].tipo
                sel_tipo.onchange = () => {
                    deplazamientos[id].tipo = sel_tipo.value
                    btn_desplazamiento.textContent = sel_tipo.value
                    GuardarDatos(data_activo, vigencia)
                }

                const sm_fsalida = newE("small", "sm_fsalida", "fw-bold")
                sm_fsalida.textContent = "Fecha salída"
                div_desplazamiento.appendChild(sm_fsalida)

                const int_fecha_sal = newE("input", "", "form-control")
                int_fecha_sal.type = "date"
                div_desplazamiento.appendChild(int_fecha_sal)
                int_fecha_sal.value = deplazamientos[id].fechaex
                int_fecha_sal.onchange = () => {
                    deplazamientos[id].fechaex = int_fecha_sal.value
                    GuardarDatos(data_activo, vigencia)
                }


                //Aquí información del departamento de expulsión
                const sm_depDes = newE("small", "sm_tipo", "fw-bold")
                const sel_lugarOri = newE("select", "", "form-control")

                sm_depDes.textContent = "Departamento origen"
                div_desplazamiento.appendChild(sm_depDes)


                const sel_depDes = newE("select", "", "form-control")
                div_desplazamiento.appendChild(sel_depDes)

                departamentos.forEach(ele => {
                    const item = newE("option", ele.departamento, "")
                    item.value = ele.departamento
                    item.textContent = ele.departamento
                    sel_depDes.appendChild(item)
                })

                sel_depDes.value = deplazamientos[ind_Desplaz].DepartamentoExp

                _cargar_lugaresDes(deplazamientos[ind_Desplaz].DepartamentoExp)

                /////////////////////////////////////////////////////////////
                //  Lugar de salida

                const sm_lugarOri = newE("small", "sm_lugarOri", "fw-bold")
                sm_lugarOri.textContent = "Lugar de origen"
                div_desplazamiento.appendChild(sm_lugarOri)
                div_desplazamiento.appendChild(sel_lugarOri)

                sel_depDes.onchange = () => {
                    deplazamientos[ind_Desplaz].DepartamentoExp = sel_depDes.value
                    GuardarDatos(data_activo, vigencia)
                    _cargar_lugaresDes(sel_depDes.value)

                }

                function _cargar_lugaresDes(departamento) {
                    sel_lugarOri.innerHTML = ""
                    lugaresNew = lugares.filter(ele => ele.departamento == departamento)
                    lugaresNew.forEach(ele => {
                        const item = newE("option", ele.lugar, "")
                        item.value = [ele.lugar, ele.latlng]
                        item.textContent = ele.lugar
                        sel_lugarOri.appendChild(item)
                    })
                }
                sel_lugarOri.value = deplazamientos[ind_Desplaz].lugarOri
                sel_lugarOri.onchange = () => {
                    const datos = sel_lugarOri.value.split(",")
                    deplazamientos[ind_Desplaz].lugarOri = datos[0]
                    deplazamientos[ind_Desplaz].coorExp = [datos[1], datos[2]]
                    GuardarDatos(data_activo, vigencia)
                }
                /////////////////////////////////////////////////////////////
                //  Entorno de salida

                const sm_EntornoOri = newE("small", "sm_EntornoOri", "fw-bold")
                sm_EntornoOri.textContent = "Entorno de origen"
                div_desplazamiento.appendChild(sm_EntornoOri)

                const entornos = ["Rural", "Urbano", "Mixto", "Otro"]
                const sel_EntornoOri = newE("select", "", "form-control")
                div_desplazamiento.appendChild(sel_EntornoOri)

                entornos.forEach(ele => {
                    const item = newE("option", ele, "")
                    item.value = ele
                    item.textContent = ele
                    sel_EntornoOri.appendChild(item)
                })
                sel_EntornoOri.value = deplazamientos[ind_Desplaz].entornoOri
                sel_EntornoOri.onchange = () => {
                    deplazamientos[ind_Desplaz].entornoOri = sel_EntornoOri.value
                    GuardarDatos(data_activo, vigencia)
                }

                ///////////////////////////////////////////////////////7
                //Entorno de llegada

                const sm_fllegada = newE("small", "sm_fllegada", "fw-bold")
                sm_fllegada.textContent = "Fecha llegada"
                div_desplazamiento.appendChild(sm_fllegada)

                const int_fecha_lleg = newE("input", "", "form-control")
                int_fecha_lleg.type = "date"
                div_desplazamiento.appendChild(int_fecha_lleg)
                int_fecha_lleg.value = deplazamientos[ind_Desplaz].fechaDes
                int_fecha_lleg.onchange = () => {
                    deplazamientos[ind_Desplaz].fechaDes = int_fecha_lleg.value
                    GuardarDatos(data_activo, vigencia)
                }


                const sm_DepDestino = newE("small", "sm_DepDestino", "fw-bold")
                sm_DepDestino.textContent = "Departamento destino"
                div_desplazamiento.appendChild(sm_DepDestino)

                const sel_depDestino = newE("select", "sel_depDestino", "form-control")
                div_desplazamiento.appendChild(sel_depDestino)

                departamentos.forEach(ele => {
                    const item = newE("option", ele.departamento, "")
                    item.value = ele.departamento
                    item.textContent = ele.departamento
                    sel_depDestino.appendChild(item)
                })

                try {
                    sel_depDestino.value = deplazamientos[ind_Desplaz].DepartamentoDes
                } catch (error) {

                }

                sel_depDestino.onchange = () => {
                    deplazamientos[ind_Desplaz].DepartamentoDes = sel_depDestino.value
                    GuardarDatos(data_activo, vigencia)
                    _cargar_lugaresDestino(sel_depDestino.value)

                }
                _cargar_lugaresDestino(deplazamientos[ind_Desplaz].DepartamentoDes)

                function _cargar_lugaresDestino(departamento) {
                    sel_lugarDestino.innerHTML = ""
                    lugaresNew = lugares.filter(ele => ele.departamento == departamento)
                    lugaresNew.forEach(ele => {
                        const item = newE("option", ele.lugar, "")
                        item.value = [ele.lugar, ele.latlng]
                        item.textContent = ele.lugar
                        sel_lugarDestino.appendChild(item)
                    })
                }

                /////////////////////////////////////////////////////////////
                //  Lugar de salida

                const sm_lugarDestino = newE("small", "sm_lugarDestino", "fw-bold")
                sm_lugarDestino.textContent = "Lugar de destino"
                div_desplazamiento.appendChild(sm_lugarDestino)
                div_desplazamiento.appendChild(sel_lugarDestino)




                const sm_entornoDestino = newE("small", "sm_entornoDestino", "fw-bold")
                sm_entornoDestino.textContent = "Entorno de destino"
                div_desplazamiento.appendChild(sm_entornoDestino)

                const sel_EntornoLleg = newE("select", "", "form-control")
                div_desplazamiento.appendChild(sel_EntornoLleg)

                entornos.forEach(ele => {
                    const item = newE("option", ele, "")
                    item.value = ele
                    item.textContent = ele
                    sel_EntornoLleg.appendChild(item)
                })
                sel_EntornoLleg.value = deplazamientos[ind_Desplaz].TipoDes
                sel_EntornoLleg.onchange = () => {
                    deplazamientos[ind_Desplaz].TipoDes = sel_EntornoLleg.value
                    GuardarDatos(data_activo, vigencia)
                }

                /////////////////////////////////////////////////////////////////
                const btn_delete = newE("button", "", "btn btn-secondary mt-2")
                btn_delete.type = "button"
                btn_delete.textContent = "Suprimir elemento"
                div_desplazamiento.appendChild(btn_delete)
                btn_delete.onclick = () => {
                    delete_item("clsDesplazamiento", "id", ind_Desplaz)
                    _carga_desplazamientos()
                    GuardarDatos(data_activo, vigencia)
                }

            }

        }

        const btn_adddesplazamiento = newE("button", "btn_adddesplazamiento", "btn btn-secondary mt-2")
        btn_adddesplazamiento.type = "button"
        btn_adddesplazamiento.textContent = "Agregar +"
        col_newdesplazamiento.appendChild(btn_adddesplazamiento)

        btn_adddesplazamiento.onclick = () => {
            vigencia.clsCasos[index].clsDesplazamiento.push(
                {
                    "id": 0,
                    "tipo": "Sin determinar",
                    "DepartamentoExp": "",
                    "lugarOri": "Sin determinar",
                    "coorExp": "",
                    "fechaex": "",
                    "entornoOri": "",

                    "DepartamentoDes": "",
                    "LugarDes": "",
                    "coorDes": "",
                    "fechaDes": "",
                    "TipoDes": "",
                }
            )
            GuardarDatos(data_activo, vigencia)
            _carga_desplazamientos()
            
        }

        ////////////////////////////////////////////////7
        // Medidas o acciones
        const row8 = newE("div", "row8", "row")
        formulario.appendChild(row8)
        const col_newmedida = newE("div", "col_newmedida", "col-md-2")
        row8.appendChild(col_newmedida)

        const smmedidas = newE("small", "smmedidas", "fw-bold me-3")
        smmedidas.textContent = "Medidas"
        col_newmedida.appendChild(smmedidas)

        const col_medidas = newE("div", "col_medidas", "col-md-10")
        row8.appendChild(col_medidas)

        _carga_medidas()

        function _carga_medidas() {
            col_medidas.innerHTML = ""
            const medidas = vigencia.clsCasos[index].clsAccJuridica
            for (id in medidas) {
                const row = newE("div", "rowmed" + id, "row")
                col_medidas.appendChild(row)

                medidas[id].id = id

                const btn_medidas = newE("div", "", "btn-label-gray-long m-1")
                btn_medidas.style.cursor = "pointer"
                btn_medidas.setAttribute("data-bs-toggle", "collapse");
                btn_medidas.setAttribute("data-bs-target", "#collapse_med" + id);

                btn_medidas.textContent = medidas[id].accion
                row.appendChild(btn_medidas)

                const collapse_med = newE("div", "", "collapse p-2")
                collapse_med.id = "collapse_med" + id
                row.appendChild(collapse_med)

                const div_medidas = newE("div", "", "card card-body")
                div_medidas.style.background = "#f2f4f4"
                collapse_med.appendChild(div_medidas)

                const sm_accion = newE("small", "sm_accion", "fw-bold")
                sm_accion.textContent = "Tipo de acción"
                div_medidas.appendChild(sm_accion)

                const tipos_medidas = ['Acción Urgente', 'Denuncia pública', 'Comunicado', 'Demanda', 'Chat de emergencia', 'Otro', 'Sin determinar']
                const sel_tipoMed = newE("select", "", "form-control")
                div_medidas.appendChild(sel_tipoMed)
                tipos_medidas.forEach(ele => {
                    const item = newE("option", ele, "")
                    item.value = ele
                    item.textContent = ele
                    sel_tipoMed.appendChild(item)
                })

                sel_tipoMed.value = medidas[id].accion
                sel_tipoMed.onchange = () => {
                    medidas[id].accion = sel_tipoMed.value
                    btn_medidas.textContent = sel_tipoMed.value
                    GuardarDatos(data_activo, vigencia)
                }

                const sm_faccion = newE("small", "sm_faccion", "fw-bold")
                sm_faccion.textContent = "Fecha de acción"
                div_medidas.appendChild(sm_faccion)

                const int_fecha_acc = newE("input", "", "form-control")
                int_fecha_acc.type = "date"
                div_medidas.appendChild(int_fecha_acc)
                int_fecha_acc.value = medidas[id].fecha
                int_fecha_acc.onchange = () => {
                    medidas[id].fecha = int_fecha_acc.value
                    GuardarDatos(data_activo, vigencia)
                }

                const sm_raccion = newE("small", "sm_raccion", "fw-bold")
                sm_raccion.textContent = "Respuesta"
                div_medidas.appendChild(sm_raccion)

                const int_respuesata = newE("input", "", "form-control")
                int_respuesata.type = "text"
                div_medidas.appendChild(int_respuesata)
                int_respuesata.value = medidas[id].respuesta
                int_respuesata.onchange = () => {
                    medidas[id].respuesta = int_respuesata.value
                    GuardarDatos(data_activo, vigencia)
                }

                /////////////////////////////////////////////////////////////////
                const btn_delete = newE("button", "", "btn btn-secondary mt-2")
                btn_delete.type = "button"
                btn_delete.textContent = "Suprimir elemento"
                div_medidas.appendChild(btn_delete)
                btn_delete.onclick = () => {
                    delete_item("clsAccJuridica", "id", id)
                    _carga_medidas()
                    GuardarDatos(data_activo, vigencia)
                }
            }


        }
        const btn_addmedidas = newE("button", "btn_addmedidas", "btn btn-secondary mt-2")
        btn_addmedidas.type = "button"
        btn_addmedidas.textContent = "Agregar +"
        col_newmedida.appendChild(btn_addmedidas)

        btn_addmedidas.onclick = () => {
            vigencia.clsCasos[index].clsAccJuridica.push(
                {
                    "fecha": "",
                    "id": 0,
                    "accion": "Sin determinar",
                    "respuesta": ""
                }
            )
            _carga_medidas()
            GuardarDatos(data_activo, vigencia)
        }
        /////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////
        //               Fuente de la información

        const titulo20 = newE("label", "titulo20", "fw-bold mt-2 text-secondary fs-5")
        titulo20.textContent = "Fuente de la información"
        formulario.appendChild(titulo20)

        const hr5 = newE("hr", "hr5", "border border-2 border-secondary")
        formulario.appendChild(hr5)

        const row9 = newE("div", "row9", "row")
        formulario.appendChild(row9)

        const col_fuente = newE("div", "col_fuente", "col-md-4")
        row9.appendChild(col_fuente)

        const sm_fuente = newE("small", "sm_fuente", "fw-bold mb-2")
        sm_fuente.textContent = "Nombre fuente"
        col_fuente.appendChild(sm_fuente)

        const int_fuente = newE("input", "", "form-control")
        int_fuente.type = "text"
        col_fuente.appendChild(int_fuente)
        int_fuente.value = vigencia.clsCasos[index].fuente
        int_fuente.onchange = () => {
            vigencia.clsCasos[index].fuente = int_fuente.value
            GuardarDatos(data_activo, vigencia)
        }

        const col_ffuente = newE("div", "col_ffuente", "col-md-4")
        row9.appendChild(col_ffuente)

        const sm_ffuente = newE("small", "sm_ffuente", "fw-bold mb-2")
        sm_ffuente.textContent = "Fecha fuente"
        col_ffuente.appendChild(sm_ffuente)

        const int_ffuente = newE("input", "", "form-control")
        int_ffuente.type = "date"
        col_ffuente.appendChild(int_ffuente)
        int_ffuente.value = vigencia.clsCasos[index].fechafuente
        int_ffuente.onchange = () => {
            vigencia.clsCasos[index].fechafuente = int_ffuente.value
            GuardarDatos(data_activo, vigencia)
        }

        const col_efuente = newE("div", "col_ffuente", "col-md-4")
        row9.appendChild(col_efuente)

        const sm_efuente = newE("small", "sm_efuente", "fw-bold mb-2")
        sm_efuente.textContent = "Enlace o contacto fuente"
        col_efuente.appendChild(sm_efuente)

        const div_efuente = newE("div", "div_efuente", "input-group flex-nowrap")
        col_efuente.appendChild(div_efuente)


        const int_efuente = newE("input", "int_efuente", "form-control")
        int_efuente.type = "text"
        div_efuente.appendChild(int_efuente)
        int_efuente.value = vigencia.clsCasos[index].enlace
        int_efuente.onchange = () => {
            vigencia.clsCasos[index].enlace = int_efuente.value
            GuardarDatos(data_activo, vigencia)
        }

        const sp_efuente = newE("span", "sp_efuente", "input-group-text btn-mini-gray")
        div_efuente.appendChild(sp_efuente)


        const i_efuente = newE("i", "i_efuente", "bi bi-link-45deg")
        sp_efuente.appendChild(i_efuente)


        sp_efuente.onclick = () => {
            window.open(int_efuente.value, '_blank')
        }



        //============================================================
        //Borra elementos que están dentro de una subclase del registro
        function delete_item(clase, campo, valor) {

            const filter = vigencia.clsCasos[index][clase].filter(ele => ele[campo] !== valor)
            vigencia.clsCasos[index][clase] = filter
        }

        //===============================================================
        //Función para crear un registro o caso nuevo
        function crear_registro(data, vig) {
            template_caso.vigencia = vig
            data.clsCasos.push(template_caso)
            GuardarDatos(data_activo, vigencia)
            _contador_registros(vigencia, 0)
        }
        //============================================================
        //Se borra la totalidad del caso
        function eliminar_registro(data, idx) {
            const filtered = data.clsCasos.filter(ele => ele.id !== idx)
            //GuardarDatos(data_activo, vigencia)
            data.clsCasos = filtered
            GuardarDatos(data_activo, vigencia)
            _contador_registros(vigencia, 0)
            _mover_aRegistro("primero", vigencia, 0)
        }
    }

    function _contador_registros(vigencia, index) {
        //Aquí contamos el número de registros de la vigencia y la posición en la que estamos
        byE("col_pos_registros").textContent = `Registro ${index + 1} de ${vigencia.clsCasos.length}`
        //alert(vigencia.clsCasos.length)
    }


}




function GuardarDatos(data_activo, vigencia) {
    //Pasamos lo editado a la variable global
    GLOBAL.state.vigencias[data_activo] = vigencia
    const id = GLOBAL.firestore.updateVigencia(GLOBAL.state.vigencias[data_activo])
}
