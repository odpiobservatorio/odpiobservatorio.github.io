function dispatchTextEffect(element) {
    let interval = null;
    const letters = "+.0123456789";

    const text = element.innerText;

    let iteration = 0;
    clearInterval(interval);
    interval = setInterval(() => {
        element.innerText = element.innerText
            .split("")
            .map((letter, index) => {
                if (index < iteration) {
                    return text[index];
                }

                return letters[Math.floor(Math.random() * 10)]
            })
            .join("");

        if (iteration >= text.length) {
            clearInterval(interval);
        }

        iteration += 1 / 3;
    }, 30);
}


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

loadDataBase("1ZhaiG1Fz3NUrlQpQtNhH8lgNUpQ97ETqnhaKFNmrTrg", "COUNTER").then(data => {
    const casos = data[0].casos;
    const afectados = data[0].afectados;
    document.getElementById("counter-casos").innerText = `+${casos.toLocaleString('de-DE')}`;
    document.getElementById("counter-afectados").innerText = `+${afectados.toLocaleString('de-DE')}`;
})
