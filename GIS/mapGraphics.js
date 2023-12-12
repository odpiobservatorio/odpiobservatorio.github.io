let Datafilter = 0;
let Layers = {}
let LabelsMap = []
let TextoLabel = "";
let ActiveLabels;


//Diccionario con la "Configuracion" del plano, se modifica segun los cambios del usuario
const formatoPlano = {
    "color": "orange",
    "opacidad": "0.5",
    "markType": "green", //Tipo de marcas q se muestran
    "size": 1,
}

function updateSize(value) {
    formatoPlano.size = parseFloat(value);
}

function resetIconSize() {
    document.getElementById("sizeIconV").value = 1;
    formatoPlano.size = 1;
    reloadIcons()
}


function reloadIcons() {
    //Limpiamos las marcas del mapa
    clearMarkers();
    //mostramos la busqueda finalmente.
    showBusqueda(DataToReport);
}

//Cambia el tipo de la marca q se muestra
function changeMark(value) {
    formatoPlano["markType"] = value //Va a la configuracion del plano y le asigna el tipo de marca q selecciono el usuario
}


function clearLayers() {
    //Limpia todas las capas q se estan mostrando
    const elemento = ((document.getElementById("LayerDepartamentos")).parentElement).parentElement;
    const lista = elemento.querySelectorAll(".form-check-input");

    for (const input of lista) {
        if (input.checked) {
            input.checked = false;
            map.removeLayer(Layers[input.id]);
        }
    }
}

function clearDep() {
    if (Layers.hasOwnProperty("currentDep")) {
        map.removeLayer(Layers["currentDep"]);
    }
}

function showDep() {

    if (Layers.hasOwnProperty("currentDep")) {
        map.removeLayer(Layers["currentDep"]);
    }

    const departamento = document.getElementById("lstDeps").value;
    const depsCopy = JSON.parse(JSON.stringify(capaDepartamentos));

    for (const feature of depsCopy.features) {
        if (feature.properties.NOMBRE_DPT == departamento) {
            depsCopy.features = [feature];
            break;
        }
    }

    //Crear capa
    Layers["currentDep"] = new L.geoJson(depsCopy, {
        style: {
            //color: formatoPlano["color"],
            weight: 2,
            opacity: 1,
            color: '#FC4E2A',
            fillColor: formatoPlano.color,
            fillOpacity: formatoPlano.opacidad,
        }
    }).bindPopup((layer) => {
        return `Departamento: ${layer.feature.properties.NOMBRE_DPT}`;
    }).addTo(map);

}

function showLayer(parent) {
    //Si el usuario selecciona una capa, la muestra, si ya esta seleccionada la elimina
    const input = parent.querySelector(".form-check-input");
    const key = input.getAttribute("id");

    if (input.checked) {
        allLayers[key]();
    } else {
        map.removeLayer(Layers[key]);
    }
}


//.............................................
//Funciones que muestran capas separadas
//.............................................


//Test-----
function colorMap(v) {
    const d = (1000 / 771) * v;
    return d > 1000 ? '#800026' :
        d > 500 ? '#BD0026' :
            d > 200 ? '#E31A1C' :
                d > 100 ? '#FC4E2A' :
                    d > 50 ? '#FD8D3C' :
                        d > 20 ? '#FEB24C' :
                            d > 10 ? '#FED976' :
                                '#FFEDA0';
}
//------------


//Funciones q se llaman dependiendo de la capa q se quiera mostrar
const allLayers = {
    "LayerPlano": () => {
        Layers["LayerPlano"] = new L.geoJSON(LayerPlano, {
            style: {
                color: formatoPlano["color"],
                weight: 0,
                fillColor: formatoPlano["color"],
                fillOpacity: formatoPlano["opacidad"],
                icon: icons[formatoPlano["markType"]]
            }
        }).bindPopup((layer) => {
            return layer.feature.properties.categoria
        }).addTo(map);
    },


    "LayerColorMap": () => {

        //Get deps
        const conteos = {};
        for (const registro of DataPrincipal) {
            const elemento = (((registro.Departamento).normalize("NFD").replace(/[\u0300-\u036f]/g, "")).toUpperCase());
            conteos[elemento] = (conteos[elemento] || 0) + 1;
        }

        const depsCopy = JSON.parse(JSON.stringify(capaDepartamentos))

        for (const feature of depsCopy.features) {
            const dep = (feature.properties.NOMBRE_DPT)
            const valor = conteos[dep]

            if (valor) {
                feature.properties["Casos"] = valor;
            } else {
                feature.properties["Casos"] = 1;
            }
        }


        //Crear capa
        Layers["LayerColorMap"] = new L.geoJson(depsCopy, {
            style: (feature) => {
                return {
                    fillColor: colorMap(feature.properties.Casos),
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    //dashArray: '3',
                    fillOpacity: 0.75
                }
            }
        }).bindPopup((layer) => {

            return `Departamento: ${layer.feature.properties.NOMBRE_DPT}, #Casos: ${layer.feature.properties.Casos}`;
        }).addTo(map);


    },

    "LayerResguardos": () => {
        Layers["LayerResguardos"] = new L.geoJSON(resguardos,
            {
                style: {
                    color: "#76D7C4",
                    weight: 0,
                    fillColor: "red",
                    fillOpacity: 5,
                    icon: icons[formatoPlano["markType"]]
                },
                filter: function (feature, layer) {
                    if (Datafilter == 1) {
                        return feature.properties.DEPARTAMENTO == "CESAR";
                    }
                    else {
                        return feature.properties;
                    };
                }
            }
        ).bindPopup((layer) => {
            return `${layer.feature.properties.NOMBRE_RESGUARDO_INDIGENA} ETNIA: ${layer.feature.properties.PUEBLO}`
        }).addTo(map);
    },

    "LayerDepartamentos": () => {
        Layers["LayerDepartamentos"] = new L.geoJSON(capaDepartamentos,
            {
                style: {
                    color: "white",
                    weight: 1,
                    fillColor: "darkgray",
                    fillOpacity: 5,
                    icon: icons[formatoPlano["markType"]]
                },
                filter: function (feature, layer) {
                    if (Datafilter == 1) {
                        return feature.properties.NOMBRE_DPT == "CESAR" || feature.properties.NOMBRE_DPT == "CHOCÓ";
                    }
                    else {
                        return feature.properties;
                    };
                }
            }
        ).bindPopup((layer) => {
            return "Nombre: " + layer.feature.properties.NOMBRE_DPT
        }).addTo(map);
    },

    "LayerRutaMigrantes": () => {
        Layers["LayerRutaMigrantes"] = new L.geoJSON(capaRutaMigrantes, {
            style: {
                color: "red",
                weight: 5,
                fillColor: "#873600",
                fillOpacity: 0.5
            }

        }).bindPopup((layer) => {
            return layer.feature.properties.TIPO;
        }).addTo(map);
    },

    "LayerNarcotrafico": () => {
        Layers["LayerNarcotrafico"] = new L.geoJSON(capaPuntosNarcotrafico, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { icon: otherIcons["negroN"] });
            }
        }).bindPopup((layer) => {
            return `Nombre: ${layer.feature.properties.Nombre}, Lugar: ${layer.feature.properties.NMunicipio}`;
        }).addTo(map);
    },

    "LayerContrabando": () => {
        Layers["LayerContrabando"] = new L.geoJSON(capaContrabando, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { icon: otherIcons["azulC"] });
            }
        }).bindPopup((layer) => {
            return `Tipo: ${layer.feature.properties.CONTRABAND}, Lugar: ${layer.feature.properties.NOM_CPOB}`;
        }).addTo(map);
    },

    "LayerDensidadCoca": () => {
        Layers["LayerDensidadCoca"] = new L.geoJSON(densidadCoca, {
            style: {
                color: "#B7950B",
                pointToLayer: { icon: icons[formatoPlano["markType"]] },
                weight: 1,
                fillColor: "#B7950B",
                fillOpacity: 0.5
            }
        }).bindPopup((layer) => {
            return `Área ${layer.feature.properties.areacoca}`;
        }).addTo(map);
    },

    "LayerFluvialIlegal": () => {
        Layers["LayerFluvialIlegal"] = new L.geoJSON(capaFluvialIlegal, {
            style: {
                color: "black",
                weight: 4,
                fillColor: "#873600",
                fillOpacity: 0.5
            }

        }).bindPopup((layer) => {
            return `Nombre: ${layer.feature.properties.NOM_RIO}, Tipo: ${layer.feature.properties.TIPO_RUTA}, Descripción: ${layer.feature.properties.DESCRIP}`;
        }).addTo(map);
    },

    "LayerRutaArmas": () => {
        Layers["LayerRutaArmas"] = new L.geoJSON(capaRutaArmas, {
            style: {
                color: "purple",
                weight: 4,
                fillColor: "#873600",
                fillOpacity: 0.5
            }
        }).bindPopup((layer) => {
            return `Nombre: ${layer.feature.properties.NOMBRE}, Tipo: ${layer.feature.properties.TIPO}, Ruta: ${layer.feature.properties.RUTA}`;
        }).addTo(map);
    },

    "LayerPdet": () => {
        Layers["LayerPdet"] = new L.geoJSON(cpaPdet, {
            style: {
                color: "white",
                pointToLayer: { icon: icons[formatoPlano["markType"]] },
                weight: 1,
                fillColor: "#873600",
                fillOpacity: 0.5
            }
        }).bindPopup((layer) => {
            return layer.feature.properties.MpNombre;
        }).addTo(map);
    },

    "LayerAmbiental": () => {
        Layers["LayerAmbiental"] = new L.geoJSON(ambiental, {
            style: {
                color: "white",
                weight: 1,
                fillColor: "red",
                fillOpacity: 0.5
            }
        }).bindPopup((layer) => {

            return `${layer.feature.properties.nombre}, Categoría: ${layer.feature.properties.organizaci}, Org: ${layer.feature.properties.categoria}`
        }).addTo(map);
    },
    //Variable que guarda el layer MAP
    "LayerTitulos": () => {
        Layers["LayerTitulos"] = new L.geoJSON(TitulosMineros, {
            style: {
                color: "white",
                weight: 0,
                fillColor: "#212F3D",
                fillOpacity: 1
            }
        }).bindPopup((layer) => {

            return `Estado: ${layer.feature.properties.TITULO_EST}, Minerales: ${layer.feature.properties.MINERALES}, Etapa: ${layer.feature.properties.ETAPA}, Contrato: ${layer.feature.properties.MODALIDAD}`;
        }).addTo(map);
        Layers["LayerTitulos"].eachLayer
    },

    "LayerBloquePretrolero": () => {
        Layers["LayerBloquePretrolero"] = new L.geoJSON(CapaBloquePetrolero,
            {
                style: {
                    color: "white",
                    weight: 1,
                    fillColor: "pink",
                    fillOpacity: 0.8
                },
                filter: function (feature, layer) {
                    return (feature.properties.TIPO_CONTR !== "NO APLICA") && (feature.properties.ESTAD_AREA !== "SIN ASIGNAR");
                }
            }
        ).bindPopup((layer) => {
            return `Tipo: ${layer.feature.properties.TIPO_CONTR}, Operador: ${layer.feature.properties.TIPO_CONTR}, Estado: ${layer.feature.properties.ESTAD_AREA}`
        }).addTo(map);
    },



    "LayerReservas": () => {
        Layers["LayerReservas"] = new L.geoJSON(reservasCap, {
            style: {
                color: "orange",
                fillColor: "orange",
                fillOpacity: 3
            }
        }).bindPopup((layer) => {
            return layer.feature.properties.NOMBRE_ZONA_RESERVA_CAMPESINA
        }).addTo(map);
    },

    "LayerPozos": () => {
        Layers["LayerPozos"] = new L.geoJSON(PozosPretoleros, {
            style: {
                color: "#5DADE2",
                fillColor: "#5DADE2",
                fillOpacity: 3
            }
        }).bindPopup((layer) => {
            return layer.feature.properties.Name;
        }).addTo(map);
    },
    "LayerFondo": () => {
        Layers["LayerFondo"] = new L.geoJSON(FondoLayer, {
            style: {
                color: "white",
                weight: 0,
                fillColor: "white",
                fillOpacity: 1.2
            }
        }).bindPopup((layer) => {
        }).addTo(map);
    },
}



//*****************************************************
//Variables para iconos personalizados
//*****************************************************



//Se llama tambien en mapData.js
//Diccionario q contiene todos los iconos relacionados a un nombre, se cambia la marca segun la seleccion del usuario
const icons = {
    "green": () => {
        return L.icon({
            iconUrl: "../img/pVerdeV.png",
            shadowUrl: '',

            iconSize: [18 * formatoPlano.size, 18 * formatoPlano.size], // size of the icon
            shadowSize: [50, 64], // size of the shadow
            iconAnchor: [9 * formatoPlano.size, 18 * formatoPlano.size], // point of the icon which will correspond to marker's location
            popupAnchor: [-0, -0] // point from which the popup should open relative to the iconAnchor
        });
    },


    "black": () => {
        return L.icon({
            iconUrl: '../img/pNegroV.png',
            shadowUrl: '',

            iconSize: [18 * formatoPlano.size, 18 * formatoPlano.size], // size of the icon
            shadowSize: [50, 64], // size of the shadow
            iconAnchor: [9 * formatoPlano.size, 18 * formatoPlano.size], // point of the icon which will correspond to marker's location
            popupAnchor: [-0, -0] // point from which the popup should open relative to the iconAnchor
        })
    },


    "red": () => {
        return L.icon({
            iconUrl: '../img/pRojoV.png',
            shadowUrl: '',

            iconSize: [18 * formatoPlano.size, 18 * formatoPlano.size], // size of the icon
            shadowSize: [50, 64], // size of the shadow
            iconAnchor: [9 * formatoPlano.size, 18 * formatoPlano.size], // point of the icon which will correspond to marker's location
            popupAnchor: [-0, -0] // point from which the popup should open relative to the iconAnchor
        })
    },

    "blue": () => {
        return L.icon({
            iconUrl: '../img/pAzulV.png',
            shadowUrl: '',

            iconSize: [18 * formatoPlano.size, 18 * formatoPlano.size], // size of the icon
            shadowSize: [50, 64], // size of the shadow
            iconAnchor: [9 * formatoPlano.size, 18 * formatoPlano.size], // point of the icon which will correspond to marker's location
            popupAnchor: [-0, -0] // point from which the popup should open relative to the iconAnchor
        })
    },

    "purple": () => {
        return L.icon({
            iconUrl: '../img/pMoradoV.png',
            shadowUrl: '',

            iconSize: [18 * formatoPlano.size, 18 * formatoPlano.size], // size of the icon
            shadowSize: [50, 64], // size of the shadow
            iconAnchor: [9 * formatoPlano.size, 18 * formatoPlano.size], // point of the icon which will correspond to marker's location
            popupAnchor: [-0, -0] // point from which the popup should open relative to the iconAnchor
        })
    },

}


function putLabel(e) {
    if (ActiveLabels == "1") {
        LabelMap = new L.marker(e.latlng, { draggable: 'true', icon: otherIcons["senalador"] },);
        LabelMap.bindTooltip(TextoLabel.replace(/(?:\r\n|\r|\n)/g, '<p>'), { draggable: 'true', permanent: true, className: "map-labels", offset: [10, 0] });
        LabelMap.on('dragend', function (event) {
            LabelMap = event.target;
            const position = LabelMap.getLatLng();
            LabelMap.setLatLng(new L.LatLng(position.lat, position.lng));
        });
        map.addLayer(LabelMap);

        LabelsMap.push(LabelMap)
    }
};

function ActualizarEtiquetas() {
    TextoLabel = document.getElementById("txValorEtiqueta").value;
}

function ActivarEtiquetas() {
    const Valor = document.getElementById("LayerEtiquetas").checked;
    if (Valor == "0") {
        ActiveLabels = "0"
    } else {
        ActiveLabels = "1"
    }
}

function InserTAg(num) {
    const textarea = document.getElementById("txValorEtiqueta")
    switch (num) {
        case 'N':
            textarea.value += "<b>Texto</b>"
        case 'C':
            textarea.value += "<i>Texto</i>"
        case 'T1':
            textarea.value += "<h4>Texto</h4>"
        case 'T2':
            textarea.ape += "<h5>Texto</h5>"
    }
}

function RemoverLabels() {
    LabelsMap.forEach(elemento => {
        map.removeLayer(elemento)
    })
}

//Cambia el color del mapa, cambiando las especificaciones de la configuracion
function AplicarColorMapa() {
    formatoPlano["color"] = document.getElementById("colorMapaColor").value;
    formatoPlano["opacidad"] = document.getElementById("colorMapOpacity").value;

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


//Otros iconos (No usados aun)
const otherIcons = {
    "senalador": L.icon({
        iconUrl: '../img/otherIcons["senalador"].png',
        shadowUrl: '',

        iconSize: [14, 14], // size of the icon
        shadowSize: [50, 64], // size of the shadow
        iconAnchor: [7, 7], // point of the icon which will correspond to marker's location
        popupAnchor: [-0, -0] // point from which the popup should open relative to the iconAnchor
    }),

    "negroN": L.icon({
        iconUrl: '../img/pNegroN.png',
        shadowUrl: '',

        iconSize: [20, 20], // size of the icon
        shadowSize: [50, 64], // size of the shadow
        iconAnchor: [10, 20], // point of the icon which will correspond to marker's location
        popupAnchor: [-0, -0] // point from which the popup should open relative to the iconAnchor
    }),

    "azulC": L.icon({
        iconUrl: '../img/pAzulC.png',
        shadowUrl: '',

        iconSize: [20, 20], // size of the icon
        shadowSize: [50, 64], // size of the shadow
        iconAnchor: [10, 20], // point of the icon which will correspond to marker's location
        popupAnchor: [-0, -0] // point from which the popup should open relative to the iconAnchor
    }),

}