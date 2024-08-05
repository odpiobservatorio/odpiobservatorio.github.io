let data2chart = []
let ActiveDBchart;
let consolidados = []



function ini_chat() {
    //Cargamos la base de datos actual
    const proyectos = GLOBAL.state.proyectos;
    let MultiCasos = []
    proyectos.forEach(proyecto => {
        proyecto.clsCasos.forEach(caso=>{
            MultiCasos.push(caso)
        })
    })
    ActiveDBchart = MultiCasos
    mostrar_consolidados(ActiveDBchart)
}

function add_consulta() {
    data2chart.push(dataWfilter)

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