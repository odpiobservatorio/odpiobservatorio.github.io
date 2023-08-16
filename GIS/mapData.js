let MrkAntecedente = [];
let CriteFindPlus = [];

//Almacena en esta varible la información de los resultados de búsqueda
let DataToReport = [];

//Variable para los tooltip
const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);
//Esta variable guarda el archivo json cargado

//*****************************************************
//Funciones para llenar listas
//*****************************************************
function CargarlstMap() {
  //Ubicar indices en las listas
  document.getElementById("lstCampos").selectedIndex = "0";

  listasAutomaticas("lstCampos");
  document.getElementById("lstAutomatica").selectedIndex = "0";

  addTextHelp();
}

//*****************************************************
//Funciones para buscar datos y mostrar marcas
//*****************************************************

function LoadData() {}

//Limpia control lista de criterios avanzados
//y de la matris de criterios avanzado.
function LimpiarCriterios() {
  document.getElementById("lstCriterios").innerHTML = "";
  CriteFindPlus = [];
}

function addOperadorCriterio(elemento) {
  const operador = elemento.getAttribute("id");

  const itCriterioTx = document.createElement("li");
  itCriterioTx.classList.add("list-group-item");
  itCriterioTx.textContent = `(${operador})`;

  document.getElementById("lstCriterios").appendChild(itCriterioTx);
  CriteFindPlus.push(operador === "Y" ? "&&" : "||");
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

  CriteFindPlus.push(CriterioFull);

  const itCriterioTx = document.createElement("li");

  itCriterioTx.textContent = `${ColumnaTx} ${OperadorTx} ${vCampoTx}`;
  itCriterioTx.classList.add("list-group-item");
  document.getElementById("lstCriterios").appendChild(itCriterioTx);
}

function showBusqueda(checkBusqueda) {
  let nCasos = 0;

  for (const elemento of checkBusqueda) {
    const TextoCaso = `${elemento.Municipio}, ${elemento.Pueblo}`;
    const p = document.createElement("p");
    p.textContent = TextoCaso;

    const a = document.createElement("a");
    a.href = "#";
    a.onclick = () => verCaso(elemento);
    a.classList.add("list-group-item", "list-group-item-action");

    const h5 = document.createElement("h6");
    h5.textContent = `${elemento.ind}. ${elemento.Tipo}`;
    h5.classList.add("mb-1");

    const sm = document.createElement("small");
    sm.classList.add("text-muted");
    sm.textContent = elemento.Year;

    const d = document.createElement("div");
    d.classList.add("d-flex", "w-100", "justify-content-between");

    d.appendChild(h5);
    d.appendChild(sm);
    a.appendChild(d);

    a.appendChild(p);

    document.getElementById("lstResGis").appendChild(a);

    ///Colocamos las marcas en el mapa
    MrkAntecedente.push(
      new L.marker([elemento.Lat, elemento.Lng], { icon: greenIcon })
        .addTo(map)
        .bindPopup(
          `<b>${elemento.Departamento} - ${elemento.Year}</b><br>${
            elemento.Municipio
          }, C: ${
            elemento.ind
          }<br><button type='button' class='btn btn-secondary' onclick ='verCaso(${JSON.stringify(
            elemento
          )})'>Ver</button></br>`
        )
    );
    nCasos++;
  }

  document.getElementById("tlResultados").textContent = `${nCasos} Resultados`;
}

///Función para busqueda compleja de varios parametros básicos
function BuscarFaseII() {
  //Limpiamos la lista de resultados
  document.getElementById("lstResGis").innerHTML = "";

  //Creamos la funcion q va a filtrar con los criterios
  const filtroCreado = new Function(
    "caso",
    `return ${CriteFindPlus.join(" ")};`
  );

  ///Ordena mi información por fecha
  const checkBusquedaSort = [...DataPrincipal].sort((a, b) => a.Year - b.Year);
  const checkBusqueda = checkBusquedaSort.filter((caso) => filtroCreado(caso));

  //Limpiamos las marcas del mapa
  clearMarkers();

  //mostramos la busqueda finalmente
  showBusqueda(checkBusqueda);

  //Agrego los valores de este filtro y los guardo en el reporte
  DataToReport = checkBusqueda;
}

function BuscarFaseI() {
  //Configuración de los criterios de búsqueda inicial, Columna & Operador & Valor a búscar.
  const iOperador = document.getElementById("lstOperador").value;
  const iCampo = `${document.getElementById("lstCampos").value}`;
  const vCampo = `${document.getElementById("txValorBusquedaA").value}`;

  ///Limpiamos la lista de resultados
  document.getElementById("lstResGis").innerHTML = "";

  ///Ordena mi información por fecha
  const checkBusquedaSort = [...DataPrincipal].sort((a, b) => a.Year - b.Year);

  let checkBusqueda;
  switch (iOperador) {
    case "1":
      checkBusqueda = checkBusquedaSort.filter((dato) =>
        dato[iCampo].includes(vCampo)
      );
      break;

    case ">":
      checkBusqueda = checkBusquedaSort.filter((dato) => dato[iCampo] > vCampo);
      break;

    case "<":
      checkBusqueda = checkBusquedaSort.filter((dato) => dato[iCampo] < vCampo);
      break;

    default:
      checkBusqueda = checkBusquedaSort.filter(
        (dato) => dato[iCampo] == vCampo
      );
      break;
  }

  //Limpiamos las marcas del mapa
  clearMarkers();

  //mostramos la busqueda finalmente
  showBusqueda(checkBusqueda);

  //Agrego los valores de este filtro y los guardo en el reporte
  console.log(DataToReport);
  DataToReport = checkBusqueda;
  console.log(DataToReport);
}

function CargarTodoMarcas() {
  document.getElementById("lstCampos").selectedIndex = "0";

  listasAutomaticas("lstCampos");
  document.getElementById("lstAutomatica").selectedIndex = "0";

  addTextHelp();

  //Limpiamos la lista de resultados
  document.getElementById("lstResGis").innerHTML = "";

  clearMarkers();

  //mostramos la busqueda finalmente
  showBusqueda(DataPrincipal);

  //Agrego los valores de este filtro y los guardo en el reporte

  /*
    let nCasos = 0;
    for (const elemento of DataPrincipal) {
        const TextoCaso = `${elemento.Municipio}, ${elemento.Pueblo}`;
        const p = document.createElement("p");
        p.textContent = TextoCaso

        const a = document.createElement("a")
        a.href = ("#")
        a.onclick = () => verCaso(elemento);
        a.classList.add('list-group-item', 'list-group-item-action');

        const h5 = document.createElement("h6");
        h5.textContent = `${(elemento.ind)}. ${elemento.Tipo}`;
        h5.classList.add('mb-1');

        const sm = document.createElement("small");
        sm.classList.add('text-muted');
        sm.textContent = elemento.Year;
        
        const d = document.createElement("div");
        d.classList.add('d-flex', 'w-100', 'justify-content-between');

        d.appendChild(h5);
        d.appendChild(sm);
        a.appendChild(d);

        a.appendChild(p);

        document.getElementById("lstResGis").appendChild(a);

        ///Colocamos las marcas en el mapa
        MrkAntecedente.push(new L.marker([elemento.Lat, elemento.Lng], { icon: greenIcon })
            .addTo(map)
            .bindPopup(`<b>${elemento.Departamento} - ${elemento.Year}</b><br>${elemento.Municipio}, C: ${elemento.ind}<br><button type='button' class='btn btn-secondary' onclick ='verCaso(${JSON.stringify(elemento)})'>Ver</button></br>`)
        );
        nCasos++   
    }   
    document.getElementById("tlResultados").textContent = `${nCasos} Resultados`; 
    */
}

//..........................................
//Funciones para mostrar ventana caso
//..........................................

function verCaso(registro) {
  document.getElementById("tlTipoCaso").textContent = `CASO ${registro.ind}`;
  document.getElementById("txTipo").textContent = registro.Tipo;
  document.getElementById("txAño").textContent = registro.Year;
  document.getElementById("txLugar").textContent = registro.Municipio;
  document.getElementById("txEtnia").textContent = `Etnía (${registro.Pueblo})`;
  document.getElementById(
    "txPerpetuador"
  ).textContent = `Perpetuador (${registro.Perpetrador})`;
  document.getElementById("txCaso").textContent = registro.Antecedentes;
  bootstrap.Modal.getOrCreateInstance(
    document.getElementById("ModalCaseOnMap")
  ).show();
}

///Modifca vicualmente el boton de buscar
function VerFindExtend() {
  let control = document.getElementById("PlusFind");

  if (control.hidden) {
    control.hidden = false;
    document.getElementById("plusOption").textContent = "-";
  } else {
    control.hidden = true;
    document.getElementById("plusOption").textContent = "+";
  }
}

function clearMarkers() {
  //Limpiamos cualquier marca en el mapa
  for (const antecedente of MrkAntecedente) {
    map.removeLayer(antecedente);
  }
}

function listasAutomaticas(cotrolList) {
  const criterio = document.getElementById(cotrolList).value;

  let DataPrincipalSort;
  if (criterio == "Year") {
    DataPrincipalSort = DataPrincipal.sort((a, b) => a[criterio] - b[criterio]);
  } else if (criterio == "Edad") {
    DataPrincipalSort = DataPrincipal.sort((a, b) => a[criterio] - b[criterio]);
  } else {
    DataPrincipalSort = DataPrincipal.sort((a, b) => {
      a = a[criterio];
      b = b[criterio];
      return a.localeCompare(b);
    });
  }

  document.getElementById("lstAutomatica").innerHTML = "";
  if (criterio !== "Antecedentes") {
    const Listas = [
      ...new Map(
        DataPrincipalSort.map((filtro) => [filtro[criterio], filtro])
      ).values(),
    ];

    for (const elemento of Listas) {
      const itemLs = document.createElement("option");
      itemLs.value = elemento[criterio];
      itemLs.text = elemento[criterio];
      document.getElementById("lstAutomatica").appendChild(itemLs);
    }
  } else {
    const itemLs = document.createElement("option");
    itemLs.text = "Sin criterio";
    document.getElementById("lstAutomatica").appendChild(itemLs);
  }
}
//Función que traslada la información de apoyo a la caja valor de búsqueda
function addTextHelp() {
  document.getElementById("txValorBusquedaA").value =
    document.getElementById("lstAutomatica").value;
}

//Funciones de tabla reporte de busqueda
function TablaReport() {
  // Obtener la referencia del elemento dode se inserta la tabla
  var ContenedorTabla = document.getElementById("divTableModal");
  //Limpia el contenido dentro del formulario modal
  document.getElementById("divTableModal").innerHTML = "";
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
  for (const titulo of titulos) {
    const elemento = document.createElement("td");
    elemento.textContent = titulo;
    Encabezados.appendChild(elemento);
  }
  //Agregamos los encabezados
  tablaHeader.appendChild(Encabezados);
  tabla.appendChild(tablaHeader);

  //Agregar una columna de botones
  //let celOpciones = document.createElement('td');
  //celOpciones.textContent = '';

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

  console.log(DataToReport);
  for (const registro of DataToReport) {
    let fila = document.createElement("tr");
    let DatoCelta = document.createElement("td");
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
  }
  tabla.appendChild(tablaBody);
  ContenedorTabla.appendChild(tabla);
  tabla.classList.add("table", "table-striped", "table-hover");
  tablaHeader.classList.add("table-dark", "fw-bold");
}

function DocumentReport() {
  const ContenedorDocumento = document.getElementById("divDocModal");
  document.getElementById("divTableModal").innerHTML = "";

  let contador = 1;
  let tagElement;

  for (const registro of DataToReport) {
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
  }
}
