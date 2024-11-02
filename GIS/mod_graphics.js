let latlng_line = {
    "ini": {
        "lat": "",
        "lng": "",
        "lugar": "",
        "departamento": "",
    },
    "end": {
        "lat": "",
        "lng": "",
        "lugar": "",
        "departamento": ""
    },
    "info": {
        "detalle": ""
    },
    "layer": {
        "pointA": "",
        "pointB": "",
        "pointC": ""
    }

}
let format_grafico = {
    "layer_line": {
        "format": {
            color_linea: "'black'",
            opacidad: 1,
            ancho_linea: 3,
            pane: "'4'",
            dashArray: "''"
        }
    }
}
let line_marks_temp = {

}


function ini_menu_graficos() {
    const clistaDep = document.getElementById("lisDep_graficos")
    const clistaMun = document.getElementById("lisMun_graficos")
    clistaDep.innerHTML = ""
    departamentos.forEach(dep => {
        const option = document.createElement("option")
        option.value = dep.departamento.toLowerCase()
        option.textContent = dep.departamento
        clistaDep.appendChild(option)

    })
    clistaDep.value = "bogotá"

    clistaDep.onchange = () => {
        clistaMun.innerHTML = ""
        lugares.forEach(item => {
            if (item.departamento.toLowerCase() == clistaDep.value) {
                const option = document.createElement("option")
                option.value = item.lng + "," + item.lat
                option.textContent = item.lugar
                clistaMun.appendChild(option)
            }
        })
    }
    clistaDep.value = "bogotá"
    clistaDep.onchange()
    clistaMun.value = "4.64993705899,-74.106715324"
    const inCoordenadas = document.getElementById("intCoordGrafico")
    clistaMun.onchange = () => {
        inCoordenadas.value = clistaMun.value
    }

    const btn_lne_ini = document.getElementById("line_ini_point")
    btn_lne_ini.onclick = () => {
        ini_line_point()
    }

    //===========================================================
    //Boton que administra marca final de la ruta
    const btn_lne_end = document.getElementById("line_end_point")
    btn_lne_end.onclick = () => {
        end_line_point()
    }

    //==================================================================
    //Acciones para leer la línea
    const fileSelector = document.getElementById('file-input-lines');
    fileSelector.addEventListener('change', (event) => {
        const archivo = event.target.files[0];

        if (!archivo) {
            return;
        }
        var lector = new FileReader();
        lector.onload = function (e) {
            var contenido = e.target.result;
            var data = JSON.parse(contenido)
            upload_lines(data)
        };

        lector.readAsText(archivo);
        //Limpiamos el contenedor archivo para que permita recargas
        document.getElementById('file-input-lines').value = ''
        //Lista las marcas en el contenedor de marcas
    });

    const btnSave_line = document.getElementById("btnSave_line")
    btnSave_line.onclick = () => {
        let tempLayer = {}

        for (ind in line_marks_temp) {
            tempLayer[ind] = {
                "pointA": line_marks_temp[ind].layer.pointA,
                "pointB": line_marks_temp[ind].layer.pointB,
                "pointC": line_marks_temp[ind].layer.pointC
            }

            line_marks_temp[ind].layer.pointA = ""
            line_marks_temp[ind].layer.pointB = ""
            line_marks_temp[ind].layer.pointC = ""
        }

        download(JSON.stringify(line_marks_temp), 'layer_line.json', 'txt')
        for (ind in line_marks_temp) {
            line_marks_temp[ind].layer.pointA = tempLayer[ind].pointA
            line_marks_temp[ind].layer.pointB = tempLayer[ind].pointB
            line_marks_temp[ind].layer.pointC = tempLayer[ind].pointC
        }
    }
    //================================================

    maker_format_line()

}

function ini_line_point() {
    const clistaDep = document.getElementById("lisDep_graficos")
    const clistaMun = document.getElementById("lisMun_graficos")
    const intOtroLugar = document.getElementById("intOtroLugar")
    const intCoordenadas = document.getElementById("intCoordGrafico")
    const intInfoLine = document.getElementById("intInfoLine")


    //Optiene las coordeandas del primer punto
    const latlng = intCoordenadas.value.split(",")
    //Guardo la primera coordenada
    latlng_line.ini.lat = latlng[0]
    latlng_line.ini.lng = latlng[1]
    latlng_line.ini.departamento = clistaDep.options[clistaDep.selectedIndex].text;

    if (intOtroLugar.value == "") {
        latlng_line.ini.lugar = clistaMun.options[clistaMun.selectedIndex].text;
    } else {
        latlng_line.ini.lugar = intOtroLugar.value
    }
    latlng_line.info.detalle = intInfoLine.value


    intOtroLugar.value = ""
    intCoordenadas.value = ""

    //Creamos el punto en el mapa
    let marcaA = L.circleMarker([latlng_line.ini.lat, latlng_line.ini.lng],
        {
            color: "white",
            fillColor: "red",
            fillOpacity: 1,
            weight: 1,
            radius: 5,
            pane: "3"
        }
    )
    marcaA.bindPopup(function () {
        return "Origen: " + latlng_line.ini.lugar + ", " + latlng_line.ini.departamento;
    }, { pane: "labels" }
    )
    marcaA.addTo(map);
    latlng_line.layer.pointA = marcaA
}
function end_line_point() {
    const clistaDep = document.getElementById("lisDep_graficos")
    const clistaMun = document.getElementById("lisMun_graficos")
    const intOtroLugar = document.getElementById("intOtroLugar")
    const intCoordenadas = document.getElementById("intCoordGrafico")
    const intInfoLine = document.getElementById("intInfoLine")


    //Optiene las coordeandas del primer punto
    const latlng = intCoordenadas.value.split(",")
    //Guardo la primera coordenada
    latlng_line.end.lat = latlng[0]
    latlng_line.end.lng = latlng[1]
    latlng_line.end.departamento = clistaDep.options[clistaDep.selectedIndex].text;

    if (intOtroLugar.value == "") {
        latlng_line.end.lugar = clistaMun.options[clistaMun.selectedIndex].text;
    } else {
        latlng_line.end.lugar = intOtroLugar.value
    }
    latlng_line.info.detalle = intInfoLine.value


    intOtroLugar.value = ""
    intCoordenadas.value = ""
    //intInfoLine.value = ""

    //Creamos el punto en el mapa
    let marcaB = L.circleMarker([latlng_line.end.lat, latlng_line.end.lng],
        {
            color: "white",
            fillColor: "lime",
            fillOpacity: 1,
            weight: 1,
            radius: 5,
            pane: "3"
        }
    )
    marcaB.bindPopup(function () {
        return "Destino: " + latlng_line.end.lugar + ", " + latlng_line.end.departamento;
    }, { pane: "labels" }
    )
    marcaB.addTo(map);
    latlng_line.layer.pointB = marcaB
    maker_line()
}
function maker_line() {
    var pointA = new L.LatLng(latlng_line.ini.lat, latlng_line.ini.lng);
    var pointB = new L.LatLng(latlng_line.end.lat, latlng_line.end.lng);
    var pointList = [pointA, pointB];

    var lineNew = new L.Polyline(pointList, {
        color: eval(format_grafico["layer_line"].format.color_linea),
        weight: eval(format_grafico["layer_line"].format.ancho_linea),
        opacity: eval(format_grafico["layer_line"].format.opacidad),
        pane: eval(format_grafico["layer_line"].format.pane),

    });
    let divLabel = document.createElement("div")
    const index = Math.random().toString(36).slice(2) + "mark"
    lineNew.bindPopup(function () {

        divLabel.innerHTML =
            `<div>Desplazamiento desde (${latlng_line.ini.lugar}, ${latlng_line.ini.departamento})</div>
            <div>Hasta (${latlng_line.end.lugar}, ${latlng_line.end.departamento})</div>
            <div>${document.getElementById("intInfoLine").value}</div>
            `
        const btnBorrar = document.createElement("button")
        btnBorrar.className = "btn btn-secondary mt-1"
        btnBorrar.type = "button"
        btnBorrar.innerHTML = `<i class="bi bi-trash" style="font-size: 10pt;"></i>`
        divLabel.appendChild(btnBorrar)
        btnBorrar.onclick = () => {
            map.removeLayer(line_marks_temp[index].layer.pointA)
            map.removeLayer(line_marks_temp[index].layer.pointB)
            map.removeLayer(line_marks_temp[index].layer.pointC)
            delete line_marks_temp[index];
            maker_lista_lines()
        }
        return divLabel
    }, { pane: "labels" }
    )
    map.addLayer(lineNew);
    latlng_line.layer.pointC = lineNew

    maker_object_line(index)
}
function maker_object_line(index) {
    //Creamos el objeto completo para despues guardar
    line_marks_temp[index] = {
        "layer": {
            "pointA": latlng_line.layer.pointA,
            "pointB": latlng_line.layer.pointB,
            "pointC": latlng_line.layer.pointC,
        },
        "line": {
            "coord": {
                ini_lat: latlng_line.ini.lat,
                ini_lng: latlng_line.ini.lng,
                end_lat: latlng_line.end.lat,
                end_lng: latlng_line.end.lng
            },
            "places": {
                ini_mun: latlng_line.ini.lugar,
                ini_dep: latlng_line.ini.departamento,
                end_mun: latlng_line.end.lugar,
                end_dep: latlng_line.end.departamento,
            },
            "format_line": {
                "color": format_grafico["layer_line"].format.color_linea,
                "weight": format_grafico["layer_line"].format.ancho_linea,
                "opacity": format_grafico["layer_line"].format.opacidad,
                "pane": format_grafico["layer_line"].format.pane,
                "dashArray": format_grafico["layer_line"].format.dashArray,
            },
            "info": {
                "detalle": document.getElementById("intInfoLine").value
            }
        }
    }
    maker_lista_lines()
}
function maker_lista_lines() {
    const panel_lista_lines = document.getElementById("panel_lista_lines")
    panel_lista_lines.innerHTML = ""

    let cont = 1

    for (i in line_marks_temp) {
        const info = line_marks_temp[i].line.places
        const row = document.createElement("div")
        row.className = "row align-items-center m-1"
        panel_lista_lines.appendChild(row)

        const col0 = document.createElement("div")
        col0.className = "col-auto"
        col0.textContent = cont++
        row.appendChild(col0)

        const col1 = document.createElement("div")
        col1.className = "col"
        col1.innerHTML = `
        <div>${info.ini_mun}</div>
        <div>${info.end_mun}</div>
         `
        row.appendChild(col1)

        const col2 = document.createElement("div")
        col2.className = "col-auto text-end"
        row.appendChild(col2)


        const btnBorrar = document.createElement("button")
        btnBorrar.className = "btn btn-secondary"
        btnBorrar.type = "button"
        btnBorrar.innerHTML = `<i class="bi bi-trash" style="font-size: 10pt;"></i>`
        col2.appendChild(btnBorrar)
        btnBorrar.onclick = () => {
            map.removeLayer(line_marks_temp[i].layer.pointA)
            map.removeLayer(line_marks_temp[i].layer.pointB)
            map.removeLayer(line_marks_temp[i].layer.pointC)
            delete line_marks_temp[i];
            maker_lista_lines()
        }
    }
}

function maker_format_line() {
    //Boton color línea
    const btnColorLine_graficos = document.getElementById("btnColorLine_graficos")
    const ul = document.getElementById("ulColorLinea_graficos")
    const icl = document.getElementById("iclg")

    btnColorLine_graficos.onclick = () => {
        ColorList.forEach(color => {
            const iColor = document.createElement("i")
            iColor.className = "bi bi-square-fill fs-5 m-1"
            iColor.style.color = color
            ul.appendChild(iColor)
            iColor.onclick = () => {
                icl.style.color = color
                format_grafico["layer_line"].format.color_linea = `'${color}'`
            }
        })
    }
    const selOpacityLine_graficos = document.getElementById("selOpacityLine_graficos")
    selOpacityLine_graficos.onchange = () => {
        format_grafico["layer_line"].format.opacidad = selOpacityLine_graficos.value
    }

    const selGrosorLine_graficos = document.getElementById("selGrosorLine_graficos")
    selGrosorLine_graficos.onchange = () => {
        format_grafico["layer_line"].format.ancho_linea = selGrosorLine_graficos.value
    }
    const selTipoLine_graficos = document.getElementById("selTipoLine_graficos")
    selTipoLine_graficos.onchange = () => {
        format_grafico["layer_line"].format.dashArray = selTipoLine_graficos.value
    }


}
function clear_line() {
    for (i in line_marks_temp) {
        map.removeLayer(line_marks_temp[i].layer.pointA)
        map.removeLayer(line_marks_temp[i].layer.pointB)
        map.removeLayer(line_marks_temp[i].layer.pointC)
        delete line_marks_temp[i];
    }
    maker_lista_lines()
}

async function download(data, type) {
    console.log(line_marks_temp,"save")
    const blob = new Blob([data], { type: type });

    const newHandle = await window.showSaveFilePicker({
        types: [{
            description: 'Text Files',
            accept: {
                'text/plain': ['.json'],
            },
        }],
        id: "save-json-file-picker",
        excludeAcceptAllOption: true,
    });

    const writableStream = await newHandle.createWritable();
    await writableStream.write(blob);
    await writableStream.close();
}


function upload_lines(loadadata) {
    
    for (i in loadadata) {
        const data = loadadata[i]

        //Creamos el punto en el mapa
        let marcaA = L.circleMarker([data.line.coord.ini_lat, data.line.coord.ini_lng],
            {
                color: "white",
                fillColor: "red",
                fillOpacity: 1,
                weight: 1,
                radius: 5,
                pane: "3"
            }
        )
        marcaA.bindPopup(function () {
            return "Origen: " + data.line.places.ini_mun + ", " + data.line.places.ini_dep;
        }, { pane: "labels" }
        )
        marcaA.addTo(map);
        //========================================================================================
        //Creamos el punto en el mapa
        let marcaB = L.circleMarker([data.line.coord.end_lat, data.line.coord.end_lng],
            {
                color: "white",
                fillColor: "lime",
                fillOpacity: 1,
                weight: 1,
                radius: 5,
                pane: "3"
            }
        )
        marcaB.bindPopup(function () {
            return "Destino: " + data.line.places.end_mun + ", " + data.line.places.end_dep;
        }, { pane: "labels" }
        )
        marcaB.addTo(map);

        //=============================================================================================
        var pointA = new L.LatLng(data.line.coord.ini_lat, data.line.coord.ini_lng);
        var pointB = new L.LatLng(data.line.coord.end_lat, data.line.coord.end_lng);
        var pointList = [pointA, pointB];

        var lineNew = new L.Polyline(pointList, {
            color: eval(data.line.format_line.color),
            weight: eval(data.line.format_line.weight),
            opacity: eval(data.line.format_line.opacity),
            pane: eval(data.line.format_line.pane),
            dashArray: eval(data.line.format_line.dashArray),

        });
        let divLabel = document.createElement("div")
        lineNew.bindPopup(function () {
            divLabel.innerHTML =
                `<div>Desplazamiento desde (${data.line.places.ini_mun}, ${data.line.places.ini_dep})</div>
            <div>Hasta (${data.line.places.end_mun}, ${data.line.places.end_dep})</div>
            <div>${data.line.info.detalle}</div>
            `
            const btnBorrar = document.createElement("button")
            btnBorrar.className = "btn btn-secondary mt-1"
            btnBorrar.type = "button"
            btnBorrar.innerHTML = `<i class="bi bi-trash" style="font-size: 10pt;"></i>`
            divLabel.appendChild(btnBorrar)
            btnBorrar.onclick = () => {
                map.removeLayer(line_marks_temp[i].layer.pointA)
                map.removeLayer(line_marks_temp[i].layer.pointB)
                map.removeLayer(line_marks_temp[i].layer.pointC)
                delete line_marks_temp[i];
                maker_lista_lines()
            }
            return divLabel
        }, { pane: "labels" }
        )
        map.addLayer(lineNew);

        //===========================================================================================
        line_marks_temp[i] = {
            "layer": {
                "pointA": marcaA,
                "pointB": marcaB,
                "pointC": lineNew,
            },
            "line": {
                "coord": {
                    ini_lat: data.line.coord.ini_lat,
                    ini_lng: data.line.coord.ini_lng,
                    end_lat: data.line.coord.end_lat,
                    end_lng: data.line.coord.end_lng
                },
                "places": {
                    ini_mun: data.line.places.ini_mun,
                    ini_dep: data.line.places.ini_dep,
                    end_mun: data.line.places.end_mun,
                    end_dep: data.line.places.end_dep,
                },
                "format_line": {
                    "color": data.line.format_line.color,
                    "weight": data.line.format_line.weight,
                    "opacity": data.line.format_line.opacity,
                    "pane": data.line.format_line.pane,
                    "dashArray": data.line.format_line.dashArray,
                },
                "info": {
                    "detalle": data.line.info.detalle
                }
            }
        }



    }
    console.log(line_marks_temp,"open")
    maker_lista_lines()

}