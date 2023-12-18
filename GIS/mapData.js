// Variables pasa usar globalmente
const bigData = {
    DataToReport: [], // Resultados de la busqueda
    MrkAntecedente: [],
    CriteFindPlus: [],
}

//Variable para los tooltip
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);

// - - - - - - - - - - - - - - - - - - - - - - - -
// Funciones para llenar listas de busqueda
// - - - - - - - - - - - - - - - - - - - - - - - -
function CargarlstMap() {
    /*
    * La funcion carga la lista de "informacion de apoyo"
    * segun el valor de "Buscar por" (Macro, dep, municipio, etc)
    */
    const lstCampos = document.getElementById("lstCampos");
    lstCampos.selectedIndex = "0";
    document.getElementById("lstAutomatica").selectedIndex = "0";
    listasAutomaticas(lstCampos.value);
}

function listasAutomaticas(criterio) {
    /*
     * La funcion recibe el criterio de busqueda y crea una lista de valores unicos
     * en el campo de "informacion de apoyo" para buscar por ese criterio. 
     */

    const sortFunc = {
        "numero": (a, b) => a[criterio] - b[criterio],
        "texto": (a, b) => {
            a = a[criterio];
            b = b[criterio];
            return (a.toString()).localeCompare(b.toString());
        },
    }

    const lstAutomatica = document.getElementById("lstAutomatica")
    lstAutomatica.innerHTML = "";

    if (criterio == "Antecedentes") {
        const itemLs = document.createElement("option");
        itemLs.text = "Sin criterio";
        document.getElementById("lstAutomatica").appendChild(itemLs);
    } else {
        const tipoOrdenamiento = ["Year", "Mes", "Edad"].includes(criterio) ? "numero" : "texto";
        const funcionOrdenar = sortFunc[tipoOrdenamiento];
        const DataPrincipalSort = DataPrincipal.sort(funcionOrdenar);

        // Hace una lista sin repeticiones del tipo q se pida
        const valoresUnicos = [
            ...new Set(
                DataPrincipalSort.map(registro => registro[criterio])
            )
        ];

        // Agrega los valores unicos a la lista de seleccion
        valoresUnicos.forEach(valor => {
            const itemLs = document.createElement("option");
            itemLs.value = valor;
            itemLs.text = valor;
            lstAutomatica.appendChild(itemLs);
        });
    }

    // Traslada la información de apoyo a la caja valor de búsqueda
    document.getElementById("txValorBusquedaA").value = document.getElementById("lstAutomatica").value;
}

function addTextHelp() {
    // Traslada la información de apoyo a la caja valor de búsqueda
    document.getElementById("txValorBusquedaA").value = document.getElementById("lstAutomatica").value;
}

// - - - - - - - - - - - - - - - - - - - - - - - -
// Funciones busqueda simple
// - - - - - - - - - - - - - - - - - - - - - - - -

function showBusqueda(datosParaMostrar = []) {
    /*
        * La funcion recibe los datos a mostrar y 
        * los muestra en la lista de resultados y en el mapa.
    */

    datosParaMostrar.forEach(registro => {
        // Agrega los resultados a la lista de resultados
        const p = document.createElement("p");
        p.textContent = `${registro.Municipio}, ${registro.Pueblo}`;

        const a = document.createElement("a");
        a.href = "#";
        a.onclick = () => verCaso(registro);
        a.classList.add("list-group-item", "list-group-item-action");

        const h6 = document.createElement("h6");
        h6.textContent = `${registro.ind}. ${registro.Tipo}`;
        h6.classList.add("mb-1");

        const sm = document.createElement("small");
        sm.classList.add("text-muted");
        sm.textContent = registro.Year;

        const div = document.createElement("div");
        div.classList.add("d-flex", "w-100", "justify-content-between");

        div.appendChild(h6);
        div.appendChild(sm);
        a.appendChild(div);

        a.appendChild(p);

        // Agregar a la lista de resultados
        document.getElementById("lstResGis").appendChild(a);

        // Agrega las marcas al mapa
        try {
            (bigData.MrkAntecedente).push(
                 // Se llama el icono de la configuracion de iconos en mapGraphics.js
                new L.marker([registro.Lat, registro.Lng], { icon: icons[formatoPlano["markType"]]() })
                    .addTo(map)
                    .bindPopup(
                        `<b>${registro.Departamento} - ${registro.Year}</b><br>${registro.Municipio
                        }, C: ${registro.ind
                        }<br><button type='button' class='btn btn-secondary' onclick ='verCaso(${JSON.stringify(
                            registro
                        )})'>Ver</button></br>`
                    )
            );
        } catch (error) {
            console.log(error);
        }
    });

    const nCasos = datosParaMostrar.length;
    document.getElementById("tlResultados").textContent = `${nCasos} resultados`;
}

function BuscarFaseI() {

    /*
    * La funcion que realiza una busqueda simple
    * de un solo criterio de busqueda y envia los datos
    * a la funcion que muestra los resultados.
    */

    // Criterios de busqueda (Criterio, operador, valor)
    const campoBusqueda = document.getElementById("lstCampos").value;
    const operador = document.getElementById("lstOperador").value;
    const valorBusqueda = document.getElementById("txValorBusquedaA").value;

    ///Limpiamos la lista de resultados
    document.getElementById("lstResGis").innerHTML = "";

    // Funcion de filtro que se usa segun el caso
    const funcionesFiltro = {
        "1": (registro) => registro[campoBusqueda].toUpperCase().includes(valorBusqueda.toUpperCase()),
        ">": (registro) => registro[campoBusqueda] > valorBusqueda,
        "<": (registro) => registro[campoBusqueda] < valorBusqueda,
        "==": (registro) => registro[campoBusqueda] == valorBusqueda,
    }

    //Limpiamos las marcas del mapa
    //clearMarkers();

    // Filtramos los datos segun el criterio
    const funcionFiltro = funcionesFiltro[operador];
    const DataToReport = DataPrincipal.filter(funcionFiltro)

    // Mostrar resultados de busqueda
    showBusqueda(DataToReport);

    //Agrego los valores de este filtro y los guardo en el reporte
    bigData.DataToReport = DataToReport;
}

// - - - - - - - - - - - - - - - - - - - - - - - -
// Funciones busqueda avanzada
// - - - - - - - - - - - - - - - - - - - - - - - -

function LimpiarCriterios() {
    /*
    * Limpia control lista de criterios avanzados
    * y de la lista de criterios de busqueda
    */
    document.getElementById("lstCriterios").innerHTML = "";
    bigData.CriteFindPlus = [];
}

function addOperadorCriterio(elemento) {
    const operador = elemento.getAttribute("id");

    // Mostrar el operador en la lista visual de criterios de busqueda avanzada
    const itCriterioTx = document.createElement("li");
    itCriterioTx.classList.add("list-group-item");
    itCriterioTx.textContent = `(${operador})`;

    // Agregar a la lista interna
    document.getElementById("lstCriterios").appendChild(itCriterioTx);
    (bigData.CriteFindPlus).push(operador === "Y" ? "&&" : "||");
}

function AgregarCriterioFind() {
    // Criterio de busqueda
    const criterioSelect = document.getElementById("lstCampos");
    const criterioText = criterioSelect.options[criterioSelect.selectedIndex].text;
    const criterioValue = criterioSelect.value;

    // Operador de busqueda
    const operadorSelect = document.getElementById("lstOperador");
    const operadorText = operadorSelect.options[operadorSelect.selectedIndex].text;
    const operadorValue = document.getElementById("lstOperador").value;

    // Valor de busqueda
    const valorBusqueda = document.getElementById("txValorBusquedaA").value;

    // Agregar a la lista de criterios de busqueda
    (bigData.CriteFindPlus).push(
        operadorValue == 1 ? // Si es verdadero entonces opcion 1, sino, opcion 2
            `caso['${criterioValue}'].includes('${valorBusqueda}')` :
            `caso['${criterioValue}'] ${operadorValue} '${valorBusqueda}'`
    );

    // Mostrar la busqueda en la lista avanzada
    const contenedor = document.createElement("div");
    contenedor.classList = "d-flex gap-3";

    const labelCriterioBusqueda = document.createElement("li");
    labelCriterioBusqueda.textContent = `${criterioText} ${operadorText} ${valorBusqueda}`;
    labelCriterioBusqueda.classList.add("list-group-item");

    // Boton eliminar contenedor
    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "-";
    btnEliminar.classList.add("btn", "btn-outline-danger");
    btnEliminar.onclick = () => {
        contenedor.remove();
        (bigData.CriteFindPlus).pop();
    };

    // Agregar elementos al contenedor
    contenedor.appendChild(labelCriterioBusqueda);
    contenedor.appendChild(btnEliminar);
    document.getElementById("lstCriterios").appendChild(contenedor);
}

function BuscarFaseII() {
    /*
    * Funcion para realizar una busqueda avanzada
    */

    //Limpiamos la lista de resultados
    document.getElementById("lstResGis").innerHTML = "";

    //Creamos la funcion q va a filtrar con los criterios
    const filtroCreado = new Function(
        "caso",
        `return ${(bigData.CriteFindPlus).join(" ")};`
    );

    ///Ordena mi información por fecha
    const DataToReport = DataPrincipal.filter((caso) => filtroCreado(caso));

    //Limpiamos las marcas del mapa
    //clearMarkers();

    //mostramos la busqueda finalmente
    showBusqueda(DataToReport);

    //Agrego los valores de este filtro y los guardo en el reporte
    bigData.DataToReport = DataToReport;
}

function buscarQuery() {
    /*
    * Funcion para realizar una busqueda compleja segun la entrada
    */

    //Limpiamos la lista de resultados
    document.getElementById("lstResGis").innerHTML = "";


    //Creamos la funcion q va a filtrar con los criterios
    const queryEntry = document.getElementById("queryBusqueda").value;
    const filtroCreado = new Function(
        "objeto",
        `return (${convertirQuery(queryEntry)});`
    )

    ///Ordena mi información por fecha
    const DataToReport = DataPrincipal.filter((caso) => filtroCreado(caso));

    //Limpiamos las marcas del mapa
    clearMarkers();

    //mostramos la busqueda finalmente
    showBusqueda(DataToReport);

    //Agrego los valores de este filtro y los guardo en el reporte
    bigData.DataToReport = DataToReport;
}

function CargarTodoMarcas() {
    /*
    * Funcion que carga y muestra todos los registros de la base de datos
    */

    //Limpiamos la lista de resultados
    document.getElementById("lstResGis").innerHTML = "";

    // Limpiamos las marcas anteriores
    clearMarkers();

    // Mostrar todos los datos
    showBusqueda(DataPrincipal);
    bigData.DataToReport = DataPrincipal;
}

//..........................................
// Funciones para mostrar ventana caso
//..........................................

function verCaso(registro) {
    /*
    * La funcion recibe un registro y muestra la ventana modal con la información
    */
    const data = {
        tlTipoCaso: `CASO ${registro.ind}`,
        txTipo: registro.Tipo,
        txAño: registro.Year,
        txLugar: registro.Municipio,
        txEtnia: `Etnía (${registro.Pueblo})`,
        txPerpetuador: `Perpetuador (${registro.Perpetrador})`,
        txCaso: registro.Antecedentes,
    }

    for (const id in data) {
        document.getElementById(id).textContent = data[id];
    }

    bootstrap.Modal.getOrCreateInstance(document.getElementById("ModalCaseOnMap")).show();
}

function VerFindExtend() {
    /*
    * La funcion muestra u oculta la ventana de busqueda avanzada
    */
    const control = document.getElementById("PlusFind");

    control.hidden = !control.hidden;
    document.getElementById("plusOption").textContent = control.hidden ? "+" : "-";
}

function clearMarkers() {
    // Limpia todas las marcas del mapa
    (bigData.MrkAntecedente).forEach(antecedente => map.removeLayer(antecedente));
}

// - - - - - - - - - - - - - - - - - - - - - - - -
// Funciones para mostrar reportes de registros (Tabla, documento)
// - - - - - - - - - - - - - - - - - - - - - - - -


//Funciones de tabla reporte de busqueda
function TablaReport() {
    // Obtener la referencia del elemento dode se inserta la tabla
    var ContenedorTabla = document.getElementById("divTableModal");

    //Limpia el contenido dentro del formulario modal
    document.getElementById("divTableModal").innerHTML = "";
    document.getElementById("divDocModal").innerHTML = "";
    
    // Agrega la imagen al documento
    const tablabase = document.getElementById("tbResultados");
    if (tablabase) tablabase.remove();

    const tabla = document.createElement("table");
    const tablaHeader = document.createElement("thead");
    tabla.id = "tbResultados";
    
    //Creamos el cuerpo de la tabla
    const tablaBody = document.createElement("tbody");
    
    //Creamos los encabezados
    const Encabezados = document.createElement("tr");

    const titulos = [
        "ID",
        "Año",
        "Departamento",
        "Lugar",
        "Pueblo",
        "Tipo",
        "Actor",
        "Territorio",
        "Género",
    ];

    titulos.forEach(titulo => {
        const elemento = document.createElement("td");
        elemento.textContent = titulo;
        Encabezados.appendChild(elemento);
    });

    //Agregamos los encabezados
    tablaHeader.appendChild(Encabezados);
    tabla.appendChild(tablaHeader);

    const Keys = [
        "Year",
        "Departamento",
        "Municipio",
        "Pueblo",
        "Tipo",
        "Perpetrador",
        "Territorio",
        "Sexo",
    ];
    let i = 1;

    (bigData.DataToReport).forEach(registro => {
        const fila = document.createElement("tr");
        const DatoCelta = document.createElement("td");
        DatoCelta.textContent = i;
        fila.appendChild(DatoCelta);
        
        //Agrego las columnas para cada fila
        Keys.forEach(key => {
            DatoCelta = document.createElement("td");
            DatoCelta.textContent = registro[key];
            fila.appendChild(DatoCelta);
        });

        //Agrego filas y columnas al cuerpo de la tabla
        tablaBody.appendChild(fila);
        i++;
    });

    tabla.appendChild(tablaBody);
    ContenedorTabla.appendChild(tabla);
    tabla.classList.add("table", "table-striped", "table-hover");
    tablaHeader.classList.add("table-dark", "fw-bold");
}

function DocumentReport() {
    const ContenedorDocumento = document.getElementById("divDocModal");
    document.getElementById("divTableModal").innerHTML = "";
    document.getElementById("divDocModal").innerHTML = "";

    let contador = 1;
    let tagElement;

    (bigData.DataToReport).forEach(registro => {
        tagElement = document.createElement("div");
        tagElement.textContent = registro.Tipo;
        tagElement.classList.add("h4", "text-success");
        ContenedorDocumento.appendChild(tagElement);

        const sm = document.createElement("small");
        sm.classList.add("text-muted");
        sm.textContent = contador;
        ContenedorDocumento.appendChild(sm);

        tagElement = document.createElement("div");
        tagElement.textContent = registro.Year;
        tagElement.classList.add("h5", "text-secondary", "ms-2");
        ContenedorDocumento.appendChild(tagElement);

        tagElement = document.createElement("div");
        tagElement.textContent = `${registro.Departamento} (${registro.Municipio})`;
        tagElement.classList.add("h6", "text-info-emphasis", "ms-3");
        ContenedorDocumento.appendChild(tagElement);

        tagElement = document.createElement("div");
        tagElement.textContent = registro.Pueblo;
        tagElement.classList.add("h6", "text-primary", "ms-3");
        ContenedorDocumento.appendChild(tagElement);

        tagElement = document.createElement("div");
        tagElement.textContent = registro.Perpetrador;
        tagElement.classList.add("h7", "text-primary", "ms-4");
        ContenedorDocumento.appendChild(tagElement);

        tagElement = document.createElement("p");
        tagElement.textContent = registro.Antecedentes;
        tagElement.classList.add("fs-5", "text-dark", "mb-5", "ms-5");
        ContenedorDocumento.appendChild(tagElement);

        tagElement = document.createElement("hr");
        ContenedorDocumento.appendChild(tagElement);

        contador++;
    });
}


/* Mi lenguaje de busqueda */

/*
Ejemplo:
`
    (id > 2 && departamento == Antioquia)
    .||.
    (id == 10 && departamento == Cundinamarca)
    .&&.
    (id similar 10 || departamento similar Cundinamarca)
`

`
    (Year == 2023)
    .&&.
    (Perpetrador similar FF || Perpetrador similar ESMAD)
`
*/

function procesarHecho(cadena) {
    if (cadena == "&&" || cadena == "||") {
        return cadena;
    } else {
        const hecho = cadena.split(" ");
        const parsed = {
            "==": `(objeto["${hecho[0]}"]).toString().toUpperCase() == "${hecho[2].toUpperCase()}"`,
            ">": `objeto["${hecho[0]}"] > "${hecho[2]}"`,
            "<": `objeto["${hecho[0]}"] < "${hecho[2]}"`,
            "similar": `((objeto["${hecho[0]}"]).toString().toUpperCase()).includes("${hecho[2].toUpperCase()}")`,
        }
        return parsed[hecho[1]];
    }
}

function convertirQuery(raw) {

    // Separar por punto los predicados grandes y eliminar los parentesis
    const predicados = raw.split(".").map(
        t => t.replace(/\(|\)/g, '')
            .trim()
    );
    // Separar por coma los predicados pequeños
    return predicados.map(predicado => {
        if (predicado === "&&" || predicado === "||") {
            return predicado;
        } else {
            const hechos = predicado.split(/(\|\||&&)/g);
            return `(${hechos.map(h =>procesarHecho(h.trim())).join(" ")})`
        }
    }).join(" ").replace(/\n/g, ' ');
}