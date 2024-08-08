
let Datafilter = 0;
//const Layers = {}
const LayersDep = []

//let MarkPIR = []

let TextoLabel = "";
let ActiveLabels;

let ColorAA;



//.............................................
//Funciones que muestran capas separadas
//.............................................

//Test-----
function colorMap(casos, max = 794) {
    /*
    * Obtiene un gradiente de color dependiendo de cuantos casos hayan
    * n es el valor normalizado segun el maximo de casos
    */
    const n = (1000 / max) * casos;
    return n > 1000 ? '#800026' :
        n > 500 ? '#BD0026' :
            n > 200 ? '#E31A1C' :
                n > 100 ? '#FC4E2A' :
                    n > 50 ? '#FD8D3C' :
                        n > 20 ? '#FEB24C' :
                            n > 10 ? '#FED976' :
                                '#FFEDA0';
}
//------------


function RemoverLabels() {
    //Funcion de GoblaMapGraphiscs
    DeleteMarks()
}


