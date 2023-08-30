let ChartPrincipal;

//Retorna -- un solo color si no se da argumentos -- o un array de colores del tamaño q le especifiquemos 
function getColor(color = false) {
    if (color) {
        //Si se le dice cuantos colores, regresa una lista de colores
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
        //Si no se le da ningun parametro a la funcion, regresa un solo color
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color = color + ("0123456789ABCDEF")[Math.floor(Math.random() * 16)];
        }
        return color
    }
}


function countTipo(Key, tagsOrdenadas) {
    
    const conteos = {};
    for (const registro of DataPrincipal) {
        const elemento = registro[Key];
        conteos[elemento] = (conteos[elemento] || 0) + 1;
    }
    return tagsOrdenadas.map(elemento => conteos[elemento] || 0);
}

function elementosUnicos(Key) {
    const colors = [];
    const elementosUnicosSet = new Set();
    //Hace una lista sin repeticiones del tipo q se pida
    //por ejem lista de los Departamentos
    for (const registro of DataPrincipal) {
        if (!elementosUnicosSet.has(registro[Key])) {
            elementosUnicosSet.add(registro[Key]);
            colors.push(getColor());
        }
    }
    return [(Array.from(elementosUnicosSet)).sort((a,b) => a - b), colors];
}


function addElements(tipo) {
    document.getElementById("tlGrafico").textContent = `Consolidado por ${tipo}`;

    const elemento = document.getElementById("grafica")
    elemento.remove();

    const newCanvas = document.createElement("canvas");
    newCanvas.id = "grafica"

    document.getElementById("DivGraficos").appendChild(newCanvas);
}

function AddGraph(Key, label, axis) {       
    addElements(label);
    //Etiquetas Unicas ordenadas
    const [tagsOrdenadas, colors] = elementosUnicos(Key);
    //Inicio la busqueda por Clave y cuento totales por año
    const Conteos = countTipo(Key, tagsOrdenadas);
    //Configurar etiquetas y datos
    const data = {
        labels: tagsOrdenadas,
        datasets: [{
            label: label,
            backgroundColor: colors,
            borderColor: 'rgb(255, 99, 132)',
            data: Conteos,
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            indexAxis: axis,
        }
    };
    ChartPrincipal = new Chart(
        document.getElementById('grafica'),
        config
    );
}

function añadirGrafico(element) {
    AddGraph(
        element.getAttribute("id"),
        element.getAttribute("label"),
        element.getAttribute("axis")
    );
}


function chartTipo(tipo) {
    ChartPrincipal.config.type = tipo;
    ChartPrincipal.update();
}

/*
function chartTipoPolar() {
    ChartPrincipal.config.type = "polarArea";
    ChartPrincipal.update();
}

function chartTipoAnillo() {
    ChartPrincipal.config.type = "doughnut";
    ChartPrincipal.update();
}

function chartTipoLine() {
    ChartPrincipal.config.type = "line";
    ChartPrincipal.update();
}

function chartTipoPie() {
    ChartPrincipal.config.type = "pie";
    ChartPrincipal.update();
}
function chartTipoBar() {
    ChartPrincipal.config.type = "bar";
    ChartPrincipal.update();
}
*/