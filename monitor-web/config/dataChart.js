let data2chart = []
let ActiveDBchart;
let consolidados = []
let criteria_items = []
let Color_Text_ChartY = "black"
let Color_Text_ChartX = "black"
let Color_Text_Leg = "black"
let Color_Line_Chart = "white"
const ColorList3 = [
    //rojos
    "#F0F8FF", "white", "#FAEBD7", "#00FFFF", "#7FFFD4", "#F5F5DC", "#000000", "#D2691E",
    "#0000FF", "#8A2BE2", "#A52A2A", "#DEB887", "#5F9EA0", "#7FFF00", "#D2691E",
    "#FF7F50", "#6495ED", "#FFF8DC", "#DC143C", "#00FFFF", "#00008B", "#008B8B",
    "#B8860B", "#006400", "#A9A9A9", "#BDB76B", "#8B008B", "#556B2F", "#FF8C00",
    "#9932CC", "#8B0000", "#E9967A", "#8FBC8F", "#483D8B", "#2F4F4F", "#00CED1",
    "#FF1493", "#00BFFF", "#696969", "#1E90FF", "#B22222", "#FFFAF0", "#228B22",
    "#FF00FF", "#FFD700", "#DAA520", "#ADFF2F", "#F0FFF0", "#FF69B4", "#CD5C5C",
    "#4B0082", "#F0E68C", "#90EE90", "#FFB6C1", "#FFA500", "#FF4500", "#FF0000",
    "#8B4513", "#FFFF00", "#FF6347", "#40E0D0", "#00FF7F"
]
const ColorList = [
    '#000000', '#000080', '#00008B', '#0000CD', '#0000FF', '#006400', '#008000', '#008080',
    '#008B8B', '#00BFFF', '#00CED1', '#00FA9A', '#00FF00', '#00FF7F', '#00FFFF', '#00FFFF',
    '#191970', '#1E90FF', '#20B2AA', '#228B22', '#2E8B57', '#2F4F4F', '#2F4F4F', '#32CD32',
    '#3CB371', '#40E0D0', '#4169E1', '#4682B4', '#483D8B', '#48D1CC', '#4B0082', '#556B2F',
    '#5F9EA0', '#6495ED', '#663399', '#66CDAA', '#696969', '#696969', '#6A5ACD', '#6B8E23',
    '#708090', '#708090', '#778899', '#778899', '#7B68EE', '#7CFC00', '#7FFF00', '#7FFFD4',
    '#800000', '#800080', '#808000', '#808080', '#808080', '#87CEEB', '#87CEFA', '#8A2BE2',
    '#8B0000', '#8B008B', '#8B4513', '#8FBC8F', '#90EE90', '#9370DB', '#9400D3', '#98FB98',
    '#9932CC', '#9ACD32', '#A0522D', '#A52A2A', '#A9A9A9', '#A9A9A9', '#ADD8E6', '#ADFF2F',
    '#AFEEEE', '#B0C4DE', '#B0E0E6', '#B22222', '#B8860B', '#BA55D3', '#BC8F8F', '#BDB76B',
    '#C0C0C0', '#C71585', '#CD5C5C', '#CD853F', '#D2691E', '#D2B48C', '#D3D3D3', '#D3D3D3',
    '#D8BFD8', '#DA70D6', '#DAA520', '#DB7093', '#DC143C', '#DCDCDC', '#DDA0DD', '#DEB887',
    '#E0FFFF', '#E6E6FA', '#E9967A', '#EE82EE', '#EEE8AA', '#F08080', '#F0E68C', '#F0F8FF',
    '#F0FFF0', '#F0FFFF', '#F4A460', '#F5DEB3', '#F5F5DC', '#F5F5F5', '#F5FFFA', '#F8F8FF',
    '#FA8072', '#FAEBD7', '#FAF0E6', '#FAFAD2', '#FDF5E6', '#FF0000', '#FF00FF', '#FF00FF',
    '#FF1493', '#FF4500', '#FF6347', '#FF69B4', '#FF7F50', '#FF8C00', '#FFA07A', '#FFA500',
    '#FFB6C1', '#FFC0CB', '#FFD700', '#FFDAB9', '#FFDEAD', '#FFE4B5', '#FFE4C4', '#FFE4E1',
    '#FFEBCD', '#FFEFD5', '#FFF0F5', '#FFF5EE', '#FFF8DC', '#FFFACD', '#FFFAF0', '#FFFAFA',
    '#FFFF00', '#FFFFE0', '#FFFFF0',]

const ColorList2 = {
    Rojos1: ["#3b0202", "#800505", "#b30707", "#e80909", "#bd3a3a", "#994b4b", "#d46e6e", "#852d04", "#ad3f0c", "#eb692d",
        "#9c4a08", "#c40c37", "#db1d49", "#f03c66", "#802121", "#651919", "#481313", "#4e1b1b", "#742d2d", "#a54c4c",
        "#d27070", "#e39494"
    ],
    Rojos2: ["#990033", "#e6004c", "#ff3377", "#ff80aa", "#800040", "#cc0066", "#ff3399", "#ff99cc", "#73264d", "#cc6699",
        "#99003d", "#e6005c", "#ff66a3", "#862528", "#7a2c2e", "#672c2e", "#673335", "#673d3f", "#805557", "#9d7274",
        "#c2989a", "#e1babc"],

    Verdes1: ["#033606", "#064e0a", "#0b7411", "#0f8815", "#129f19", "#15b51d", "#1ad023", "#1feb29",
        "#46ef4e", "#43d049", "#3bad3f", "#328e35", "#2a742d", "#235f26", "#1c461e", "#132714", "#F6CEE3", "#29482b",
        "#597c5b", "#789f7a"],
    Verdes2: ["#006400", "#00FA9A", "#008000", "#2E8B57", "#32CD32", "#3CB371", "#2E8B57", "#556B2F", "#6B8E23", "#7FFF00",
        "#90EE90", "#ADFF2F"],
    Azules1: ["#00264d", "#004d99", "#0073e6", "#4da6ff", "#80bfff", "#cce6ff", "#1f3d7a", "#5c85d6", "#99b3e6", "#2d2d86",
        "#45d9c1", "#6666cc", "#0099ff", "#80ccff", "#2a786b", "#5f8c85", "#78b399", "#83d2af", "#7ce7b8", "#5ed29f",
        "#4db387", "#368c67"],

    Grises: ["#484848", "#686868", "#808080", "#989898", "#B0B0B0", "#C8C8C8", "#D8D8D8", "#E8E8E8", "#F5F5F5"],
    Multicolor1: [
        //rojos
        "#F0F8FF", "#FAEBD7", "#00FFFF", "#7FFFD4", "#F5F5DC", "#D2691E",
        "#0000FF", "#8A2BE2", "#A52A2A", "#DEB887", "#5F9EA0", "#7FFF00", "#D2691E",
        "#FF7F50", "#6495ED", "#FFF8DC", "#DC143C", "#00FFFF", "#00008B", "#008B8B",
        "#B8860B", "#006400", "#A9A9A9", "#BDB76B", "#8B008B", "#556B2F", "#FF8C00",
        "#9932CC", "#8B0000", "#E9967A", "#8FBC8F", "#483D8B", "#2F4F4F", "#00CED1",
        "#FF1493", "#00BFFF", "#696969", "#1E90FF", "#B22222", "#FFFAF0", "#228B22",
        "#FF00FF", "#FFD700", "#DAA520", "#ADFF2F", "#F0FFF0", "#FF69B4", "#CD5C5C",
        "#4B0082", "#F0E68C", "#90EE90", "#FFB6C1", "#FFA500", "#FF4500", "#FF0000",
        "#8B4513", "#FFFF00", "#FF6347", "#40E0D0", "#00FF7F"
    ],
    Observatorio1: ["#A52A2A", "#CD5C5C", "#BC8F8F", "#C71585", "#D2B48C", "#DB7093", "#DC143C", "#DB7093", "#E9967A", "#F08080",
        "#F4A460", "#F5DEB3", "#FF1493", "#FF7F50", "#FF6347"],
    Observatorio2: ["#696969", "#708090", "#8FBC8F", "#A52A2A", "#A9A9A9", "#B22222", "#BC8F8F", "#BDB76B", "#CD853F", "#DAA520",
        "#DC143C", "#DB7093", "#E9967A", "#F0E68C", "#FF8C00", "#DC143C", "#FFD700"],
    Observatorio3: ["#2F4F4F", "#5F9EA0", "#696969", "#708090", "#808080", "#8FBC8F", "#B0C4DE", "#C0C0C0", "#D3D3D3", "#DCDCDC",
        "E6E6FA"
    ],
}

function ini_chat() {
    let MultiCasos = []
    //Cargamos la base de datos actual
    const proyectos = GLOBAL.state.proyectos;
    proyectos.forEach(proyecto => {
        proyecto.clsCasos.forEach(caso => {
            MultiCasos.push(caso)
        })
    })

    ActiveDBchart = MultiCasos
    mostrar_consolidados(ActiveDBchart)

    //Nos preparamso para busquedas/consultas
    crear_listas("clsCasos_macroregion")


    const ulControls = {
        "1": {
            "nombre": "ulColorFondoChart",
            "i": "i_fondo",
            "funcion":(color)=>{
                document.getElementById("divChart").style.background = color
            }
        },
        "2": {
            "nombre": "ulDataColor",
            "i": "i_DataColor",
            "funcion":(color)=>{
                ColorDatos = color
            }
        },
        "3": {
            "nombre": "ulColorLetraChartY",
            "i": "i_textoY",
            "funcion":(color)=>{
                Color_Text_ChartY = color
            }
        },
        "4": {
            "nombre": "ulColorLetraChartX",
            "i": "i_textoX",
            "funcion":(color)=>{
                Color_Text_ChartX = color
            }
        },
        "5": {
            "nombre": "ulColorLetraLeg",
            "i": "i_textoLeg",
            "funcion":(color)=>{
                Color_Text_Leg = color
            }
        },
        "6": {
            "nombre": "ulColorLineaChart",
            "i": "i_linea",
            "funcion":(color)=>{
                Color_Line_Chart = color
            }
        },
        "7": {
            "nombre": "ulColorBorde",
            "i": "i_borde",
            "funcion":(color)=>{
                bordeColor = color
            }
        }
    }


    for (id in ulControls) {
        const hexinput= document.createElement("input")
        const ul = ulControls[id]
        const i = document.getElementById(ul.i)
        i.className = "bi bi-square-fill rounded"
        i.style.color = "black"
        const ulDiv = document.getElementById(ul.nombre)
        ulDiv.innerHTML=""
        ColorList.forEach(color => {
            const iColor = document.createElement("i")
            iColor.className = "bi bi-square-fill fs-5"
            iColor.style.color = color
            iColor.style.margin = "2px"
            ulDiv.appendChild(iColor)
            iColor.onclick = () => {
                hexinput.value=color
                i.style.color = color
                ul.funcion(color)
                crear_grafico(consolidados, document.getElementById("listTipo_chart").value)
            }

        })
        
        hexinput.className="form-control"
        hexinput.type="text"
        hexinput.placeholder="HEX Color"
        ulDiv.appendChild(hexinput)
        
        hexinput.onchange=()=>{
            ul.funcion(hexinput.value)
            i.style.color = hexinput.value
            crear_grafico(consolidados, document.getElementById("listTipo_chart").value)
        }


    }






   

    








    //ulFondo


}
//Aquí todo para las listas y búsquedas
function crear_listas(opcion) {
    filterList = []
    makerList["newOpen_list"](opcion)
}
//Guarda en esta variable las cadenas de criterios de filto js
const makerList = {
    "newOpen_list": (opcion) => {
        //Contenedor delas listas
        const contenedor = document.getElementById("contenedor_criterios")
        contenedor.innerHTML = ""
        //Toma el criterio y los divide por _ para obtener el campo y la clase
        const criterio = opcion.split("_")
        //Aquí obtengo la clase y el campo, deriva la acción si es la clase Padre o Hija
        let newCriteria = [] //Esta variable guarda la lista según la clase
        if (criterio[0] == "clsCasos") {
            ActiveDBchart.forEach(caso => {
                if (newCriteria.includes(caso[criterio[1]]) == false) {
                    newCriteria.push(caso[criterio[1]])
                }
            })
        } else {
            //Aquí es la derivación en caso de que la clase no sea CASOS (Padre)
            //Busca en la clase hija.
            ActiveDBchart.forEach(caso => {
                caso[criterio[0]].forEach(item => {
                    if (newCriteria.includes(item[criterio[1]]) == false) {
                        newCriteria.push(item[criterio[1]])

                    }
                })
            })
        }


        //Ordenamos la lsita de AZ
        let newDataOrdenado;
        try {
            function porDato(a, b) {
                return a.localeCompare(b);
            }
            newDataOrdenado = newCriteria.sort(porDato);


        } catch (error) {
            //Esto en el caso que los valores sean solo numérico, entonces se ordena por número
            newDataOrdenado = newCriteria.sort();
            newDataOrdenado.sort(function (a, b) {
                return a - b;
            });
            //Al identificar esta variacón, indica que es un valor tipo número, entonces

        }

        //Con base a essa lista creamos una lista de selección on check
        newDataOrdenado.forEach(item => {
            let realvalue;
            if (typeof item === "number") {
                realvalue = parseInt(item)
            } else {
                realvalue = (item)
            }
            const elemento = document.createElement("div")
            elemento.className = "ms-3 me-3"
            elemento.style.fontWeight = "normal"
            elemento.innerHTML =
                `
    <input class="fst-normal form-check-input" type="checkbox" value="${realvalue}" id="check${item}${criterio[1]}">
     ${item}
    `
            //Coloca un elemento en la lista, estos elementos tienen un control chekc que lo detecta el programa
            contenedor.appendChild(elemento)
            const checkers = document.getElementById(`check${item}${criterio[1]}`)
            //Miramos si el valor viene de la lista o viene de el campo abirto

            //Se detecta un cambio en el control, agrega o elimina un elemento de la lista de filtros.
            checkers.onchange = () => {
                //Validamos si la clase es mayor o menor


                if (checkers.checked == true) {

                    const criterios = {
                        "clase": criterio[0],
                        "field": criterio[1],
                        "operador": document.getElementById("lstOperadores").value,
                        "value": checkers.value
                    }
                    filterList.push(criterios)
                } else {
                    const eliminados = filterList.filter(elemento => elemento.value != checkers.value);
                    filterList = eliminados
                }

                let tituloboton = ""
                filterList.forEach(palabra => {
                    tituloboton = tituloboton + "[" + palabra.value + "]"

                })
                const btnCriterios = document.getElementById("btnCriterios")
                btnCriterios.textContent = tituloboton
            }
        })

        document.getElementById("intOpentCriterio").oninput = () => {
            const criterios = {
                "clase": criterio[0],
                "field": criterio[1],
                "operador": document.getElementById("lstOperadores").value,
                "value": document.getElementById("intOpentCriterio").value
            }
            filterList = []
            filterList.push(criterios)
        }


        //Ahora trabajamos con los filtros
        const filtrador = document.getElementById("btnConsulta")
        //Debemos construir las cadenas de filtro según las listas en filterlist
        filtrador.onclick = () => {
            add_criterio_extendido()
            filter_extend()
            LimpiarConsulta()
            document.getElementById("intOpentCriterio").value = ""
        }

    }
}

function add_criterio_extendido() {
    const contenedorlistas = document.getElementById("listconsultaextendida")

    if (filterList.length == 0) {
        operador_link = ""
    }
    //Miramos todos los elementos de filtros creados
    let i = 0
    let line = []
    filterList.forEach(texto => {
        const item = document.createElement("li")
        item.className = "list-group-item"
        item.textContent = texto.clase + " " + texto.operador + " " + texto.value
        contenedorlistas.appendChild(item)
        if (i == filterList.length - 1) {
            operador_link = ""
        }
        if (i < filterList.length - 1) {
            operador_link = "||"
        }
        i = i + 1

        const newItemCriterio =
        {
            "clase": texto.clase,
            "field": texto.field,
            "operador": texto.operador,
            "value": texto.value,
            "link": operador_link
        }
        line.push(newItemCriterio)
    })
    let cadena = ""
    if (filterList[0].clase !== "clsCasos") {
        ActiveDBchart.forEach(caso => {

        })
        const registros = ActiveDBchart[1]
        line.forEach(item => {
            try {
                if (typeof registros[item.clase][item.field] === "number") {
                    cadena = cadena + `registro["${item.clase}"].some((objTipo) => objTipo["${item.field}"]${item.operador}(${item.value}) ${item.link})`
                } else {
                    cadena = cadena + `registro["${item.clase}"].some((objTipo) => objTipo["${item.field}"]${item.operador}("${item.value}") ${item.link})`
                }

            } catch (error) {

            }
        })
        criteria_items.push([filterList[0].clase, cadena])


        //
    } else {
        const registros = ActiveDBchart
        line.forEach(item => {
            if (typeof registros[item.field] === "number") {
                cadena = cadena + `registro["${item.field}"]${item.operador}(${item.value}) ${item.link}`
            } else {
                cadena = cadena + `registro["${item.field}"]${item.operador}("${item.value}") ${item.link}`
            }
        })
        criteria_items.push([filterList[0].clase, cadena])
    }
    document.getElementById("intOpentCriterio").value = ""
    fromOpenText = ""


}
function filter_extend() {
    const Proyectos = GLOBAL.state.proyectos

    let datafilter = []
    Proyectos.forEach(proyecto => {
        const filtrados = proyecto.clsCasos.filter((registro) => {
            let condiciones = []

            criteria_items.forEach(criterio => {
                condiciones.push(eval(criterio[1]))
            })

            let score = 0
            condiciones.forEach(valor => {
                score = score + valor

            })

            if (score == condiciones.length) {
                datafilter.push(registro)
            }
            score = []
        });




    })
    mostrar_consolidados(datafilter)

    /* CODIGO DE PARTIDA DE INICIO */


    //dataWfilter = datafilter

}
function LimpiarConsulta() {
    criteria_items = []
    const contenedorlistas = document.getElementById("listconsultaextendida")
    contenedorlistas.innerHTML = ""
    const btnCriterios = document.getElementById("btnCriterios")
    btnCriterios.textContent = "Criterios"
    document.getElementById("intOpentCriterio").value = ""
    fromOpenText = ""
}

function add_consulta() {
    //data2chart.push(dataWfilter)
}
function mostrar_consolidados(data) {
    const tbody = document.getElementById("tbodyconsolidados")
    document.getElementById("lstbuscarpor").value = "sininfo"
    tbody.innerHTML = ""

    document.getElementById("nCasos").textContent = data.length
    const totalPersonas = data.reduce((prev, curr) => prev + curr.npersonas, 0);
    document.getElementById("nVictimas").textContent = totalPersonas

    const lstCampos = document.getElementById("lstbuscarpor")
    lstCampos.onchange = () => {
        const criterio = lstCampos.value.split("_")
        //Creo una lista sin repeticiones
        let newCriteria = [] //Esta variable guarda la lista según la clase
        if (criterio[0] == "clsCasos") {
            data.forEach(caso => {
                if (newCriteria.includes(caso[criterio[1]]) == false) {
                    newCriteria.push(caso[criterio[1]])
                }
            })
        } else {
            //Aquí es la derivación en caso de que la clase no sea CASOS (Padre)
            //Busca en la clase hija.
            data.forEach(caso => {
                caso[criterio[0]].forEach(item => {
                    if (newCriteria.includes(item[criterio[1]]) == false) {
                        newCriteria.push(item[criterio[1]])
                    }
                })
            })
        }

        let newDataOrdenado;
        try {
            function porDato(a, b) {
                return a.localeCompare(b);
            }
            newDataOrdenado = newCriteria.sort(porDato);


        } catch (error) {
            //Esto en el caso que los valores sean solo numérico, entonces se ordena por número
            newDataOrdenado = newCriteria.sort();
            newDataOrdenado.sort(function (a, b) {
                return a - b;
            });
            //Al identificar esta variacón, indica que es un valor tipo número, entonces

        }
        consolidados = []

        newDataOrdenado.forEach(item => {
            if (criterio[0] == "clsCasos") {
                let filtered = data.filter(value => value[criterio[1]] == item)

                const totalVictimas = filtered.reduce((prev, curr) => prev + curr.npersonas, 0);
                let resultado = [item, filtered.length, totalVictimas]
                consolidados.push(resultado)
            } else {
                let newDatafiltered = []
                data.forEach(caso => {
                    let filtered = caso[criterio[0]].filter(value => value[criterio[1]] == item)
                    if (filtered.length !== 0) {
                        newDatafiltered.push(caso)
                    }
                })
                const totalVictimas = newDatafiltered.reduce((prev, curr) => prev + curr.npersonas, 0);
                let resultado = [item, newDatafiltered.length, totalVictimas]
                consolidados.push(resultado)
            }
        })
        crear_consolidados()

    }
}
function crear_consolidados() {
    const tbody = document.getElementById("tbodyconsolidados")
    tbody.innerHTML = ""

    consolidados.forEach(item => {
        const tr = document.createElement("tr")
        const campo = document.createElement("td")
        campo.textContent = item[0]
        tr.appendChild(campo)

        const casos = document.createElement("td")
        casos.textContent = item[1]
        casos.className = "text-end"
        tr.appendChild(casos)

        const personas = document.createElement("td")
        personas.textContent = item[2]
        personas.className = "text-end"
        tr.appendChild(personas)
        tbody.appendChild(tr)

    })
    crear_grafico(consolidados, document.getElementById("listTipo_chart").value)
}
function sort_consolidado(tipo, orden) {

    let newDataOrdenado

    if (orden == 0) {
        newDataOrdenado = consolidados.sort(function (a, b) {
            var textA = a[tipo];
            var textB = b[tipo];
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
    } else {
        newDataOrdenado = consolidados.sort(function (a, b) {
            var textA = a[tipo];
            var textB = b[tipo];
            return (textB < textA) ? -1 : (textB > textA) ? 1 : 0;
        });
    }

    const tbody = document.getElementById("tbodyconsolidados")
    tbody.innerHTML = ""

    newDataOrdenado.forEach(item => {
        const tr = document.createElement("tr")
        const campo = document.createElement("td")
        campo.textContent = item[0]
        tr.appendChild(campo)

        const casos = document.createElement("td")
        casos.textContent = item[1]
        tr.appendChild(casos)

        const personas = document.createElement("td")
        personas.textContent = item[2]
        tr.appendChild(personas)
        tbody.appendChild(tr)

    })
    crear_grafico(newDataOrdenado, document.getElementById("listTipo_chart").value)


}

function tipo_grafico(tipo) {
    crear_grafico(consolidados, tipo)
}
function getColor(color = false) {
    if (color) {
        //Si se le dice cuantos colores, regresa una lista de colores
        const colors = []
        for (let i = 0; i < color; i++) {
            let color = "#";
            for (let i = 0; i < 6; i++) {
                color = color + ("0123456789ABCDEF")[Math.floor(Math.random() * 16)];
            }
            colors.push(color)
        }
        return colors
    } else {
        //Si no se le da ningun parametro a la funcion, regresa un solo color
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color = color + ("0123456789ABCDEF")[Math.floor(Math.random() * 16)];
        }
        return color
    }
}

let rango = 0
function cambio_rango(value) {
    rango = value
    crear_grafico(consolidados, document.getElementById("listTipo_chart").value)
}
let rangoMax = 1000000
function cambio_rangoMax(value) {
    rangoMax = value
    crear_grafico(consolidados, document.getElementById("listTipo_chart").value)
}
let fsize = 12
function fontSize_chart(value) {
    fsize = value
    crear_grafico(consolidados, document.getElementById("listTipo_chart").value)
}
let fsizeX = 12
function fontSize_chartX(value) {
    fsizeX = value
    crear_grafico(consolidados, document.getElementById("listTipo_chart").value)
}
let fsizeLeg = 12
function fontSize_Leg(value) {
    fsizeLeg = value
    crear_grafico(consolidados, document.getElementById("listTipo_chart").value)
}
let ValEje = "y"
function Change_eje_grafico(value) {
    ValEje = value
    crear_grafico(consolidados, document.getElementById("listTipo_chart").value)
}

let ColorDatos = "gray"
function data_color_change(value) {
    ColorDatos = ColorList2[value]
    crear_grafico(consolidados, document.getElementById("listTipo_chart").value)
}
let fromCampo = 0
function data_from_change(value) {
    fromCampo = value
    crear_grafico(consolidados, document.getElementById("listTipo_chart").value)
}
let bordeColor = "black"
function change_borde_color(value) {
    bordeColor = value
    crear_grafico(consolidados, document.getElementById("listTipo_chart").value)
}

function crear_grafico(data, tipo) {
    const div = document.getElementById('divChart');
    div.innerHTML = ""
    const ctx = document.createElement("canvas")
    div.appendChild(ctx)
    ctx.id = "myChart"

    let newLabels = []
    let newCasos = []
    let newVictimas = []
    let newColors = []

    let labelA = "Víctimas"
    let indexA = 2


    if (fromCampo == 0) {
        indexA = 2
    } else {
        indexA = 1
    }

    data.forEach(label => {
        if (label[indexA] >= rango && label[indexA] <= rangoMax) {
            newLabels.push(label[0])
            newVictimas.push(label[2])
            newCasos.push(label[1])
            newColors.push(getColor());
        }
    })

    if (fromCampo == 0) {
        data_from = newVictimas
        labelA = "Víctimas"
    } else {
        data_from = newCasos
        labelA = "Casos"
    }



    new Chart(ctx, {
        type: tipo,
        data: {
            labels: newLabels,
            datasets: [{
                label: "# de " + labelA,
                data: data_from,
                borderColor: bordeColor,
                borderWidth: 1,
                backgroundColor: ColorDatos,
            }],

        },
        options: {
            responsive: true,
            indexAxis: ValEje,
            plugins: {
                // changin the lagend colour
                legend: {
                    labels: {
                        color: Color_Text_Leg,
                        font: {
                            size: fsizeLeg,
                        }
                    },
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: Color_Text_ChartY,
                        font: {
                            size: fsize,
                        }
                    },
                    grid: {
                        color: Color_Line_Chart
                    }
                },
                x: {
                    ticks: {
                        color: Color_Text_ChartX,
                        font: {
                            size: fsizeX,
                        }
                    },
                    grid: {
                        color: Color_Line_Chart
                    }
                }
            }
        }
    });


}

function ver_todo() {
    mostrar_consolidados(ActiveDBchart)
}

function altura_chart(value) {

    document.getElementById("divChart").style.width = value
    var ctx = document.getElementById("myChart")
    ctx.style.height = value;


}
