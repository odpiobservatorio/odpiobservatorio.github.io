//Variable que filtra las capas GeoJson si está activa
///filtra por departamento
let Datafilter = 0;
let Layers = {}

//.............................................
//Funciones que muestran capas separadas
//.............................................

function clearLayers() {
  let lista = ((document.getElementById("LayerDepartamentos")).parentElement).parentElement;
  lista = lista.querySelectorAll(".form-check-input");

  for (const input of lista) {
    if (input.checked) {
      input.checked = false;
      map.removeLayer(Layers[input.getAttribute("id")]);
    }
  }
}

function showLayer(parent) {
  const input = parent.querySelector(".form-check-input");
  const key = input.getAttribute("id");

  if (input.checked) {
    allLayers[key]();
  } else {
    map.removeLayer(Layers[key]);
  }
}


const allLayers = {
  "LayerPlano": () => {
    Layers["LayerPlano"] = new L.geoJSON(LayerPlano, {
      style: {
        color: "#76D7C4",
        weight: 0,
        fillColor: "#76D7C4",
        fillOpacity: 5,
        icon: greenIcon
      }
    }).bindPopup((layer) => {
      return layer.feature.properties.categoria
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
          icon: greenIcon
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
          icon: greenIcon
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
        return L.marker(latlng, { icon: pNegroN });
      }
    }).bindPopup((layer) => {
      return `Nombre: ${layer.feature.properties.Nombre}, Lugar: ${layer.feature.properties.NMunicipio}`;
    }).addTo(map);
  },

  "LayerContrabando": () => {
    Layers["LayerContrabando"] = new L.geoJSON(capaContrabando, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: pAzulC });
      }
    }).bindPopup((layer) => {
      return `Tipo: ${layer.feature.properties.CONTRABAND}, Lugar: ${layer.feature.properties.NOM_CPOB}`;
    }).addTo(map);
  },

  "LayerDensidadCoca": () => {
    Layers["LayerDensidadCoca"] = new L.geoJSON(densidadCoca, {
      style: {
        color: "#B7950B",
        pointToLayer: { icon: greenIcon },
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
        pointToLayer: { icon: greenIcon },
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

var redIcon = L.icon({
  iconUrl: 'http://drive.google.com/uc?export=view&id=1twxk4zLh6wwXNn2Z2ttNzp3bDZeJ_ICk',
  shadowUrl: '',

  iconSize: [14, 14], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [7, 14], // point of the icon which will correspond to marker's location
  popupAnchor: [-0, -0] // point from which the popup should open relative to the iconAnchor
});

var blueIcon = L.icon({
  iconUrl: 'http://drive.google.com/uc?export=view&id=1EkOvfc494j92gqYei3YMBLeNAgmSHH8y',
  shadowUrl: '',

  iconSize: [14, 14], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [7, 14], // point of the icon which will correspond to marker's location
  popupAnchor: [-0, -0] // point from which the popup should open relative to the iconAnchor
});

var yellowIcon = L.icon({
  iconUrl: 'http://drive.google.com/uc?export=view&id=1XLFL39Jm0NZ8D5PBg9b6VEqMzNw1EQ5y',
  shadowUrl: '',

  iconSize: [14, 14], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [7, 14], // point of the icon which will correspond to marker's location
  popupAnchor: [-0, -0] // point from which the popup should open relative to the iconAnchor
});

var greenIcon = L.icon({
  //iconUrl: 'http://drive.google.com/uc?export=view&id=1TcHI2ecG3JtHqZ9H6IdsYOFC1HH42fOu',
  iconUrl: '../img/pVerdeV.png',
  shadowUrl: '',

  iconSize: [18, 18], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [9, 18], // point of the icon which will correspond to marker's location
  popupAnchor: [-0, -0] // point from which the popup should open relative to the iconAnchor
});

var orangeIcon = L.icon({
  iconUrl: 'http://drive.google.com/uc?export=view&id=1D6a_M8N64g-K7CDkaENE1wlVlJ6v-CsW',
  shadowUrl: '',

  iconSize: [14, 14], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [7, 14], // point of the icon which will correspond to marker's location
  popupAnchor: [-0, -0] // point from which the popup should open relative to the iconAnchor
});



let LabelsMap = []
let TextoLabel = "";
let ActiveLabels;


function putLabel(e) {

  if (ActiveLabels == "1") {
    LabelMap = new L.marker(e.latlng, { draggable: 'true', icon: pSenalador },
    );
    LabelMap.bindTooltip(
      TextoLabel.replace(/(?:\r\n|\r|\n)/g, '<p>'),
      { draggable: 'true', permanent: true, className: "map-labels", offset: [10, 0] });
    LabelMap.on('dragend', function (event) {
      LabelMap = event.target;
      var position = LabelMap.getLatLng();
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

var purpleIcon = L.icon({
  iconUrl: 'http://drive.google.com/uc?export=view&id=1DOYa14gjF2qafc5JANuZbMlubKJtsTuT',
  shadowUrl: '',

  iconSize: [14, 14], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [7, 14], // point of the icon which will correspond to marker's location
  popupAnchor: [-0, -0] // point from which the popup should open relative to the iconAnchor
});
var pNegroN = L.icon({
  iconUrl: '../img/pNegroN.png',
  shadowUrl: '',

  iconSize: [20, 20], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [10, 20], // point of the icon which will correspond to marker's location
  popupAnchor: [-0, -0] // point from which the popup should open relative to the iconAnchor
});
var pAzulC = L.icon({
  iconUrl: '../img/pAzulC.png',
  shadowUrl: '',

  iconSize: [20, 20], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [10, 20], // point of the icon which will correspond to marker's location
  popupAnchor: [-0, -0] // point from which the popup should open relative to the iconAnchor
});

var pSenalador = L.icon({
  iconUrl: '../img/pSenalador.png',
  shadowUrl: '',

  iconSize: [14, 14], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [7, 7], // point of the icon which will correspond to marker's location
  popupAnchor: [-0, -0] // point from which the popup should open relative to the iconAnchor
});