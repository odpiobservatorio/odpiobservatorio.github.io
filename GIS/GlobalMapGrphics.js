let MarkFreePoligon = [];
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

function PutMarkCicle(
    //Propiedasdes del marcador por defecto
    static = false,
    colorB = 'black',
    fillOpacity = 1,
    radius = 10,
    LatB = 4.797,
    LngB = -74.030,
    MarksFree=true


) {
    let Lat
    let Lng
    let draggable

    if (static == false) {
        draggable = true
        Lat = 4.797
        Lng = -74.030
    } else {
        draggable = false
        Lat = LatB
        Lng = LngB
    }



    circle = new L.circleMarker([Lat, Lng],
        {
            draggable: draggable,
            color: 'white',
            fillColor: colorB,
            fillOpacity: fillOpacity,
            radius: radius,
            weight: 1,
            //Para colocar las marcas arriba de otras capas.
            pane: 'polygonsPane'//Se encuentra configurado al inicio de map.html
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
    MarkFreePoligon.forEach(elemento => {
        map.removeLayer(elemento)
    })
}

function PutLabelFree() {
    let lb = document.getElementById("inLabel").value
    const LbEdit = `
        <div class="text-success" style="font-size:small;">${lb}</div>
    `

    let LabelMap = PutMarkCicle(false, 'azure', 1, 15000)
    LabelMap.bindTooltip(LbEdit, { draggable: 'true', permanent: true, className: "map-labels", offset: [10, 0] });
    LabelMap.on('dragend',
        function (event) {
            LabelMap = event.target;
            const position = LabelMap.getLatLng();
            LabelMap.setLatLng(new L.LatLng(position.lat, position.lng));
        });
    map.addLayer(LabelMap);
    LabelsMap.push(LabelMap)
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

function readMarks(){
let exportableMark=[]
    MarkFreePoligon.forEach(marca =>{

        exportableMark.push(
            {
                draggable: true,
                color: 'white',
                fillColor:  marca.options.fillColor,
                fillOpacity: marca.options.fillOpacity,
                radius: marca.options.radius,
                weight: 1,
                lat:marca._latlng.lat,
                lng:marca._latlng.lng,
                pane: marca.options.pane,
            }
        )
        console.log(exportableMark)
    })


}
