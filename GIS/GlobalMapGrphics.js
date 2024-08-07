
//VARIABLES PARA MARCADORES PERSONALIZADOS
//COLOR ACTIVO


let mark_selected;
let coordenada_activa = "4.797, -74.030";
let formatActivo = {
    "tipo_activo": "0",
    "color": "black",
    "size": "8",
    "opacidad": "1",
    "texto": ""
}

let markCopy;
//VARIABLE QUE GUARDA TODOS LOS MARCADORES PERSONALIZADOS, POSIBILITA LA OPCIÓN DE BORRAR TODOS O ÚLTIMO
let Marcadores_Personalizados = []
//Esta variable aplica para el módulo mapData, showBusqueda
let color_marca_busqueda = "green"
let colorline_marca_busqueda = "white"
let opacidad_marca_busqueda = 1
let size_marca_busqueda=10

//Guarda los marcadores libres
let MarkFreePoligon = [];
//Guarda las etiquetas libres punto/etiqueta
let LabelsMapGrup = []

let CapasCustom = {}

//Guarda la leyendas/convenciones
let LeyendasMap = []
//Lista de colores para usar

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


//Función para crear menú de colores
function ListColorsMn(control) {
    let cUl = document.getElementById(control)
    cUl.innerHTML = ""

    cUl.onchange = () => { PutMarkCicle(false, cUl.value, 1, 10) }

    ColorList.forEach(color => {
        let liC = document.createElement("option")
        liC.style.background = color
        liC.value = color
        liC.textContent = color

        cUl.appendChild(liC)
    })


}

function ListColors(type, control) {

    let cUl = document.getElementById(control)
    cUl.innerHTML = ""

    ColorList.forEach(color => {
        let liC = document.createElement("svg")

        liC.innerHTML = `
                    <svg width="40" height="20" 
                    style="background-color:${color};
                    opacity: 1"></svg>
            `
        if (type == 'Marks') {
            liC.onclick = () => UpdateColorMark(color)
        } else if (type == 'Layers') {
            liC.onclick = () => UpdateColorLayer(color)
        } else if (type == 'Desktop') {
            liC.onclick = () => UpdateColorDesktop(color)
        } else if (type == 'CroquisBorde') {
            liC.onclick = () => UpdateCroquisBorde(color)
        } else if (type == 'BorderMarksColor') {
            liC.onclick = () => UpdateColorBorderMark(color)
        } else if (type == 'color-mark-custom') {
            liC.onclick = () => {
                //Aplica para el panel de marcadores personalizados
                formatActivo.color = color
                document.getElementById("span-color-marca").style.background = color
                document.getElementById("span-opacity-marca").style.background = color
                document.getElementById("span-opacity-marca").style.opacity = formatActivo.opacidad
            }
        } else if (type == "color-mark-busqueda") {

            liC.onclick = () => {
                color_marca_busqueda = color
                document.getElementById("btnColor_busqueda").style.background = color
            }
        }
        else if (type == "color-mark-busqueda-plus") {

            liC.onclick = () => {
                color_marca_busqueda = color
                document.getElementById("btnColor_busquedaPlus").style.background = color
                document.getElementById("btnColor_busqueda").style.background = color
            }
            //Este evento es nuevo, remplazará a los anteriores
        } else if (type == "color-mark-consulta") {

            liC.onclick = () => {
                color_marca_busqueda = color
                document.getElementById("btnColor_consulta").style.background = color
            }
        }else if (type == "colorline-mark-consulta") {
            liC.onclick = () => {
                colorline_marca_busqueda = color
                document.getElementById("btnColorlinea_consulta").style.color = color
            }
        }

        cUl.appendChild(liC)
    })
}

function inputFromLatLng() {
    const valueCoord = document.getElementById('inMarkFrom')
    let coordenadas = []
    coordenadas = (valueCoord.value).split(",")

    PutMarkCicle(false, 'orange', 1, 10, coordenadas[0], coordenadas[1])
    mensajes("La marca fue creada")
}

function PutMarkCicle(
    //Propiedasdes del marcador por defecto
    static = false,
    colorB = 'black',
    colorL = 'white',
    fillOpacity = 1,
    radius = 10,
    LatB = 4.797,
    LngB = -74.030,
    pane="7",
    Onlabel = false,
    Content = '',
    key = '',
) {
    let Lat
    let Lng
    let draggable

    if (static == false) {
        draggable = true
        Lat = LatB
        Lng = LngB
    } else {
        draggable = false
        Lat = LatB
        Lng = LngB
    }

    circle = new L.circleMarker([Lat, Lng],
        {
            Type: 'Mark',
            draggable: draggable,
            fillColor: colorB,
            color: colorL,
            fillOpacity: fillOpacity,
            radius: radius,
            weight: 1,
            //Para colocar las marcas arriba de otras capas.
            pane: pane,//Se encuentra configurado al inicio de map.html
            Onlabel: Onlabel,
            Content: Content,
            key: key
        })
        


    if (static == false) {
        //Si es no estatico se activa la función de arrastrar
        circle.on('dragend', function (e) {
        })
        //solo se guardan la marca no fijas
        MarkFreePoligon.push(circle)
    }

    map.addLayer(circle)

    return circle

}

function PutMarkSquare(
    //Propiedasdes del marcador por defecto
    static = false,
    colorB = 'black',
    fillOpacity = 1,
    LatB = 4.797,
    LngB = -74.030,

) {
    poly1 = [
        [
            [7.30, -74.83],
            [6.88, -74.83],
            [6.88, -74.28],
            [7.30, -74.28],
            [7.30, -74.28],
        ]
    ]

    polygon = new L.Polygon([poly1], {
        draggable: true,
        color: 'green',
        fillColor: 'green',
        fillOpacity: 1,
        pane: 'polygonsPane',//Se encuentra configurado al inicio de map.html
    })

    map.addLayer(polygon)

    return polygon
}

function DeleteMarks() {
    //Borra los marcadores libres
    MarkFreePoligon.forEach(elemento => {
        map.removeLayer(elemento)
    })
    //Borra las leyendas
    LeyendasMap.forEach(elemento => {
        map.removeLayer(elemento)
    })

    //Borra las etiquetas libres punto/etiqueta
    LabelsMapGrup.forEach(elemento => {
        map.removeLayer(elemento)
    })

    LabelsMapGrup = []
    MarkFreePoligon = []
    LeyendasMap = []
}


function PutLabelFree(
    text = '',
    LatB = 4.797,
    LngB = -74.030) {


    let lb
    if (text.length == 0) {
        lb = document.getElementById("inLabel").value
    } else {
        lb = text
    }

    const LbEdit = `
    <div class="text-success" style="font-size:small;" onclick="HideMark()">${lb}</div>`

    let LabelMap = PutMarkCicle(false, 'azure', 0.5, 5, LatB, LngB, true, lb)

    LabelMap.bindTooltip(LbEdit, { interactive: true, draggable: 'true', permanent: true, className: "map-labels", offset: [10, 0] });
    LabelMap.on('dragend',
        function (event) {
            LabelMap = event.target;
            const position = LabelMap.getLatLng();
            LabelMap.setLatLng(new L.LatLng(position.lat, position.lng));
        });

    map.addLayer(LabelMap);
    //Guarda el conjunto de etiquetas libres punto/etiqueta
    LabelsMapGrup.push(LabelMap)


    //
}
function show_legens() {
    let labels = []
    let items = []
    Marcadores_Personalizados.forEach(item => {

        if (labels.includes(item.options.info) === false) {
            //let newItem=[item.options.info,item.options.Type, item.options.fillColor]
            labels.push(item.options.info)
            let newLabel = [item.options.info, item.options.Type, item.options.fillColor]
            items.push(newLabel)
        }
    })

    //Ordeno los datos A-Z
    let newDataOrdenado
    newDataOrdenado = items.sort(function (a, b) {
        var textA = a[0];
        var textB = b[0];
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });

    //const LbEdit = `
    //<div class="text-success" style="font-size:small;" onclick="HideMark()">${lb}</div>`

    const div = document.createElement("div")
    div.className = "m-1 border border-1 border-secondary  rounded"
    div.style.width = "200px"
    div.style.display = "inline-block"
    newDataOrdenado.forEach(item => {
        const row = document.createElement("div")
        row.className = "row ms-1 text-secondary align-items-center"
        row.style.fontSize = "10pt"

        const col1 = document.createElement("div")
        col1.className = "col-auto"

        if (item[1] == "circle") {
            const i = document.createElement("i")
            i.className = "bi-circle-fill"
            i.style.fontSize = "12pt"
            i.style.color = item[2]
            col1.appendChild(i)

        } else {
            const i = document.createElement("i")
            i.className = "bi-square-fill"
            i.style.fontSize = "12pt"
            i.style.color = item[2]
            col1.appendChild(i)
        }


        row.appendChild(col1)

        const col2 = document.createElement("div")
        col2.className = "col-auto"
        col2.textContent = item[0]
        row.appendChild(col2)


        div.appendChild(row)
    })



    let LabelMap = PutMarkCicle(false, 'gray', 0.5, 5)

    LabelMap.bindTooltip(
        div,
        {
            draggable: 'true',
            permanent: true,
            className: "",
            offset: [10, 0],
            pane: 'polygonsPane'
        });
    LabelMap.on('dragend', function (event) {
        LabelMap = event.target;
        const position = LabelMap.getLatLng();
        LabelMap.setLatLng(new L.LatLng(position.lat, position.lng));
    });
    map.addLayer(LabelMap);
    LeyendasMap.push(LabelMap)
}

function PutPopUpZ(text) {

    const PopUp = new L.popup({
        content: text,
        pane: 'mapPopUps'
    })
    return PopUp
}

function UpdateColorMark(fillColor) {
    bigData.MrkAntecedente.forEach(marca => {
        marca.setStyle(
            {
                fillColor: fillColor,
            })
    })
}
function UpdateColorBorderMark(color) {
    bigData.MrkAntecedente.forEach(marca => {
        marca.setStyle(
            {
                color: color,
            })
    })
}
function UpdateOpacityMark(fillOpacity) {
    bigData.MrkAntecedente.forEach(marca => {
        marca.setStyle(
            {
                fillOpacity: fillOpacity
            })
    })
}
function UpdateRadiusMark(radius) {
    bigData.MrkAntecedente.forEach(marca => {
        marca.setRadius(radius)
    })
}
function UpdateColorLayer(color) {

    formatoPlano["color"] = color;

    //Si el mapa tiene la capa activa, la elimina y genera nuevamente con los colores actualizados
    //Asi el cambio de la configuracion es instantaneo
    if (Layers.hasOwnProperty("LayerPlano") && map.hasLayer(Layers["LayerPlano"])) {
        map.removeLayer(Layers["LayerPlano"]);
        allLayers["LayerPlano"]();
    }

    if (Layers.hasOwnProperty("currentDep")) {
        updateDepColors()
    }
}
function UpdateOpacityLayer(opacity) {

    formatoPlano["opacidad"] = opacity;

    //Si el mapa tiene la capa activa, la elimina y genera nuevamente con los colores actualizados
    //Asi el cambio de la configuracion es instantaneo
    if (Layers.hasOwnProperty("LayerPlano") && map.hasLayer(Layers["LayerPlano"])) {
        map.removeLayer(Layers["LayerPlano"]);
        allLayers["LayerPlano"]();
    }

    if (Layers.hasOwnProperty("currentDep")) {
        showDep();
    }
}

function UpdateCroquisBorde(color) {

    formatoPlano["bordercolor"] = color;

    //Si el mapa tiene la capa activa, la elimina y genera nuevamente con los colores actualizados
    //Asi el cambio de la configuracion es instantaneo
    if (Layers.hasOwnProperty("LayerPlano") && map.hasLayer(Layers["LayerPlano"])) {
        map.removeLayer(Layers["LayerPlano"]);
        allLayers["LayerPlano"]();
    }

    if (Layers.hasOwnProperty("currentDep")) {
        updateDepColors()
    }
}

function UpdateBorderAncho(ancho) {
    formatoPlano["weight"] = ancho;

    //Si el mapa tiene la capa activa, la elimina y genera nuevamente con los colores actualizados
    //Asi el cambio de la configuracion es instantaneo
    if (Layers.hasOwnProperty("LayerPlano") && map.hasLayer(Layers["LayerPlano"])) {
        map.removeLayer(Layers["LayerPlano"]);
        allLayers["LayerPlano"]();
    }

    if (Layers.hasOwnProperty("currentDep")) {
        updateDepColors()
    }
}

function UpdateColorDesktop(color) {

    formatoDesktop["color"] = color;

    //Si el mapa tiene la capa activa, la elimina y genera nuevamente con los colores actualizados
    //Asi el cambio de la configuracion es instantaneo
    if (Layers.hasOwnProperty("LayerFondo") && map.hasLayer(Layers["LayerFondo"])) {
        map.removeLayer(Layers["LayerFondo"]);
        allLayers["LayerFondo"]();
    }

    if (Layers.hasOwnProperty("currentDep")) {
        showDep();
    }
}

function SaveMarks() {
    let exportableMark = []
    MarkFreePoligon.forEach(marca => {
        //Solo exporta las marcas independientes, no las de las etiquetas
        exportableMark.push(
            {
                type: marca.options.Type,
                color: 'white',
                fillColor: marca.options.fillColor,
                fillOpacity: marca.options.fillOpacity,
                radius: marca.options.radius,
                weight: 1,
                lat: marca._latlng.lat,
                lng: marca._latlng.lng,
                onlabel: marca.options.Onlabel,
                content: marca.options.Content
            }
        )

    })

    const a = document.createElement("a");
    const archivo = new Blob([JSON.stringify(exportableMark)], { type: 'text/plain' });
    const url = URL.createObjectURL(archivo);
    a.href = url;
    a.download = 'Puntos ODPI';
    a.click();
    URL.revokeObjectURL(url);
}

function LoadFiles(e) {
    var archivo = e.target.files[0];
    GLOBAL.firestore.loadfile(archivo)
    if (!archivo) {
        return;
    }
}

function LoadMarks(e) {
    var archivo = e.target.files[0];
    if (!archivo) {

        return;
    }
    var lector = new FileReader();
    lector.onload = function (e) {
        var contenido = e.target.result;
        var Parse = JSON.parse(contenido)

        Parse.forEach(marca => {
            //Si la entrada es una marca, pues creamos una marca
            if (marca.onlabel == false) {
                PutMarkCicle(
                    false,
                    marca.fillColor,
                    marca.fillOpacity,
                    marca.radius,
                    marca.lat,
                    marca.lng,
                    marca.onlabel,
                    '')
            } else {
                PutLabelFree(marca.content, marca.lat, marca.lng)
            }
        })

    };
    lector.readAsText(archivo);
    //Limpiamos el contenedor archivo para que permita recargas
    document.getElementById('file-input').value = ''
}
//Vincula el evento del control input para cargar el archivo


try {
    document.getElementById('file-load')
        .addEventListener('change', LoadFiles);
} catch (error) {
    console.log("Evento file-load")
}

function HideMark() {


}

function LoadFileSelected(file, name) {
    const ListFiles = document.getElementById('selPathFiles')
    GLOBAL.firestore.readFile(file, name)


}

function InterPretarData(Data, name, type) {
    if (type == "json") {
        var contenido = Data;
        var Parse = JSON.stringify(contenido)
        let i = 0
        Data.forEach(marca => {

            formatActivo.texto = marca.info
            if (marca.Type == "circle") {
                Marca_Personalizada_Circulo(
                    marca.draggable,
                    marca.fillColor,
                    marca.fillOpacity,
                    marca.radius,
                    marca.lat,
                    marca.lng,
                    marca.color,
                    marca.weight,
                    marca.pane
                )

            } else {
                Marca_Personalizada_Cuadrado(
                    marca.draggable,
                    marca.fillColor,
                    marca.fillOpacity,
                    marca.radius,
                    marca.lat,
                    marca.lng,
                    marca.color,
                    marca.weight,
                    marca.pane
                )

            }

            Marcadores_Personalizados[i].options.index = i
            i = i + 1
            list_marcas_custom()
        })
    } else if (type == "geojson") {
        let Mark
        let typeGeometry = Data.features[0].geometry.type

        if (typeGeometry == 'MultiPoint') {
            let i = 0
            CapasCustom[name] = []
            new L.geoJSON(Data, {
                style: (feature) => {
                    const Lat = feature.geometry.coordinates[0][1]
                    const Lng = feature.geometry.coordinates[0][0]
                    const mark = new L.circleMarker([Lat, Lng],
                        {

                            color: 'white',
                            fillColor: 'red',
                            fillOpacity: 1,
                            radius: 10,
                            weight: 1,
                            //Para colocar las marcas arriba de otras capas.
                            pane: 'polygonsPane',//Se encuentra configurado al inicio de map.html


                        }).addTo(map)
                    CapasCustom[name].push(mark)
                },
            })


        } else if (typeGeometry == 'MultiLineString') {
            CapasCustom[name] = []
            const Line = new L.geoJSON(Data, {
                style: (feature) => {
                    return {
                        color: "blue",
                        fillColor: "gray",
                        weight: 2,
                        fillOpacity: 0.5,
                        pane: 'mapLayers',
                    }
                },
            }).addTo(map)
            CapasCustom[name].push(Line)
        } else {
            CapasCustom[name] = []
            const Poligon = new L.geoJSON(Data, {
                style: (feature) => {
                    return {
                        color: "white",
                        fillColor: "gray",
                        weight: 2,
                        fillOpacity: 0.5,
                        pane: 'mapLayers',
                    }
                },
            }).addTo(map)
            CapasCustom[name].push(Poligon)
        }
    }



}

function hideLayer(selectedText, type) {
    if (type == "json") {
        delete_all_custom_marks(0)
    } else if (type == "geojson") {
        const ItemsArray = (CapasCustom[selectedText])
        ItemsArray.forEach(elemento => {
            map.removeLayer(elemento)
        })
    }

}



function update_format_custom() {
    //mark_selected
    let MarcaAtivaIni = Marcadores_Personalizados[mark_selected]
    const Tipo_Marca = formatActivo.tipo_activo
    if (Tipo_Marca == 0) {
        coordenada_activa = `${MarcaAtivaIni._latlng.lat}, ${MarcaAtivaIni._latlng.lng}`
        map.removeLayer(MarcaAtivaIni)
        Insertar_marcador_personalizado(Tipo_Marca)
    } else {
        map.removeLayer(MarcaAtivaIni)
        coordenada_activa = `${MarcaAtivaIni._latlngs[0][1].lat}, ${MarcaAtivaIni._latlngs[0][1].lng}`
        Insertar_marcador_personalizado(Tipo_Marca)
    }
    //Lista las marcas en el contenedor de marcas
    list_marcas_custom()
}

function copy_format_custom() {
    //mark_selected
    markCopy = Marcadores_Personalizados[mark_selected]
    console.log("copiar de:", mark_selected)
    mensajes("se ha copiado el formato","orange")


}

function paste_format_custom() {
    console.log("pegar a:", mark_selected)
    let MarcaAtivaIni = Marcadores_Personalizados[mark_selected]


    if (markCopy.options.Type == "circle") {
        coordenada_activa = `${MarcaAtivaIni._latlng.lat}, ${MarcaAtivaIni._latlng.lng}`

    } else {
        coordenada_activa = `${MarcaAtivaIni._latlngs[0][1].lat}, ${MarcaAtivaIni._latlngs[0][1].lng}`
    }

    let Coordenadas = coordenada_activa.split(",");


    formatActivo.texto = markCopy.options.info

    if (markCopy.options.Type == "circle") {
        Marca_Personalizada_Circulo(false, markCopy.options.fillColor, markCopy.options.fillOpacity, markCopy.options.radius, Coordenadas[0], Coordenadas[1])

    } else {
        Marca_Personalizada_Cuadrado(false, markCopy.options.fillColor, markCopy.options.fillOpacity, markCopy.options.radius, parseFloat(Coordenadas[0]), parseFloat(Coordenadas[1]))

    }
    //Lista las marcas en el contenedor de marcas
    map.removeLayer(MarcaAtivaIni)
    delete_all_custom_marks(1)
    let i = 0
    Marcadores_Personalizados.forEach(marca => {
        marca.options.index = i++
    })

    list_marcas_custom()
    mensajes("se ha actualizado el marcador","orange")
}



function Change_icon(control) {
    if (control.value == 0) {
        document.getElementById("ico-Tipo-Marca").className = "bi bi-circle-fill text-secondary fs-3"
    } else {
        document.getElementById("ico-Tipo-Marca").className = "bi bi-square-fill text-secondary fs-3"
    }

}
function Change_size_custom(value) {

    formatActivo.size = value
    document.getElementById("span-size-marca").textContent = formatActivo.size / 10 + "x"
}
function Change_opacity_custom(value) {

    formatActivo.opacidad = value
    document.getElementById("span-opacity-marca").textContent = 100 - ((formatActivo.opacidad) * 100) + "%"
    document.getElementById("span-opacity-marca").style.opacity = formatActivo.opacidad
}


//////ADMINISTRA LAS FUNCIONES DE MARCADORES LIBRES PERO CON CONFIGURACIÓN
function Insertar_marcador_personalizado() {

    let Coordenadas = coordenada_activa.split(",");

    const Tipo_Marca = document.getElementById("sel-tipo-marca").value

    if (Tipo_Marca == 0) {
        Marca_Personalizada_Circulo(false, formatActivo.color, formatActivo.opacidad, formatActivo.size, Coordenadas[0], Coordenadas[1])

    } else {
        Marca_Personalizada_Cuadrado(false, formatActivo.color, formatActivo.opacidad, formatActivo.size, parseFloat(Coordenadas[0]), parseFloat(Coordenadas[1]))
    }



    list_marcas_custom()

}

function Marca_Personalizada_Circulo(
    //Propiedasdes del marcador por defecto
    static = false,
    fillcolor = 'black',
    fillOpacity = 1,
    radius = 10,
    LatB = 4.797,
    LngB = -74.030,
    color = "white",
    weight = 1,
    pane = 'polygonsPane',

) {
    let Lat
    let Lng
    let draggable

    if (static == false) {
        draggable = true
        Lat = LatB
        Lng = LngB
    } else {
        draggable = false
        Lat = LatB
        Lng = LngB
    }

    circle = new L.circleMarker([Lat, Lng],
        {
            Type: 'circle',
            draggable: draggable,
            fillColor: fillcolor,
            fillOpacity: fillOpacity,
            radius: radius,
            color: color,
            weight: weight,
            //Para colocar las marcas arriba de otras capas.
            pane: pane,//Se encuentra configurado al inicio de map.html
            index: Marcadores_Personalizados.length,
            info: formatActivo.texto
        })

    let indexMark = circle.options.index

    //Agrega un díalogo personalizable que se abre al hacer click
    if (formatActivo.texto != "") {
        circle.bindPopup(PutPopUpZ(`${indexMark + 1}. ${formatActivo.texto}`));
    }

    //Acciones relacionadas con el evento click en la marca
    circle.on('click', onClick);
    function onClick() {
        mark_selected = this.options.index
        console.log(this.options.index)
        formatActivo.tipo_activo = 0
        //mark_selected
        let MarcaAtivaIni = this
        //Copia las coordenadas de la marca actual
        coordenada_activa = `${MarcaAtivaIni._latlng.lat}, ${MarcaAtivaIni._latlng.lng}`

    }
    if (static == false) {
        //Si es no estatico se activa la función de arrastrar
        circle.on('dragend', function (e) {
        })
        //solo se guardan la marca no fijas

    }
    map.addLayer(circle)
    Marcadores_Personalizados.push(circle)


    return circle
}
function Marca_Personalizada_Cuadrado(
    //Propiedasdes del marcador por defecto
    static = false,
    fillcolor = 'black',
    fillOpacity = 1,
    radius = 5,
    LatB = 7,
    LngB = -75,
    color = "white",
    weight = 1,
    pane = 'polygonsPane',


) {

    let Lat
    let Lng
    let draggable

    if (static == false) {
        draggable = true
        Lat = LatB
        Lng = LngB
    } else {
        draggable = false
        Lat = LatB
        Lng = LngB
    }
    let size = parseFloat(radius / 10)


    var bounds = [[LatB - size, LngB], [LatB, LngB + size]];

    polygon = new L.rectangle(bounds, {
        Type: 'polygon',
        draggable: draggable,
        fillColor: fillcolor,
        fillOpacity: fillOpacity,
        color: color,
        weight: weight,
        radius: radius,
        //Para colocar las marcas arriba de otras capas.
        pane: pane,//Se encuentra configurado al inicio de map.html
        index: Marcadores_Personalizados.length,
        info: formatActivo.texto

    })
    let indexMark = polygon.options.index

    //Agrega un díalogo personalizable que se bare al hacer click
    if (formatActivo.texto != "") {
        polygon.bindPopup(PutPopUpZ(`${indexMark + 1}. ${formatActivo.texto}`));
    }

    //Acciones relacionadas con el evento click en la marca
    polygon.on('click', onClick);
    function onClick() {
        mark_selected = this.options.index
        console.log(this.options.index)
        formatActivo.tipo_activo = 1
        let MarcaAtivaIni = this

        //Copia las coordenadas de la marca actual / NOTA, como este es un poligono, las coordenadas principales so bidimencinal
        coordenada_activa = `${MarcaAtivaIni._latlngs[0][1].lat}, ${MarcaAtivaIni._latlngs[0][1].lng}`
    }

    if (static == false) {
        //Si es no estatico se activa la función de arrastrar
        polygon.on('dragend', function (e) {
        })
        //solo se guardan la marca no fijas
        Marcadores_Personalizados.push(polygon)
    }
    map.addLayer(polygon)
    Marcadores_Personalizados.push(polygon)

    return polygon
}

function delete_all_custom_marks(option) {
    //Borra los marcadores libres
    if (option == 0) {
        Marcadores_Personalizados.forEach(elemento => {
            map.removeLayer(elemento)
            Marcadores_Personalizados = []
        })
        list_marcas_custom()
    } else {
        console.log("borrar:", mark_selected)
        map.removeLayer(Marcadores_Personalizados[mark_selected])

        Marcadores_Personalizados.splice(mark_selected, 1); // returns [1]
        let i = 0
        Marcadores_Personalizados.forEach(marca => {
            marca.options.index = i++
        })
    }
    list_marcas_custom()

    //Lista las marcas en el contenedor de marcas


}

//Carga las marcas de un archivo local
const fileSelector = document.getElementById('file-input-marks');
fileSelector.addEventListener('change', (event) => {
    const archivo = event.target.files[0];

    if (!archivo) {
        return;
    }
    var lector = new FileReader();
    lector.onload = function (e) {
        var contenido = e.target.result;
        var Parse = JSON.parse(contenido)
        let i = 0
        Parse.forEach(marca => {
            formatActivo.texto = marca.info
            if (marca.Type == "circle") {
                Marca_Personalizada_Circulo(
                    marca.draggable,
                    marca.fillColor,
                    marca.fillOpacity,
                    marca.radius,
                    marca.lat,
                    marca.lng,
                    marca.color,
                    marca.weight,
                    marca.pane
                )

            } else {
                Marca_Personalizada_Cuadrado(
                    marca.draggable,
                    marca.fillColor,
                    marca.fillOpacity,
                    marca.radius,
                    marca.lat,
                    marca.lng,
                    marca.color,
                    marca.weight,
                    marca.pane
                )

            }

            Marcadores_Personalizados[i].options.index = i
            i = i + 1
            list_marcas_custom()
        })

    };

    lector.readAsText(archivo);
    //Limpiamos el contenedor archivo para que permita recargas
    document.getElementById('file-input-marks').value = ''
    //Lista las marcas en el contenedor de marcas


});


function save_load_custom_marks(value) {
    //Si es 0 implica que se va a guardar las marcas
    if (value == 0) {
        let exportableMark = []
        Marcadores_Personalizados.forEach(marca => {
            //Solo exporta las marcas independientes, no las de las etiquetas
            let lat
            let lng

            if (marca.options.Type == "circle") {
                lat = marca._latlng.lat;
                lng = marca._latlng.lng;
            } else if (marca.options.Type == "polygon") {
                lat = marca._latlngs[0][1].lat;
                lng = marca._latlngs[0][1].lng;
            }
            exportableMark.push(
                {
                    Type: marca.options.Type,
                    draggable: marca.options.Type.draggable,
                    fillColor: marca.options.fillColor,
                    fillOpacity: marca.options.fillOpacity,
                    radius: marca.options.radius,
                    color: marca.options.color,
                    weight: marca.options.weight,
                    pane: marca.options.pane,
                    index: marca.options.index,
                    lat: lat,
                    lng: lng,
                    info: marca.options.info
                }
            )

        })

        const a = document.createElement("a");
        const archivo = new Blob([JSON.stringify(exportableMark)], { type: 'text/plain' });
        const url = URL.createObjectURL(archivo);
        a.href = url;
        a.download = 'Marcas Personales.json';
        a.click();
        URL.revokeObjectURL(url);
    }
}

function list_marcas_custom() {
    const contenedor = document.getElementById("list_marcas-custom")
    contenedor.innerHTML = ""

    let i = 0
    Marcadores_Personalizados.forEach(marca => {
        marca.options.index = i++
        let tipo;


        if (marca.options.Type == "circle") {
            tipo = "bi-circle-fill"
        } else if ("polygon") {
            tipo = "bi-square-fill"

        }

        const item = document.createElement("lis")
        item.className = "list-group-item d-flex justify-content-between align-items-start list-group-item-action"
        item.id = "marcador-item" + marca.options.index
        item.innerHTML = `
        <span class="badge text-bg-primary rounded-pill">
            <i class="bi ${tipo} fs-5" id="ico-list-marca" style="color: ${marca.options.fillColor};"></i>
        </span>
        <div class="ms-2 me-auto">

        <div class="">[${marca.options.index + 1}] ${marca.options.info}</div>
        </div>
            <span class="badge text-bg-primary rounded-pill" id="btn-borrar-marca${marca.options.index}">
                <i class="bi bi-trash3 text-secondary fs-5"></i>
            </span>

        `
        contenedor.appendChild(item)

        document.getElementById("marcador-item" + marca.options.index).onclick = () => {
            let lat
            let lng

            if (marca.options.Type == "circle") {
                lat = marca._latlng.lat;
                lng = marca._latlng.lng;
                formatActivo.tipo_activo = 0
            } else if (marca.options.Type == "polygon") {
                lat = marca._latlngs[0][1].lat;
                lng = marca._latlngs[0][1].lng;
                formatActivo.tipo_activo = 1
            }

            var tooltip = L.tooltip([lat, lng], {
                content: marca.options.info,
                pane: 'polygonsPane'
            })
                .addTo(map);


        }
        document.getElementById("marcador-item" + marca.options.index).onmousemove = () => {

            document.getElementById("marcador-item" + marca.options.index).className = "list-group-item d-flex justify-content-between align-items-start list-group-item-action"
        }
        document.getElementById(`btn-borrar-marca${marca.options.index}`).onclick = () => {
            mark_selected = marca.options.index

            if (marca.options.Type == "circle") {
                formatActivo.tipo_activo = 0
            } else if (marca.options.Type == "polygon") {
                formatActivo.tipo_activo = 1
            }
            delete_all_custom_marks(1)

        }



    })
}
function tooltip(control, texto, color) {
    const tooltip = document.createElement("span")
    tooltip.className = "tooltip-text"
    tooltip.textContent = (texto)
    tooltip.style.background = color
    control.appendChild(tooltip)


}