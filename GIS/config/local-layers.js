//Crea cadenas alfanumericas aleatorias
function randomStr(len, arr) {
    let ans = '';
    for (let i = len; i > 0; i--) {
        ans +=
            arr[(Math.floor(Math.random() * arr.length))];
    }
    return ans
}
//Crea un color aleatorio
function randomColor(color = false) {
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
let layers_local = {}

function open_local_layer(control) {
    const archivo = control.target.files[0];
    if (!archivo) {
        return;
    }
    var lector = new FileReader();
    const layer_title = archivo.name.split(".")

    lector.onload = function (e) {
        var file_geojson = e.target.result;
        var layer_local = JSON.parse(file_geojson)
        var layer_propierties = []

        //Creamos un índice aleatorio
        const idR = randomStr(10, '123456789abcdefghijklmnzx');
        //Crea una capa con base al archivo cargado
        const Layer_Open = L.geoJSON(layer_local, {
            style: function (feature) {
                //Mira los campos y verifica si alguno forma parte de la lista general
                for (const property in feature.properties) {
                    if (layer_propierties.includes(property) !== true) {
                        layer_propierties.push(property)
                    }
                }
                return {
                    color: "white",
                    fillColor: randomColor(),
                    pane: "4",
                    weight: 1,
                    fillOpacity: 1,
                    //display: 'none'
                }
            }
        }).addTo(map);

        //const layer_exist = layers_local.filter(ele => ele[1] == layer_title[0])
        //if (layer_exist.length !== 0) {
        //  mensajes("El archivo ya ha sido cargado", "Orange")
        //}

        const newFormat = {
            "style": {
                color_linea: "white",
                color_fondo: randomColor(),
                opacidad: 1,
                ancho_linea: 3,
                pane: "'3'",
                "change_backcolor": () => {

                }

            },
            "atributes": {

            }
        }

        let layer_template =
        {
            "id": idR,
            "title": layer_title[0],
            "properties": layer_propierties,
            "layer": Layer_Open,
            "style": {
                line_color: "white",
                back_color: randomColor(),
                Opacity: 1,
                line_weight: 3,
                pane: "'3'",
                "change_backColor": (color) => {
                    //Limpiamos la capa del mapa
                    map.removeLayer(layers_local["layer_" + idR].layer)
                    const active_Ls = layers_local["layer_" + idR].layer._layers
                    for (const property in active_Ls) {
                        active_Ls[property].options.fillColor = color
                    }
                    layers_local["layer_" + idR].layer.addTo(map)
                },
                "change_lineColor": (color) => {
                    //Limpiamos la capa del mapa
                    map.removeLayer(layers_local["layer_" + idR].layer)
                    const active_Ls = layers_local["layer_" + idR].layer._layers
                    for (const property in active_Ls) {
                        active_Ls[property].options.color = color
                    }
                    layers_local["layer_" + idR].layer.addTo(map)
                },
                "change_lineWeight": (value) => {
                    //Limpiamos la capa del mapa
                    map.removeLayer(layers_local["layer_" + idR].layer)
                    const active_Ls = layers_local["layer_" + idR].layer._layers
                    for (const property in active_Ls) {
                        active_Ls[property].options.weight = value
                    }
                    layers_local["layer_" + idR].layer.addTo(map)
                },
                "change_opacity": (value) => {
                    //Limpiamos la capa del mapa
                    map.removeLayer(layers_local["layer_" + idR].layer)
                    const active_Ls = layers_local["layer_" + idR].layer._layers
                    for (const property in active_Ls) {
                        active_Ls[property].options.fillOpacity = value
                    }
                    layers_local["layer_" + idR].layer.addTo(map)
                }
                ,
                "change_pane": (value) => {
                    //Limpiamos la capa del mapa
                    map.removeLayer(layers_local["layer_" + idR].layer)
                    const active_Ls = layers_local["layer_" + idR].layer._layers
                    for (const property in active_Ls) {
                        active_Ls[property].options.pane = value
                    }
                    layers_local["layer_" + idR].layer.addTo(map)
                }
            },
            "hide": (value) => {
                if (value == false) {
                    layers_local["layer_" + idR].layer.addTo(map)
                } else {
                    map.removeLayer(layers_local["layer_" + idR].layer)
                }

            }

        }



        layers_local["layer_" + idR] = layer_template

        layers_local["layer_" + idR].style.change_pane('1')

    };
    lector.readAsText(archivo);
}