const GLOBAL = {
    state: {}
}

let Datafilter = 0;
const Layers = {}
let LabelsMap = []
let TextoLabel = "";
let ActiveLabels;

let ColorAA;

const activeMacros = {}
const macros = {
    amazonia: {
        color: "#61ad28",
        deps: [
            "AMAZONAS", "CAQUETA", "GUAVIARE", "PUTUMAYO", "VAUPES", "GUAINIA"
        ]
    },

    centroOriente: {
        color: "#ad68e6",
        deps: [
            "SANTAFE DE BOGOTA D.C", "BOYACA", "NORTE DE SANTANDER", "TOLIMA", "HUILA", "CUNDINAMARCA", "SANTANDER"
        ],
    },

    norte: {
        color: "#fe7547",
        deps: [
            "CESAR", "CORDOBA", "LA GUAJIRA", "MAGDALENA", "SUCRE", "BOLIVAR", "ATLANTICO"
        ],
    },

    occidente: {

        color: "#c7767f",
        deps: [
            "ANTIOQUIA", "CALDAS", "CAUCA", "VALLE DEL CAUCA", "CHOCO", "NARIÑO", "QUINDIO", "RISARALDA",
        ],
    },

    orinoquia: {
        color: "#fece46",
        deps: [
            "ARAUCA", "CASANARE", "META", "VICHADA"
        ],
    },
}

//Diccionario con la "configuracion" del plano, se modifica segun los cambios del usuario
const formatoPlano = {
    "color": "orange", // Configuracion de color 
    "opacidad": "0.5", // Configuracion de Opacidad
    "markType": "green", //Tipo de marcas q se muestran
    "size": 1, // Tamaño de las marcas
}

function updateSize(value) {
    // Actualiza el tamaño de las marcas
    formatoPlano.size = parseFloat(value);
}

function seeMacro(macroKey) {
    const macro = macros[macroKey];
    activeMacros[macroKey] = [];

    (macro.deps).forEach(departamento => {
        const depsCopy = JSON.parse(JSON.stringify(capaDepartamentos));
        depsCopy.features = [
            (depsCopy.features).find(
                feature => feature.properties.NOMBRE_DPT === departamento
            )
        ];
        // Crear capa
        (activeMacros[macroKey]).push(
            new L.geoJson(depsCopy, {
                style: {
                    weight: 2,
                    opacity: 2,
                    color: '#ffffff',
                    fillColor: macro.color,
                    fillOpacity: formatoPlano.opacidad,
                }
            }).bindPopup((layer) => {
                return `Departamento: ${layer.feature.properties.NOMBRE_DPT}`;
            }).addTo(map)
        );
    });
}

function showMacro(checkBox) {
    const macroKey = checkBox.getAttribute("id");

    if (checkBox.checked) {
        seeMacro(macroKey);
    } else {
        if (activeMacros.hasOwnProperty(macroKey)) {
            const activeDeps = activeMacros[macroKey];
            activeDeps.forEach(depLayer => map.removeLayer(depLayer))
            delete activeMacros[macroKey];
        }
    }
}

function resetIconSize() {
    // Resetea el tamaño de las marcas y las muestra nuevamente
    document.getElementById("sizeIconV").value = 1;
    formatoPlano.size = 1;
    reloadIcons()
}

function reloadIcons() {
    /*
    * Recarga las marcas en el mapa, con la configuracion actualizada
    */

    //Limpiamos las marcas del mapa
    clearMarkers();

    // Mostrar datos en el mapa
    showBusqueda(bigData.DataToReport);
}

function changeMark(value) {
    /* 
    * Cambia el tipo de la marca q se muestra
    */
    formatoPlano["markType"] = value
}

function clearLayers() {
    /*
    * Limpia todas las capas q se estan mostrando
    */

    const contenedor = (document.getElementById("lstLayers"));
    const listaChecks = contenedor.querySelectorAll(".form-check-input");

    listaChecks.forEach(checkbox => {
        const key = checkbox.id;

        if (checkbox.checked) {
            checkbox.checked = false;

            if (Layers.hasOwnProperty(key)) {
                map.removeLayer(Layers[key]);
                delete Layers[key];
            } else {
                if (activeMacros.hasOwnProperty(key)) {
                    const activeDeps = activeMacros[key];
                    activeDeps.forEach(depLayer => map.removeLayer(depLayer))
                    delete activeMacros[key];
                }
            }
        }
    });
}

function clearDep() {
    /*
    * Limpia el departamento inidividual q se esta mostrando
    */
    if (Layers.hasOwnProperty("currentDep")) {
        map.removeLayer(Layers["currentDep"]);
    }
}

function showDep() {
    /*
    * Muestra un departamento individual en el mapa
    */

    // Si hay un departamento mostrandose, lo elimina
    clearDep()

    const departamento = document.getElementById("lstDeps").value;
    const depsCopy = JSON.parse(JSON.stringify(capaDepartamentos));

    depsCopy.features = [
        (depsCopy.features).find(
            feature => feature.properties.NOMBRE_DPT === departamento
        )
    ];

    // Crear capa
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
    /* 
    * Si el usuario selecciona una capa, la muestra, si ya esta seleccionada la elimina
    */

    const checkBox = parent.querySelector(".form-check-input");
    const key = checkBox.getAttribute("id");

    if (checkBox.checked) {
        allLayers[key]();
        LeyendaActiva = key

    } else if (Layers.hasOwnProperty(key)) {
        map.removeLayer(Layers[key]);
        delete Layers[key];
    }
}

//.............................................
//Funciones que muestran capas separadas
//.............................................

//Test-----
function colorMap(casos, max = 794) {
    /*
    * Obtiene un gradiente de color dependiendo de cuantos casos hayan
    * n es el valor normalizado segun el maximo de casos
    */
    const n = (1000 / max) * casos;
    return n > 1000 ? '#800026' :
        n > 500 ? '#BD0026' :
            n > 200 ? '#E31A1C' :
                n > 100 ? '#FC4E2A' :
                    n > 50 ? '#FD8D3C' :
                        n > 20 ? '#FEB24C' :
                            n > 10 ? '#FED976' :
                                '#FFEDA0';
}
//------------

let a = 1
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

    "LayerMapaCalor": () => {

        //Get deps
        const conteos = {};
        const filtrado = bigData.DataToReport;

        filtrado.forEach(registro => {
            const elemento = normalizeString(registro.Departamento);
            conteos[elemento] = (conteos[elemento] || 0) + 1;
        });

        const max = Math.max(...Object.values(conteos));

        const depsCopy = JSON.parse(JSON.stringify(capaDepartamentos));
        (depsCopy.features).forEach(feature => {
            const propiedades = feature.properties;
            const nombreDepartamento = normalizeString(propiedades.nombre_dpt);
            const valor = conteos[nombreDepartamento]

            propiedades.Casos = valor ? valor : 0;
        });

        //Crear capa
        Layers["LayerMapaCalor"] = new L.geoJson(depsCopy, {
            style: (feature) => {
                const casos = conteos[
                    normalizeString(feature.properties.nombre_dpt)
                ];
                return {
                    fillColor: colorMap(casos || 1, max),
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    //dashArray: '3',
                    fillOpacity: 0.75
                }
            }
        }).bindPopup((layer) => {
            const casos = conteos[
                normalizeString(layer.properties.nombre_dpt)
            ];
            return `Departamento: ${layer.feature.properties.nombre_dpt}, #Casos: ${casos}`;
        }).addTo(map);
    },

    "LayerColorMap": () => {
        //Get deps
        const conteos = {};
        DataPrincipal.forEach(registro => {
            const elemento = normalizeString(registro.Departamento);
            conteos[elemento] = (conteos[elemento] || 0) + 1;
        });
        const max = Math.max(...Object.values(conteos));
        const depsCopy = JSON.parse(JSON.stringify(capaDepartamentos));

        //Crear capa
        Layers["LayerColorMap"] = new L.geoJson(depsCopy, {
            style: (feature) => {
                const casos = conteos[
                    normalizeString(feature.properties.nombre_dpt)
                ];
                return {
                    fillColor: colorMap(casos || 1, max),
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    //dashArray: '3',
                    fillOpacity: 0.75
                }
            }
        }).bindPopup((layer) => {
            const casos = conteos[
                normalizeString(layer.properties.nombre_dpt)
            ];
            return `Departamento: ${layer.feature.properties.nombre_dpt}, #Casos: ${casos}`;
        }).addTo(map);
    },


    "LayerColorVictimas": () => {
        //Get deps
        const conteos = {};
        DataPrincipal.forEach(registro => {
            const dep = normalizeString(registro.Departamento);
            const afectados = registro["Total personas"];
            conteos[dep] = (conteos[dep] || 0) + (
                afectados == "No registra" ? 0 : parseInt(afectados)
            );
        });
        const max = Math.max(...Object.values(conteos));
        const depsCopy = JSON.parse(JSON.stringify(capaDepartamentos));

        //Crear capa
        Layers["LayerColorVictimas"] = new L.geoJson(depsCopy, {
            style: (feature) => {
                const casos = conteos[
                    normalizeString(feature.properties.nombre_dpt)
                ];
                return {
                    fillColor: colorMap(casos, max),
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    //dashArray: '3',
                    fillOpacity: 0.75
                }
            }
        }).bindPopup((layer) => {
            const casos = conteos[
                normalizeString(layer.feature.properties.nombre_dpt)
            ];
            return `Departamento: ${layer.feature.properties.nombre_dpt}, #Casos: ${casos.toLocaleString('de-DE')}`;
        }).addTo(map);
    },

    "LayerColorVictimasFiltrado": () => {
        //Get deps
        const conteos = {};
        (bigData.DataToReport).forEach(registro => {
            const dep = normalizeString(registro.Departamento);
            const afectados = registro["Total personas"];
            conteos[dep] = (conteos[dep] || 0) + (
                afectados == "No registra" ? 0 : parseInt(afectados)
            );
        });
        const max = Math.max(...Object.values(conteos));
        const depsCopy = JSON.parse(JSON.stringify(capaDepartamentos));

        //Crear capa
        Layers["LayerColorVictimasFiltrado"] = new L.geoJson(depsCopy, {
            style: (feature) => {
                const casos = conteos[
                    normalizeString(feature.properties.nombre_dpt)
                ];
                return {
                    fillColor: colorMap(casos, max),
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    //dashArray: '3',
                    fillOpacity: 0.75
                }
            }
        }).bindPopup((layer) => {
            const casos = conteos[
                normalizeString(layer.feature.properties.nombre_dpt)
            ];
            return `Departamento: ${layer.feature.properties.nombre_dpt}, #Casos: ${casos ? casos.toLocaleString('de-DE') : 0}`;
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
                    color: formatoPlano.color,
                    weight: 1,
                    // fillColor: "darkgray",
                    fillOpacity: 0,
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
            return "Nombre: " + layer.feature.properties.nombre_dpt
        }).addTo(map);
    },

    "LayerMunicipios": () => {
        Layers["LayerMunicipios"] = new L.geoJSON(capaMunicipios,
            {
                style: {
                    color: formatoPlano.color,
                    weight: 1,
                    // fillColor: "darkgray",
                    fillOpacity: 0,
                    icon: icons[formatoPlano["markType"]]
                },
                filter: function (feature, layer) {
                    if (Datafilter == 1) {
                        //return feature.properties.NOMBRE_DPT == "CESAR" || feature.properties.NOMBRE_DPT == "CHOCÓ";
                    }
                    else {
                        return feature.properties;
                    };
                }
            }
        ).bindPopup((layer) => {
            return "Nombre: " + layer.feature.properties.nombre_mpi
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

        Layers["LayerDensidadCoca"] = new L.geoJSON(densidadCoca,

            {

                style: (feature) => {
                    return {
                        color: "white",
                        weight: 1,
                        weight: 1,
                        fillColor: "green",
                        fillOpacity: feature.properties.Procentaje,
                    }
                },


            }).bindPopup((layer) => {
                return "Departamento:" + layer.feature.properties.DeNombre + ` Hectareas ${layer.feature.properties.Hectareas}`
            },

            ).addTo(map);
    },



    "LayerFluvialIlegal": () => {
        Layers["LayerFluvialIlegal"] = new L.geoJSON(capaFluvialIlegal, {
            style: {
                color: "blue",
                weight: 1,
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
                weight: 3,
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

    "LayerBloquePretrolero": () => {
        Layers["LayerBloquePretrolero"] = new L.geoJSON(CapaBloquePetrolero,
            {
                style: (feature) => {
                    return {
                        color: feature.properties.backcolor,
                        fillColor: feature.properties.backcolor,
                        weight: 1,
                        fillOpacity: 0.6,
                    }
                },
            }
        ).bindPopup((layer) => {
            return `Tipo: ${layer.feature.properties.LEYENDA}, Operador: ${layer.feature.properties.TIPO_CONTR}, Estado: ${layer.feature.properties.ESTAD_AREA}`
        }).addTo(map);
    },

    "LayerFondo": () => {
        Layers["LayerFondo"] = new L.geoJSON(FondoLayer, {
            style: {
                color: "#ffffff",
                weight: 0,
                fillColor: "white",
                fillOpacity: 1,
            }
        }).bindPopup((layer) => {
        }).addTo(map);
    },
    "LayerFondoDark": () => {
        Layers["LayerFondoDark"] = new L.geoJSON(FondoLayer, {
            style: {
                color: "#ffffff",
                weight: 0,
                fillColor: "black",
                fillOpacity: 1,
            }
        }).bindPopup((layer) => {
        }).addTo(map);
    },



    //Grupos armados ilegales
    "LayerELN": () => {
        Layers["LayerELN"] = new L.geoJSON(ELN2022Pares, {
            style: {
                color: "white",
                weight: 1,
                fillColor: "yellow",
                fillOpacity: 0.8
            }
        }).bindPopup((layer) => {
            return "ELN 2022 " + layer.feature.properties.MpNombre + " " + layer.feature.properties.Depto
        }).addTo(map);
    },


    "LayerGentilDuarte": () => {
        Layers["LayerGentilDuarte"] = new L.geoJSON(GentilDuarte2022Pares, {
            style: {
                color: "white",
                weight: 1,
                fillColor: "gray",
                fillOpacity: 0.8
            }
        }).bindPopup((layer) => {
            return layer.feature.properties.nombre_dpt + " "
                + layer.feature.properties.nombre_mpi
                + " Gentil Duarte (Pares 2022)"
        }).addTo(map);
    },


    "LayerAAPuntos": () => {
        Layers["LayerAAPuntos"] = new L.geoJSON(AAPuntosPares2022, {
            style: (feature) => {
                return {
                    color: feature.properties.backcolor,
                    fillColor: feature.properties.backcolor,
                    weight: 6,
                    fillOpacity: 1,
                }
            },
        }).bindPopup((layer) => {
            //layer.feature.properties.Nombre
            return layer.feature.properties.NombreAA
        }).addTo(map);
    },



    "LayerCluster2024": () => {
        Layers["LayerCluster2024"] = new L.geoJSON(ClusterODPI2024, {
            style: (feature) => {
                return {
                    color: "white",
                    fillColor: "gray",
                    weight: 1,
                    fillOpacity: 1,
                }
            },
        }).bindPopup((layer) => {
            "Cluster de afectaciones a los DPI OBSERVATORIO ODPI ONIC 2016-2023"
            //layer.feature.properties.Nombre
            //return layer.feature.properties.NombreAA
        }).addTo(map);
    },



    "LayerMacroT": () => {
        Layers["LayerMacroT"] = new L.geoJSON(MacroTcv, {
            style: (feature) => {
                return {
                    color: feature.properties.backColor,
                    fillColor: feature.properties.backColor,
                    weight: 1,
                    fillOpacity: 0.6,
                }
            },
        }).bindPopup((layer) => {
            //layer.feature.properties.Nombre
            return layer.feature.properties.MacroT + " "
                + layer.feature.properties.nombre_mpi
                + " " + layer.feature.properties.nombre_dpt
        }).addTo(map);
    },


}

//*****************************************************
//Variables para iconos personalizados
//*****************************************************

const iconsPaths = {
    green: "../img/pVerdeV.png",
    black: "../img/pNegroV.png",
    red: "../img/pRojoV.png",
    blue: "../img/pAzulV.png",
    purple: "../img/pMoradoV.png",
    Ppurple: "../img/clusMorado.png",
    Pblue: "../img/clusAzul.png",
    Pgray: "../img/clusGris.png",
    Porange: "../img/clusGris.png",
    Pred: "../img/clusGris.png",
}

const icons = {
    /*
    * Al llamar una funcion se obtiene un icono personalizado con las especificaciones
    * Se usa tambien en mapData.js
    */

    "green": () => {
        return L.icon({
            iconUrl: iconsPaths.green,
            shadowUrl: '',

            iconSize: [18 * formatoPlano.size, 18 * formatoPlano.size], // size of the icon
            shadowSize: [50, 64], // size of the shadow
            iconAnchor: [9 * formatoPlano.size, 18 * formatoPlano.size], // point of the icon which will correspond to marker's location
            popupAnchor: [-0, -0] // point from which the popup should open relative to the iconAnchor
        });
    },


    "black": () => {
        return L.icon({
            iconUrl: iconsPaths.black,
            shadowUrl: '',

            iconSize: [18 * formatoPlano.size, 18 * formatoPlano.size], // size of the icon
            shadowSize: [50, 64], // size of the shadow
            iconAnchor: [9 * formatoPlano.size, 18 * formatoPlano.size], // point of the icon which will correspond to marker's location
            popupAnchor: [-0, -0] // point from which the popup should open relative to the iconAnchor
        })
    },


    "red": () => {
        return L.icon({
            iconUrl: iconsPaths.red,
            shadowUrl: '',

            iconSize: [18 * formatoPlano.size, 18 * formatoPlano.size], // size of the icon
            shadowSize: [50, 64], // size of the shadow
            iconAnchor: [9 * formatoPlano.size, 18 * formatoPlano.size], // point of the icon which will correspond to marker's location
            popupAnchor: [-0, -0] // point from which the popup should open relative to the iconAnchor
        })
    }
    ,

    "blue": () => {
        return L.icon({
            iconUrl: iconsPaths.blue,
            shadowUrl: '',

            iconSize: [18 * formatoPlano.size, 18 * formatoPlano.size], // size of the icon
            shadowSize: [50, 64], // size of the shadow
            iconAnchor: [9 * formatoPlano.size, 18 * formatoPlano.size], // point of the icon which will correspond to marker's location
            popupAnchor: [-0, -0] // point from which the popup should open relative to the iconAnchor
        })
    },

    "purple": () => {
        return L.icon({
            iconUrl: iconsPaths.purple,
            shadowUrl: '',

            iconSize: [18 * formatoPlano.size, 18 * formatoPlano.size], // size of the icon
            shadowSize: [50, 64], // size of the shadow
            iconAnchor: [9 * formatoPlano.size, 18 * formatoPlano.size], // point of the icon which will correspond to marker's location
            popupAnchor: [-0, -0] // point from which the popup should open relative to the iconAnchor
        })
    },

    "Ppurple": () => {
        return L.icon({
            iconUrl: iconsPaths.Ppurple,
            shadowUrl: '',

            iconSize: [18 * formatoPlano.size, 18 * formatoPlano.size], // size of the icon
            shadowSize: [50, 64], // size of the shadow
            iconAnchor: [9 * formatoPlano.size, 18 * formatoPlano.size], // point of the icon which will correspond to marker's location
            popupAnchor: [-0, -0] // point from which the popup should open relative to the iconAnchor
        })
    },
    "Pblue": () => {
        return L.icon({
            iconUrl: iconsPaths.Ppurple,
            shadowUrl: '',

            iconSize: [18 * formatoPlano.size, 18 * formatoPlano.size], // size of the icon
            shadowSize: [50, 64], // size of the shadow
            iconAnchor: [9 * formatoPlano.size, 18 * formatoPlano.size], // point of the icon which will correspond to marker's location
            popupAnchor: [-0, -0] // point from which the popup should open relative to the iconAnchor
        })
    },
    "Pgray": () => {
        return L.icon({
            iconUrl: iconsPaths.Pgray,
            shadowUrl: '',

            iconSize: [18 * formatoPlano.size, 18 * formatoPlano.size], // size of the icon
            shadowSize: [50, 64], // size of the shadow
            iconAnchor: [9 * formatoPlano.size, 18 * formatoPlano.size], // point of the icon which will correspond to marker's location
            popupAnchor: [-0, -0] // point from which the popup should open relative to the iconAnchor
        })
    },
    "Porange": () => {
        return L.icon({
            iconUrl: iconsPaths.Porange,
            shadowUrl: '',

            iconSize: [18 * formatoPlano.size, 18 * formatoPlano.size], // size of the icon
            shadowSize: [50, 64], // size of the shadow
            iconAnchor: [9 * formatoPlano.size, 18 * formatoPlano.size], // point of the icon which will correspond to marker's location
            popupAnchor: [-0, -0] // point from which the popup should open relative to the iconAnchor
        })
    },
    "Pred": () => {
        return L.icon({
            iconUrl: iconsPaths.Pred,
            shadowUrl: '',

            iconSize: [18 * formatoPlano.size, 18 * formatoPlano.size], // size of the icon
            shadowSize: [50, 64], // size of the shadow
            iconAnchor: [9 * formatoPlano.size, 18 * formatoPlano.size], // point of the icon which will correspond to marker's location
            popupAnchor: [-0, -0] // point from which the popup should open relative to the iconAnchor
        })
    },

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

function RemoverLabels() {
    LabelsMap.forEach(elemento => {
        map.removeLayer(elemento)
    })
}

function MostrarLeyendas() {
    let templateLeyenda = document.createElement('div');
    templateLeyenda.className = "text-dark"


    let hrLeyenda = document.createElement('div');
    hrLeyenda.className = "h6 text-secondary ms-3";

    templateLeyenda.appendChild(hrLeyenda)

    if (LeyendaActiva == "LayerDensidadCoca") {

        //Leo la matriz de Densidad y leo cada item
        LyDenCoca.forEach(item => {
            templateLeyenda.style.width = "200px"
            hrLeyenda.textContent = "Densidad de Coca 2021";
            let rItem = document.createElement('div');
            rItem.className = "row";
            rItem.innerHTML = `
            <div class="col-auto me-auto ms-3 ">
                <svg width="20" height="10" style="background-color:${item.color};opacity: ${item.opacity};"></svg>
            </div>
            <div class="col tLeyenda ">
                    ${item.label}
            </div>  
            `
            templateLeyenda.appendChild(rItem)
        })
    } else if (LeyendaActiva == "LayerMacroT") {
        templateLeyenda.style.width = "250px"
        hrLeyenda.textContent = "Macro Territorios C.V";
        //Leo la matriz de Densidad y leo cada item
        LyMacroT.forEach(item => {
            let rItem = document.createElement('div');
            rItem.className = "r";
            rItem.innerHTML = `
            <div class="tLeyenda">
            <svg class="ms-1 me-2" width="17" height="10" style="background-color:${item.color};opacity: ${item.opacity};"></svg>
             ${item.label}
            </div>  
            `
            templateLeyenda.appendChild(rItem)
        })
    } else if (LeyendaActiva == "LayerBloquePretrolero") {
        templateLeyenda.style.width = "250px"
        hrLeyenda.textContent = "Agencia Nacional Hidrocarburos";
        //Leo la matriz de Densidad y leo cada item
        LyANH.forEach(item => {
            let rItem = document.createElement('div');
            rItem.className = "r";
            rItem.innerHTML = `
            <div class="tLeyenda">
            <svg class="ms-1 me-2" width="17" height="10" style="background-color:${item.color};opacity: ${item.opacity};"></svg>
             ${item.label}
            </div>  
            `
            templateLeyenda.appendChild(rItem)
        })
    }








    //<img src="${iconsPaths[formatoPlano.markType]}" width="18" height="18">



    LabelMap = new L.marker([3.12, -56.2], { draggable: 'true', icon: otherIcons["senalador"] },);

    LabelMap.bindTooltip(templateLeyenda, { draggable: 'true', permanent: true, className: "map-labels", offset: [10, 0] });
    LabelMap.on('dragend', function (event) {
        LabelMap = event.target;
        const position = LabelMap.getLatLng();
        LabelMap.setLatLng(new L.LatLng(position.lat, position.lng));
    });
    map.addLayer(LabelMap);

    LabelsMap.push(LabelMap)
}



//Otros iconos (No usados aun)
const otherIcons = {
    "senalador": L.icon({
        iconUrl: '../img/pSenalador.png',
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
