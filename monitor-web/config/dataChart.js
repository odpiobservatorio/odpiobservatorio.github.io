let data2chart = []
let ActiveDBchart;
let consolidados = []
let criteria_items = []



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
        console.log(criteria_items)

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
            console.log(criterio[0])
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
        newLabels.push(label[0])
        newVictimas.push(label[2])
        newCasos.push(label[1])

        newColors.push(getColor());
    })


    new Chart(ctx, {
        type: tipo,
        data: {
            labels: newLabels,
            datasets: [{
                label: '# de Victimas',
                data: newVictimas,
                borderWidth: 1,
                backgroundColor: newColors,
            }],

        },
        options: {
            responsive: true,
            indexAxis: 'y',
            scales: {
                y: {
                    beginAtZero: true
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
