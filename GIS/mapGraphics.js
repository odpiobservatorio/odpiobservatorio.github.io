
let Datafilter = 0;
const Layers = {}
const LayersDep = []

let MarkPIR = []

let TextoLabel = "";
let ActiveLabels;
let LayersPIR = [];

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
    "bordercolor":"white",
    "weight":"2"
}
const formatoDesktop = {
    "color": "#29D5D8", // Configuracion de color 
    "opacidad": "1", // Configuracion de Opacidad
}

//Función para visualizar macros por unidades
function seeMacro(macroKey) {
    const macro = macros[macroKey];
    activeMacros[macroKey] = [];

    (macro.deps).forEach(departamento => {
        const depsCopy = JSON.parse(JSON.stringify(capaDepartamentos));
        depsCopy.features = [
            (depsCopy.features).find(
                feature => feature.properties.nombre_dpt === departamento
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
            }).bindPopup(
                PutPopUpZ(
                    (layer) => {
                        return `Departamento: ${layer.feature.properties.nombre_dpt}`;
                    }
                )
            ).addTo(map)
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
    LayersDep.forEach(departamento =>{
        map.removeLayer(departamento)


    })
}

function showDep() {
    /*
    * Muestra un departamento individual en el mapa
    */

    // Si hay un departamento mostrandose, lo elimina
    //clearDep()

    const departamento = document.getElementById("lstDeps").value;
    const depsCopy = JSON.parse(JSON.stringify(capaDepartamentos));

    depsCopy.features = [
        (depsCopy.features).find(
            feature => feature.properties.nombre_dpt === departamento
        )
    ];

    // Crear capa

    



    Layers["currentDep"] = new L.geoJson(depsCopy, {
        style: {
            color: formatoPlano["bordercolor"],
            weight: 2,
            opacity: 1,
            fillColor: formatoPlano.color,
            fillOpacity: formatoPlano.opacidad,
            pane:"polygonsPane"
        }
    }).bindPopup(
        PutPopUpZ(
            (layer) => {
                return layer.feature.properties.nombre_dpt
            }
        )
    ).addTo(map);

    LayersDep.push(Layers["currentDep"])


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
        map.removeLayer(Layers[key])
        delete Layers[key];

    }

}

//Administra los objetos que son superpeustos
function showOverLay(parent) {
    const checkBox = parent.querySelector(".form-check-input");
    if (checkBox.checked) {
        allLayers["LayerPIR"]()
        LeyendaActiva = "LayerPIR"
    } else {
        MarkPIR.forEach(elemento => {
            map.removeLayer(elemento)
        })
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


//Funciones q se llaman dependiendo de la capa q se quiera mostrar
const allLayers = {
    "LayerPlano": () => {
        Layers["LayerPlano"] = new L.geoJSON(LayerPlano, {
            style: {
                color: formatoPlano["bordercolor"],
                weight: formatoPlano["weight"],
                fillColor: formatoPlano["color"],
                fillOpacity: formatoPlano["opacidad"],
                pane: 'mapPane' //Orden en la capa              
            }
        }).addTo(map)
    },

    "LayerFondo": () => {
        Layers["LayerFondo"] = new L.geoJSON(FondoLayer, {
            style: {
                color: formatoDesktop["color"],
                weight: 0,
                fillColor: formatoDesktop["color"],
                fillOpacity: 1,
            }
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
        }).addTo(map);
    },
    "LayerDepartamentos": () => {
        Layers["LayerDepartamentos"] = new L.geoJSON(capaDepartamentos,
            {
                style: {
                    color: formatoPlano["bordercolor"],
                    weight: 1,
                    pane: 'mapLayers',
                    fillOpacity: 0,

                },
                filter: function (feature, layer) {
                    if (Datafilter == 1) {
                        return feature.properties.nombre_dpt == "CESAR" || feature.properties.nombre_dpt == "CHOCÓ";
                    }
                    else {
                        return feature.properties;
                    };
                }
            }
        ).bindPopup(
            PutPopUpZ(
                (layer) => {
                    return "Nombre: " + layer.feature.properties.nombre_dpt
                }
            )

        ).addTo(map);
    },

    "LayerMunicipios": () => {
        Layers["LayerMunicipios"] = new L.geoJSON(capaMunicipios,
            {
                style: {
                    color: formatoPlano["bordercolor"],
                    weight: 1,
                    pane: 'mapLayers',
                    fillOpacity: 0,
                },
                filter: function (feature, layer) {
                    if (Datafilter == 1) {
                        //return feature.properties.nombre_dpt == "CESAR" || feature.properties.nombre_dpt == "CHOCÓ";
                    }
                    else {
                        return feature.properties;
                    };
                }
            }
        ).bindPopup(
            PutPopUpZ(
                (layer) => {
                    return "Nombre: " + layer.feature.properties.nombre_mpi
                }
            )
        ).addTo(map);
    },

    "LayerMacroT": () => {
        Layers["LayerMacroT"] = new L.geoJSON(MacroTcv, {
            style: (feature) => {
                //Configuro el Popup nuevo               
                return {
                    color: feature.properties.backColor,
                    fillColor: feature.properties.backColor,
                    weight: 1,
                    fillOpacity: 0.6,
                    pane: 'mapLayers',
                }
            },
        }).bindPopup(
            PutPopUpZ(
                (layer) => {
                    return layer.feature.properties.MacroT
                        + layer.feature.properties.nombre_mpi
                        + " " + layer.feature.properties.nombre_dpt;
                }
            )
        ).addTo(map);
    },

    "LayerResguardos": () => {
        Layers["LayerResguardos"] = new L.geoJSON(resguardos,
            {
                style: {
                    color: "#76D7C4",
                    weight: 0,
                    fillColor: "red",
                    fillOpacity: 5,
                    pane: 'mapLayers'
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
        ).bindPopup(
            PutPopUpZ(
                (layer) => {
                    return `${layer.feature.properties.NOMBRE} ETNIA: ${layer.feature.properties.PUEBLO} MUNICIPIO: ${layer.feature.properties.MUNICIPIO}`
                }
            )
        ).addTo(map);
    },
    "LayerReservas": () => {
        Layers["LayerReservas"] = new L.geoJSON(reservasCap, {
            style: {
                color: "orange",
                fillColor: "orange",
                fillOpacity: 3,
                pane: 'mapLayers'
            }
        }).bindPopup(
            PutPopUpZ(
                (layer) => {
                    return layer.feature.properties.NOMBRE_ZONA_RESERVA_CAMPESINA
                }
            )
        ).addTo(map);
    },

    "LayerPdet": () => {
        Layers["LayerPdet"] = new L.geoJSON(cpaPdet, {
            style: {
                color: "white",
                weight: 1,
                fillColor: "#873600",
                pane: 'mapLayers',
                fillOpacity: 0.5
            }
        }).bindPopup(
            PutPopUpZ(
                (layer) => {
                    return layer.feature.properties.MpNombre;
                }
            )
        ).addTo(map);
    },

    "LayerRutaMigrantes": () => {
        Layers["LayerRutaMigrantes"] = new L.geoJSON(capaRutaMigrantes, {
            style: {
                color: "red",
                weight: 3,
                fillColor: "#873600",
                fillOpacity: 0.5,
                pane: 'mapLayers'
            }

        }).bindPopup(
            PutPopUpZ(
                (layer) => {
                    return layer.feature.properties.TIPO;
                }
            )
        ).addTo(map);
    },

    "LayerNarcotrafico": () => {


        Layers["LayerNarcotrafico"] = new L.geoJSON(capaPuntosNarcotrafico, {
            pointToLayer: function (feature, latlng)
            //
            {
                return PutMarkCicle(true, 'blue', 1, 10, latlng.lat, latlng.lng);
            }
        }).bindPopup(
            PutPopUpZ(
                (layer) => {
                    return `Nombre: ${layer.feature.properties.Nombre}, Lugar: ${layer.feature.properties.NMunicipio}`;
                }
            )).addTo(map);
    },

    "LayerContrabando": () => {
        Layers["LayerContrabando"] = new L.geoJSON(capaContrabando, {
            pointToLayer: function (feature, latlng) {
                return PutMarkCicle(true, 'black', 1, 10, latlng.lat, latlng.lng);
            }
        }).bindPopup(
            PutPopUpZ(
                (layer) => {
                    return `Tipo: ${layer.feature.properties.CONTRABAND}, Lugar: ${layer.feature.properties.NOM_CPOB}`;
                }
            )
        ).addTo(map);
    },

    "LayerFluvialIlegal": () => {
        Layers["LayerFluvialIlegal"] = new L.geoJSON(capaFluvialIlegal, {
            style: {
                color: "#2E86C1",
                weight: 1,
                fillColor: "#2E86C1",
                pane: 'mapLayers',
                fillOpacity: 0.5
            }

        }).bindPopup(
            PutPopUpZ(
                (layer) => {
                    return `Nombre: ${layer.feature.properties.NOM_RIO}, Tipo: ${layer.feature.properties.TIPO_RUTA}, Descripción: ${layer.feature.properties.DESCRIP}`;

                }
            )).addTo(map);
    },

    "LayerRutaArmas": () => {
        Layers["LayerRutaArmas"] = new L.geoJSON(capaRutaArmas, {
            style: {
                color: "purple",
                weight: 3,
                fillColor: "#873600",
                pane: 'mapLayers',
                fillOpacity: 0.5
            }
        }).bindPopup(
            PutPopUpZ(
                (layer) => {
                    return `Nombre: ${layer.feature.properties.NOMBRE}, Tipo: ${layer.feature.properties.TIPO}, Ruta: ${layer.feature.properties.RUTA}`;

                }
            )
        ).addTo(map);
    },
    "LayerDensidadCoca": () => {
        Layers["LayerDensidadCoca"] = new L.geoJSON(densidadCoca,
            {
                style: (feature) => {
                    return {
                        color: "white",
                        weight: 1,
                        fillColor: "green",
                        pane: 'mapLayers',
                        fillOpacity: feature.properties.Procentaje,
                    }
                },

            }).bindPopup(
                PutPopUpZ(
                    (layer) => {
                        return "Departamento:" + layer.feature.properties.DeNombre + ` Hectareas ${layer.feature.properties.Hectareas}`
                    }
                )
            ).addTo(map);
    },

    //Grupos armados ilegales
    "LayerELN": () => {
        Layers["LayerELN"] = new L.geoJSON(ELN2022Pares, {
            style: (feature) => {
                LabelB = PutPopUpZ()
                return {
                    color: "white",
                    weight: 1,
                    fillColor: "yellow",
                    fillOpacity: 0.8,
                    pane: 'mapLayers'
                }
            }
        }).bindPopup(
            PutPopUpZ(
                (layer) => {
                    return "ELN 2022 "
                        + layer.feature.properties.MpNombre
                        + " " + layer.feature.properties.Depto
                }
            )
        ).addTo(map);
    },

    "LayerGentilDuarte": () => {
        Layers["LayerGentilDuarte"] = new L.geoJSON(GentilDuarte2022Pares, {
            style: (feature) => {
                return {
                    color: "white",
                    weight: 1,
                    fillColor: "gray",
                    fillOpacity: 0.8,
                    pane: 'mapLayers'
                }
            }
        }).bindPopup(
            PutPopUpZ(
                (layer) => {
                    return layer.feature.properties.nombre_dpt + " "
                        + layer.feature.properties.nombre_mpi
                        + " Gentil Duarte (Pares 2022)"
                }
            )
        ).addTo(map);
    },

    "LayerAAPuntos": () => {
        Layers["LayerAAPuntos"] = new L.geoJSON(AAPuntosPares2022, {
            style: (feature) => {
                return {
                    color: feature.properties.backcolor,
                    fillColor: feature.properties.backcolor,
                    weight: 6,
                    fillOpacity: 1,
                    pane: 'polygonsPane',
                }
            },
        }).bindPopup(
            PutPopUpZ(
                (layer) => {
                    return layer.feature.properties.NombreAA
                }
            )
        ).addTo(map);
    },

    "LayerCluster2024": () => {
        Layers["LayerCluster2024"] = new L.geoJSON(ClusterODPI2024, {
            style: (feature) => {
                return {
                    color: "white",
                    fillColor: "gray",
                    weight: 1,
                    fillOpacity: 1,
                    pane: 'mapLayers'
                }
            },
        }).bindPopup("Cluster de afectaciones a los DPI OBSERVATORIO ODPI ONIC 2016-2023").addTo(map);
    },

    "LayerPIR": () => {
        PlanPIR.forEach(elemento => {
            let LatIn = "";
            let LngIn = "";
            let Mark;


            if (elemento.EstadoFase == "IMPLEMENTADO") {
                LatIn = elemento.LAT
                LngIn = elemento.LNG
                Mark = PutMarkCicle(true, 'green', 0.8, 10, LatIn, LngIn)

            } else if (elemento.EstadoFase == "IMPLEMENTACIÓN") {
                LatIn = elemento.LAT - 0.2
                LngIn = elemento.LNG
                Mark = PutMarkCicle(true, 'blue', 0.8, 10, LatIn, LngIn)

            } else if (elemento.EstadoFase == "ALISTAMIENTO") {
                LatIn = elemento.LAT + 0.2
                LngIn = elemento.LNG
                Mark = PutMarkCicle(true, 'gray', 0.8, 10, LatIn, LngIn)

            } else if (elemento.EstadoFase == "IDENTIFICACIÓN") {
                LatIn = elemento.LAT
                LngIn = elemento.LNG + 0.2
                Mark = PutMarkCicle(true, '#EF59A4', 0.8, 10, LatIn, LngIn)


            } else if (elemento.EstadoFase == "CARACTERIZACIÓN DEL DAÑO") {
                LatIn = elemento.LAT
                LngIn = elemento.LNG - 0.2
                Mark = PutMarkCicle(true, 'purple', 0.8, 10, LatIn, LngIn)
            }
            else if (elemento.EstadoFase == "DISEÑO Y FORMULACIÓN") {
                LatIn = elemento.LAT
                LngIn = elemento.LNG + 0.2
                Mark = PutMarkCicle(true, 'orange', 0.8, 10, LatIn, LngIn)
            }

            try {
                PIRm = Mark.bindPopup(
                    PutPopUpZ(`<div>
                    <div class="fw-medium text-success">${elemento.Municipio}</div>
                    <div class="ms-1"><b>Estado: </b>${elemento.EstadoFase}</div>
                    <div class="ms-1"><b>Pdet: </b>${elemento.PDET}</div>
                    <div class=" mt-2 ms-1 mb-2"><b>Sujeto: </b>${elemento.SujetoColectivo}</div>
                    <div class="ms-1"><b>Estado RUV: </b>:${elemento.EstadoRUV}</div>
                    <div class="ms-1"><b>Avance: %</b>:${elemento.PorcentajeAvancePIRC}</div>                  
                </div>`));
                map.addLayer(PIRm)
                MarkPIR.push(PIRm)
            } catch (error) {
                console.log(elemento)
            }
        })
    },

    "LayerIRV": () => {

        let Opacity;
        let parent
        Layers["LayerIRV"] = new L.geoJSON(capaIRV,

            {
                style: (feature) => {
                    parent = feature.properties
                    let MUN = feature.properties.nombre_mpi

                    let filteredMun = IRV.filter(mun =>
                        mun.Municipio.toLocaleLowerCase() == MUN.toLocaleLowerCase());
                    //alert(filteredMun[0].Percent+MUN.toLocaleLowerCase() + filteredMun[0].Municipio.toLocaleLowerCase())
                    try {
                        Opacity = filteredMun[0].Percent
                    } catch (error) {
                        Opacity = 0

                    }
                    return {
                        color: "red",
                        fillColor: "orange",
                        weight: 1,
                        fillOpacity: Opacity,
                    }
                },

            }
        ).bindPopup(
            PutPopUpZ(
                (layer) => {
                    let label
                    let parent = layer.feature.properties
                    let MUN = parent.nombre_mpi
                    let filteredMun = IRV.filter(mun =>
                        mun.Municipio.toLocaleLowerCase() == MUN.toLocaleLowerCase());

                    try {
                        label = `
                        <div>
                            <div class="fw-medium text-success">${parent.nombre_mpi}</div>
                            <div>Riesgo: ${filteredMun[0].Cluster}</div>
                            <div>Pdet: ${filteredMun[0].Pdet}</div>
                            <div>Estimado: ${filteredMun[0].Estimado.toFixed([3])}</div>
                        </div>        
                        `
                    } catch (error) {
                        label = `
                        <div>
                            <div class="fw-medium text-success">${parent.nombre_mpi}</div>
                            <div>Riesgo: Sin información</div>
                            <div>Pdet: Sin información</div>
                            <div>Estimado: Sin información</div>
                        </div>        
                        `
                    }

                    return label

                }
            )



        ).addTo(map);
    },

    //Variable que guarda el layer MAP
    "LayerTitulos": () => {
        Layers["LayerTitulos"] = new L.geoJSON(TitulosMineros, {
            style: {
                color: "white",
                weight: 0,
                fillColor: "#212F3D",
                fillOpacity: 1,
                pane: 'mapLayers'
            }
        }).bindPopup(
            PutPopUpZ(
                (layer) => {
                    return `Estado: ${layer.feature.properties.TITULO_EST}, Minerales: ${layer.feature.properties.MINERALES}, Etapa: ${layer.feature.properties.ETAPA}, Contrato: ${layer.feature.properties.MODALIDAD}`;

                }
            )
        ).addTo(map);
        Layers["LayerTitulos"].eachLayer
    },



    "LayerPozos": () => {
        Layers["LayerPozos"] = new L.geoJSON(PozosPretoleros, {
            style: {
                color: "#5DADE2",
                fillColor: "#5DADE2",
                fillOpacity: 3,
                pane: 'mapLayers'
            }
        }).bindPopup(
            PutPopUpZ(
                (layer) => {
                    return layer.feature.properties.Name;
                }
            )
        ).addTo(map);
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
                        pane: 'mapLayers'
                    }
                },
            }
        ).bindPopup(
            PutPopUpZ((layer) => {
                return `Tipo: ${layer.feature.properties.LEYENDA}
                Operador: ${layer.feature.properties.TIPO_CONTR} 
                Estado: ${layer.feature.properties.ESTAD_AREA}`
            })
        ).addTo(map);
    },
    "LayerAmbiental": () => {
        Layers["LayerAmbiental"] = new L.geoJSON(ambiental, {
            style: {
                color: "white",
                weight: 1,
                fillColor: "red",
                pane: 'mapLayers',
                fillOpacity: 0.5
            }
        }).bindPopup(
            PutPopUpZ(
                (layer) => {
                    return `${layer.feature.properties.nombre}, Categoría: ${layer.feature.properties.organizaci}, Org: ${layer.feature.properties.categoria}`

                }
            )
        ).addTo(map);
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
                    color: formatoPlano,
                    //dashArray: '3',
                    fillOpacity: 0.75,
                    pane: 'polygonsPane'
                }
            }
        }).bindPopup(
            PutPopUpZ(
                (layer) => {
                    const filtrado = bigData.DataToReport;

                    filtrado.forEach(registro => {
                        const elemento = normalizeString(registro.Departamento);
                        conteos[elemento] = (conteos[elemento] || 0) + 1;
                    });
            
                    const max = Math.max(...Object.values(conteos));
            
                    const depsCopy = JSON.parse(JSON.stringify(capaDepartamentos));
                    (depsCopy.features).forEach(feature => {
                        const propiedades = layer.feature.properties;
                        const nombreDepartamento = normalizeString(propiedades.nombre_dpt);
                        const valor = conteos[nombreDepartamento]
            
                        propiedades.Casos = valor ? valor : 0;
                    });
                    const casos = conteos[
                        normalizeString(layer.feature.properties.nombre_dpt)
                    ];
                    return `Departamento: ${layer.feature.properties.nombre_dpt}, #Casos: ${casos}`;

                }
            )).addTo(map);
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
                    fillOpacity: 0.75,
                    pane: 'mapLayers'
                }
            }
        }).bindPopup(
            PutPopUpZ(
                (layer) => {
                    DataPrincipal.forEach(registro => {
                        const elemento = normalizeString(registro.Departamento);
                        conteos[elemento] = (conteos[elemento] || 0) + 1;
                    });
                    const casos = conteos[
                        normalizeString(layer.feature.properties.nombre_dpt)
                    ];
                    return `Departamento: ${layer.feature.properties.nombre_dpt}, #Casos:${casos}`;
                }
            )).addTo(map);
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
                    pane: 'mapLayers',
                    fillOpacity: 0.75
                }
            }
        }).bindPopup(
            PutPopUpZ(
                (layer) => {
                    DataPrincipal.forEach(registro => {
                        const dep = normalizeString(registro.Departamento);
                        const afectados = registro["Total personas"];
                        conteos[dep] = (conteos[dep] || 0) + (
                            afectados == "No registra" ? 0 : parseInt(afectados)
                        );
                    });
                    const max = Math.max(...Object.values(conteos));
                    const depsCopy = JSON.parse(JSON.stringify(capaDepartamentos));
                    const casos = conteos[
                        normalizeString(layer.feature.properties.nombre_dpt)
                    ];

                    return `Departamento: ${layer.feature.properties.nombre_dpt}, #Víctimas: ${casos.toLocaleString('de-DE')}`;
                }
            )).addTo(map);
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
                    pane: 'mapLayers',
                    fillOpacity: 0.75
                }
            }
        }).bindPopup(
            PutPopUpZ(
                (layer) => {
                    (bigData.DataToReport).forEach(registro => {
                        const dep = normalizeString(registro.Departamento);
                        const afectados = registro["Total personas"];
                        conteos[dep] = (conteos[dep] || 0) + (
                            afectados == "No registra" ? 0 : parseInt(afectados)
                        );
                    });
                    const max = Math.max(...Object.values(conteos));
                    const depsCopy = JSON.parse(JSON.stringify(capaDepartamentos));

                    const casos = conteos[
                        normalizeString(layer.feature.properties.nombre_dpt)
                    ];
                    return `Departamento: ${layer.feature.properties.nombre_dpt}, #Casos: ${casos ? casos.toLocaleString('de-DE') : 0}`;
                }
            )).addTo(map);
    },

}


function RemoverLabels() {
    //Funcion de GoblaMapGraphiscs
    DeleteMarks()
}

function MostrarLeyendas() {

    let templateLeyenda = document.createElement('div');
    templateLeyenda.className = "text-dark"
    let hrLeyenda = document.createElement('div');
    hrLeyenda.className = "h6 text-secondary ms-3";

    templateLeyenda.appendChild(hrLeyenda)

    putLeyenda[LeyendaActiva].forEach(item => {

        templateLeyenda.style.width = "250px"
        //hrLeyenda.textContent = item.title;
        let rItem = document.createElement('div');
        rItem.className = "row";
        rItem.innerHTML = `
        <div class="tLeyenda">
        <svg class="ms-1 me-2" width="17" height="10" style="background-color:${item.color};opacity: ${item.opacity};"></svg>
         ${item.label}
        </div>  
        `
        templateLeyenda.appendChild(rItem)
    })




    let LabelMap = PutMarkCicle(false, 'gray', 0.5, 5)

    LabelMap.bindTooltip(
        templateLeyenda,
        {
            draggable: 'true',
            permanent: true,
            className: "map-labels",
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

