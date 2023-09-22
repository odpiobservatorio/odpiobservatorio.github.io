function quitarTildes(cadena) {
    return cadena.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function getDeps() {
    const conteos = {};
    for (const registro of DataPrincipal) {
        const elemento = (quitarTildes(registro.Departamento).toUpperCase());
        conteos[elemento] = (conteos[elemento] || 0) + 1;
    }

    const depsCopy = Object.assign({}, capaDepartamentos)

    for (const feature of depsCopy.features) {
        const dep = (feature.properties.NOMBRE_DPT)
        const valor = conteos[dep]
    
        if (valor) {
            feature.properties["Casos"] = valor;
        } else {
            feature.properties["Casos"] = 1;
        }
    }
    return depsCopy
}


function colorMap(v) {
    const d = (1000/771) * v;
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}


function final() {
    const x = new L.geoJson(getDeps(), {style: (feature) => {
        return {
            fillColor: colorMap(feature.properties.Casos),
            weight: 2,
            opacity: 1,
            color: 'white',
            //dashArray: '3',
            fillOpacity: 0.75
        }
    } }).addTo(map);    
}