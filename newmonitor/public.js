const formatNum = (numero) => {
    const valorUnformat = numero
    const valFormated = valorUnformat.toLocaleString("us-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    return valFormated
}
function load_info_public() {
    const fecha_corte = new Date();
    let dia = fecha_corte.getDate()
    let mes = fecha_corte.getMonth() + 1
    let vig = fecha_corte.getFullYear()

    //GLOBAL.state.publicos
    //Iniciamos la recolección de los datos generales, casos y víctimas.
    let template_public = {
        'corte': "",
        'nCasos': 0,
        'nVictimas': 0,
        'nCasosHoy': 0,
        'nVictimasHoy': 0,
        'A_Vigencia': {
            'mayorCasos': ["", 0],
            'mayorVictimas': ["", 0],
            'text': "",
            'acumulado': [],
        },
        'A_Departamento': {
            'mayorCasos': ["", 0],
            'mayorVictimas': ["", 0],
            'text': "",
            'acumulado': [],
        },
        'A_Lugares': {
            'mayorCasos': ["", 0],
            'mayorVictimas': ["", 0],
            'text': "",
            'acumulado': [],
        }

    }

    let nCasos = 0
    let nVictimas = 0
    let nCasosHoy = 0
    let nVictimasHoy = 0

    let List_Vigencias = []
    let Data_vigencias = {}
    let List_Departamentos = []
    let Data_Departamentos = {}
    let List_Lugares = []
    let Data_Lugares = {}

    for (id in split_Data) {
        const vigencia = split_Data[id]

        vigencia.clsCasos.forEach(caso => {
            nCasos++ //Aquí se suman todos los casos de cada vigencia
            nVictimas = nVictimas + parseInt(caso.npersonas)
            //Si la vigencia actual es la última, entonces guarda el dato
            if (caso.vigencia == vig) {
                nCasosHoy++
                nVictimasHoy = nVictimasHoy + parseInt(caso.npersonas)
            }
            //Verifica si hay una vigencia en la lista de vigencias
            if (List_Vigencias.includes(caso.vigencia) != true) {
                List_Vigencias.push(caso.vigencia)
                Data_vigencias[caso.vigencia] = {
                    'vigencia': caso.vigencia,
                    'casos': 1,
                    'victimas': 1
                }
            }
            //Verifica si hay departamento en la lista de departamentos
            if (List_Departamentos.includes(caso.departamento) != true) {
                List_Departamentos.push(caso.departamento)
                Data_Departamentos[caso.departamento] = {
                    'departamento': caso.departamento,
                    'casos': 1,
                    'victimas': 1
                }
            }
            //Realizamos verificación de lugares
            caso.clsLugares.forEach(lug => {
                {
                    if (List_Lugares.includes(lug.municipio) != true) {
                        List_Lugares.push(lug.municipio)
                        Data_Lugares[lug.municipio] = {
                            'municipio': lug.municipio,
                            'casos': 1,
                            'victimas': 1
                        }
                    }
                }
            })
        });
    }


    //Conteos por año
    List_Vigencias.forEach(vig => {
        let n = 0
        for (id in split_Data) {
            const vigencia = split_Data[id]
            vigencia.clsCasos.forEach(caso => {
                if (caso.vigencia == vig) {
                    Data_vigencias[caso.vigencia].casos = n
                    Data_vigencias[caso.vigencia].victimas = Data_vigencias[caso.vigencia].victimas + parseInt(caso.npersonas)
                    n++
                }
            });
        }
        //Calcula los puntajes más altos en casos y victimas por año
        if (template_public.A_Vigencia.mayorCasos[1] < Data_vigencias[vig].casos) {
            template_public.A_Vigencia.mayorCasos[0] = Data_vigencias[vig].vigencia
            template_public.A_Vigencia.mayorCasos[1] = Data_vigencias[vig].casos
        }
        if (template_public.A_Vigencia.mayorVictimas[1] < Data_vigencias[vig].victimas) {
            template_public.A_Vigencia.mayorVictimas[0] = Data_vigencias[vig].vigencia
            template_public.A_Vigencia.mayorVictimas[1] = Data_vigencias[vig].victimas
        }
    })


    //Conteos por departamento
    List_Departamentos.forEach(dep => {
        let n = 0
        for (id in split_Data) {
            const vigencia = split_Data[id]
            vigencia.clsCasos.forEach(caso => {
                if (caso.departamento == dep) {
                    Data_Departamentos[caso.departamento].casos = n
                    Data_Departamentos[caso.departamento].victimas = Data_Departamentos[caso.departamento].victimas + parseInt(caso.npersonas)
                    n++
                }
            });
        }
        //Calcula los puntajes más altos en casos y victimas por año
        if (template_public.A_Departamento.mayorCasos[1] < Data_Departamentos[dep].casos) {
            template_public.A_Departamento.mayorCasos[0] = Data_Departamentos[dep].departamento
            template_public.A_Departamento.mayorCasos[1] = Data_Departamentos[dep].casos
        }
        if (template_public.A_Departamento.mayorVictimas[1] < Data_Departamentos[dep].victimas) {
            template_public.A_Departamento.mayorVictimas[0] = Data_Departamentos[dep].departamento
            template_public.A_Departamento.mayorVictimas[1] = Data_Departamentos[dep].victimas
        }
    })

    //Conteos por municipios/lugares
    List_Lugares.forEach(lug => {
        let n = 1
        for (id in split_Data) {
            const vigencia = split_Data[id]
            vigencia.clsCasos.forEach(caso => {
                caso.clsLugares.forEach(mun => {
                    if (mun.municipio == lug) {
                        Data_Lugares[mun.municipio].casos = n
                        Data_Lugares[mun.municipio].victimas = Data_Lugares[mun.municipio].victimas + parseInt(caso.npersonas)
                        n++
                    }
                })

            });
            //Calcula los puntajes más altos en casos y victimas por año
            if (template_public.A_Lugares.mayorCasos[1] < Data_Lugares[lug].casos) {
                template_public.A_Lugares.mayorCasos[0] = Data_Lugares[lug].municipio
                template_public.A_Lugares.mayorCasos[1] = Data_Lugares[lug].casos
            }
            if (template_public.A_Lugares.mayorVictimas[1] < Data_Lugares[lug].victimas) {
                template_public.A_Lugares.mayorVictimas[0] = Data_Lugares[lug].municipio
                template_public.A_Lugares.mayorVictimas[1] = Data_Lugares[lug].victimas
            }
        }


    })

    template_public.nCasos = nCasos
    template_public.nCasosHoy = nCasosHoy
    template_public.nVictimas = nVictimas
    template_public.nVictimasHoy = nVictimasHoy


    let texto_vigencias =
        `<p>Para el análisis realizado por el <i>CLÚSTER ODPI</i> en relación a la variable AÑO 
    se evidencia que la vigencia con mayor número de casos de afectaciones a los derechos de 
    los pueblos indígenas es el año <b>${template_public.A_Vigencia.mayorCasos[0]}</b> 
    con un total de <b>${template_public.A_Vigencia.mayorCasos[1]}</b> casos registrados.
    <p> En relación a el número de víctimas por año se encuentra que el año 
    <b>${template_public.A_Vigencia.mayorVictimas[0]}</b> es la vigencia con más registro de víctimas con
    un total de <b>${template_public.A_Vigencia.mayorVictimas[1]}</b> personas.`

    template_public.A_Vigencia.text = texto_vigencias
    template_public.A_Vigencia.acumulado = sort_data("AZ", Data_vigencias, "victimas")


    let texto_departamentos =
        `<p>Con relación a la identificación de la variable LUGAR en el caso de los departamentos con mayor
    número de afectaciones se puede decir que <b>${template_public.A_Departamento.mayorCasos[0]}</b> es el que presenta
    mayor número de casos con una cifra de <b>${template_public.A_Departamento.mayorCasos[1]}</b>.
    <p> En relación a el número de víctimas por departamento se encuentra 
    <b>${template_public.A_Departamento.mayorVictimas[0]}</b> lugar con un registro de 
    <b>${template_public.A_Departamento.mayorVictimas[1]}</b> personas.`

    template_public.A_Departamento.text = texto_departamentos
    template_public.A_Departamento.acumulado = sort_data("AZ", Data_Departamentos, "victimas")//


    let texto_lugares =
        `<p>El municipio con mayor afectación es <b>${template_public.A_Lugares.mayorCasos[0]}</b> con un registro de <b>${template_public.A_Lugares.mayorCasos[1]}</b> casos.
    Con relación al número de víctimas por lugar se encuentra  
    <b>${template_public.A_Lugares.mayorVictimas[0]}</b> con un total de  
    <b>${template_public.A_Lugares.mayorVictimas[1]}</b> personas.`

    template_public.A_Lugares.text = texto_lugares
    template_public.A_Lugares.acumulado = sort_data("AZ", Data_Lugares, "victimas")//




    template_public.corte = `${dia}/${mes}/${vig}`


    GLOBAL.state.publicos[1].consolidados = template_public
    save_public_data()

}
function opendata() {
    //console.clear()
    try {
        const data_public = GLOBAL.state.publicos[1].consolidados
        byE("nVictimas").textContent = formatNum((data_public.nVictimas))
        byE("nCasos").textContent = formatNum(data_public.nCasos)
        byE("nCasosHoy").textContent = formatNum(data_public.nCasosHoy)
        byE("nVictimasHoy").textContent = formatNum((data_public.nVictimasHoy))

        //Construimos la información sobre vigencias
        byE("text_vigencias").innerHTML = data_public.A_Vigencia.text
        byE("col_tabla_vigencias").innerHTML=""
        byE("col_tabla_vigencias").appendChild(make_tabla(data_public.A_Vigencia.acumulado, "Vigencia", "vigencia"))


        //Constuimos la información sobre departamentos
        byE("text_departamentos").innerHTML = data_public.A_Departamento.text
        byE("col_tabla_departamentos").innerHTML=""
        byE("col_tabla_departamentos").appendChild(make_tabla(data_public.A_Departamento.acumulado, "Vigencia", "departamento"))

        //Constuimos la información sobre departamentos
        byE("text_lugares").innerHTML = data_public.A_Lugares.text
        byE("col_tabla_lugares").innerHTML=""
        byE("col_tabla_lugares").appendChild(make_tabla(data_public.A_Lugares.acumulado, "Vigencia", "municipio"))

        byE("lb_corte").textContent = "Fecha de actualización: " + data_public.corte
    } catch (error) {
        console.log("No en módulo público")
        byE("panel_escritorio").textContent = "En conexión"
    }
}
function make_tabla(data, categoria, campo) {
    const newTable = newE("table", "table" + categoria, "table table-public table-striped table-hover")
    const newTHead = newE("thead", "newTHead" + categoria, "text-white bg-secondary")
    newTable.appendChild(newTHead)

    const newtrHead = newE("tr", "newtrHead" + categoria, "")
    newTHead.appendChild(newtrHead)

    const newth_categoria = newE("th", "newth_categoria" + categoria, "")
    newth_categoria.textContent = categoria
    newtrHead.appendChild(newth_categoria)

    const newth_casos = newE("th", "newth_casos" + categoria, "")
    newtrHead.appendChild(newth_casos)

    const menu_casos = newE("div", "menu_casos" + categoria, "dropdown")
    newth_casos.appendChild(menu_casos)
    const btnmenu_casos = newE("button", "btnmenu_casos" + categoria, "btn btn-white dropdown-toggle")
    btnmenu_casos.type = "button"
    btnmenu_casos.setAttribute("data-bs-toggle", "dropdown")
    btnmenu_casos.textContent = "Casos"
    menu_casos.appendChild(btnmenu_casos)

    const ul_casos = newE("ul", "ul_casos" + categoria, "dropdown-menu")
    menu_casos.appendChild(ul_casos)

    const op_AZ = newE("div", "op_AZ" + categoria, "item-menu ms-3")
    op_AZ.textContent = "A-Z"
    ul_casos.appendChild(op_AZ)
    op_AZ.onclick = () => {
        _make_files(sort_data("ZA", data, "casos"))
    }

    const op_ZA = newE("div", "op_ZA" + categoria, "item-menu ms-3")
    op_ZA.textContent = "Z-A"
    ul_casos.appendChild(op_ZA)
    op_ZA.onclick = () => {
        _make_files(sort_data("AZ", data, "casos"))
    }


    const newth_victimas = newE("th", "newth_victimas" + categoria, "")
    newtrHead.appendChild(newth_victimas)

    const menu_victimas = newE("div", "menu_victimas" + categoria, "dropdown")
    newth_victimas.appendChild(menu_victimas)
    const btnmenu_victimas = newE("button", "btnmenu_victimas" + categoria, "btn btn-white dropdown-toggle")
    btnmenu_victimas.type = "button"
    btnmenu_victimas.setAttribute("data-bs-toggle", "dropdown")
    btnmenu_victimas.textContent = "Víctimas"
    menu_victimas.appendChild(btnmenu_victimas)

    const ul_victimas = newE("ul", "ul_victimas" + categoria, "dropdown-menu")
    menu_victimas.appendChild(ul_victimas)

    const op_AZ_victimas = newE("div", "op_AZ_victimas" + categoria, "item-menu ms-3")
    op_AZ_victimas.textContent = "A-Z"
    ul_victimas.appendChild(op_AZ_victimas)
    op_AZ_victimas.onclick = () => {
        _make_files(sort_data("ZA", data, "victimas"))
    }

    const op_ZA_victimas = newE("div", "op_ZA_victimas" + categoria, "item-menu ms-3")
    op_ZA_victimas.textContent = "Z-A"
    ul_victimas.appendChild(op_ZA_victimas)
    op_ZA_victimas.onclick = () => {
        _make_files(sort_data("AZ", data, "victimas"))
    }

    const newtBody = newE("tbody", "newtBody" + categoria, "table-group-divider")
    newTable.appendChild(newtBody)

    _make_files(data)

    function _make_files(data) {
        newtBody.innerHTML = ""
        for (id in data) {
            const tr = newE("tr", "tr_dep" + id, "")
            const td_cat = newE("td", "td_categoria" + categoria + id, "fw-bold")
            td_cat.textContent = data[id][campo]
            tr.appendChild(td_cat)

            const td_casos = newE("td", "td_casos_" + categoria + id, "fw_normal text-end")
            td_casos.textContent = parseInt(data[id].casos) + 1
            tr.appendChild(td_casos)

            const td_victimas = newE("td", "td_victimas" + id, "fw_normal text-end")
            td_victimas.textContent = data[id].victimas
            tr.appendChild(td_victimas)

            newtBody.appendChild(tr)

        }
    }




    return newTable


}

function save_public_data() {
    const id = GLOBAL.firestore.updatePublico(GLOBAL.state.publicos[1])
}

function sort_data(orden, data, campo) {
    const data_sort_ini = data
    let sortedDataArray

    const DataArray = Object.entries(data_sort_ini).map(([key, value]) => ({ ...value, key: key }))
    if (orden == "AZ") {
        sortedDataArray = DataArray.sort((a, b) => b[campo] - a[campo])
    } else {
        sortedDataArray = DataArray.sort((a, b) => a[campo] - b[campo])
    }
    return sortedDataArray

}
