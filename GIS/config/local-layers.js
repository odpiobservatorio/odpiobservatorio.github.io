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
const Color_local_layer = [
    '#000000', '#000080', '#00008B', '#0000CD', '#0000FF', '#006400', '#008000', '#008080',
    '#008B8B', '#00BFFF', '#00CED1', '#00FA9A', '#00FF00', '#00FF7F', '#00FFFF', '#00FFFF',
    '#191970', '#1E90FF', '#20B2AA', '#228B22', '#2E8B57', '#2F4F4F', '#2F4F4F', '#32CD32',
    '#3CB371', '#40E0D0', '#4169E1', '#4682B4', '#483D8B', '#48D1CC', '#4B0082', '#556B2F',
    '#5F9EA0', '#6495ED', '#663399', '#66CDAA', '#696969', '#696969', '#6A5ACD', '#6B8E23',
    '#708090', '#708090', '#778899', '#778899', '#7B68EE', '#7CFC00', '#7FFF00', '#7FFFD4',
    '#800000', '#800080', '#808000', '#808080', '#808080', '#87CEEB', '#87CEFA', '#8A2BE2',
    '#8B0000', '#8B008B', '#8B4513', '#8FBC8F', '#90EE90', '#9370DB', '#9400D3', '#98FB98',
    '#9932CC', '#9ACD32', '#A0522D', '#A52A2A', '#A9A9A9', '#A9A9A9', '#ADD8E6', '#ADFF2F',
    '#AFEEEE', '#B0C4DE', '#B0E0E6', '#B22222', '#B8860B', '#BA55D3', '#BC8F8F', '#BDB76B',
    '#C0C0C0', '#C71585', '#CD5C5C', '#CD853F', '#D2691E', '#D2B48C', '#D3D3D3', '#D3D3D3',
    '#D8BFD8', '#DA70D6', '#DAA520', '#DB7093', '#DC143C', '#DCDCDC', '#DDA0DD', '#DEB887',
    '#E0FFFF', '#E6E6FA', '#E9967A', '#EE82EE', '#EEE8AA', '#F08080', '#F0E68C', '#F0F8FF',
    '#F0FFF0', '#F0FFFF', '#F4A460', '#F5DEB3', '#F5F5DC', '#F5F5F5', '#F5FFFA', '#F8F8FF',
    '#FA8072', '#FAEBD7', '#FAF0E6', '#FAFAD2', '#FDF5E6', '#FF0000', '#FF00FF', '#FF00FF',
    '#FF1493', '#FF4500', '#FF6347', '#FF69B4', '#FF7F50', '#FF8C00', '#FFA07A', '#FFA500',
    '#FFB6C1', '#FFC0CB', '#FFD700', '#FFDAB9', '#FFDEAD', '#FFE4B5', '#FFE4C4', '#FFE4E1',
    '#FFEBCD', '#FFEFD5', '#FFF0F5', '#FFF5EE', '#FFF8DC', '#FFFACD', '#FFFAF0', '#FFFAFA',
    '#FFFF00', '#FFFFE0', '#FFFFF0',]

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
                }
            }
        }).addTo(map);

        let layer_template =
        {
            "id": idR,
            "title": layer_title[0],
            "properties": layer_propierties,
            "layer": Layer_Open,
            "style": {
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
                if (value == true) {
                    layers_local["layer_" + idR].layer.addTo(map)
                } else {
                    map.removeLayer(layers_local["layer_" + idR].layer)
                }
            }

        }
        layers_local["layer_" + idR] = layer_template
        make_line_layer(layers_local["layer_" + idR])

    };
    lector.readAsText(archivo);
}
function make_line_layer(layer) {
    const container = document.getElementById("panel_localLayers")
    //Creamos un collapse para incorporar el check y el nombre de la capa
    const collapse_item = document.createElement("div")
    collapse_item.className = "line-layer"
    container.appendChild(collapse_item)

    //Creo una línea para colocar los diferentes elementos btn formato y título de la capa y check
    const row = document.createElement("div")
    row.className = "row  align-items-center"
    collapse_item.appendChild(row)

    //Columna donde va el botón mostrar opciones de formato
    const col1 = document.createElement("div")
    col1.className = "col-auto"
    col1.style.width = "15px"
    row.appendChild(col1)

    //botón mostrar opciones de formato
    const btnFormato = document.createElement("i")
    btnFormato.className = "bi bi-gear-fill boton-format"
    col1.appendChild(btnFormato)
    btnFormato.setAttribute("data-bs-toggle", "collapse")
    btnFormato.setAttribute("data-bs-target", "#itemcollapse" + layer.id)


    //olumna donde va el control check
    const col2 = document.createElement("div")
    col2.className = "col-auto"
    col2.style.width = "15px"
    row.appendChild(col2)

    //Control check que muestra u oculta la capa
    const check_layer = document.createElement("input")
    check_layer.className = "form-check-input"
    check_layer.type = "checkbox"
    col2.appendChild(check_layer)

    //administramos las acciones del control check
    check_layer.checked = true
    check_layer.oninput = () => {
        layer.hide(check_layer.checked)
    }

    //olumna donde va el título
    const col3 = document.createElement("div")
    col3.className = "col-auto"
    col3.textContent = layer.title
    row.appendChild(col3)

    //Crear el contenedor de botones
    const divBotones = document.createElement("div")
    divBotones.className = "accordion-collapse collapse bg-white"
    divBotones.id = "itemcollapse" + layer.id
    collapse_item.appendChild(divBotones)

    put_botones_formato(layer, divBotones)
}

function put_botones_formato(layer, conenedor) {
    //Creamos una línea para contener todos los botones
    const row = document.createElement("div")
    row.className = "row  align-items-center m-2"
    conenedor.appendChild(row)

    //
    const col1 = document.createElement("div")
    col1.className = "col-auto me-1"
    col1.style.width = "35px"
    row.appendChild(col1)

    const i_backColor = document.createElement("div")
    i_backColor.className = "boton-change bi bi-square-fill"
    i_backColor.setAttribute("data-bs-toggle", "dropdown")
    col1.appendChild(i_backColor)

    //Iniciamos creando el botón de color del fondo
    const menu1 = document.createElement("ul")
    menu1.className = "dropdown-menu p-1 list-group-scroll"
    menu1.style.width = "300px"
    menu1.style.height = "400px"
    col1.appendChild(menu1)

    Color_local_layer.forEach(color => {
        const iColor = document.createElement("i")
        iColor.className = "bi bi-square-fill m-1"
        iColor.style.fontSize = "16pt"
        iColor.style.cursor = "pointer"
        iColor.style.color = color
        menu1.appendChild(iColor)
        iColor.onclick = () => {
            layer.style.change_backColor(color)
            i_backColor.style.color = color
        }

    })

    const col2 = document.createElement("div")
    col2.className = "col-auto me-1"
    col2.style.width = "35px"
    row.appendChild(col2)

    const i_lineColor = document.createElement("div")
    i_lineColor.className = "boton-change bi bi-square"
    i_lineColor.setAttribute("data-bs-toggle", "dropdown")
    col2.appendChild(i_lineColor)

    const menu2 = document.createElement("ul")
    menu2.className = "dropdown-menu p-1 list-group-scroll"
    menu2.style.width = "300px"
    menu2.style.height = "400px"
    col2.appendChild(menu2)

    Color_local_layer.forEach(color => {
        const iColor = document.createElement("i")
        iColor.className = "bi bi-square-fill m-1"
        iColor.style.fontSize = "16pt"
        iColor.style.cursor = "pointer"
        iColor.style.color = color
        menu2.appendChild(iColor)
        iColor.onclick = () => {
            layer.style.change_lineColor(color)
            i_lineColor.style.color = color
        }

    })

    const col3 = document.createElement("div")
    col3.className = "col-auto me-1"
    col3.style.width = "35px"
    row.appendChild(col3)

    const i_lineWidth = document.createElement("div")
    i_lineWidth.className = "boton-change bi pt-1"
    i_lineWidth.style.fontSize = "16px"
    i_lineWidth.textContent = "1px"
    i_lineWidth.setAttribute("data-bs-toggle", "dropdown")
    col3.appendChild(i_lineWidth)

    const menu3 = document.createElement("ul")
    menu3.className = "dropdown-menu p-1 list-group-scroll"
    menu3.style.width = "60px"
    menu3.style.height = "200px"
    col3.appendChild(menu3)

    const list_line = [0, 1, 2, 3, 4, 5, 6]
    list_line.forEach(ele => {
        const number = document.createElement("div")
        number.textContent = ele + "pt"
        number.className="line-number"
        number.style.cursor = "pointer"
        menu3.appendChild(number)
        number.onclick = () => {
            layer.style.change_lineWeight(ele)
            i_lineWidth.textContent=ele + "pt"
        }
    })


    const col4 = document.createElement("div")
    col4.className = "col-auto me-1"
    col4.style.width = "50px"
    row.appendChild(col4)

    const i_Opacity = document.createElement("div")
    i_Opacity.className = "boton-change pt-1"
    i_Opacity.style.fontSize = "16px"
    i_Opacity.textContent = "100%"
    i_Opacity.setAttribute("data-bs-toggle", "dropdown")
    col4.appendChild(i_Opacity)

    const menu4 = document.createElement("ul")
    menu4.className = "dropdown-menu p-1 list-group-scroll"
    menu4.style.width = "60px"
    menu4.style.height = "200px"
    col4.appendChild(menu4)

    const list_opacity = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4,0.3,0.2,0.1]
    list_opacity.forEach(ele => {
        const number = document.createElement("div")
        number.textContent = (ele * 100) + "%"
        number.className="line-number"
        number.style.cursor = "pointer"
        menu4.appendChild(number)
        number.onclick = () => {
            layer.style.change_opacity(ele)
            i_Opacity.textContent=(ele * 100) + "%"
        }
    })

}