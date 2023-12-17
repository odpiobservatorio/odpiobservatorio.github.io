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

    const funciones = {
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
        const funcionOrdenar = funciones[tipoOrdenamiento];
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

// - - - - - - - - - - - - - - - - - - - - - - - -
// Funciones busqueda simple
// - - - - - - - - - - - - - - - - - - - - - - - -

function showBusqueda(datosParaMostrar) {
    /*
        * La funcion recibe los datos a mostrar y 
        * los muestra en la lista de resultados y en el mapa.
    */

    datosParaMostrar.forEach(elemento => {
        // Agrega los resultados a la lista de resultados
        const p = document.createElement("p");
        p.textContent = `${elemento.Municipio}, ${elemento.Pueblo}`;

        const a = document.createElement("a");
        a.href = "#";
        a.onclick = () => verCaso(elemento);
        a.classList.add("list-group-item", "list-group-item-action");

        const h6 = document.createElement("h6");
        h6.textContent = `${elemento.ind}. ${elemento.Tipo}`;
        h6.classList.add("mb-1");

        const sm = document.createElement("small");
        sm.classList.add("text-muted");
        sm.textContent = elemento.Year;

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
                new L.marker([elemento.Lat, elemento.Lng], { icon: icons[formatoPlano["markType"]]() }) //Se llama el diccionario icons
                    .addTo(map)
                    .bindPopup(
                        `<b>${elemento.Departamento} - ${elemento.Year}</b><br>${elemento.Municipio
                        }, C: ${elemento.ind
                        }<br><button type='button' class='btn btn-secondary' onclick ='verCaso(${JSON.stringify(
                            elemento
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
    const iCampo = document.getElementById("lstCampos").value; 
    const iOperador = document.getElementById("lstOperador").value;
    const vCampo = document.getElementById("txValorBusquedaA").value;

    ///Limpiamos la lista de resultados
    document.getElementById("lstResGis").innerHTML = "";

    // Funcion de filtro que se usa segun el caso
    const filtros = {
        "1": (registro) => registro[iCampo].toUpperCase().includes(vCampo.toUpperCase()),
        ">": (registro) => registro[iCampo] > vCampo,
        "<": (registro) => registro[iCampo] < vCampo,
        "==": (registro) => registro[iCampo] == vCampo,
    }
    
    //Limpiamos las marcas del mapa
    //clearMarkers();

    // Filtramos los datos segun el criterio
    const funcionFiltro = filtros[iOperador];
    const datos = DataPrincipal.filter(funcionFiltro)

    // Mostrar resultados de busqueda
    showBusqueda(datos);

    //Agrego los valores de este filtro y los guardo en el reporte
    bigData.DataToReport = datos;
}

// - - - - - - - - - - - - - - - - - - - - - - - -
// Funciones busqueda avanzada
// - - - - - - - - - - - - - - - - - - - - - - - -

function LimpiarCriterios() {
    // Limpia control lista de criterios avanzados
    // y de la matriz de criterios avanzado.

    document.getElementById("lstCriterios").innerHTML = "";
    bigData.CriteFindPlus = [];
}

function addOperadorCriterio(elemento) {
    const operador = elemento.getAttribute("id");

    const itCriterioTx = document.createElement("li");
    itCriterioTx.classList.add("list-group-item");
    itCriterioTx.textContent = `(${operador})`;

    document.getElementById("lstCriterios").appendChild(itCriterioTx);
    (bigData.CriteFindPlus).push(operador === "Y" ? "&&" : "||");
}

function AgregarCriterioFind() {
    const ColumnaSr = document.getElementById("lstCampos");
    const ColumnaTx = ColumnaSr.options[ColumnaSr.selectedIndex].text;
    const ColumnaVal = document.getElementById("lstCampos").value;

    const OperadorSr = document.getElementById("lstOperador");
    const OperadorTx = OperadorSr.options[OperadorSr.selectedIndex].text;
    const OperadorVal = document.getElementById("lstOperador").value;

    const vCampoTx = document.getElementById("txValorBusquedaA").value;

    let CriterioFull;
    if (OperadorVal == 1) {
        CriterioFull = `caso['${ColumnaVal}'].includes('${vCampoTx}')`;
    } else {
        CriterioFull = `caso['${ColumnaVal}'] ${OperadorVal} '${vCampoTx}'`;
    }

    (bigData.CriteFindPlus).push(CriterioFull);

    const contenedor = document.createElement("div");
    contenedor.classList.add("d-flex");

    const itCriterioTx = document.createElement("li");
    itCriterioTx.textContent = `${ColumnaTx} ${OperadorTx} ${vCampoTx}`;
    itCriterioTx.classList.add("list-group-item");
    
    // Boton eliminar contenedor
    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "-";
    btnEliminar.classList.add("btn", "btn-danger");
    btnEliminar.onclick = () => {
        contenedor.remove();
        (bigData.CriteFindPlus).pop();
    };

    contenedor.appendChild(itCriterioTx);
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
    const datos = DataPrincipal.filter((caso) => filtroCreado(caso));

    //Limpiamos las marcas del mapa
    //clearMarkers();

    //mostramos la busqueda finalmente
    showBusqueda(datos);

    //Agrego los valores de este filtro y los guardo en el reporte
    bigData.DataToReport = datos;
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
        tlTipoCaso : `CASO ${registro.ind}`,
        txTipo : registro.Tipo,
        txAño : registro.Year,
        txLugar : registro.Municipio,
        txEtnia : `Etnía (${registro.Pueblo})`,
        txPerpetuador : `Perpetuador (${registro.Perpetrador})`,
        txCaso : registro.Antecedentes,
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
        for (const key of Keys) {
            DatoCelta = document.createElement("td");
            DatoCelta.textContent = registro[key];
            fila.appendChild(DatoCelta);
        }
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
        contador++;

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
    });
}
