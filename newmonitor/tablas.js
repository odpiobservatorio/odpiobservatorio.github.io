const campos = [
    ["clsCasos", "macroregion", "MACROREGIÓN", "1"],
    ["clsCasos", "departamento", "DEPARTAMENTO", "1"],
    ["clsLugares", "municipio", "LUGARES", "1"],
    ["clsLugares", "lat", "LAT", "0"],
    ["clsLugares", "lng", "LNG", "0"],
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
    ["clsCasos", "enlace", "ENLACE", "0"],
    ["clsCasos", "detalle", "DETALLE", "0"],
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
    //======================================================================================


    //Crear un contenedor para todos los controles de entrada por registro


    contenedor.appendChild(formulario)

    function _make_tabla(vigencia) {
        formulario.innerHTML = ""
        const data_tabla = newE("table", "data_tabla", "table table-hover mt-2")
        //data_tabla.style.width = "2000px"
        formulario.appendChild(data_tabla)

        const data_Encabezados = newE("thead", "data_Encabezados", "m-3")
        data_tabla.appendChild(data_Encabezados)

        //Crear los encabezados dinámicamente
        const fila_Encabezado = newE("tr", "fila_Encabezado", "mb-2")
        data_Encabezados.appendChild(fila_Encabezado)

        const thscope_col = newE("th", "thscope_col", "tabla-cell")
        thscope_col.scope = "col"
        thscope_col.textContent = "#"
        fila_Encabezado.appendChild(thscope_col)

        campos.forEach(campo => {
            if (campo[3] == "1") {
                const th = newE("th", "th" + campo[2], "tabla-cell td-fitwidth")
                th.textContent = campo[2]
                fila_Encabezado.appendChild(th)

                //const div = document.createElement("div")
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

            const th = newE("th", "", "tabla-cell-scope") //Aquí está el numerador indice por caso
            th.scope = "row"
            th.textContent = caso.id + 1
            th.onmouseover=()=>{
                mensajes_tool("Abrir registro","black")
            }
            tr.appendChild(th)

            let nCol = 0 //Inicia el contador según la columna o campo 
            campos.forEach(data_columna => { //Busca en la tabla de los campos
                if (data_columna[3] == "1") { //Si el campo está visible "1" crear la columna
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




    }
}