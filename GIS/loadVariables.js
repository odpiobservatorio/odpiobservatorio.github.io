function fetchLayer(layerName, layerPath) {
    const link = `https://raw.githubusercontent.com/odpiobservatorio/odpiobservatorio.github.io/main/GIS${layerPath}`;

    fetch(link).then(response => response.json())
        .then(data => {
            window[layerName] = data;
        }).catch(error => {
            console.log(error);
        });
}

const layersToLoad = {
    CapaBloquePetrolero: '/layers/BloquePetrolero.json',
    LayerPlano: '/layers/Croquis.json',
    capaDepartamentos: '/layers/Departamentos.json',
    FondoLayer: '/layers/Fondo.json',
    cpaPdet: '/layers/MunicipiosPDET.json',
    PozosPretoleros: '/layers/PozosPet.json',
    reservasCap: '/layers/ReservasCap.json',
    resguardos: '/layers/Resguardos.json',
    TitulosMineros: '/layers/TitulosMin.json',

    densidadCoca: '/layers/ECOIlegal/desidadCoca.json',
    capaFluvialIlegal: '/layers/ECOIlegal/FluvilesIlegal.json',
    capaRutaArmas: '/layers/ECOIlegal/IngArmas.json',
    capaContrabando: '/layers/ECOIlegal/PuntosContrabando.json',
    capaPuntosNarcotrafico: '/layers/ECOIlegal/PuntosNarcotrafico.json',
    capaRutaMigrantes: '/layers/ECOIlegal/RutaMigrantes.json',
};


for (const layerName in layersToLoad) {
    fetchLayer(layerName, layersToLoad[layerName]);
}

// Cargar infoambiente
function fetchAmbiente() {
    const names = ["datapart1", "datapart2", "datapart3"]
    return names.map(nombre => {
        return fetch(
            `https://raw.githubusercontent.com/odpiobservatorio/odpiobservatorio.github.io/main/GIS/layers/${nombre}`
        ).then(response => response.text())
    });
}

Promise.all(fetchAmbiente()).then(res => {
    window["ambiental"] = JSON.parse(`{ ${(res[0] + res[1] + res[2])} }`);
})