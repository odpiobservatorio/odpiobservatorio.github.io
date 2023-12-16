function getColor(color = false) {
    //Retorna -- un solo color si no se da argumentos -- o un array de colores del tamaño q le especifiquemos 
    if (color) {
        const colors = []
        for (let i = 0; i < color; i++) {
            let color = "#";
            for (let i = 0; i < 6; i++) {
                color = color + ("0123456789ABCDEF")[Math.floor(Math.random() * 16)];
            }
            colors.push(color)
        }
        return colors
    } else {
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color = color + ("0123456789ABCDEF")[Math.floor(Math.random() * 16)];
        }
        return color
    }
}

function showPivotArea() {
    const activar = document.getElementById("map");

    if (activar.hidden) {
        document.getElementById("map").hidden = false;
        document.getElementById("headerMap").hidden = false;
        document.getElementById("pivot").hidden = true;
    } else {
        document.getElementById("map").hidden = true;
        document.getElementById("headerMap").hidden = true;
        document.getElementById("pivot").hidden = false;
    }

    //TablaReportII()
    PivotElementos()
}


function crearEncabezados(valueKey) {
    const encabezados = document.createElement("tr");

    for (const titulo of [valueKey, "Cantidad"]) {
        const encabezado = document.createElement("td");
        encabezado.textContent = titulo;
        encabezados.appendChild(encabezado);
    }

    return encabezados;
}


function PivotElementos() {
    //Para no crear los elementos cada vez q se ejecuta los agregue a el html

    const valueKey = document.getElementById("lstPivot").value; //El tipo/clave por el cual se va a generar todo

    const tablaHeader = document.getElementById("tablaHeader");
    tablaHeader.innerHTML = ""; //Elimina elementos si ya habia antes
    //Agregamos los encabezados
    tablaHeader.appendChild(crearEncabezados(valueKey)); //genera los encabezados y los agrega
    //tabla.appendChild(tablaHeader);

    const tablaBody = document.getElementById("tablaBody");
    tablaBody.innerHTML = "";

    const conteos = {}; //Diccionario con etiqutas y sus respectivos contadores
    etiquetas = []; //Variable Global, una lista de las etiquetas, ejem: [2018, 2019, 2020]
    valores = []; //Variable Global, lista con los conteos, ejem: [10, 23, 15]

    (bigData.DataToReport).forEach(registro => {
        conteos[registro[valueKey]] = (conteos[registro[valueKey]] || 0) + 1; //Revisa en todos los datos y cuenta cuantas veces aparece una "etiqueta"
    });

    for (const [etiqueta, contador] of Object.entries(conteos)) { //Agrega los datos a la tabla y ademas guarda los valores de las etiquetas y sus conteos (Ademas las etiquetas estan ordenadas)
        etiquetas.push(etiqueta);
        valores.push(contador);

        const fila = document.createElement("tr");

        const nombre = document.createElement("td");
        nombre.textContent = etiqueta;

        const valor = document.createElement("td");
        valor.textContent = contador;

        fila.appendChild(nombre);
        fila.appendChild(valor);
        tablaBody.appendChild(fila);
    }

    //tabla.appendChild(tablaBody);
    CreaGrafica();
}


function CreaGrafica() {
    document.getElementById("grafica").remove();

    const newCanvas = document.createElement("canvas");
    newCanvas.id = "grafica"
    document.getElementById("DivGraficos").appendChild(newCanvas);

    const data = {
        labels: etiquetas, //Toma la variable global
        datasets: [{
            label: document.getElementById("lstPivot").value,
            backgroundColor: getColor(etiquetas.length), //Toma un array de colores del tamaño q le especifiquemos
            borderColor: 'rgb(255, 99, 132)',
            data: valores, //Toma la variable global
        }]
    };

    const config = {
        type: document.getElementById("lstGrafico").value, //Tipo de grafica
        data: data,
        options: {
            indexAxis: "x",
        }
    };

    ChartPrincipal = new Chart(
        document.getElementById('grafica'),
        config
    );
}