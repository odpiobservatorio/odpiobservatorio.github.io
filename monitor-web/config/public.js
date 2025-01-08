let data_public
const ColorListPublic = {
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
const formatNum = (numero) => {
    const valorUnformat = numero
    const valFormated = numero//valorUnformat.toLocaleString("us-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    return valFormated
}
const maxValue = (data, campo) => {
    let maxValue = 0
    let maxDAta = []

    for (id in data) {
        if (data[id][campo] > maxValue) {
            maxValue = data[id][campo]
            maxDAta = [data[id][campo], data[id][0]]
        }
    }
    return maxDAta

}

async function opendata() {
    data_public = GLOBAL.state.publicos[0]
    try {

        const nvictimas = document.getElementById("nvictimas")
        const ncasos = document.getElementById("ncasos")
        nvictimas.textContent = formatNum(data_public.consolidados[0].acumulados[0].victimas)
        ncasos.textContent = formatNum(data_public.consolidados[0].acumulados[0].casos)

        const nvictimasHoy = document.getElementById("nvictimasHoy")
        const ncasosHoy = document.getElementById("ncasosHoy")
        nvictimasHoy.textContent = formatNum(data_public.consolidados[0].actual[0].victimas)
        ncasosHoy.textContent = formatNum(data_public.consolidados[0].actual[0].casos)

        const corteData = document.getElementById("corteData")
        corteData.textContent = "Informe a corte de " + data_public.corte

    } catch (error) {

    }

    maker_years(data_public.consolidados[1].tiempo)

    document.getElementById("inMaxDep").onchange=()=>{
        maker_departamentos(data_public.consolidados[1].departamentos, document.getElementById("inMaxDep").value)
    }
    document.getElementById("inMaxPub").onchange=()=>{
        maker_pueblos(data_public.consolidados[1].pueblos, document.getElementById("inMaxPub").value)
    }
    document.getElementById("inMaxTipo").onchange=()=>{
        maker_tipos(data_public.consolidados[1].tipos, document.getElementById("inMaxTipo").value)
    }

    maker_departamentos(data_public.consolidados[1].departamentos,1000)
    maker_pueblos(data_public.consolidados[1].pueblos,1000)
    maker_tipos(data_public.consolidados[1].tipos,1000)

}
function maker_years(data) {
    const textVigencias = document.getElementById("textVigencias")
    const MaxVictimas = maxValue(data, 2)
    const MaxCasos = maxValue(data, 1)
    textVigencias.innerHTML = `En el registro de información para la categoría vigencia, encontramos que el año con más número de víctimas fue el <b>${MaxVictimas[1]}</b> con una cifra de <b>${MaxVictimas[0]}</b>. 
    En el caso de número de afectaciones se registra que para el año <b>${MaxCasos[1]}</b> se presentaron <b>${MaxCasos[0]}</b> casos (Clúster ODPI 2024). 
    <p class="mt-1">Existe una relación entre los sistemas de monitorieo u observación de las diferentes organizaciones, frente a mayor número de casos registrados,
    debido a que quienes tienen mayor efectividad en la comunicación de la información predominan en las estadísticas nacionales</p>`



    const div = document.getElementById('ChartVigencias');
    div.innerHTML = ""
    const ctx = document.createElement("canvas")
    div.appendChild(ctx)

    ctx.id = "myChartVigencia"
    ctx.style.height = "400px";
    //ctx.style.width = "600px";
    div.style.height = "400px";
    //div.style.width = "600px";

    let newLabels = []
    let newCasos = []
    let newVictimas = []




    for (id in data) {
        const datos = data[id]
        newLabels.push(datos[0])
        newVictimas.push(datos[2])
        newCasos.push(datos[1])
    }

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: newLabels,
            datasets: [{
                label: "Víctimas por año",
                data: newVictimas,
                //borderColor: "gray",
                borderWidth: 1,
                backgroundColor: ColorListPublic.Rojos1,
            },
            {
                label: "Casos por año",
                data: newCasos,
                //borderColor: "gray",
                borderWidth: 1,
                backgroundColor: ColorListPublic.Verdes1,
            }],

        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: "y",
            plugins: {
                // changin the lagend colour
                legend: {
                    labels: {
                        color: "black",
                        font: {
                            size: "14pt",
                        }
                    },
                },
            },
            scales: {
                y: {
                    display: true,
                    beginAtZero: true,
                    ticks: {
                        color: "black",
                        font: {
                            size: "14pt",
                            //weight: "bolder"
                        }
                    },
                    grid: {
                        display: false,
                        //color: Color_Line_Chart
                    }
                },
                x: {
                    display: true,
                    ticks: {
                        color: "black",
                        font: {
                            size: "12pt",
                        }
                    },
                    grid: {
                        display: false,
                        //color: Color_Line_Chart
                    }
                }
            }
        }
    });

}

function maker_departamentos(data,min) {
    const textVigencias = document.getElementById("textDepartamentos")
    const MaxVictimas = maxValue(data, 2)
    const MaxCasos = maxValue(data, 1)
    textVigencias.innerHTML = `En el registro de información para la categoría departamento, encontramos que el lugar con más número de víctimas es <b>${MaxVictimas[1]}</b> con una cifra de <b>${MaxVictimas[0]}</b>. 
    En el caso de número de afectaciones se registra que el departamento de <b>${MaxCasos[1]}</b> se presentaron <b>${MaxCasos[0]}</b> casos (Clúster ODPI 2024).`



    const div = document.getElementById('ChartDepartamentos');
    div.innerHTML = ""
    const ctx = document.createElement("canvas")
    div.appendChild(ctx)

    ctx.id = "myChartVigencia"
    ctx.style.height = "400px";
    //ctx.style.width = "600px";
    div.style.height = "400px";
    //div.style.width = "600px";

    let newLabels = []
    let newCasos = []
    let newVictimas = []


    for (id in data) {
        if (data[id][2] >= min) {
            const datos = data[id]
            newLabels.push(datos[0])
            newVictimas.push(datos[2])
            newCasos.push(datos[1])
        }

    }

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: newLabels,
            datasets: [{
                label: "Víctimas por año",
                data: newVictimas,
                //borderColor: "gray",
                borderWidth: 1,
                backgroundColor: ColorListPublic.Rojos1,
            }],

        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: "y",
            plugins: {
                // changin the lagend colour
                legend: {
                    labels: {
                        color: "black",
                        font: {
                            size: "14pt",
                        }
                    },
                },
            },
            scales: {
                y: {
                    display: true,
                    beginAtZero: true,
                    ticks: {
                        color: "black",
                        font: {
                            size: "14pt",
                            //weight: "bolder"
                        }
                    },
                    grid: {
                        display: false,
                        //color: Color_Line_Chart
                    }
                },
                x: {
                    display: true,
                    ticks: {
                        color: "black",
                        font: {
                            size: "12pt",
                        }
                    },
                    grid: {
                        display: false,
                        //color: Color_Line_Chart
                    }
                }
            }
        }
    });

}
function maker_pueblos(data,min) {
    const textData = document.getElementById("textPueblos")
    const MaxVictimas = maxValue(data, 2)
    const MaxCasos = maxValue(data, 1)
    textData.innerHTML = `En relación a la categoría Pueblo o Comunidad se evidencia que el pueblo <b>${MaxVictimas[1]}</b> presenta mayor número de víctimas con una cifra de <b>${MaxVictimas[0]}</b>. 
    En el caso de número de afectaciones se registra que en el pueblo <b>${MaxCasos[1]}</b> se presentaron <b>${MaxCasos[0]}</b> casos.`


    const div = document.getElementById('ChartPueblos');
    div.innerHTML = ""
    const ctx = document.createElement("canvas")
    div.appendChild(ctx)

    ctx.id = "myChart"
    ctx.style.height = "400px";
    //ctx.style.width = "600px";
    div.style.height = "400px";
    //div.style.width = "600px";

    let newLabels = []
    let newCasos = []
    let newVictimas = []


    for (id in data) {
        if (data[id][2] >= min) {
            const datos = data[id]
            newLabels.push(datos[0])
            newVictimas.push(datos[2])
            newCasos.push(datos[1])
        }

    }

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: newLabels,
            datasets: [{
                label: "Víctimas por pueblo",
                data: newVictimas,
                //borderColor: "gray",
                borderWidth: 1,
                backgroundColor: ColorListPublic.Rojos1,
            }],

        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: "y",
            plugins: {
                // changin the lagend colour
                legend: {
                    labels: {
                        color: "black",
                        font: {
                            size: "14pt",
                        }
                    },
                },
            },
            scales: {
                y: {
                    display: true,
                    beginAtZero: true,
                    ticks: {
                        color: "black",
                        font: {
                            size: "14pt",
                            //weight: "bolder"
                        }
                    },
                    grid: {
                        display: false,
                        //color: Color_Line_Chart
                    }
                },
                x: {
                    display: true,
                    ticks: {
                        color: "black",
                        font: {
                            size: "12pt",
                        }
                    },
                    grid: {
                        display: false,
                        //color: Color_Line_Chart
                    }
                }
            }
        }
    });

}
function maker_tipos(data,min) {
    const textData = document.getElementById("textTipos")
    const MaxVictimas = maxValue(data, 2)
    const MaxCasos = maxValue(data, 1)
    textData.innerHTML = `En relación a la categoría Tipo de Afectación o Desarmonía se evidencia que el tipo <b>${MaxVictimas[1]}</b> presenta mayor número de víctimas con una cifra de <b>${MaxVictimas[0]}</b>. 
    En el caso de número de afectaciones se registra que en el tipo <b>${MaxCasos[1]}</b> se presentaron <b>${MaxCasos[0]}</b> casos.`


    const div = document.getElementById('ChartTipos');
    div.innerHTML = ""
    const ctx = document.createElement("canvas")
    div.appendChild(ctx)

    ctx.id = "myChart"
    ctx.style.height = "400px";
    //ctx.style.width = "600px";
    div.style.height = "400px";
    //div.style.width = "600px";

    let newLabels = []
    let newCasos = []
    let newVictimas = []


    for (id in data) {
        if (data[id][2] >= min) {
            const datos = data[id]
            newLabels.push(datos[0])
            newVictimas.push(datos[2])
            newCasos.push(datos[1])
        }

    }

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: newLabels,
            datasets: [{
                label: "Víctimas por tipo de afectación",
                data: newVictimas,
                //borderColor: "gray",
                borderWidth: 1,
                backgroundColor: "gray",
            }],

        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: "y",
            plugins: {
                // changin the lagend colour
                legend: {
                    labels: {
                        color: "black",
                        font: {
                            size: "14pt",
                        }
                    },
                },
            },
            scales: {
                y: {
                    display: true,
                    beginAtZero: true,
                    ticks: {
                        color: "black",
                        font: {
                            size: "14pt",
                            //weight: "bolder"
                        }
                    },
                    grid: {
                        display: false,
                        //color: Color_Line_Chart
                    }
                },
                x: {
                    display: true,
                    ticks: {
                        color: "black",
                        font: {
                            size: "12pt",
                        }
                    },
                    grid: {
                        display: false,
                        //color: Color_Line_Chart
                    }
                }
            }
        }
    });

}
