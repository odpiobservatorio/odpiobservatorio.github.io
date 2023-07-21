//Definir funcion de carga
function load(path) {
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