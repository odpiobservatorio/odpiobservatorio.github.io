let console_lines = []

function randomStr(len, arr) {
    let ans = '';
    for (let i = len; i > 0; i--) {
        ans +=
            arr[(Math.floor(Math.random() * arr.length))];
    }
    return ans

}

function consola_clear() {
    document.getElementById("console-lines").innerHTML = ""
    console_lines = []
}

const comandosEx = [
    [""],
    ["filter.clear"],
    [`filter => ["clsCasos","item.macroregion == 'Norte'"]#style["black",8,0.8]`],
    [`filter.plus=>[["clsPueblos","item.nombre.includes('Emb')"],["clsCasos","item.npersonas>1000"]]#style["pink",8,0.8]`],
    ["layer.show=>['CAPA']"],
    ["layer.hide=>['CAPA']"],
    ["layer.hide.all"],

]

function consola_newLine(texto) {
    const id = randomStr(10, '123456789abcdefghijklmnzx');
    var newLine = {}
    newLine.id = id;
    newLine.command = comandosEx[texto];
    console_lines.push(newLine);

    _html_maker_line()
    function _html_maker_line() {
        const panel_lines = document.getElementById("console-lines")
        panel_lines.innerHTML = ""
        console_lines.forEach(comando => {

            const linea = document.createElement("div")
            linea.className = "input-group bg-dark"
            const inputLine = document.createElement("textarea")
            inputLine.className = "form-control bg-dark text-white"
            inputLine.rows = 1
            inputLine.type = "text"
            inputLine.value = comando.command
            inputLine.id = comando.id
            linea.appendChild(inputLine)

            const btnRun = document.createElement("button")
            btnRun.className = "btn btn-dark border border-1"
            btnRun.type = "button"
            btnRun.innerHTML = `<i class="bi bi-arrow-right-circle fs-5 text-info"></i>`
            linea.appendChild(btnRun)

            btnRun.onclick = () => {
                consola_command(inputLine)
            }
            inputLine.onchange = () => {
                comando.command = inputLine.value
            }

            inputLine.oninput = () => {
                comando.command = inputLine.value
            }

            const btnRemove = document.createElement("button")
            btnRemove.className = "btn btn-dark border border-1"
            btnRemove.type = "button"
            btnRemove.innerHTML = `<i class="bi bi-file-earmark-x fs-5 text-danger"></i>`
            linea.appendChild(btnRemove)

            btnRemove.onclick = () => {
                const delete_line = console_lines.filter(line => line.id !== comando.id)
                console_lines = delete_line
                console.log(console_lines)
                _html_maker_line()

            }

            panel_lines.appendChild(linea)


        })

    }






}

function consola_command(control_line) {

    cinfigIni_data()
    const control = control_line
    const line_run = control.value
    const line = line_run[line_run.length - 1]

    const comando = control_line.value.split("=>")

    if (comando[0].trim() == "filter") {
        const line_comand = comando[1].split("#style")

        const formato_inp = eval(line_comand[1])

        try {
            color_marca_busqueda = formato_inp[0]
            size_marca_busqueda = formato_inp[1]
            opacidad_marca_busqueda = formato_inp[2]
        } catch (error) {

        }
        const criterios_eval = eval(line_comand[0])
        filter_from_console(criterios_eval[0], criterios_eval[1])

    } else if (comando[0].trim() == "filter.all") {
        ver_todo()
    }
    else if (comando[0].trim() == "filter.clear") {
        limpiar_todo_marcas()
    } else if (comando[0].trim() == "filter.plus") {
        const line_comand = comando[1].split("#style")

        const formato_inp = eval(line_comand[1])

        try {
            color_marca_busqueda = formato_inp[0]
            size_marca_busqueda = formato_inp[1]
            opacidad_marca_busqueda = formato_inp[2]
        } catch (error) {

        }
        const criterios_eval = eval(line_comand[0])
        filter_from_console_plus(criterios_eval)
    }
    else if (comando[0].trim() == "layer.show") {
        const line_comand = comando[1].split("#style")
        const nameLayer = eval(line_comand[0])
        nameLayer.forEach(capa => {
            const layer = jslayers.filter(l => l[1] == capa)
            const inputC = document.getElementById("checklayer_" + layer[0][1])
            inputC.checked = true
            layers['put_layer'](inputC, 'layer_' + layer[0][1], layer[0][3])
        })
    }
    else if (comando[0].trim() == "layer.hide") {
        const line_comand = comando[1].split("#style")
        const nameLayer = eval(line_comand[0])
        nameLayer.forEach(capa => {
            const inputC = document.getElementById("checklayer_" + capa)
            inputC.checked = false
            let layer_remove = lis_layers.filter(value => value[0] == "layer_" + capa)
            let layer_noremove = lis_layers.filter(value => value[0] !== "layer_" + capa)
            map.removeLayer(layer_remove[0][1])
            lis_layers = layer_noremove
        })
    } else if (comando[0].trim() == "layer.hide.all") {
        lis_layers.forEach(capa => {
            const simplename = capa[0].split("_")         
            const inputC = document.getElementById("checklayer_" + simplename[1])
            inputC.checked = false
            let layer_remove = lis_layers.filter(value => value[0] == "layer_" + simplename[1])
            let layer_noremove = lis_layers.filter(value => value[0] !== "layer_" + simplename[1])
            map.removeLayer(layer_remove[0][1])
            lis_layers = layer_noremove
        })
        lis_layers = []
    }

}
function filter_from_console(clase, filter_comand) {
    const casos = Active_data_monitor.clsCasos
    let casos_filtered = []
    let c_criterios = filter_comand

    //verifico que tipo de operador es
    if (clase == "clsCasos") {
        _run_filter_casos()
    } else {
        _run_filter_Subcasos(clase)
    }

    function _run_filter_casos() {
        casos.forEach(item => {
            if (eval(c_criterios)) {
                casos_filtered.push(item)
            }
        })
    }

    function _run_filter_Subcasos(clase) {
        casos.forEach(caso => {
            caso[clase].forEach(item => {
                if (eval(c_criterios)) {
                    casos_filtered.push(caso)
                }
            })
        })
    }
    mostrar_resultados(casos_filtered)
    crear_consolidado_resultado(casos_filtered, criteria_items)
}
function filter_from_console_plus(filter_comand) {
    const casos = Active_data_monitor.clsCasos
    let casos_filtered = []
    //Verifica si en la cadena hay una búsqueda por ClsCasos/ clase superior
    const filterCaso = filter_comand.filter(ele => ele[0] == "clsCasos")
    const filterNoCaso = filter_comand.filter(ele => ele[0] !== "clsCasos")

    if (filterCaso !== null) {
        let dataA = []
        casos.forEach(item => {
            if (eval(filterCaso[0][1])) {
                dataA.push(item)
            }
        })
        _filter_2(dataA)
    } else {
        _filter_2(casos)
    }

    function _filter_2(data) {
        //Construimos primero la cadena del filtro
        let cadenaA = ""
        filterNoCaso.forEach(filtro => {
            cadenaA = cadenaA + `registro.${filtro[0]}.some((item)=>${filtro[1]})&&`
        })
        let cadenaB = cadenaA.substring(0, cadenaA.length - 2)
        const filtrados = data.filter((registro) => {
            let f = eval(cadenaB)
            if (f == true) {
                casos_filtered.push(registro)
            }
        });


    }

    mostrar_resultados(casos_filtered)
    crear_consolidado_resultado(casos_filtered, criteria_items)

}