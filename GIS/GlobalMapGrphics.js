

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
    "#C0392B", "#E74C3C",
    //Violetas
    "#9B59B6", "#AF7AC5",
    //Azules
    "#2980B9", "#3498DB",
    //Asure
    "#48C9B0", "#45B39D",
    //Verdes
    "#52BE80 ", "#2ECC71", "#145A32",
    //Naranjas
    "#F1C40F", "#F39C12", "#E67E22", "#D35400",

    "#ECF0F1",
    "#BDC3C7", "#95A5A6", "#7F8C8D", "#34495E",
    "#2C3E50", "#17202A"
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
    fillOpacity = 1,
    radius = 10,
    LatB = 4.797,
    LngB = -74.030,
    Onlabel = false,
    Content = '',
    key = ''
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
            color: 'white',
            fillColor: colorB,
            fillOpacity: fillOpacity,
            radius: radius,
            weight: 1,
            //Para colocar las marcas arriba de otras capas.
            pane: 'polygonsPane',//Se encuentra configurado al inicio de map.html
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
    })
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
        showDep();
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
                console.log(marca.content, marca.lat, marca.lng)
                PutLabelFree(marca.content, marca.lat, marca.lng)
            }
        })

    };
    lector.readAsText(archivo);
    //Limpiamos el contenedor archivo para que permita recargas
    document.getElementById('file-input').value = ''
}
//Vincula el evento del control input para cargar el archivo
document.getElementById('file-input')
    .addEventListener('change', LoadMarks);

document.getElementById('file-load')
    .addEventListener('change', LoadFiles);

function HideMark() {

    console.log(LabelsMapGrup[0].options.key)
}

function LoadFileSelected() {
    const ListFiles = document.getElementById('selPathFiles')

    var selectedText = ListFiles.options[ListFiles.selectedIndex].text;
    GLOBAL.firestore.readFile(ListFiles.value, selectedText)

}

function InterPretarData(Data, name) {


    let Mark
    let typeGeometry = Data.features[0].geometry.type

    if (typeGeometry == 'MultiPoint') {

        let i = 0
        CapasCustom[name]=[]
        new L.geoJSON(Data, {
            style: (feature) => {
                const Lat = feature.geometry.coordinates[0][1]
                const Lng = feature.geometry.coordinates[0][0]
                const mark= new L.circleMarker([Lat, Lng],
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
        CapasCustom[name]=[]
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
        CapasCustom[name]=[]
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

function hideLayer() {
    const ListFiles = document.getElementById('selPathFiles')
    var selectedText = ListFiles.options[ListFiles.selectedIndex].text;

    const ItemsArray = (CapasCustom[selectedText])
   
    ItemsArray.forEach(elemento=>{
        map.removeLayer(elemento)

    })


    //
}