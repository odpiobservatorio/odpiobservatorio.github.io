
// Cargar informacion de la base de datos de registros
function loadDataBase(id, hoja, query = "Select *") {
    //Carga base de datos de google sheets y la convierte a una lista

    //let query = "Select A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W, AK, AN"
    return fetch(`https://docs.google.com/spreadsheets/d/${id}/gviz/tq?&sheet=${hoja}&tq=${encodeURIComponent(query)}`)
        .then(response => response.text())
        .then(text => {
            //Cargar Datos
            const rawdata = text.slice(47, -2);
            const data = ((JSON.parse(rawdata)).table);

            //Titulos de columnas y Obtener columnas
            const cols = (data.cols);
            const Keys = cols.map(col => col.label);
            const rows = data.rows;

            //Regresar Objeto (Diccionario Json)
            const Objeto = [];
            for (const row of rows) {
                const raw = (row.c)
                const rowinfo = raw.map(dic => (dic && dic.v) ? dic.v : "No registra");
                const caso = Object.fromEntries(Keys.map((key, i) => [key, rowinfo[i]]));
                Objeto.push(caso)
            }
            return Objeto
        })
}

// Datos principales
let DataPrincipal;
loadDataBase("1ZhaiG1Fz3NUrlQpQtNhH8lgNUpQ97ETqnhaKFNmrTrg", "EVENTOS").then(objeto => {
    DataPrincipal = [...objeto].sort((a, b) => a.Year - b.Year);
})

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


// Cargar datos de capas
function fetchLayer(layerName, layerPath) {
    const link = `https://raw.githubusercontent.com/odpiobservatorio/odpiobservatorio.github.io/main/GIS${layerPath}`;

    fetch(link, {
        cache: "force-cache"
    }).then(response => response.json())
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
