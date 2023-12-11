// Configuracion de constantes globales
const CONFIG = {
}

function sheetsQuery(hoja, id, query = "Select *") {
    return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?&sheet=${hoja}&tq=${encodeURIComponent(query)}`
}

function makeRequest(json, url) {
    const queryUrl = `${url}?${Object.entries(json).map(
        query => `${query[0]}=${encodeURIComponent(query[1])}`
    ).join("&")}`;

    return fetch(queryUrl, { method: "GET" }).then(
        response => response.text()
    ).then(data => data);
}

function loadRows(hoja, id, query = "Select *") {
    //Carga una hoja de calculo de google sheets y regresa un array de objetos, que representan cada fila
    return fetch(sheetsQuery(hoja, id, query))
        .then(response => response.text())
        .then(text => {
            //Cargar Datos
            const rawdata = text.slice(47, -2);
            const data = ((JSON.parse(rawdata)).table);

            //Titulos de columnas y Obtener columnas
            const Keys = (data.rows[0].c).map(c => c.v);
            const rows = data.rows;

            //Regresar Objeto (Diccionario Json)
            const Objeto = [];
            for (const row of rows) {
                const raw = (row.c)
                const rowinfo = raw.map(dic => (dic && dic.v) ? dic.v : "Nn");
                const caso = Object.fromEntries(Keys.map((key, i) => [key, rowinfo[i]]));
                Objeto.push(caso)
            }
            return Objeto
        })
}

function loadObject(hoja, id, query = "Select *") {
    //Carga cada fila con una Key asociada a sus valores
    return fetch(sheetsQuery(hoja, id, query))
        .then((response) => response.text())
        .then((text) => {
            //Cargar Datos
            const data = ((JSON.parse(text.slice(47, -2))).table);

            //Titulos de columnas y Obtener columnas
            const cols = (data.cols);
            const Keys = cols.map(col => col.label).slice(1);
            const rows = data.rows;

            const Objeto = {};
            for (const row of rows) {
                const raw = row.c;
                const rowinfo = raw.map((dic) => (dic && dic.v ? dic.v : "Nn"));
                //Key - Info (Object)
                Objeto[rowinfo[0]] = Object.fromEntries(Keys.map((key, i) => [key, rowinfo[i + 1]]));
            }
            return Objeto;
        });
}

function addOptions(data, targetID) {
    // Agregar opciones a un elemento select
    const selectElement = document.getElementById(targetID);
    data.forEach(value => {
        const option = document.createElement('option');
        option.text = value;
        option.value = value;
        selectElement.add(option);
    });
}
