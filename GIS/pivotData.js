let LabelPivot = [];
let Conteos = [];

function showPivotArea() {
    let Activar = document.getElementById("map").hidden;
    if (Activar == false) {
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
function PivotElementos(key) {
    let contenedorTabla = document.getElementById("divTablaPivot")
    let ValuePivot = document.getElementById("lstPivot").value;
    contenedorTabla.innerHTML = ""
    //Iniciamos la tabla y encabezados
    const tablabase = document.getElementById("tbResultadosPivot");
    if (tablabase) tablabase.remove();
    const tabla = document.createElement("table");
    const tablaHeader = document.createElement("thead");
    tabla.id = "tbResultadosPivot";
    //Creamos el cuerpo de la tabla
    const tablaBody = document.createElement("tbody");
    //Creamos los encabezados
    const Encabezados = document.createElement("tr");

    const titulos = [
        ValuePivot,
        "Cantidad",
    ];
    for (const titulo of titulos) {
        const elemento = document.createElement("td");
        elemento.textContent = titulo;
        Encabezados.appendChild(elemento);
    }
    //Agregamos los encabezados
    tablaHeader.appendChild(Encabezados);
    tabla.appendChild(tablaHeader);

    const elementosUnicosSet = new Set();
    //Hace una lista sin repeticiones del tipo q se pida
    //por ejem lista de los Departamentos

    //Agregamos las etiquetas o categorias
    LabelPivot = [];
    Conteos = [];
    let counter = 0;
    for (const registro of DataToReport) {
        if (!elementosUnicosSet.has(registro[ValuePivot])) {
            elementosUnicosSet.add(registro[ValuePivot]);
            LabelPivot.push(registro[ValuePivot])           
            for (const elemento of DataToReport) {
                if (elemento[ValuePivot] == registro[ValuePivot]) {
                    counter++;
                }
            };
            Conteos.push(counter)
            counter=0
        }
    };
    //Agrega los datos a la tabla
    let num=0
    for (const Elemento of LabelPivot) {
        let fila = document.createElement("tr");
        DatoCelta = document.createElement("td");
        DatoCelta.textContent = Elemento;
        fila.appendChild(DatoCelta);

        DatoCelta = document.createElement("td");
        DatoCelta.textContent = Conteos[num];
        num++
        fila.appendChild(DatoCelta);
        tablaBody.appendChild(fila);

    }


    //let Tx = document.createElement("h6")
    //Tx.textContent = registro[ValuePivot]


    tabla.appendChild(tablaBody);
    contenedorTabla.appendChild(tabla);
    tabla.classList.add("table", "table-striped", "table-hover", "m-3");
    tablaHeader.classList.add("table-dark", "fw-bold");

}

