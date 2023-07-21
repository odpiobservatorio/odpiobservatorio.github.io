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

//Cargar las variables de cada base de datos (Luego se puede cambiar a algo mas eficiente)
(async () => { 
    //Layers
    let CapaBloquePetrolero = await load('./layers/BloquePetrolero.json');
    let LayerPlano = await load('./layers/Croquis.json');
    let capaDepartamentos = await load('./layers/Departamentos.json');
    let FondoLayer = await load('./layers/Fondo.json');
    let cpaPdet = await load('./layers/MunicipiosPDET.json');
    let PozosPretoleros = await load('./layers/PozosPet.json');
    let reservasCap = await load('./layers/ReservasCap.json');
    let resguardos = await load('./layers/Resguardos.json');
    let TitulosMineros = await load('./layers/TitulosMin.json');   
    
    //ECOIlegal
    let densidadCoca = await load("./layers/ECOIlegal/desidadCoca.json");
    let capaFluvialIlegal= await load("./layers/ECOIlegal/FluvilesIlegal.json");
    let capaRutaArmas = await load("./layers/ECOIlegal/IngArmas.json");
    let capaContrabando = await load("./layers/ECOIlegal/PuntosContrabando.json");
    let capaPuntosNarcotrafico = await load("./layers/ECOIlegal/PuntosNarcotrafico.json");
    let capaRutaMigrantes = await load("./layers/ECOIlegal/RutaMigrantes.json");
})();

//Los archivos en los que se dividio la informacion ambiental inicializan 3 variables q tienen informacion en formato de string
//luego se concadenan en la variable ambiental y se convierten en el objeto con toda la informacion
//Hace lo mismo que tener el archivo gigante, pero se dividio la informacion por el uso del servidor
let ambiental = JSON.parse(("{" + data1 + data2 +  data3 + "}"));

















