const DATA = {};

// Crear formulario
(async () => {
    // Cargar datos geograficos
    await loadData();
    
    
})();

async function loadData() {
    // Cargar datos de municipios y departamentos
    DATA.GeoData = (await (await fetch("https://www.datos.gov.co/resource/95qx-tzs7.json")).json());
}