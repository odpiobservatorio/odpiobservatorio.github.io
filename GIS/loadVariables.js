//Definir funcion de carga
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

//Declarar variables
let CapaBloquePetrolero;
let LayerPlano;
let capaDepartamentos;
let FondoLayer;
let cpaPdet;
let PozosPretoleros;
let reservasCap;
let resguardos;
let TitulosMineros;
let densidadCoca;
let capaFluvialIlegal;
let capaRutaArmas;
let capaContrabando;
let capaPuntosNarcotrafico;
let capaRutaMigrantes;


//Cargar las variables de cada base de datos (Luego se puede cambiar a algo mas eficiente)
//Layers
load('./layers/BloquePetrolero.json').then(data => { CapaBloquePetrolero = data });
load('./layers/Croquis.json').then(data => { LayerPlano = data });
load('./layers/Departamentos.json').then(data => { capaDepartamentos = data });
load('./layers/Fondo.json').then(data => { FondoLayer = data });
load('./layers/MunicipiosPDET.json').then(data => { cpaPdet = data });
load('./layers/PozosPet.json').then(data => { PozosPretoleros = data });
load('./layers/ReservasCap.json').then(data => { reservasCap = data });
load('./layers/Resguardos.json').then(data => { resguardos = data });
load('./layers/TitulosMin.json').then(data => { TitulosMineros = data });

//ECOIlegal
load("./layers/ECOIlegal/desidadCoca.json").then(data => { densidadCoca = data });
load("./layers/ECOIlegal/FluvilesIlegal.json").then(data => { capaFluvialIlegal = data });
load("./layers/ECOIlegal/IngArmas.json").then(data => { capaRutaArmas = data });
load("./layers/ECOIlegal/PuntosContrabando.json").then(data => { capaContrabando = data });
load("./layers/ECOIlegal/PuntosNarcotrafico.json").then(data => { capaPuntosNarcotrafico = data });
load("./layers/ECOIlegal/RutaMigrantes.json").then(data => { capaRutaMigrantes = data });

/*
let DataPrincipal;
load("../data/DataPrincipal.json").then(data => { DataPrincipal = data });
*/

let DataPrincipal;
loadDataBase("1zqI2xhjm3ZxEIr31zkDaDg8_wfCVSBlKgHE2Em6zd0Y", "EVENTOS").then(objeto => {
    DataPrincipal = objeto;
})


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