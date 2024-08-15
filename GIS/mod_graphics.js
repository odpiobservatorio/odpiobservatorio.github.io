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
    "info":{
        "detalle":""
    }
}
let format_grafico = {
    "layer_line": {
        "format": {
            color_linea: "'black'",
            opacidad: 1,
            ancho_linea: 3,
            pane: "'4'"
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
    clistaMun.value = "bogotá"

    const inCoordenadas = document.getElementById("intCoordGrafico")
    clistaMun.onchange = () => {
        inCoordenadas.value = clistaMun.value
    }

    //Administra el inicio de la ruta
    const btn_lne_ini = document.getElementById("line_ini_point")
    btn_lne_ini.onclick = () => {
        const latlng = inCoordenadas.value.split(",")
        latlng_line.ini.lat = latlng[0]
        latlng_line.ini.lng = latlng[1]
        latlng_line.ini.lugar = clistaMun.options[clistaMun.selectedIndex].text;
        latlng_line.ini.departamento = clistaDep.options[clistaDep.selectedIndex].text;


        let marcaA = L.circleMarker([latlng_line.ini.lat, latlng_line.ini.lng],
            {
                color: "white",
                fillColor: "purple",
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
        maker_index()
        function maker_index() {
            let index = Math.random().toString(36).slice(2) + "mark"
            line_marks_temp[index] = {
                "layer": {
                    "data": marcaA,
                },
            }
        }
    }

    //===========================================================
    //Boton que administra marca final de la ruta
    const btn_lne_end = document.getElementById("line_end_point")
    btn_lne_end.onclick = () => {
        const latlng = inCoordenadas.value.split(",")
        latlng_line.end.lat = latlng[0]
        latlng_line.end.lng = latlng[1]
        latlng_line.end.lugar = clistaMun.options[clistaMun.selectedIndex].text;
        latlng_line.end.departamento = clistaDep.options[clistaDep.selectedIndex].text;

        let marcaB = L.circleMarker([latlng_line.end.lat, latlng_line.end.lng],
            {
                color: "white",
                fillColor: "purple",
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
        maker_index()
        make_line()
        function make_line() {
            var pointA = new L.LatLng(latlng_line.ini.lat, latlng_line.ini.lng);
            var pointB = new L.LatLng(latlng_line.end.lat, latlng_line.end.lng);
            var pointList = [pointA, pointB];

            var lineNew = new L.Polyline(pointList, {
                color: eval(format_grafico["layer_line"].format.color_linea),
                weight: eval(format_grafico["layer_line"].format.ancho_linea),
                opacity: eval(format_grafico["layer_line"].format.opacidad),
                pane: eval(format_grafico["layer_line"].format.pane),

            });
            lineNew.bindPopup(function () {
                return `Desplazamiento desde (${latlng_line.ini.lugar},${latlng_line.ini.departamento}) 
            \n hasta (${latlng_line.end.lugar},${latlng_line.end.departamento})
            \n ${document.getElementById("intInfoLine").value}`;
            }, { pane: "labels" }
            )
            map.addLayer(lineNew);

            maker_index_line()

            function maker_index_line() {
                let index = Math.random().toString(36).slice(2) + "line"
                line_marks_temp[index] = {
                    "layer": {
                        "data": lineNew,
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
                        },
                        "info":{
                            "detalle":document.getElementById("intInfoLine").value
                        }
                    }

                }

            }

        }
        function maker_index() {
            let index = Math.random().toString(36).slice(2) + "mark"
            line_marks_temp[index] = {
                "layer": {
                    "data": marcaB,
                },
            }
        }
    }

    maker_format_line()
    //==================================================================

    function maker_format_line() {
        //Boton color línea
        const btnColorLine_graficos = document.getElementById("btnColorLine_graficos")
        const ul = document.getElementById("ulColorLinea_graficos")
        const icl = document.getElementById("iclg")

        btnColorLine_graficos.onclick = () => {
            ColorList.forEach(color => {
                const iColor = document.createElement("i")
                iColor.className = "bi bi-square-fill fs-3 m-1"
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
    }

    //Acciones para guardar la línea
    const btnSave_line = document.getElementById("btnSave_line")
    btnSave_line.onclick = () => {

        for (ind in line_marks_temp) {
            line_marks_temp[ind].layer.data = ""
        }

        download(JSON.stringify(line_marks_temp), 'layer_line.json', 'txt')
    }

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


}
function clear_line() {
    for (ind in line_marks_temp) {
        try {
            map.removeLayer(line_marks_temp[ind].layer.data)
        } catch (error) {
            console.log(line_marks_temp[ind].layer.data)
        }
    }
}

function download(data, filename, type) {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function upload_lines(data) {
    for (ind in data) {
        if (data[ind].line != null) {
            //Procedemos a crear el primer punto
            ini_place(data[ind].line)
            end_place(data[ind].line)
        }
    }

    function ini_place(data) {
        
        latlng_line.ini.lat = data.coord.ini_lat
        latlng_line.ini.lng = data.coord.ini_lng
        latlng_line.ini.lugar = data.places.ini_mun
        latlng_line.ini.departamento = data.places.ini_dep

        let marcaA = L.circleMarker([latlng_line.ini.lat, latlng_line.ini.lng],
            {
                color: "white",
                fillColor: "purple",
                fillOpacity: 1,
                weight: 1,
                radius: 5,
                pane: "3"
            }

        )
        marcaA.bindPopup(function () {
            return "Origen: " + data.places.ini_mun + ", " + data.places.ini_dep;
        }, { pane: "labels" }
        )
        marcaA.addTo(map);
        maker_index()
        function maker_index() {
            let index = Math.random().toString(36).slice(2) + "mark"
            line_marks_temp[index] = {
                "layer": {
                    "data": marcaA,
                },
            }
        }
        
    }
    function end_place(data) {

        latlng_line.end.lat = data.coord.end_lat
        latlng_line.end.lng = data.coord.end_lng
        latlng_line.end.lugar = data.places.end_mun
        latlng_line.end.departamento = data.places.end_dep


        let marcaB = L.circleMarker([latlng_line.end.lat, latlng_line.end.lng],
            {
                color: "white",
                fillColor: "purple",
                fillOpacity: 1,
                weight: 1,
                radius: 5,
                pane: "3"
            }
        )

        marcaB.bindPopup(function () {
            return "Destino: " + data.places.end_mun + ", " + data.places.end_dep;;
        }, { pane: "labels" }
        )

        marcaB.addTo(map);
        maker_index()
        make_line()
        function make_line() {
            var pointA = new L.LatLng(latlng_line.ini.lat, latlng_line.ini.lng);
            var pointB = new L.LatLng(latlng_line.end.lat, latlng_line.end.lng);
            var pointList = [pointA, pointB];

            var lineLoad = new L.Polyline(pointList, {
                color: eval(data.format_line.color),
                weight: eval(data.format_line.weight),
                opacity: eval(data.format_line.opacity),
                pane: eval(data.format_line.pane),

            });
            lineLoad.bindPopup(function () {
                return `Desplazamiento desde (${data.places.ini_mun},${data.places.ini_dep }) 
            \n hasta (${data.places.end_mun },${data.places.end_dep})
            \n ${data.info.detalle}`;
            }, { pane: "labels" }
            )
            map.addLayer(lineLoad);

            maker_index_line()

            function maker_index_line() {
                let index = Math.random().toString(36).slice(2) + "line"
                line_marks_temp[index] = {
                    "layer": {
                        "data": lineLoad,
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
                        },
                        "info":{
                            "detalle":data.info.detalle
                        }
                    }

                }

            }

        }
        function maker_index() {
            let index = Math.random().toString(36).slice(2) + "mark"
            line_marks_temp[index] = {
                "layer": {
                    "data": marcaB,
                },
            }
        }
    }
}
