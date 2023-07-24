/*
query = "Select *"
&tq=${encodeURIComponent(query)}
*/

function loadDataBase(id, hoja) {
    
    //Convierte base de datos de Google Sheets a Objeto trabajable
    return fetch(`https://docs.google.com/spreadsheets/d/${id}/gviz/tq?&sheet=${hoja}`)
        .then(response => response.text())
        .then(text => {
            //Cargar Datos
            const rawdata = text.slice(47, -2);
            const data = ((JSON.parse(rawdata)).table);

            //Titulos de columnas y Obtener columnas
            const cols = (data.cols);
            let Keys = cols.map(col => col.label);
            const rows = data.rows;

            //Regresar Objeto (Diccionario Json)
            let Objeto = [];
            for (const row of rows) {
                let raw = (row.c)            
                let rowinfo = raw.map(dic => dic.v);
                const caso = Object.fromEntries(Keys.map((key, i) => [key, rowinfo[i]]));
                Objeto.push(caso)
            }
            return Objeto
        })
}