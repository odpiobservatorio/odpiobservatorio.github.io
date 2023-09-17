/*
function makeRequest(json) {
    const apiUrl = "https://script.google.com/macros/s/AKfycbzyE0XUcMKezgmSLv7ux9xPAyiq1pf8OYiFD4kTEkjX6C3SKNKkENpYsM2g0ejE9CYP/exec";
    return fetch(`${apiUrl}?${Object.entries(json).map((query) => `${query[0]}=${encodeURIComponent(query[1])}`).join("&")}`, { method: "GET" })
        .then((response) => response.text())
        .then((data) => {
            return data
        });
}

makeRequest({ type: "load" }).then(response => {
    DataPrincipal = JSON.parse(response);
})
*/
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

let DataPrincipal;
loadDataBase("1ZhaiG1Fz3NUrlQpQtNhH8lgNUpQ97ETqnhaKFNmrTrg", "EVENTOS").then(objeto => {
    DataPrincipal = objeto;
})