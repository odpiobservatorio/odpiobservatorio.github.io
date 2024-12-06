let join_Data = [];
let split_Data;
let ActiveData;
function openIni() {
    byE("menu_general").hidden = false
    //alert("ingresamos")
    //console.log(GLOBAL.state.vigencias)

    const temp_vigencias = GLOBAL.state.vigencias

    temp_vigencias.forEach(vigencia => {

        vigencia.clsCasos.forEach(caso => {
            join_Data.push({
                "clsCasos": caso
            })
        })
    })
    split_Data = GLOBAL.state.vigencias
}
function run_casos() {
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
    let last_vigencia;
    let contador = 0
    split_Data.forEach(vigencia => {
        const item = newE("option", "option" + vigencia.id, "")
        item.value = contador
        item.textContent = vigencia.id
        selVigencias.appendChild(item)
        last_vigencia = contador
        contador++
    })

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




    //======================================================================================


    //Crear un contenedor para todos los controles de entrada por registro
    const formulario = newE("div", "formulario", "container")
    contenedor.appendChild(formulario)

    //Automatiza al iniciar el módulo, colocnado en el primer registro de la vigencia y últiam vigencia
    selVigencias.value = last_vigencia
    _make_registros(split_Data[last_vigencia], 0, last_vigencia)
    _contador_registros(split_Data[last_vigencia], 0)


    //Acciones cuando se cambie la vigencias del selector
    selVigencias.onchange = () => {
        _make_registros(split_Data[selVigencias.value], 0, selVigencias.value)
        _contador_registros(split_Data[selVigencias.value], 0)
    }



    function _mover_aRegistro(criterio, vigencia, index) {

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
        small_nuevo_lugar.textContent="Nombre"
        ulNewMunicipios.appendChild(small_nuevo_lugar)

        const int_newlugar = newE("input", "int_newlugar", "form-control")
        int_newlugar.type="text"
        ulNewMunicipios.appendChild(int_newlugar)

        const small_coordenada = newE("small", "small_coordenada", "fw-bold mb-2")
        small_coordenada.textContent="Coordenadas"
        ulNewMunicipios.appendChild(small_coordenada)

        const int_coordenada = newE("input", "int_coordenada", "form-control")
        int_coordenada.type="text"
        int_coordenada.placeholder="'0.0,-0.0'"
        ulNewMunicipios.appendChild(int_coordenada)

        const btnNewLugar = newE("button", "btnNewLugar", "btn btn-secondary m-1")
        btnNewLugar.type="button"
        btnNewLugar.textContent="Agregar"
        ulNewMunicipios.appendChild(btnNewLugar)

        btnNewLugar.onclick=()=>{
            const coorde= int_coordenada.value.split(",")
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
            console.log(vigencia.clsCasos[index].clsLugares)
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
        titulo11.textContent="Detalle del lugar"
        formulario.appendChild(titulo11)

        const in_detallelugar = newE("textarea", "in_detallelugar", "form-control")
        in_detallelugar.rows="2"
        formulario.appendChild(in_detallelugar)
        in_detallelugar.value=vigencia.clsCasos[index].detalleLugar
        in_detallelugar.onchange=()=>{
            vigencia.clsCasos[index].detalleLugar=in_detallelugar.value
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
        titulo13.textContent="Pueblo / Étnia"
        col_pueblo.appendChild(titulo13)

        const col_newpueblo = newE("div", "col_newpueblo", "col-md-6")
        row3.appendChild(col_newpueblo)

        const titulo14 = newE("small", "titulo14", "fw-bold mb-2")
        titulo14.textContent="Otro pueblo"
        col_newpueblo.appendChild(titulo14)



        //console.log(vigencia.clsCasos[index])


        //============================================================
        function delete_item(clase, campo, valor) {
            //console.log(nombre)
            const filter = vigencia.clsCasos[index][clase].filter(ele => ele[campo] !== valor)
            vigencia.clsCasos[index][clase] = filter
        }

        function crear_registro(data, vig) {
            template_caso.vigencia = vig
            data.clsCasos.push(template_caso)
            GuardarDatos(data_activo, vigencia)
        }
        //============================================================
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
