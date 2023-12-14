
function createLayer(layerName, layerPath) {
    const link = `https://raw.githubusercontent.com/odpiobservatorio/odpiobservatorio.github.io/main/GIS${layerPath}`;
    return load(link).then(data => {
        window[layerName] = data;
    });
}

function load(link) {
    //Llama el archivo y lo regresa como objeto json
    return fetch(link)
        .then(response => response.json())
        .then(data => {
            return data;
        }).catch(error => {
            console.log(error);
            throw error;
        });
}


// Declarar un objeto que contenga los nombres de las variables y sus rutas de archivo
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

const layerPromises = [];
for (const layerName in layersToLoad) {
    layerPromises.push(createLayer(layerName, layersToLoad[layerName]));
}

//Carga todos los archivos
Promise.all(layerPromises)
    .then(() => console.log("Capas cargadas con exito!"))
    .catch(error => {
        console.error('Error al cargar las capas:', error);
    });
