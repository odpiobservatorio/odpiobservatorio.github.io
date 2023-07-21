//Variable que filtra las capas GeoJson si está activa
///filtra por departamento
let Datafilter = 0;

//*****************************************************
//Funciones que muestran capas separadas
//*****************************************************

function mostrarCroquis() {
  let Valor = document.getElementById("LayerPlano").checked;

  if (Valor == true) {
    capaPlana = new L.geoJSON(LayerPlano, {
      style: {
        color: "#76D7C4",
        weight: 0,
        fillColor: "#76D7C4",
        fillOpacity: 5,
        icon: greenIcon
      }
    }).bindPopup(function (layer) {
      return layer.feature.properties.categoria
    }).addTo(map);


  } else {
    map.removeLayer(capaPlana)

  }

}

function mostrarResguardos() {
  let Valor = document.getElementById("LayerResguardos").checked;



  if (Valor == true) {
    capaResguardo = new L.geoJSON(resguardos,
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
    ).bindPopup(function (layer) {
      return layer.feature.properties.NOMBRE_RESGUARDO_INDIGENA + " ETNIA:" + layer.feature.properties.PUEBLO
    }).addTo(map);


  } else {
    map.removeLayer(capaResguardo)

  }




}
function mostrarDepartamentos() {
  let Valor = document.getElementById("LayerDepartamentos").checked;



  if (Valor == true) {
    Departamentos = new L.geoJSON(capaDepartamentos,
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
            return feature.properties.NOMBRE_DPT == "CESAR" || feature.properties.NOMBRE_DPT == "CHOCÓ" ;
          }
          else {
            return feature.properties;
          };
        }
      }
    ).bindPopup(function (layer) {
      return "Nombre: " + layer.feature.properties.NOMBRE_DPT
    }).addTo(map);


  } else {
    map.removeLayer(Departamentos)

  }




}

function mostrarRutaMigrantes() {
  let Valor = document.getElementById("LayerRutaMigrantes").checked;
  if (Valor == true) {
    Migrantes = new L.geoJSON(capaRutaMigrantes, {
      style: {
        color: "red",
        weight: 5,
        fillColor: "#873600",
        fillOpacity: 0.5
      }

    }).bindPopup(function (layer) {
      return layer.feature.properties.TIPO;
    }).addTo(map);

  } else {
    map.removeLayer(Migrantes)
  }

}

function MostrarNarcotrafico() {
  let Valor = document.getElementById("LayerNarcotrafico").checked;
  if (Valor == true) {
    Narcotrafico = new L.geoJSON(capaPuntosNarcotrafico, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: pNegroN });
      }
    }).bindPopup(function (layer) {
      return "Nombre: " + layer.feature.properties.Nombre + ", Lugar:"
        + layer.feature.properties.NMunicipio;
    }).addTo(map);


  } else {
    map.removeLayer(Narcotrafico)
  }
}
function MostrarContrabando() {
  let Valor = document.getElementById("LayerContrabando").checked;
  if (Valor == true) {
    Contrabando = new L.geoJSON(capaContrabando, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: pAzulC });
      }
    }).bindPopup(function (layer) {
      return "Tipo: " + layer.feature.properties.CONTRABAND + ", Lugar:"
        + layer.feature.properties.NOM_CPOB;
    }).addTo(map);


  } else {
    map.removeLayer(Contrabando)
  }
}

function mostrarDensidadCoca() {

  let Valor = document.getElementById("LayerDensidadCoca").checked;
  if (Valor == true) {
    capaCoca = new L.geoJSON(densidadCoca, {
      style: {
        color: "#B7950B",
        pointToLayer: { icon: greenIcon },
        weight: 1,
        fillColor: "#B7950B",
        fillOpacity: 0.5
      }
    }).bindPopup(function (layer) {
      return "Área " + layer.feature.properties.areacoca;
    }).addTo(map);

  } else {
    map.removeLayer(capaCoca)
  }
}

function mostrarRutaFluvialIlegal() {
  let Valor = document.getElementById("LayerFluvialIlegal").checked;
  if (Valor == true) {
    FluvialIlegal = new L.geoJSON(capaFluvialIlegal, {
      style: {
        color: "black",
        weight: 4,
        fillColor: "#873600",
        fillOpacity: 0.5
      }

    }).bindPopup(function (layer) {
      return "Nombre: " + layer.feature.properties.NOM_RIO + ", Tipo:"
        + layer.feature.properties.TIPO_RUTA +
        ", Descripción:" + layer.feature.properties.DESCRIP;
    }).addTo(map);

  } else {
    map.removeLayer(FluvialIlegal)
  }

}

function mostrarRutaArmas() {
  let Valor = document.getElementById("LayerRutaArmas").checked;
  if (Valor == true) {
    Armas = new L.geoJSON(capaRutaArmas, {
      style: {
        color: "purple",
        weight: 4,
        fillColor: "#873600",
        fillOpacity: 0.5
      }

    }).bindPopup(function (layer) {
      return "Nombre: " + layer.feature.properties.NOMBRE + ", Tipo:"
        + layer.feature.properties.TIPO +
        ", Ruta:" + layer.feature.properties.RUTA;
    }).addTo(map);

  } else {
    map.removeLayer(Armas)
  }

}

function mostrarMunPdet() {

  let Valor = document.getElementById("LayerPdet").checked;
  if (Valor == true) {
    capaPdet = new L.geoJSON(cpaPdet, {
      style: {
        color: "white",
        pointToLayer: { icon: greenIcon },
        weight: 1,
        fillColor: "#873600",
        fillOpacity: 0.5
      }
    }).bindPopup(function (layer) {
      return layer.feature.properties.MpNombre;
    }).addTo(map);

  } else {
    map.removeLayer(capaPdet)
  }
}

function mostrarAmbiental() {
  let Valor = document.getElementById("LayerAmbiental").checked;
  if (Valor == true) {
    capaAmbiental = new L.geoJSON(ambiental, {
      style: {
        color: "white",
        weight: 1,
        fillColor: "red",
        fillOpacity: 0.5
      }
    }).bindPopup(function (layer) {
      return layer.feature.properties.nombre + ", Categoría:" + layer.feature.properties.organizaci + "Org:" + layer.feature.properties.categoria
    }).addTo(map);


  } else {
    map.removeLayer(capaAmbiental)

  }
}
//Variable que guarda el layer MAP
function mostrarTitulos() {

  let Valor = document.getElementById("LayerTitulos").checked;
  if (Valor == true) {
    capaTitulos = new L.geoJSON(TitulosMineros, {
      style: {
        color: "white",
        weight: 0,
        fillColor: "#212F3D",
        fillOpacity: 1
      }
    }).bindPopup(function (layer) {
      return "Estado:" + layer.feature.properties.TITULO_EST
        + ", Minerales: " + layer.feature.properties.MINERALES
        + ", Etapa:" + layer.feature.properties.ETAPA
        + ", Contrato" + layer.feature.properties.MODALIDAD;
    }).addTo(map);


  } else {
    map.removeLayer(capaTitulos)
  }
  capaTitulos.eachLayer




}
function mostrarBloquePetrolero() {
  let Valor = document.getElementById("LayerBloquePretrolero").checked;
  if (Valor == true) {
    bPetrolero = new L.geoJSON(CapaBloquePetrolero, {
      style: {
        color: "white",
        weight: 1,
        fillColor: "pink",
        fillOpacity: 0.5
      }

    }).bindPopup(function (layer) {
      return "Tipo:" + layer.feature.properties.TIPO_CONTR
        + ", Operador:" + layer.feature.properties.TIPO_CONTR
        + ", Estado" + layer.feature.properties.ESTAD_AREA;
    }).addTo(map);

  } else {
    map.removeLayer(bPetrolero)
  }

}
function mostrarReservas() {
  let Valor = document.getElementById("LayerReservas").checked;
  if (Valor == true) {
    capaReserva = new L.geoJSON(reservasCap, {
      style: {

        color: "orange",
        fillColor: "orange",
        fillOpacity: 3

      }
    }).bindPopup(function (layer) {
      return layer.feature.properties.NOMBRE_ZONA_RESERVA_CAMPESINA
    }).addTo(map);

  } else {
    map.removeLayer(capaReserva)
  }
}

function mostrarPozos() {

  let Valor = document.getElementById("LayerPozos").checked;
  if (Valor == true) {
    capaPozos = new L.geoJSON(PozosPretoleros, {
      style: {
        color: "#5DADE2",
        fillColor: "#5DADE2",
        fillOpacity: 3
      }
    }).bindPopup(function (layer) {
      return layer.feature.properties.Name;
    }).addTo(map);


  } else {
    map.removeLayer(capaPozos)
  }
}
function mostrarFondo() {
  let Valor = document.getElementById("LayerFondo").checked;
  if (Valor == true) {

    capaFondo = new L.geoJSON(FondoLayer, {
      style: {
        color: "white",
        weight: 0,
        fillColor: "white",
        fillOpacity: 1.2
      }
    }).bindPopup(function (layer) {
    }).addTo(map);

  } else {
    map.removeLayer(capaFondo)
  }
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
let TextoLabel = ""
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
  let Valor = document.getElementById("LayerEtiquetas").checked;
  if (Valor == "0") {
    ActiveLabels = "0"

  } else {
    ActiveLabels = "1"
  }

}
function InserTAg(num) {
  let textarea = document.getElementById("txValorEtiqueta")
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


