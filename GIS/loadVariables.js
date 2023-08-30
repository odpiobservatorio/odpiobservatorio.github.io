
function createLayer(layerName, layerPath) {
    return load(layerPath).then(data => {
        window[layerName] = data;
    });
}

function load(path) {
    //Llama el archivo y lo regresa como objeto json
    return fetch(path)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.log(error);
            throw error;
        });
}


// Declarar un objeto que contenga los nombres de las variables y sus rutas de archivo
const layersToLoad = {
    CapaBloquePetrolero: './layers/BloquePetrolero.json',
    LayerPlano: './layers/Croquis.json',
    capaDepartamentos: './layers/Departamentos.json',
    FondoLayer: './layers/Fondo.json',
    cpaPdet: './layers/MunicipiosPDET.json',
    PozosPretoleros: './layers/PozosPet.json',
    reservasCap: './layers/ReservasCap.json',
    resguardos: './layers/Resguardos.json',
    TitulosMineros: './layers/TitulosMin.json',

    densidadCoca: './layers/ECOIlegal/desidadCoca.json',
    capaFluvialIlegal: './layers/ECOIlegal/FluvilesIlegal.json',
    capaRutaArmas: './layers/ECOIlegal/IngArmas.json',
    capaContrabando: './layers/ECOIlegal/PuntosContrabando.json',
    capaPuntosNarcotrafico: './layers/ECOIlegal/PuntosNarcotrafico.json',
    capaRutaMigrantes: './layers/ECOIlegal/RutaMigrantes.json',
};

const layerPromises = [];
for (const layerName in layersToLoad) {
    layerPromises.push(createLayer(layerName, layersToLoad[layerName]));
}

//Carga todos los archivos
Promise.all(layerPromises)
    .then(() => {})
    .catch(error => {
        console.error('Error al cargar las capas:', error);
    });



/*
//Futuras Bases de datos online
let DBs = {
    "BloquePetrolero": "",
    "Croquis": "",
    "Departamentos": "",
    "Fondo": "",
    "MunicipiosPDET": "",
    "PozosPet": "",
    "ReservasCap": "",
    "Resguardos": "",
    "TitulosMin": "",
    "desidadCoca": "",
    "FluvilesIlegal": "",
    "IngArmas": "",
    "PuntosContrabando": "",
    "PuntosNarcotrafico": "",
    "RutaMigrantes": "",
}
let id = "1zqI2xhjm3ZxEIr31zkDaDg8_wfCVSBlKgHE2Em6zd0Y";
loadDataBase(id, DBs['BloquePetrolero']).then( Objeto => { CapaBloquePetrolero =  Objeto });
loadDataBase(id, DBs['Croquis']).then( Objeto => { LayerPlano =  Objeto });
loadDataBase(id, DBs['Departamentos']).then( Objeto => { capaDepartamentos =  Objeto });
loadDataBase(id, DBs['Fondo']).then( Objeto => { FondoLayer =  Objeto });
loadDataBase(id, DBs['MunicipiosPDET']).then( Objeto => { cpaPdet =  Objeto });
loadDataBase(id, DBs['PozosPet']).then( Objeto => { PozosPretoleros =  Objeto });
loadDataBase(id, DBs['ReservasCap']).then( Objeto => { reservasCap =  Objeto });
loadDataBase(id, DBs['Resguardos']).then( Objeto => { resguardos =  Objeto });
loadDataBase(id, DBs['TitulosMin']).then( Objeto => { TitulosMineros =  Objeto });
//ECOIlegal
loadDataBase(id, DBs["desidadCoca"]).then( Objeto => { densidadCoca =  Objeto });
loadDataBase(id, DBs["FluvilesIlegal"]).then( Objeto => { capaFluvialIlegal =  Objeto });
loadDataBase(id, DBs["IngArmas"]).then( Objeto => { capaRutaArmas =  Objeto });
loadDataBase(id, DBs["PuntosContrabando"]).then( Objeto => { capaContrabando =  Objeto });
loadDataBase(id, DBs["PuntosNarcotrafico"]).then( Objeto => { capaPuntosNarcotrafico =  Objeto });
loadDataBase(id, DBs["RutaMigrantes"]).then( Objeto => { capaRutaMigrantes =  Objeto });
*/
