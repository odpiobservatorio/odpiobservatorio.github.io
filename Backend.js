
const call = {
    "load": (request) => {
        const id = "1ZhaiG1Fz3NUrlQpQtNhH8lgNUpQ97ETqnhaKFNmrTrg";
        const hoja = "EVENTOS";
        const query = "Select *";
        //let query = "Select A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W, AK, AN"

        const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?&sheet=${hoja}&tq=${encodeURIComponent(query)}`
        
        const response = UrlFetchApp.fetch(url);
        const text = response.getContentText();

        
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
        return JSON.stringify(Objeto);
    },

    "ping": (request) => {
        return "Pong";
    }
}

function doGet(query) {
    const request = (query.parameter);
    try {
        return ContentService.createTextOutput(call[request.type](request));
    } catch (error) {
        return ContentService.createTextOutput("404");
    }
}


/*function loadDataBase(id, hoja, query = "Select *") {
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
*/