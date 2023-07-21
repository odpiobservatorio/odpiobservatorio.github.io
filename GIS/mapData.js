
let MrkAntecedente = [];
let CriteFindPlus = [];

//Almacena en esta varible la información de los resultados de búsqueda
let DataToReport = [];

//Variable para los tooltip
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
//Esta variable guarda el archivo json cargado

//*****************************************************
//Funciones para llenar listas
//*****************************************************
function CargarlstMap() {
    //Ubicar indices en las listas
    document.getElementById("lstCampos").selectedIndex = "0"

    listasAutomaticas("lstCampos")
    document.getElementById("lstAutomatica").selectedIndex = "0"

   addTextHelp()

}


//*****************************************************
//Funciones para buscar datos y mostrar marcas
//*****************************************************

function LoadData() {


}


//Limpia control lista de criterios avanzados
//y de la matris de criterios avanzado.
function LimpiarCriterios() {
    document.getElementById("lstCriterios").innerHTML = ""
    CriteFindPlus = [];

}

function AddOperadorCriteriosY() {
    let itCriterioTx = document.createElement("li");
    itCriterioTx.classList.add("list-group-item")

    itCriterioTx.textContent = "(Y)"
    document.getElementById("lstCriterios").appendChild(itCriterioTx);
    CriteFindPlus.push("&&");


}
function AddOperadorCriteriosO() {
    let itCriterioTx = document.createElement("li");
    itCriterioTx.classList.add("list-group-item")

    itCriterioTx.textContent = "(O)"
    document.getElementById("lstCriterios").appendChild(itCriterioTx);
    CriteFindPlus.push("||");
}

function AgregarCriterioFind() {
    let ColumnaSr = document.getElementById("lstCampos");
    let ColumnaTx = ColumnaSr.options[ColumnaSr.selectedIndex].text;
    let ColumnaVal = document.getElementById("lstCampos").value;


    let OperadorSr = document.getElementById("lstOperador");
    let OperadorTx = OperadorSr.options[OperadorSr.selectedIndex].text;
    let OperadorVal = document.getElementById("lstOperador").value;

    let vCampoTx = document.getElementById("txValorBusquedaA").value;


    let CriterioFull
    if (OperadorVal == 1) {
        CriterioFull = "caso['" + ColumnaVal + "']" + ".includes('" + vCampoTx + "')";
    }

    else {
        CriterioFull = "caso['" + ColumnaVal + "']" + OperadorVal + "'" + vCampoTx + "'"
    }


    CriteFindPlus.push(CriterioFull);

    let itCriterioTx = document.createElement("li");

    itCriterioTx.textContent = ColumnaTx + " " + OperadorTx + " " + vCampoTx
    itCriterioTx.classList.add("list-group-item")


    document.getElementById("lstCriterios").appendChild(itCriterioTx);

}
///Función para busqueda compleja de varios parametros básicos
function BuscarFaseII() {
    //Limpiamos la lista de resultados
    document.getElementById("lstResGis").innerHTML = ""

    //Inicializamos la variable de criterios
    let Cadena = "caso=> ";

    //Búsco en la variable global los elementos que hayan sido agregados
    //y construimos la cadena general.
    CriteFindPlus.forEach(elemento => {
        Cadena = Cadena + elemento + " "
    })


    ///Ordena mi información por fecha
    const checkBusquedaSort = [...DataPrincipal].sort(function (a, b) {
        return a.Year - b.Year
    });
    const checkBusqueda = checkBusquedaSort.filter(eval(Cadena));
    //Agrego los valores de este filtro y los guardo en el reporte
    DataToReport = checkBusqueda

    //Limpiamos cualquier marca en el mapa
    for (let i = 0; i < MrkAntecedente.length; i++) {
        //Limpia información de mi mapa principal
        map.removeLayer(MrkAntecedente[i]);
    }

    nCasos = 0;
    checkBusqueda.forEach(elemento => {
        let a = document.createElement("a")
        a.href = ("#")
        a.onclick = () => verCaso(elemento.ind - 1);

        a.classList.add('list-group-item', 'list-group-item-action');

        let d = document.createElement("div");
        d.classList.add('d-flex', 'w-100', 'justify-content-between');


        let h5 = document.createElement("h6");
        h5.textContent = (elemento.ind - 1) + ". " + elemento.Tipo;
        h5.classList.add('mb-1');
        d.appendChild(h5);

        let sm = document.createElement("small");
        sm.classList.add('text-muted');
        sm.textContent = elemento.Year;
        d.appendChild(sm);

        a.appendChild(d);

        let TextoCaso = elemento.Municipio + ", " + elemento.Pueblo;
        p = document.createElement("p");
        p.textContent = TextoCaso
        a.appendChild(p);

        document.getElementById("lstResGis").appendChild(a);


        ///Colocamos las marcas en el mapa
        MrkAntecedente.push(new L.marker([elemento.Lat, elemento.Lng], { icon: greenIcon })
            .addTo(map)
            .bindPopup("<b>" + elemento.Departamento + "-" + elemento.Year + "</b><br>" + elemento.Municipio + " C:" + elemento.ind + "<br><button type='button' class='btn btn-secondary' onclick ='verCaso(" + (elemento.ind - 1) + ")'>Ver</button></br>")
        );
        nCasos++
    });
    document.getElementById("tlResultados").textContent = nCasos + " Resultados"
    nCasos = 0;

}

function BuscarFaseI() {
    //Configuración de los criterios de búsqueda inicial, Columna & Operador & Valor a búscar.
    let iCampo = "dato['" + document.getElementById("lstCampos").value + "']";
    let iOperador = document.getElementById("lstOperador").value

    let vCampo = "'" + document.getElementById("txValorBusquedaA").value + "'";

    ///Limpiamos la lista de resultados
    document.getElementById("lstResGis").innerHTML = ""

    ///Ordena mi información por fecha
    const checkBusquedaSort = [...DataPrincipal].sort(function (a, b) {
        return a.Year - b.Year
    });

    let filtro
    if (iOperador == 1) {
        filtro = iCampo + ".includes(" + vCampo + ")";
    }
    else {
        filtro = iCampo + iOperador + vCampo;
    }
    let checkBusqueda = checkBusquedaSort.filter(dato => eval(filtro));
    //Agrego los valores de este filtro y los guardo en el reporte
    DataToReport = checkBusqueda
    //Limpiamos cualquier marca en el mapa
    for (let i = 0; i < MrkAntecedente.length; i++) {
        //Limpia información de mi mapa principal
        map.removeLayer(MrkAntecedente[i]);
    }

    nCasos = 0;
    checkBusqueda.forEach(elemento => {
        let a = document.createElement("a")
        a.href = ("#")
        a.onclick = () => verCaso(elemento.ind - 1);

        a.classList.add('list-group-item', 'list-group-item-action');

        let d = document.createElement("div");
        d.classList.add('d-flex', 'w-100', 'justify-content-between');


        let h5 = document.createElement("h6");
        h5.textContent = (elemento.ind - 1) + ". " + elemento.Tipo;
        h5.classList.add('mb-1');
        d.appendChild(h5);

        let sm = document.createElement("small");
        sm.classList.add('text-muted');
        sm.textContent = elemento.Year;
        d.appendChild(sm);

        a.appendChild(d);

        let TextoCaso = elemento.Municipio + ", " + elemento.Pueblo;
        p = document.createElement("p");
        p.textContent = TextoCaso
        a.appendChild(p);

        document.getElementById("lstResGis").appendChild(a);


        ///Colocamos las marcas en el mapa
        MrkAntecedente.push(new L.marker([elemento.Lat, elemento.Lng], { icon: greenIcon })
            .addTo(map)
            .bindPopup("<b>" + elemento.Departamento + "-" + elemento.Year + "</b><br>" + elemento.Municipio + " C:" + (elemento.ind - 1) + "<br><button type='button' class='btn btn-secondary' onclick ='verCaso(" + (elemento.ind - 1) + ")'>Ver</button></br>")
        );
        nCasos++
    });
    document.getElementById("tlResultados").textContent = nCasos + " Resultados"
    nCasos = 0;
}


//*****************************************************
//Funciones para mostrar ventana caso
//*****************************************************
function verCaso(num) {
    document.getElementById('tlTipoCaso').textContent = "CASO " + DataPrincipal[num - 1].ind;
    document.getElementById('txTipo').textContent = DataPrincipal[num].Tipo;
    document.getElementById('txAño').textContent = DataPrincipal[num].Year;
    document.getElementById('txLugar').textContent = DataPrincipal[num].Municipio;
    document.getElementById('txEtnia').textContent = "Etnía (" + DataPrincipal[num].Pueblo + ")";
    document.getElementById('txPerpetuador').textContent = "Perpetuador(" + DataPrincipal[num].Perpetrador + ")";
    document.getElementById('txCaso').textContent = DataPrincipal[num].Antecedentes;
    bootstrap.Modal.getOrCreateInstance(document.getElementById('ModalCaseOnMap')).show();
}
///Modifca vicualmente el boton de buscar
function VerFindExtend() {
    let control = document.getElementById("PlusFind");
    if (control.hidden == true) {
        control.hidden = false
        document.getElementById("plusOption").textContent = "-"
    }
    else {
        control.hidden = true
        document.getElementById("plusOption").textContent = "+"
    }
}


function RemoverMarkers() {
    //Limpiamos cualquier marca en el mapa
    for (let i = 0; i < MrkAntecedente.length; i++) {
        //Limpia información de mi mapa principal
        map.removeLayer(MrkAntecedente[i]);
    }
}

function listasAutomaticas(cotrolList) {

    let criterio = document.getElementById(cotrolList).value;

    ///Ordena mi información alfabeticamente por criterio
    let CriterioSort;

    if (criterio == "Year") {
        CriterioSort = "a." + criterio + " - " + "b." + criterio
    }
    else if (criterio == "Edad") {
        CriterioSort = "a." + criterio + " - " + "b." + criterio
    }
    else {
        CriterioSort = "a." + criterio + ".localeCompare(b." + criterio + ")"
    }


    let DataPrincipalSort = DataPrincipal.sort((a, b) => eval(CriterioSort))



    document.getElementById("lstAutomatica").innerHTML = ""
    if (criterio !== "Antecedentes") {
        const Listas = [...new Map(DataPrincipalSort.map((filtro) => [eval("filtro." + criterio), filtro])).values()];
        Listas.forEach(elemento => {
            let itemLs = document.createElement("option")
            itemLs.value = eval("elemento." + criterio);
            itemLs.text = eval("elemento." + criterio);
            document.getElementById("lstAutomatica").appendChild(itemLs);

        })
    }
    else {
        let itemLs = document.createElement("option")
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


    // Agrega la imagen al documento 
    let tablabase = document.getElementById('tbResultados');
    if (tablabase) tablabase.remove();




    let tabla = document.createElement('table');
    let tablaHeader = document.createElement('thead');
    tabla.id = 'tbResultados';

    //Creamos el cuerpo de la tabla
    let tablaBody = document.createElement('tbody');

    //Creamos los encabezados
    let Encabezados = document.createElement('tr');


    let hdId = document.createElement('td');
    hdId.textContent = "ID";
    Encabezados.appendChild(hdId);

    let hdAño = document.createElement('td');
    hdAño.textContent = "Año";
    Encabezados.appendChild(hdAño);

    let hdDep = document.createElement('td');
    hdDep.textContent = "Departamento";
    Encabezados.appendChild(hdDep);

    let hdLugar = document.createElement('td');
    hdLugar.textContent = "Lugar";
    Encabezados.appendChild(hdLugar);

    let hdPueblo = document.createElement('td');
    hdPueblo.textContent = "Pueblo";
    Encabezados.appendChild(hdPueblo);

    let hdTipo = document.createElement('td');
    hdTipo.textContent = "Tipo";
    Encabezados.appendChild(hdTipo);

    let hdActor = document.createElement('td');
    hdActor.textContent = "Actor";
    Encabezados.appendChild(hdActor);

    let TextoHd
    TextoHd = document.createElement('td');
    TextoHd.textContent = "Territorio";
    Encabezados.appendChild(TextoHd);

    let hdFuente = document.createElement('td');
    hdFuente.textContent = "Fuente";
    Encabezados.appendChild(hdFuente);




    //Agregamos los encabezados
    tablaHeader.appendChild(Encabezados);
    tabla.appendChild(tablaHeader);




    //Agregar una columna de botones
    //let celOpciones = document.createElement('td');
    //celOpciones.textContent = '';


    let DatoCelta;
    let i = 1
    DataToReport.forEach(registro => {
        //Agrego una fila por cada registro de mi DBr
        let fila = document.createElement('tr');

        DatoCelta = document.createElement('td');
        DatoCelta.textContent = i;
        fila.appendChild(DatoCelta);

        //Agrego las columnas para cada fila
        DatoCelta = document.createElement('td');
        DatoCelta.textContent = registro.Year;
        fila.appendChild(DatoCelta);

        DatoCelta = document.createElement('td');
        DatoCelta.textContent = registro.Departamento;
        fila.appendChild(DatoCelta);

        DatoCelta = document.createElement('td');
        DatoCelta.textContent = registro.Municipio;
        fila.appendChild(DatoCelta);

        DatoCelta = document.createElement('td');
        DatoCelta.textContent = registro.Pueblo;
        fila.appendChild(DatoCelta);

        DatoCelta = document.createElement('td');
        DatoCelta.textContent = registro.Tipo;
        fila.appendChild(DatoCelta);

        DatoCelta = document.createElement('td');
        DatoCelta.textContent = registro.Perpetrador;
        fila.appendChild(DatoCelta);

        DatoCelta = document.createElement('td');
        DatoCelta.textContent = registro.Territorio;
        fila.appendChild(DatoCelta);

        DatoCelta = document.createElement('td');
        //DatoCelta.style.maxWidth= "50px"
        DatoCelta.textContent = registro.Fuente;
        fila.appendChild(DatoCelta);

        //Agrego filas y columnas al cuerpo de la tabla
        tablaBody.appendChild(fila)
        i++

    })

    tabla.appendChild(tablaBody);
    ContenedorTabla.appendChild(tabla);
    tabla.classList.add('table', 'table-striped', 'table-hover');

    tablaHeader.classList.add('table-dark', 'fw-bold');
}

function DocumentReport() {
    var ContenedorDocumento = document.getElementById("divDocModal");
    document.getElementById("divTableModal").innerHTML = ""
    divDocModal


    let contador=1;
    let tagElement;
    DataToReport.forEach(registro => {

        tagElement = document.createElement("div")
        tagElement.textContent = registro.Tipo;
        tagElement.classList.add("h4", "text-success")
        ContenedorDocumento.appendChild(tagElement);

        let sm = document.createElement("small");
        sm.classList.add('text-muted');
        sm.textContent = contador;
        ContenedorDocumento.appendChild(sm);
        contador++


        tagElement = document.createElement("div")
        tagElement.textContent = registro.Year;
        tagElement.classList.add("h5", "text-secondary","ms-2")
        ContenedorDocumento.appendChild(tagElement);

        tagElement = document.createElement("div")
        tagElement.textContent = registro.Departamento + " (" + registro.Municipio + ")";
        tagElement.classList.add("h6", "text-info-emphasis","ms-3")
        ContenedorDocumento.appendChild(tagElement);

        tagElement = document.createElement("div")
        tagElement.textContent = registro.Pueblo;
        tagElement.classList.add("h6", "text-primary" ,"ms-3")
        ContenedorDocumento.appendChild(tagElement);
        
        tagElement = document.createElement("div")
        tagElement.textContent = registro.Perpetrador;
        tagElement.classList.add("h7", "text-primary" ,"ms-4")
        ContenedorDocumento.appendChild(tagElement);

        tagElement = document.createElement("p")
        tagElement.textContent = registro.Antecedentes;
        tagElement.classList.add("fs-5", "text-dark", "mb-5","ms-5")
        ContenedorDocumento.appendChild(tagElement);

       


    })



}