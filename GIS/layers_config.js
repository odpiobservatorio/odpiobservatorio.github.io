const ColorLayer = [
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
let lis_layers = []
let lis_layers_open = []
let format_layer = {
    "layer_tablero": {
        "format": {
            color_linea: "'white'",
            color_fondo: "'white'",
            opacidad: 1,
            ancho_linea: 1,
            pane: "'1'"
        },
        "label": [
            {
                "clase": "fw-bold text-info",
                "contenido": "Tablero",
                "campo": ""
            }
        ],
        "target": {
            "local": "nolocal",
        },
        "atributes": [

        ]

    },
    "layer_basemap": {
        "format": {
            color_linea: "'white'",
            color_fondo: "'orange'",
            opacidad: 1,
            ancho_linea: 1,
            pane: "'2'"
        },
        "label": [
            {
                "clase": "fw-bold text-info",
                "contenido": "Mapa base",
                "campo": ""
            }
        ],
        "target": {
            "local": "nolocal",
        },
        "atributes": [

        ]

    },
    "layer_departamentos": {
        "format": {
            color_linea: "'blue'",
            color_fondo: "'lightblue'",
            opacidad: 1,
            ancho_linea: 1,
            pane: "'3'"
        },
        "label": [
            {
                "clase": "fw-bold text-success",
                "contenido": "Departamento",
                "campo": "DPTO_CNMBR"
            }
        ],
        "target": {
            "local": "nolocal",
        },
        "atributes": []
    },
    "layer_municipios": {
        "format": {
            color_linea: "'blue'",
            color_fondo: "'lightblue'",
            opacidad: 1,
            ancho_linea: 1,
            pane: "'3'"
        },
        "label": [
            {
                "clase": "fw-bold text-success",
                "contenido": "Municipio",
                "campo": "nombre_mpi"
            },
            {
                "clase": "fw-bold",
                "contenido": "Departamento",
                "campo": "nombre_dpt"
            }
        ],
        "target": {
            "local": "nolocal",
        },
        "atributes": []
    },
    "layer_amazonia": {
        "format": {
            color_linea: "'white'",
            color_fondo: "'orange'",
            opacidad: 1,
            ancho_linea: 1,
            pane: "'3'"
        },
        "label": [
            {
                "clase": "fw-bold",
                "contenido": "Departamento",
                "campo": "Departamen"
            }
        ],
        "target": {
            "local": "nolocal",
        },
        "atributes": []
    },
    "layer_macroterritorioscv": {
        "format": {
            color_linea: "'white'",
            color_fondo: "feature.properties.backColor",
            opacidad: "",
            ancho_linea: 1,
            pane: "'3'"
        },
        "label": [
            {
                "clase": "fw-bold",
                "contenido": "Macroregión",
                "campo": "MacroT"
            },
            {
                "clase": "fw-bold",
                "contenido": "Departamento",
                "campo": "nombre_dpt"
            }
        ],
        "target": {
            "local": "nolocal",
        },
        "atributes": [

        ]
    },
    "layer_resguardos": {
        "format": {
            color_linea: "'white'",
            color_fondo: "'red'",
            opacidad: 1,
            ancho_linea: 1,
            pane: "'3'"
        },
        "label": [
            {
                "clase": "fw-bold text-success",
                "contenido": "Nombre",
                "campo": "NOMBRE"
            },
            {
                "clase": "fw-bold text-success",
                "contenido": "Pueblo",
                "campo": "PUEBLO"
            }

        ],
        "target": {
            "local": "nolocal",
        },
        "atributes": []
    },
    "layer_reservac": {
        "format": {
            color_linea: "'white'",
            color_fondo: "'lime'",
            opacidad: 1,
            ancho_linea: 1,
            pane: "'3'"
        },
        "label": [
            {
                "clase": "fw-bold",
                "contenido": "Nombre",
                "campo": "NOMBRE_ZONA_RESERVA_CAMPESINA"
            },
        ],
        "target": {
            "local": "nolocal",
        },
        "atributes": []
    },
    "layer_pdet": {
        "format": {
            color_linea: "'white'",
            color_fondo: "'green'",
            opacidad: 1,
            ancho_linea: 1,
            pane: "'3'"
        },
        "label": [
            {
                "clase": "fw-bold text-success",
                "contenido": "Nombre",
                "campo": "MpNombre"
            },
            {
                "clase": "fw-bold text-success",
                "contenido": "Departamento",
                "campo": "Depto"
            },
        ],
        "target": {
            "local": "nolocal",
        },
        "atributes": []
    },    
    "layer_ganepares": {
        "format": {
            color_linea: "feature.properties.backcolor",
            color_fondo: "feature.properties.backcolor",
            opacidad: 1,
            ancho_linea: 6,
            pane: "'3'"
        },
        "label": [
            {
                "clase": "fw-bold text-success",
                "contenido": "Nombre",
                "campo": "NombreAA"
            },
            {
                "clase": "fw-bold text-success",
                "contenido": "Zona",
                "campo": "Zona"
            },
        ],
        "target": {
            "local": "nolocal",
        },
        "atributes": []
    },
    "layer_clusterodpi2024": {
        "format": {
            color_linea: "'black'",
            color_fondo: "'black'",
            opacidad: 1,
            ancho_linea: 3,
            pane: "'3'"
        },
        "label": [
            {
                "clase": "fw-bold text-success",
                "contenido": "Cluster de afectaciones a los DPI OBSERVATORIO ODPI ONIC 2016-2023",
                "campo": ""
            },
        ],
        "target": {
            "local": "nolocal",
        },
        "atributes": []
    },
    "layer_dencoca": {
        "format": {
            color_linea: "'white'",
            color_fondo: "'green'",
            opacidad: "feature.properties.Procentaje",
            ancho_linea: 1,
            pane: "'3'"
        },
        "label": [
            {
                "clase": "fw-bold text-success",
                "contenido": "Departamento",
                "campo": "DeNombre"
            },
            {
                "clase": "fw-bold text-success",
                "contenido": "Porcentaje",
                "campo": "Procentaje"
            },
            {
                "clase": "fw-bold text-success",
                "contenido": "Cantidad (Ha)",
                "campo": "Hectareas"
            }

        ],
        "target": {
            "local": "nolocal",
        },
        "atributes": []
    },
    "layer_ilegalrios": {
        "format": {
            color_linea: "'blue'",
            color_fondo: "'blue'",
            opacidad: 1,
            ancho_linea: 1,
            pane: "'3'"
        },
        "label": [
            {
                "clase": "fw-bold text-success",
                "contenido": "Nombre",
                "campo": "NOM_RIO"
            },
            {
                "clase": "fw-bold text-success",
                "contenido": "Tipo",
                "campo": "TIPO_RUTA"
            },
            {
                "clase": "fw-bold text-success",
                "contenido": "Descripción",
                "campo": "DESCRIP"
            },
            {
                "clase": "fw-bold text-success",
                "contenido": "Observación",
                "campo": "OBSERVACIO"
            }

            

        ],
        "target": {
            "local": "nolocal",
        },
        "atributes": []
    },
    "layer_ingresoarmas": {
        "format": {
            color_linea: "'red'",
            color_fondo: "'red'",
            opacidad: 1,
            ancho_linea: 2,
            pane: "'3'"
        },
        "label": [
            {
                "clase": "fw-bold text-success",
                "contenido": "Nombre",
                "campo": "NOMBRE"
            },
            {
                "clase": "fw-bold text-success",
                "contenido": "Tipo",
                "campo": "TIPO"
            },
            {
                "clase": "fw-bold text-success",
                "contenido": "Ruta",
                "campo": "RUTA"
            },


            

        ],
        "target": {
            "local": "nolocal",
        },
        "atributes": []
    },
    "layer_contrabando": {
        "format": {
            color_linea: "'black'",
            color_fondo: "'red'",
            opacidad: 1,
            ancho_linea: 2,
            pane: "'3'"
        },
        "label": [
            {
                "clase": "fw-bold text-success",
                "contenido": "Lugar",
                "campo": "NOM_CPOB"
            },
            {
                "clase": "fw-bold text-success",
                "contenido": "Tipo",
                "campo": "CONTRABAND"
            }
        ],
        "target": {
            "local": "nolocal",
        },
        "atributes": []
    },
    "layer_migrantes": {
        "format": {
            color_linea: "'black'",
            color_fondo: "'orange'",
            opacidad: 1,
            ancho_linea: 2,
            pane: "'3'"
        },
        "label": [
            {
                "clase": "fw-bold text-success",
                "contenido": "Departamento",
                "campo": "NOM_DEPTO"
            },
            {
                "clase": "fw-bold text-success",
                "contenido": "Tipo",
                "campo": "TIPO"
            }
        ],
        "target": {
            "local": "nolocal",
        },
        "atributes": []
    },
    "layer_anh": {
        "format": {
            color_linea: "'red'",
            color_fondo: "'pink'",
            opacidad: 1,
            ancho_linea: 1,
            pane: "'3'"
        },
        "label": [
            {
                "clase": "fw-bold text-success",
                "contenido": "Clasificación",
                "campo": "CLASIFICAC"
            },
            {
                "clase": "fw-bold text-success",
                "contenido": "Tipo",
                "campo": "TIPO_CONTR"
            },
            {
                "clase": "fw-bold text-success",
                "contenido": "Estado",
                "campo": "ESTAD_AREA"
            },
            {
                "clase": "fw-bold text-success",
                "contenido": "Operador",
                "campo": "OPERADOR"
            }
        ],
        "target": {
            "local": "nolocal",
        },
        "atributes": []
    }
}



function loadlayers() {
    const jslayers = [
        ["nolayer", "Mapa general"],//=================
        ["001tablero", "tablero", "Tablero"],
        ["002basemap", "basemap", "Mapa base"],
        ["nolayer", "Unidades Territoriales"],//=================
        ["003departamentos", "departamentos", "Departamentos"],
        ["004municipios", "municipios", "Municipios"],
        ["nolayer", "Macroregiones"],//=================
        ["008macroterritorioscv", "macroterritorioscv", "Macroregiones CV"],
        ["005mamazonia", "amazonia", "Macro amazonía"],
        ["nolayer", "Territorios"],//=================
        ["004resguardos", "resguardos", "Resguardos"],
        ["006reservacampesina", "reservasc", "Reservas campecinas"],
        ["007pdet", "pdet", "Municipios PDET"],
        ["nolayer", "Rutas o Economías Ilegales"],//=================
        ["011densidadcoca", "dencoca", "Cultivos Coca (Ha)"],
        ["012fluvialesilegal", "ilegalrios", "Rutas fluviales"],
        ["013ingresoarmas", "ingresoarmas", "Ruta Ingreso Armas"],
        ["014contrabando", "contrabando", "Ruta/Punto Contrabando"],
        ["015migrantes", "migrantes", "Ruta Migrantes"],
        ["nolayer", "Grupos Armados no Estatales"],//=================
        ["009ganepares", "ganepares", "Presencia GANE (Pares)"],
        ["nolayer", "Información víctimas"],//=================
        ["010clusterodpi2024", "clusterodpi2024", "Cluster ODPI ONIC 2024"],
        ["nolayer", "Información ambiental"],//=================
        ["016agenciahid", "anh", "ANH"],

    ]

    const panel_control_layers = document.getElementById("panel_control_layers")
    panel_control_layers.innerHTML = ""

    document.getElementById("layerjsdiv").innerHTML = ""
    jslayers.forEach(item => {
        if (item[0] !== "nolayer") {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `/GIS/newLayers/${item[0]}.js`;
            document.getElementById("layerjsdiv").appendChild(script);
            maker_coltrol_layer(item[1], item[2])
        }else{
            const sm = document.createElement("small")
            sm.className="text-info fw-bold"
            sm.textContent=item[1]
            document.getElementById("panel_control_layers").appendChild(sm)
        }
    })

    function maker_coltrol_layer(name, title) {
        const accordion_item = document.createElement("div")
        accordion_item.className = "accordion-item border border-1 p-1 mb-1"

        const btn_group = document.createElement("div")
        btn_group.className = "btn-group"
        btn_group.role = "group"

        btn_group.innerHTML = `            
        <a class="ms-1 me-2" data-bs-toggle="collapse" href="#" data-bs-target="#collapse${name}"
          id=btnConfigLayer${name}>
          <i class="bi bi-gear-fill" style="color:#CEECF5;"></i>
        </a>`

        const form_check = document.createElement("div")
        form_check.className = "form-check"

        const input = document.createElement("input")
        input.className = "form-check-input"
        input.type = "checkbox"
        input.id = "checklayer_" + name
        input.onchange = () => layers['put_layer'](input, 'layer_' + name)
        form_check.appendChild(input)

        const label = document.createElement("label")
        label.className = "form-check-label"
        label.for = "checklayer_" + name
        label.textContent = title
        form_check.appendChild(label)
        btn_group.appendChild(form_check)
        accordion_item.appendChild(btn_group)

        const accordion_collapse = document.createElement("div")
        accordion_collapse.className = "accordion-collapse collapse container-fluid"
        accordion_collapse.id = "collapse" + name
        accordion_collapse.innerHTML = `
        <div class="accordion-body container-fluid" id="bodyCollapse${name}">
                    
        </div>
        `


        accordion_item.appendChild(accordion_collapse)

        panel_control_layers.appendChild(accordion_item)

        const btnConfigLayer = document.getElementById("btnConfigLayer" + name)
        btnConfigLayer.onclick = () => config_format("layer_" + name, "bodyCollapse" + name)

    }

}

const layers = {
    //función que obtiene desde el control el nombre del control y nombre de la capa
    "put_layer"(control, layer_name) {
        const format = format_layer[layer_name]

        //Verifica si el contro check su estado
        let propiedades = []
        if (control.checked == true) {
            //Si es activado crea uan capa con base al archivo local
            //..eval(layer_name)...usa el texto, lo convierte en uan variable que evoca la capa

            const layer = L.geoJSON(eval(layer_name), {
                style: function (feature) {
                    //Identifica las propiedades de la capa
                    for (const property in feature.properties) {
                        if (propiedades.includes(property) !== true) {
                            propiedades.push(property)
                        }
                    }
                    console.log(eval(format_layer[layer_name].format.color_fondo))
                    return {
                        color: eval(format_layer[layer_name].format.color_linea),
                        fillColor: eval(format_layer[layer_name].format.color_fondo),
                        fillOpacity: eval(format_layer[layer_name].format.opacidad),
                        weight: eval(format_layer[layer_name].format.ancho_linea),
                        pane: eval(format_layer[layer_name].format.pane),

                        
                    };
                }
            }).bindPopup(function (layer) {
                const contenido = document.createElement("div")
                format_layer[layer_name].label.forEach(elemento => {
                    const label = document.createElement("div")
                    label.className = elemento.clase
                    label.textContent = elemento.contenido
                    contenido.appendChild(label)

                    const div = document.createElement("div")
                    div.textContent = layer.feature.properties[elemento.campo]
                    contenido.appendChild(div)
                })
                return contenido.innerHTML;
            }, { pane: "labels" }
            ).addTo(map);

            //Agrega esta capa a la lista de capas para activar o desactivar
            lis_layers.push([layer_name, layer])
        } else {
            //Crear dos filtros para mostrar o quitar la capa
            //Solo para capas locales fijas, que siempre se presentarán en el programa
            let layer_remove = lis_layers.filter(value => value[0] == layer_name)
            let layer_noremove = lis_layers.filter(value => value[0] !== layer_name)
            map.removeLayer(layer_remove[0][1])
            lis_layers = layer_noremove
        }

    }
}
function config_format(layer_name, controlname) {

    const cCollapseBody = document.getElementById(controlname)
    cCollapseBody.innerHTML = ""


    const btngroup = document.createElement("div")
    btngroup.role = "group"
    btngroup.className = "btn-group border-1 border border-info p-2"


    cCollapseBody.appendChild(btngroup)

    maker_control_backcolor()
    maker_control_linecolor()
    maker_control_lineWeight()
    maker_control_opacity()
    maker_control_pane()
    function maker_control_backcolor() {
        //Crearemos un control desplegable de color personalizado
        const dropdown = document.createElement("div")
        dropdown.className = "dropdown me-1"
        dropdown.innerHTML =
            `
        <button class="dropdown-toggle border-0 
        border-0 btn-outline-secondary p-1" 
            type="button" 
            data-bs-toggle="dropdown"
            id="btnColor${layer_name}">
        </button>
        `
        const ul = document.createElement("ul")
        ul.className = "dropdown-menu container-fluid p-1 shadow"
        ul.style.width = "300px"
        dropdown.appendChild(ul)
        btngroup.appendChild(dropdown)

        const btnColor = document.getElementById("btnColor" + layer_name)
        //Colocamos un icono que cambiará de color cuando cambie la selección
        const i = document.createElement("i")
        i.className = "bi bi-square-fill rounded"
        try {
            i.style.color = eval(format_layer[layer_name].format.color_fondo)
        } catch (error) {
            btnColor.hidden = true
        }
        btnColor.appendChild(i)

        //Colocamos los colores en el ul control

        ColorList.forEach(color => {
            const iColor = document.createElement("i")
            iColor.className = "bi bi-square-fill fs-3"
            iColor.style.color = color
            iColor.style.margin = "2px"
            ul.appendChild(iColor)
            iColor.onclick = () => {
                i.style.color = color
                format_layer[layer_name].format.color_fondo = `'${color}'`
                const checkLayer = document.getElementById("check" + layer_name)

                if (checkLayer.checked == true) {
                    //Crear dos filtros para mostrar o quitar la capa
                    //Solo para capas locales fijas, que siempre se presentarán en el programa

                    if (format_layer[layer_name].target.local == "nolocal") {
                        let layer_remove = lis_layers.filter(value => value[0] == layer_name)
                        let layer_noremove = lis_layers.filter(value => value[0] !== layer_name)
                        map.removeLayer(layer_remove[0][1])
                        lis_layers = layer_noremove
                        layers.put_layer(checkLayer, layer_name)
                    } else if (format_layer[layer_name].target.local == "local") {
                        let layer_remove = lis_layers_open.filter(value => value[0] == layer_name)
                        map.removeLayer(layer_remove[0][1])

                        let capa = lis_layers_open.filter(value => value[0] == layer_name)
                        let layers = capa[0][1]._layers
                        for (const property in layers) {
                            capa[0][1]._layers[property].options.fillColor = eval(format_layer[layer_name].format.color_fondo)
                        }
                        capa[0][1].addTo(map)
                    }

                }
            }
        })

    }
    function maker_control_linecolor() {
        //Crearemos un control desplegable de color linea personalizado
        const dropdown = document.createElement("div")
        dropdown.className = "dropdown me-1"
        dropdown.innerHTML =
            `
        <button class="border-0 btn-outline-secondary p-1
            dropdown-toggle" 
            type="button" 
            data-bs-toggle="dropdown"
            id="btnLineColor${layer_name}">
        </button>
        `
        const ul = document.createElement("ul")
        ul.className = "dropdown-menu container-fluid p-1"
        ul.style.width = "300px"
        dropdown.appendChild(ul)
        btngroup.appendChild(dropdown)

        //Colocamos un icono que cambiará de color cuando cambie la selección
        const i = document.createElement("i")
        i.className = "bi bi-square fw-bold"
        const btnLineColor = document.getElementById("btnLineColor" + layer_name)
        try {
            i.style.color = eval(format_layer[layer_name].format.color_fondo)
        } catch (error) {
            btnLineColor.hidden = true
        }
        
        btnLineColor.appendChild(i)

        //Colocamos los colores en el ul control

        ColorList.forEach(color => {
            const iColor = document.createElement("i")
            iColor.className = "bi bi-square-fill fs-3"
            iColor.style.color = color
            iColor.style.margin = "2px"
            ul.appendChild(iColor)
            iColor.onclick = () => {
                i.style.color = color
                format_layer[layer_name].format.color_linea = `'${color}'`
                const checkLayer = document.getElementById("check" + layer_name)

                if (checkLayer.checked == true) {

                    if (format_layer[layer_name].target.local == "nolocal") {
                        //Crear dos filtros para mostrar o quitar la capa
                        //Solo para capas locales fijas, que siempre se presentarán en el programa
                        let layer_remove = lis_layers.filter(value => value[0] == layer_name)
                        let layer_noremove = lis_layers.filter(value => value[0] !== layer_name)
                        map.removeLayer(layer_remove[0][1])
                        lis_layers = layer_noremove
                        layers.put_layer(checkLayer, layer_name)
                    } else if (format_layer[layer_name].target.local == "local") {
                        let layer_remove = lis_layers_open.filter(value => value[0] == layer_name)
                        map.removeLayer(layer_remove[0][1])
                        //lis_layers_open["layer_name"][1]= newLayer(layer_remove)
                        let capa = lis_layers_open.filter(value => value[0] == layer_name)
                        let layers = capa[0][1]._layers
                        for (const property in layers) {
                            capa[0][1]._layers[property].options.color = eval(format_layer[layer_name].format.color_linea)
                        }
                        capa[0][1].addTo(map)
                    }

                }


            }
        })

    }
    function maker_control_lineWeight() {
        //Crearemos un control desplegable de color linea personalizado
        const dropdown = document.createElement("div")
        dropdown.className = "dropdown me-1"
        dropdown.innerHTML =
            `
        <button class="border-0 btn-outline-secondary p-1
            dropdown-toggle" 
            type="button" 
            data-bs-toggle="dropdown"
            id="btnLineWeight${layer_name}">
        </button>
        `
        const ul = document.createElement("ul")
        ul.className = "dropdown-menu container-fluid p-1"
        dropdown.appendChild(ul)
        btngroup.appendChild(dropdown)

        //Colocamos un icono que cambiará de color cuando cambie la selección
        const i = document.createElement("i")
        i.className = "bi-arrows-collapse-vertical"
        i.textContent = " " + format_layer[layer_name].format.ancho_linea + "px"
        i.style.color = "black"


        const btnLineColor = document.getElementById("btnLineWeight" + layer_name)
        btnLineColor.appendChild(i)

        //Colocamos los colores en el ul control
        const lineWight = [
            [0, "0px"],
            [1, "1px"],
            [2, "2px"],
            [3, "3px"],
            [4, "4px"],
        ]

        lineWight.forEach(value => {
            const li = document.createElement("li")
            li.className = "ms-2"

            const a = document.createElement("a")
            a.className = "dropdown-item"
            a.href = "#"
            a.textContent = value[1]
            li.appendChild(a)

            ul.appendChild(li)
            a.onclick = () => {
                format_layer[layer_name].format.ancho_linea = value[0]
                const checkLayer = document.getElementById("check" + layer_name)
                i.textContent = " " + value[0] + "px"

                if (checkLayer.checked == true) {
                    if (format_layer[layer_name].target.local == "nolocal") {
                        let layer_remove = lis_layers.filter(value => value[0] == layer_name)
                        let layer_noremove = lis_layers.filter(value => value[0] !== layer_name)
                        map.removeLayer(layer_remove[0][1])
                        lis_layers = layer_noremove
                        layers.put_layer(checkLayer, layer_name)
                    } else if (format_layer[layer_name].target.local == "local") {
                        let layer_remove = lis_layers_open.filter(value => value[0] == layer_name)
                        map.removeLayer(layer_remove[0][1])
                        //lis_layers_open["layer_name"][1]= newLayer(layer_remove)
                        let capa = lis_layers_open.filter(value => value[0] == layer_name)
                        let layers = capa[0][1]._layers
                        for (const property in layers) {
                            capa[0][1]._layers[property].options.weight = format_layer[layer_name].format.ancho_linea
                        }
                        capa[0][1].addTo(map)
                    }
                }
            }
        })

    }
    function maker_control_opacity() {
        //Crearemos un control desplegable de color linea personalizado
        const dropdown = document.createElement("div")
        dropdown.className = "dropdown me-1"
        dropdown.innerHTML =
            `
        <button class="border-0 btn-outline-secondary p-1
            dropdown-toggle" 
            type="button" 
            data-bs-toggle="dropdown"
            id="btnOpacity${layer_name}">
        </button>
        `
        const ul = document.createElement("ul")
        ul.className = "dropdown-menu container-fluid p-1"
        dropdown.appendChild(ul)
        btngroup.appendChild(dropdown)

        //Colocamos un icono que cambiará de color cuando cambie la selección
        const i = document.createElement("i")
        i.className = ""
        i.textContent = format_layer[layer_name].format.opacidad * 100 + "%"
        i.style.color = "black"


        const btnOpacity = document.getElementById("btnOpacity" + layer_name)
        btnOpacity.appendChild(i)

        //Colocamos los colores en el ul control
        const Opacity = [
            [1, "100%"],
            [0.9, "90%"],
            [0.8, "80px"],
            [0.7, "70px"],
            [0.6, "60px"],
            [0.5, "50px"],
            [0.4, "40px"],
            [0.3, "30px"],
            [0.2, "20px"],
            [0.1, "10px"],

        ]

        Opacity.forEach(value => {
            const li = document.createElement("li")
            li.className = "ms-2"

            const a = document.createElement("a")
            a.className = "dropdown-item"
            a.href = "#"
            a.textContent = value[1]
            li.appendChild(a)

            ul.appendChild(li)
            a.onclick = () => {
                format_layer[layer_name].format.opacidad = value[0]
                const checkLayer = document.getElementById("check" + layer_name)
                i.textContent = "" + value[1]

                if (checkLayer.checked == true) {
                    if (format_layer[layer_name].target.local == "nolocal") {
                        let layer_remove = lis_layers.filter(value => value[0] == layer_name)
                        let layer_noremove = lis_layers.filter(value => value[0] !== layer_name)
                        map.removeLayer(layer_remove[0][1])
                        lis_layers = layer_noremove
                        layers.put_layer(checkLayer, layer_name)
                    } else if (format_layer[layer_name].target.local == "local") {
                        let layer_remove = lis_layers_open.filter(value => value[0] == layer_name)
                        map.removeLayer(layer_remove[0][1])
                        //lis_layers_open["layer_name"][1]= newLayer(layer_remove)
                        let capa = lis_layers_open.filter(value => value[0] == layer_name)
                        let layers = capa[0][1]._layers
                        for (const property in layers) {
                            capa[0][1]._layers[property].options.fillOpacity = format_layer[layer_name].format.opacidad
                        }
                        capa[0][1].addTo(map)
                    }
                }


            }
        })

    }
    function maker_control_pane() {
        //Crearemos un control desplegable de color linea personalizado
        const dropdown = document.createElement("div")
        dropdown.className = "dropdown me-1"
        dropdown.innerHTML =
            `
        <button class="border-0 btn-outline-secondary p-1
            dropdown-toggle" 
            type="button" 
            data-bs-toggle="dropdown"
            id="btnPane${layer_name}">
        </button>
        `
        const ul = document.createElement("ul")
        ul.className = "dropdown-menu container-fluid p-1"
        dropdown.appendChild(ul)
        btngroup.appendChild(dropdown)

        //Colocamos un icono que cambiará de color cuando cambie la selección
        const i = document.createElement("i")
        i.className = "bi-intersect"
        i.textContent = eval(format_layer[layer_name].format.pane)
        i.style.color = "black"


        const btnOpacity = document.getElementById("btnPane" + layer_name)
        btnOpacity.appendChild(i)

        //Colocamos los colores en el ul control
        const Pane = ["1", "2", "3", "4", "5", "6"]

        Pane.forEach(value => {
            const li = document.createElement("li")
            li.className = "ms-2"

            const a = document.createElement("a")
            a.className = "dropdown-item"
            a.href = "#"
            a.textContent = value
            li.appendChild(a)

            ul.appendChild(li)
            a.onclick = () => {
                format_layer[layer_name].format.pane = `'${value}'`
                const checkLayer = document.getElementById("check" + layer_name)
                i.textContent = " " + value

                if (checkLayer.checked == true) {
                    if (format_layer[layer_name].target.local == "nolocal") {
                        let layer_remove = lis_layers.filter(value => value[0] == layer_name)
                        let layer_noremove = lis_layers.filter(value => value[0] !== layer_name)
                        map.removeLayer(layer_remove[0][1])
                        lis_layers = layer_noremove
                        layers.put_layer(checkLayer, layer_name)
                    } else if (format_layer[layer_name].target.local == "local") {
                        let layer_remove = lis_layers_open.filter(value => value[0] == layer_name)
                        map.removeLayer(layer_remove[0][1])
                        //lis_layers_open["layer_name"][1]= newLayer(layer_remove)
                        let capa = lis_layers_open.filter(value => value[0] == layer_name)
                        let layers = capa[0][1]._layers
                        for (const property in layers) {
                            capa[0][1]._layers[property].options.pane = eval(format_layer[layer_name].format.pane)
                        }
                        capa[0][1].addTo(map)
                    }
                }


            }
        })

    }
}