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
    const row_botones = newE("div", "row0", "row bg-secondary ms-2 align-items-center pb-2")
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
        fecha_evento.onchange=()=>{
            vigencia.clsCasos[index].fecha=fecha_evento.value
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
        selMacrotipo.onchange=()=>{
            vigencia.clsCasos[index].macrotipo=selMacrotipo.value
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
        in_detalle.onchange=()=>{
            vigencia.clsCasos[index].detalle=in_detalle.value
            GuardarDatos(data_activo, vigencia)
        }


        //console.log(vigencia.clsCasos[index])



    }


    function _contador_registros(vigencia, index) {
        //Aquí contamos el número de registros de la vigencia y la posición en la que estamos
        byE("col_pos_registros").textContent = `Registro ${index + 1} de ${vigencia.clsCasos.length}`
        //alert(vigencia.clsCasos.length)
    }

}

function GuardarDatos(data_activo, vigencia) {
    //Pasamos lo editado a la variable global
    GLOBAL.state.vigencias[data_activo]=vigencia
    const id = GLOBAL.firestore.updateVigencia(GLOBAL.state.vigencias[data_activo])
}