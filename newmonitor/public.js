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
        },
        "microInformeHoy": {
            "SIG": [],
            "calor-dep": [],
            "macro-tipos": {
                "data": [],
                "lista": []
            }
        }
    }

    let nCasos = 0
    let nVictimas = 0
    let nCasosHoy = 0
    let nVictimasHoy = 0

    let List_Vigencias = []
    let Data_vigencias = {}
    let List_Departamentos = []
    let Data_Departamentos = []

    let List_Lugares = []
    let Data_Lugares = []

    let Lugares_hoy_temp = []
    let Lugares_hoy = []



    let dep_hoy_temp = []
    let dep_hoy = []

    let macro_tipos_tempH = []
    let macro_tipos_list = []
    let macro_tiposH = []

    for (id in split_Data) {
        const vigencia = split_Data[id]

        vigencia.clsCasos.forEach(caso => {
            nCasos++ //Aquí se suman todos los casos de cada vigencia
            nVictimas = nVictimas + parseInt(caso.npersonas)
            //Si la vigencia actual es la última, entonces guarda el dato
            if (caso.vigencia == vig) {
                nCasosHoy++
                nVictimasHoy = nVictimasHoy + parseInt(caso.npersonas)


                //
                if (dep_hoy_temp.includes(caso.departamento) == false) {
                    dep_hoy_temp.push(caso.departamento)
                    const new_dep = {
                        "departamento": caso.departamento.toLowerCase(),
                        "casos": 1,
                        "victimas": 1,
                        "porcentaje": 0
                    }
                    dep_hoy.push(new_dep)
                } else {
                    const filtered = dep_hoy.filter(ele => ele.departamento == caso.departamento.toLowerCase())
                    filtered[0].casos = parseInt(filtered[0].casos) + 1
                    filtered[0].victimas = parseInt(filtered[0].victimas) + parseInt(caso.npersonas)
                }

                if (macro_tipos_tempH.includes(caso.macrotipo) == false) {
                    const tipo = {
                        "macrotipo": caso.macrotipo,
                        "casos": 1,
                        "victimas": parseInt(caso.npersonas)
                    }
                    macro_tipos_list.push(tipo)
                    macro_tipos_tempH.push(caso.macrotipo)
                } else {
                    const filtered = macro_tipos_list.filter(ele => ele.macrotipo == caso.macrotipo)
                    filtered[0].casos = filtered[0].casos + 1
                    filtered[0].victimas = filtered[0].victimas + parseInt(caso.npersonas)
                }

                caso.clsLugares.forEach(l => {
                    if (Lugares_hoy_temp.includes(l.municipio) == false) {
                        const lugar = {
                            "departamento": caso.departamento,
                            "municipio": l.municipio,
                            "lat": l.lat,
                            "lng": l.lng,
                            "casos": 1,
                            "victimas": parseInt(caso.npersonas)
                        }
                        Lugares_hoy_temp.push(l.municipio)
                        Lugares_hoy.push(lugar)
                    } else {
                        const filtered = Lugares_hoy.filter(ele => ele.municipio == l.municipio)
                        filtered[0].casos = filtered[0].casos + 1
                        filtered[0].victimas = filtered[0].victimas + parseInt(caso.npersonas)
                    }

                    //Macrotipos
                    const lugar = {
                        "departamento": caso.departamento,
                        "municipio": l.municipio,
                        "macrotipo": caso.macrotipo,
                        "lat": l.lat,
                        "lng": l.lng,
                    }
                    macro_tiposH.push(lugar)
                })

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

    //Actualizar macrotipos
    template_public.microInformeHoy["macro-tipos"]["data"] = macro_tiposH
    template_public.microInformeHoy["macro-tipos"]["lista"] = macro_tipos_list

    //Actualizar lugares
    template_public.microInformeHoy.SIG = Lugares_hoy

    //Procesaar datos departamento - mapa calor

    dep_hoy.forEach(d => {
        //Calcular porcentaje
        const porcentaje_dep = parseInt(d.victimas) / parseInt(nVictimasHoy)
        d.porcentaje = (porcentaje_dep.toFixed(1))
    })

    //Actualizar departamentos
    template_public.microInformeHoy["calor-dep"] = dep_hoy


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
        byE("col_tabla_vigencias").innerHTML = ""
        byE("col_tabla_vigencias").appendChild(make_tabla(data_public.A_Vigencia.acumulado, "Vigencia", "vigencia"))


        //Constuimos la información sobre departamentos
        byE("text_departamentos").innerHTML = data_public.A_Departamento.text
        byE("col_tabla_departamentos").innerHTML = ""
        byE("col_tabla_departamentos").appendChild(make_tabla(data_public.A_Departamento.acumulado, "Vigencia", "departamento"))

        //Constuimos la información sobre departamentos
        byE("text_lugares").innerHTML = data_public.A_Lugares.text
        byE("col_tabla_lugares").innerHTML = ""
        byE("col_tabla_lugares").appendChild(make_tabla(data_public.A_Lugares.acumulado, "Vigencia", "municipio"))

        byE("lb_corte").textContent = "Fecha de actualización: " + data_public.corte

        make_microinforme_hoy(data_public.microInformeHoy)

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

function make_microinforme_hoy(data) {
    const vigencia_hoy = new Date()
    byE("titulo-vigente").textContent = "Micro Informe " + vigencia_hoy.getFullYear()
    //implementar la libreria de leaflet
    let map;

    map = L.map("map", {
        zoomDelta: 0.25,
        zoomSnap: 0
    }).setView([5.1, -75.55], 5.5);
    _make_panes()

    function _make_panes() {
        //Crea una capa en el mapa para colocar los marcadores tipo poligono, pero los deja siempre arriba.  
        map.createPane('1');
        //New panes to layer
        map.getPane('1').style.zIndex = 400;
        //Crea una capa en el mapa para colocar el mapa croquis.
        map.createPane('2');
        map.getPane('2').style.zIndex = 600;

        map.createPane('3');
        map.getPane('3').style.zIndex = 800;

        map.createPane('4');
        map.getPane('4').style.zIndex = 900;

        map.createPane('5');
        map.getPane('5').style.zIndex = 1100;

        map.createPane('6');
        map.getPane('6').style.zIndex = 1300;

        map.createPane('7');
        map.getPane('7').style.zIndex = 1500;

        map.createPane('labels');
        map.getPane('labels').style.zIndex = 2000;

        map.createPane('polygonsPane');
        map.getPane('polygonsPane').style.zIndex = 1500;
    }

    //Colocamos el tablero
    const tablero = L.geoJSON(layer_tablero, {
        style: function (feature) {
            return {
                fillColor: "#212f3d",
                fillOpacity: 1
            };
        }
    }).bindPopup(function (layer) {
        return "Tablero";
    }).addTo(map);

    //Colocamso el mapa base
    const mapa_base = L.geoJSON(layer_basemap, {
        style: function (feature) {
            return {
                fillColor: "white",
                color: "white",
                fillOpacity: 1,
                weight: 0.5,
                pane: "1"
            };
        }
    }).bindPopup(function (layer) {
        return "Mapa base";
    }).addTo(map);


    let mayor_porcentaje = 0
    let menor_porcentaje = 1
    //Colocamos departamentos y mapa calor

    const depar = L.geoJSON(layer_departamentos, {
        style: function (feature) {
            const dep = feature.properties.DPTO_CNMBR.toLowerCase()
            const filtered = data["calor-dep"].filter(ele => ele.departamento == dep)
            let porcentaje = 0
            if (filtered.length != 0) {
                porcentaje = (parseFloat(filtered[0].porcentaje)) + parseFloat(0.3)
                if (porcentaje > mayor_porcentaje) {
                    mayor_porcentaje = porcentaje
                }

                if (porcentaje < menor_porcentaje) {
                    menor_porcentaje = porcentaje
                }
            }
            return {
                fillColor: "#5dade2",
                color: "#212f3d",
                fillOpacity: porcentaje.toFixed(1),
                opacity: 1,
                weight: 1,
                pane: "2"
            };
        }
    }).bindPopup(function (layer) {

        const div_info = newEk("div", "")
        div_info.style.width = "180px"

        const row_dep = newEk("div", "row")
        div_info.appendChild(row_dep)

        const col_dep = newEk("div", "col-6 fw-bold", "Departamento:")
        row_dep.appendChild(col_dep)

        const col_dep_nombre = newEk("div", "col", layer.feature.properties.DPTO_CNMBR)
        row_dep.appendChild(col_dep_nombre)

        //       

        const dep = layer.feature.properties.DPTO_CNMBR.toLowerCase()
        const filtered = data["calor-dep"].filter(ele => ele.departamento == dep)

        if (filtered.length != 0) {
            const row_victimas = newEk("div", "row")
            div_info.appendChild(row_victimas)

            const col_victimas = newEk("div", "col-6 fw-bold", "Victimas:")
            row_victimas.appendChild(col_victimas)

            const col_victimas_nombre = newEk("div", "col", filtered[0].victimas)
            row_victimas.appendChild(col_victimas_nombre)

            const row_porcentaje = newEk("div", "row")
            div_info.appendChild(row_porcentaje)

            const col_casosP = newEk("div", "col-6 fw-bold", "Porcentaje:")
            row_porcentaje.appendChild(col_casosP)

            const prt = filtered[0].porcentaje * 100

            const col_casos_nombreP = newEk("div", "col", prt + "%")
            row_porcentaje.appendChild(col_casos_nombreP)

            const row_casos = newEk("div", "row")
            div_info.appendChild(row_casos)

            const col_casos = newEk("div", "col-6 fw-bold", "Casos:")
            row_casos.appendChild(col_casos)

            const col_casos_nombre = newEk("div", "col", filtered[0].casos)
            row_casos.appendChild(col_casos_nombre)



        }

        return div_info
    }, { pane: "labels" }).addTo(map);

    //Colocamos los puntos
    let marcas = []
    _make_marcas()
    function _make_marcas() {
        data.SIG.forEach(p => {
            let circle = new L.circleMarker([p.lat, p.lng],
                {
                    color: "white",
                    fillColor: "#d22c84",
                    fillOpacity: 1,
                    weight: 1,
                    radius: 7,
                    pane: "3"
                }).bindPopup(function (layer) {
                    const div_info = newEk("div", "")
                    div_info.style.width = "180px"

                    const row_dep = newEk("div", "row")
                    div_info.appendChild(row_dep)

                    const col_dep = newEk("div", "col-6 fw-bold", "Departamento:")
                    row_dep.appendChild(col_dep)

                    const col_dep_nombre = newEk("div", "col", p.departamento)
                    row_dep.appendChild(col_dep_nombre)

                    const row_lug = newEk("div", "row")
                    div_info.appendChild(row_lug)

                    const col_lug = newEk("div", "col-6 fw-bold", "Lugar:")
                    row_lug.appendChild(col_lug)

                    const col_lug_nombre = newEk("div", "col", p.municipio)
                    row_lug.appendChild(col_lug_nombre)

                    const row_casos = newEk("div", "row")
                    div_info.appendChild(row_casos)

                    const col_casos = newEk("div", "col-6 fw-bold", "Casos:")
                    row_casos.appendChild(col_casos)

                    const col_casos_nombre = newEk("div", "col", p.casos)
                    row_casos.appendChild(col_casos_nombre)

                    const row_victimas = newEk("div", "row")
                    div_info.appendChild(row_victimas)

                    const col_victimas = newEk("div", "col-6 fw-bold", "Victimas:")
                    row_victimas.appendChild(col_victimas)

                    const col_victimas_nombre = newEk("div", "col", p.victimas)
                    row_victimas.appendChild(col_victimas_nombre)

                    return div_info;
                }, { pane: "labels" })

            map.addLayer(circle)
            marcas.push(circle)
        })
    }

    let mostrar_marcas = true
    let mostrar_dep = true
    _make_panel_A()
    function _make_panel_A() {
        L.Control.Watermark = L.Control.extend({
            onAdd: function (map) {
                const div_panel = newEk("div", "shadow panel-map")

                const sm1 = newEk("small", "fw-bold text-secondary ms-1", "Información")
                //div_panel.appendChild(sm1)

                const row_marcas = newEk("div", "row mt-2 ms-1 align-items-center")
                div_panel.appendChild(row_marcas)

                const col_marcas_icono = newEk("div", "col-auto bi bi-circle-fill panel-map-marca")
                col_marcas_icono.style.color = "#d22c84"
                row_marcas.appendChild(col_marcas_icono)

                const col_marcas_label = newEk("div", "col", "Lugar de afectación")
                row_marcas.appendChild(col_marcas_label)

                col_marcas_icono.onclick = () => {
                    if (mostrar_marcas == true) {
                        marcas.forEach(m => {
                            map.removeLayer(m)
                        })
                        mostrar_marcas = false
                        col_marcas_icono.style.color = "#e5e8e8"
                    } else {
                        marcas.forEach(m => {
                            map.addLayer(m)
                        })
                        mostrar_marcas = true
                        col_marcas_icono.style.color = "#d22c84"
                    }
                }


                const row_dep = newEk("div", "row mt-2 ms-1 align-items-center")
                div_panel.appendChild(row_dep)

                const col_dep_icono = newEk("div", "col-auto bi bi-square panel-map-marca")
                col_dep_icono.style.color = "#212f3d"
                row_dep.appendChild(col_dep_icono)

                const col_dep_label = newEk("div", "col", "Departamento")
                row_dep.appendChild(col_dep_label)

                col_dep_icono.onclick = () => {
                    if (mostrar_dep == true) {
                        map.removeLayer(depar)
                        mostrar_dep = false
                        col_dep_icono.style.color = "#e5e8e8"
                    } else {
                        map.addLayer(depar)
                        mostrar_dep = true
                        col_dep_icono.style.color = "gray"
                    }
                }


                const row_dep_victimas = newEk("div", "row mt-2 ms-1 align-items-center")
                div_panel.appendChild(row_dep_victimas)

                const col_depVic_icono = newEk("div", "col-auto bi bi-square-fill panel-map-marca")
                col_depVic_icono.style.color = "#5dade2"
                col_depVic_icono.style.opacity = mayor_porcentaje
                row_dep_victimas.appendChild(col_depVic_icono)

                const col_depVic_label = newEk("div", "col", "Mayor número de victimas")
                row_dep_victimas.appendChild(col_depVic_label)

                const row_depM_victimas = newEk("div", "row mt-2 ms-1 align-items-center")
                div_panel.appendChild(row_depM_victimas)

                const col_depVicM_icono = newEk("div", "col-auto bi bi-square-fill panel-map-marca")
                col_depVicM_icono.style.color = "#5dade2"
                col_depVicM_icono.style.opacity = menor_porcentaje
                row_depM_victimas.appendChild(col_depVicM_icono)

                const col_depVicM_label = newEk("div", "col", "Menor número de victimas")
                row_depM_victimas.appendChild(col_depVicM_label)

                const hr = newEk("hr", "")
                div_panel.appendChild(hr)

                const row_clear = newEk("div", "row mt-2 ms-1 align-items-center")
                div_panel.appendChild(row_clear)

                const col_clear_icono = newEk("div", "col-auto bi-trash3")
                //col_clear_icono.style.color = "#d22c84"
                row_clear.appendChild(col_clear_icono)

                const col_clear_label = newEk("div", "col panel-map-marca", "Limpiar marcas")
                row_clear.appendChild(col_clear_label)

                col_clear_label.onclick = () => {
                    _borrar_otras_marcas()
                }





                var div = L.DomUtil.create('div');
                div.appendChild(div_panel)

                return div;
            },

            onRemove: function (map) {
                // Nothing to do here
            }
        });

        L.control.watermark = function (opts) {
            return new L.Control.Watermark(opts);
        }
        L.control.watermark({ position: 'bottomleft' }).addTo(map);

        function _borrar_otras_marcas() {
            marcas_tipo.forEach(m => {
                map.removeLayer(m)
            })
            marcas_tipo = []
        }
    }

    _make_panel_B()
    let marcas_tipo = []
    function _make_panel_B() {
        const ColorLayer_list = [
            "#00FFFF", "#7FFFD4", "#D2691E",
            "#0000FF", "#8A2BE2", "#A52A2A", "#DEB887", "#5F9EA0", "#7FFF00", "#D2691E",
            "#FF7F50", "#6495ED", "#DC143C", "#00FFFF", "#00008B", "#008B8B",
            "#B8860B", "#006400", "#A9A9A9", "#BDB76B", "#8B008B", "#556B2F", "#FF8C00",
            "#9932CC", "#8B0000", "#E9967A", "#8FBC8F", "#483D8B", "#2F4F4F", "#00CED1",
            "#FF1493", "#00BFFF", "#696969", "#1E90FF", "#B22222", "#FFFAF0", "#228B22",
            "#FF00FF", "#FFD700", "#DAA520", "#ADFF2F", "#F0FFF0", "#FF69B4", "#CD5C5C",
            "#4B0082", "#F0E68C", "#90EE90", "#FFB6C1", "#FFA500", "#FF4500", "#FF0000",
            "#8B4513", "#FFFF00", "#FF6347", "#40E0D0", "#00FF7F"
        ]

        L.Control.Watermark = L.Control.extend({
            onAdd: function (map) {
                const div_panel = newEk("div", "shadow panel-map-lg")

                const row_marcas = newEk("div", "row mt-2 ms-1 align-items-center")
                div_panel.appendChild(row_marcas)

                const col_marcas_icono = newEk("div", "col-auto bi bi-circle-fill panel-map-marca")
                col_marcas_icono.style.color = "whitesmoke"
                row_marcas.appendChild(col_marcas_icono)

                const col_marcas_label = newEk("div", "col fw-bold", "Macrotipo")
                row_marcas.appendChild(col_marcas_label)

                const col_marcas_valor = newEk("div", "col-auto fw-bold", "Víc")
                row_marcas.appendChild(col_marcas_valor)

                const sort_lista = data["macro-tipos"].lista.sort(function (a, b) {
                    return a["macrotipo"].localeCompare(b["macrotipo"]);
                    //return b["ocurrencias"] - a["ocurrencias"];
                });

                let color = 0

                sort_lista.forEach(m => {
                    const row_marcas = newEk("div", "row mt-2 ms-1 align-items-center")
                    div_panel.appendChild(row_marcas)

                    const col_marcas_icono = newEk("div", "col-auto bi bi-circle-fill panel-map-marca")
                    col_marcas_icono.style.color = ColorLayer_list[color]

                    row_marcas.appendChild(col_marcas_icono)

                    col_marcas_icono.onclick = () => {
                        _make_macroTipo(m.macrotipo, col_marcas_icono.style.color)
                        //console.log(col_marcas_icono.style.color)
                    }

                    const col_marcas_label = newEk("div", "col", m.macrotipo)
                    row_marcas.appendChild(col_marcas_label)

                    const col_marcas_valor = newEk("div", "col-auto", m.victimas)
                    row_marcas.appendChild(col_marcas_valor)

                    color++
                })

                var div = L.DomUtil.create('div');
                div.appendChild(div_panel)

                return div;
            },

            onRemove: function (map) {
                // Nothing to do here
            }
        });

        L.control.watermark = function (opts) {
            return new L.Control.Watermark(opts);
        }
        L.control.watermark({ position: 'bottomright' }).addTo(map);

        function _make_macroTipo(criterio, color_marca) {
            //Verifico si ya hay este criterio en el mapa
            let filtered_del = marcas_tipo.filter(ele => ele.tipo == criterio)
            
            if(filtered_del.length!=0){
                //Si se encuentra en el mapa este tipo, entonces
                //lo busco y lo elimino tanto del mapa como de la lista
                for (i in marcas_tipo){
                    let m=i
                    if(marcas_tipo[i].tipo==criterio){                      
                        map.removeLayer(marcas_tipo[i])
                        delete marcas_tipo[m]
                    }
                }
            }else{
                _make_criterio()
            }
                    
            function _make_criterio() {
                let filtered_tipos = data["macro-tipos"]["data"].filter(ele => ele.macrotipo == criterio)
                filtered_tipos.forEach(p => {
                    let circle_tipo = new L.circleMarker([p.lat, p.lng],
                        {
                            color: "black",
                            fillColor: `${color_marca}`,
                            fillOpacity: 0.5,
                            weight: 2,
                            radius: 9,
                            pane: "4",
                            tipo: p.macrotipo
                        }).bindPopup(function (layer) {
                            const div_info = newEk("div", "")
                            div_info.style.width = "250px"

                            const row_dep = newEk("div", "row")
                            div_info.appendChild(row_dep)

                            const col_dep = newEk("div", "col-6 fw-bold", "Departamento:")
                            row_dep.appendChild(col_dep)

                            const col_dep_nombre = newEk("div", "col", p.departamento)
                            row_dep.appendChild(col_dep_nombre)

                            const row_lug = newEk("div", "row")
                            div_info.appendChild(row_lug)

                            const col_lug = newEk("div", "col-6 fw-bold", "Lugar:")
                            row_lug.appendChild(col_lug)

                            const col_lug_nombre = newEk("div", "col", p.municipio)
                            row_lug.appendChild(col_lug_nombre)

                            const row_tipo = newEk("div", "row")
                            div_info.appendChild(row_tipo)

                            const col_tipo = newEk("div", "col-6 fw-bold", "Macrotipo:")
                            row_tipo.appendChild(col_tipo)

                            const col_tipo_nombre = newEk("div", "col", p.macrotipo)
                            row_tipo.appendChild(col_tipo_nombre)

                            return div_info;
                        }, { pane: "labels" })

                    circle_tipo["tipo"] = criterio
                    map.addLayer(circle_tipo)
                    marcas_tipo.push(circle_tipo)
                })
            }
        }

    }

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
