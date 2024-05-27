//Esta variable guarda el proyecto activo como clase
let ActiveDB;
class clsObservatorio {
    constructor(id) {
        this.id = id
        this.clsCasos = []
    }

    //Todo esta clase se deriva a una cadena tipo Json
    convertToJSON() {
        const cache = [];
        return JSON.stringify(this, (key, value) => {
            if (typeof value === 'object' && value !== null) {
                if (cache.includes(value)) return;
                cache.push(value);
            }
            return value;
        });
    }

    //Inicia la transformación del objeto firebase en un objeto para la clase proyecto
    static loadAsInstance(objDatosODPI) {
        //Esta acción carga las actividades que están en firebase y la sube convierte en 
        //un objeto que llena la lista de areas
        const loadCasos = (fromclsCasos) => {
            return fromclsCasos.map(casos => {
                const casoNew = new Caso(
                    casos.id,
                    casos.macrotipo,
                    casos.detalle,
                    casos.parent,
                );
                //areaNew.cslNotas = loadNotas(Areas.cslNotas);
                return casoNew;
            })
        }
        //Crea una nueva clase datos
        const dataODPI = new clsObservatorio();
        //Lo carga en uan variable global
        GLOBAL.state.proyecto = dataODPI;
        //Identifica el marcador único ID
        dataODPI.id = objDatosODPI.id;
        dataODPI.clsCasos = loadCasos(objDatosODPI.clsCasos);
        mensajes("Se ha cargado la base de datos", "green")
        return dataODPI;

    }
    GuardarDataODPI() {
        const id = GLOBAL.firestore.updateProyecto(
            JSON.parse(ActiveDB.convertToJSON()))
    }
    addCaso(Caso) {
        this.clsCasos.push(Caso);
    }
    deleteCaso(id) {
        this.clsCasos.splice(id, 1);
        GuardarVigencia()
    }
}

class Caso {
    constructor(id, macrotipo, detalle, dominio) {
        this.id = id;
        this.macrotipo = macrotipo;
        this.detalle = detalle;
        this.parent = dominio;
    }
    makerHTMLCaso() {
        const intDetalle = document.getElementById("intDetalle")
        intDetalle.value = this.detalle
        intDetalle.oninput = () => {
            this.detalle = intDetalle.value
            GuardarDatos()
        }
        //
        const intMacrotipo = document.getElementById("intMacrotipo")
        intMacrotipo.value = this.macrotipo

        intMacrotipo.onchange = () => {
            this.macrotipo = intMacrotipo.value
            document.getElementById("caso" + this.id).textContent = this.macrotipo
            GuardarDatos()
        }

    }


}



function loadProyecto() {
    if (Registrado == 1) {
        const proyectos = GLOBAL.state.proyectos;
        ActiveDB = clsObservatorio.loadAsInstance(proyectos[0]);
        document.getElementById("panel-escritorio").hidden = false
        ListarCasos()
        gotoFirst()

        //Cargar macrotipos
        const lstMacrotipos = document.getElementById("intMacrotipo")
        lstMacrotipos.innerHTML = ""

        macrotipos.forEach(tipo => {
            const item = document.createElement("option")
            item.value = tipo
            item.textContent = tipo
            lstMacrotipos.appendChild(item)
        })
        gotoFirst()


    } else {
        mensajes("Aun no se ha registrado en el sistema", "orange")
        document.getElementById("panel-escritorio").hidden = true
    }
}
async function GuardarDatos() {
    try {
        ActiveDB.GuardarDataODPI();
        //mensajes("La información ha sido guardada", "green")
    } catch (error) {
        mensajes("Se ha presentado un problema: " + error.code, "red")
    }
}

async function AgregarCaso() {
    ActiveDB.addCaso(new Caso(0, "Sin macrotipo", "Sin detalle", ActiveDB))
    GuardarDatos()
    const lstCasos = document.getElementById("lstCasos")
    //Lo limpiamos
    lstCasos.innerHTML = ""
    let c = 0
    ActiveDB.clsCasos.forEach(caso => {
        const itemCaso = document.createElement("a");
        itemCaso.href = "#"
        itemCaso.className = "list-group-item list-group-item-action"
        itemCaso.textContent = caso.macrotipo
        lstCasos.appendChild(itemCaso)

        //Configuramos las acciones relacionadas con el item
        itemCaso.onclick = () => {
            caso.id = c++
            caso.makerHTMLCaso()
        }
    });
    gotoEnd()
    mensajes("Elemento creado", "Green")
}
async function ListarCasos() {
    const lstCasos = document.getElementById("lstCasos")
    //Lo limpiamos
    lstCasos.innerHTML = ""
    let c = 0
    ActiveDB.clsCasos.forEach(caso => {
        caso.id=c++
        const itemCaso = document.createElement("a");
        itemCaso.href = "#"
        itemCaso.className = "list-group-item list-group-item-action"
        itemCaso.textContent = caso.macrotipo
        itemCaso.id = "caso" + caso.id
        lstCasos.appendChild(itemCaso)

        //Configuramos las acciones relacionadas con el item
        itemCaso.onclick = () => {
            caso.makerHTMLCaso()
        }


    });

}
let activeIndex = 0;
async function gotoCaso(id) {
    activeIndex = id
    ActiveDB.clsCasos[id].makerHTMLCaso()
}
async function gotoFirst() {
    activeIndex = 0
    ActiveDB.clsCasos[0].makerHTMLCaso()
}
async function gotoEnd() {
    activeIndex = ActiveDB.clsCasos.length - 1
    ActiveDB.clsCasos[activeIndex].makerHTMLCaso()
}
async function gotoBackNext(option) {
    let newIndex
    //Si la opción es 0=back
    if (option == 0 && activeIndex > 0) {
        newIndex = activeIndex - 1
        activeIndex = newIndex

    } else if (option == 1 && activeIndex < ActiveDB.clsCasos.length) {
        newIndex = activeIndex + 1
        activeIndex = newIndex
    }
    ActiveDB.clsCasos[activeIndex].makerHTMLCaso()
}