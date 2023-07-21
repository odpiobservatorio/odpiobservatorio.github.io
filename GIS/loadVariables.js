//Definir funcion de carga
async function load(path) {
    try {
        const response = await fetch(path);
        return await response.json();
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}

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
(async () => { 
    //Layers
    CapaBloquePetrolero = await load('./layers/BloquePetrolero.json');
    LayerPlano = await load('./layers/Croquis.json');
    capaDepartamentos = await load('./layers/Departamentos.json');
    FondoLayer = await load('./layers/Fondo.json');
    cpaPdet = await load('./layers/MunicipiosPDET.json');
    PozosPretoleros = await load('./layers/PozosPet.json');
    reservasCap = await load('./layers/ReservasCap.json');
    resguardos = await load('./layers/Resguardos.json');
    TitulosMineros = await load('./layers/TitulosMin.json');   
    
    //ECOIlegal
    densidadCoca = await load("./layers/ECOIlegal/desidadCoca.json");
    capaFluvialIlegal = await load("./layers/ECOIlegal/FluvilesIlegal.json");
    capaRutaArmas = await load("./layers/ECOIlegal/IngArmas.json");
    capaContrabando = await load("./layers/ECOIlegal/PuntosContrabando.json");
    capaPuntosNarcotrafico = await load("./layers/ECOIlegal/PuntosNarcotrafico.json");
    capaRutaMigrantes = await load("./layers/ECOIlegal/RutaMigrantes.json");
})();

//Los archivos en los que se dividio la informacion ambiental inicializan 3 variables q tienen informacion en formato de string
//luego se concadenan en la variable ambiental y se convierten en el objeto con toda la informacion
//Hace lo mismo que tener el archivo gigante, pero se dividio la informacion por el uso del servidor
let ambiental = JSON.parse(("{" + data1 + data2 +  data3 + "}"));

















