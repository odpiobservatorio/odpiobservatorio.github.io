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

//Cargar las variables de cada base de datos
(async () => {
    let CapaBloquePetrolero = await load('./layers/BloquePetrolero.json');
    let LayerPlano = await load('./layers/Croquis.json');
    let capaDepartamentos = await load('./layers/Departamentos.json');
    let FondoLayer = await load('./layers/Fondo.json');
    let cpaPdet = await load('./layers/MunicipiosPDET.json');
    let PozosPretoleros = await load('./layers/PozosPet.json');
    let reservasCap = await load('./layers/ReservasCap.json');
    let resguardos = await load('./layers/Resguardos.json');
    let TitulosMineros = await load('./layers/TitulosMin.json');    
})();













