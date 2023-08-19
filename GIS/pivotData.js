function getColor(color = false) {
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
    const activar = document.getElementById("map").hidden;

    if (activar == false) {
        document.getElementById("map").hidden = true;
        document.getElementById("headerMap").hidden = true;
        document.getElementById("pivot").hidden = false;
    }
    else {
        document.getElementById("map").hidden = false;
        document.getElementById("headerMap").hidden = false;
        document.getElementById("pivot").hidden = true;
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
    const valueKey = document.getElementById("lstPivot").value;
    
    const tablaHeader = document.getElementById("tablaHeader");
    tablaHeader.innerHTML = "";
    //Agregamos los encabezados
    tablaHeader.appendChild(crearEncabezados(valueKey));
    //tabla.appendChild(tablaHeader);

    const tablaBody = document.getElementById("tablaBody");
    tablaBody.innerHTML = "";

    const conteos = {};
    etiquetas = []; //Global
    valores = []; //Global

    for (const registro of DataToReport) {
        conteos[registro[valueKey]] = (conteos[registro[valueKey]] || 0) + 1;
    }

    for (const [etiqueta, contador] of Object.entries(conteos)) {
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
    CreaGrafica(etiquetas, valores);
}


function CreaGrafica() {
    document.getElementById("grafica").remove();
    
    const newCanvas = document.createElement("canvas");
    newCanvas.id = "grafica"
    document.getElementById("DivGraficos").appendChild(newCanvas);

    const data = {
        labels: etiquetas,
        datasets: [{
            label: document.getElementById("lstPivot").value,
            backgroundColor: getColor(etiquetas.length),
            borderColor: 'rgb(255, 99, 132)',
            data: valores,
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