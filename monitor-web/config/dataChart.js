let data2chart = []
let ActiveDBchart;
let consolidados = []
let criteria_items = []
let Color_Text_ChartY = "black"
let Color_Text_ChartX = "black"
let Color_Text_Leg = "black"
let Color_Line_Chart = "white"
const ColorList = [
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

const ColorList2={
    Rojos1:["#3B0B17","#610B21","#8A0829","#B40431","#DF013A","#FF0040","#FE2E64","#FA5882","#F5A9BC",
            "#610B38","#8A084B","#B4045F","#FF0080","#FE2E9A","#FA58AC","#F781BE","#F5A9D0","#F6CEE3",
            "#3B0B2E","#610B4B","#8A0868"
    ]
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

    const ulFondo = document.getElementById("ulColorFondoChart")
    const ulTextoY = document.getElementById("ulColorLetraChartY")
    const ulTextoX = document.getElementById("ulColorLetraChartX")
    const ulTextoLeg = document.getElementById("ulColorLetraLeg")
    const ulLinea = document.getElementById("ulColorLineaChart")




    const i = document.getElementById("i_fondo")
    i.className = "bi bi-square-fill rounded"
    i.style.color = "black"


    ColorList.forEach(color => {
        const iColor = document.createElement("i")
        iColor.className = "bi bi-square-fill fs-3"
        iColor.style.color = color
        iColor.style.margin = "2px"
        ulFondo.appendChild(iColor)
        iColor.onclick = () => {
            i.style.color = color
            document.getElementById("divChart").style.background = color
        }

    })

    const i2 = document.getElementById("i_textoY")
    i2.className = "bi bi-square-fill rounded"
    i2.style.color = "black"

    ColorList.forEach(color => {
        const iColor = document.createElement("i")
        iColor.className = "bi bi-square-fill fs-3"
        iColor.style.color = color
        iColor.style.margin = "2px"
        ulTextoY.appendChild(iColor)
        iColor.onclick = () => {
            i2.style.color = color
            Color_Text_ChartY = color
            crear_grafico(consolidados, document.getElementById("listTipo_chart").value)
        }

    })

    const i2X = document.getElementById("i_textoX")
    i2X.className = "bi bi-square-fill rounded"
    i2X.style.color = "black"

    ColorList.forEach(color => {
        const iColor = document.createElement("i")
        iColor.className = "bi bi-square-fill fs-3"
        iColor.style.color = color
        iColor.style.margin = "2px"
        ulTextoX.appendChild(iColor)
        iColor.onclick = () => {
            i2X.style.color = color
            Color_Text_ChartX = color
            crear_grafico(consolidados, document.getElementById("listTipo_chart").value)
        }

    })

    const ileg = document.getElementById("i_textoLeg")
    ileg.className = "bi bi-square-fill rounded"
    ileg.style.color = "black"

    ColorList.forEach(color => {
        const iColor = document.createElement("i")
        iColor.className = "bi bi-square-fill fs-3"
        iColor.style.color = color
        iColor.style.margin = "2px"
        ulTextoLeg.appendChild(iColor)
        iColor.onclick = () => {
            ileg.style.color = color
            Color_Text_Leg = color
            crear_grafico(consolidados, document.getElementById("listTipo_chart").value)
        }

    })

    const i3 = document.getElementById("i_linea")
    i3.className = "bi bi-square-fill rounded"
    i3.style.color = "black"

    ColorList.forEach(color => {
        const iColor = document.createElement("i")
        iColor.className = "bi bi-square-fill fs-3"
        iColor.style.color = color
        iColor.style.margin = "2px"
        ulLinea.appendChild(iColor)
        iColor.onclick = () => {
            i3.style.color = color
            Color_Line_Chart = color
            crear_grafico(consolidados, document.getElementById("listTipo_chart").value)
        }

    })

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
    crear_grafico(consolidados, "bar")
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
    crear_grafico(newDataOrdenado, "bar")


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
    let newColors2 = []
    data.forEach(label => {
        if (label[2] >= rango && label[2] <= rangoMax) {
            newLabels.push(label[0])
            newVictimas.push(label[2])
            newCasos.push(label[1])
            newColors.push(getColor());
        }
    })

    new Chart(ctx, {
        type: tipo,
        data: {
            labels: newLabels,
            datasets: [{
                label: '# de Victimas',
                data: newVictimas,
                borderWidth: 1,
                backgroundColor: ColorList2.Rojos1,
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
