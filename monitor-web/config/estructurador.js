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
    constructor(id, detalle, dominio) {
        this.id = id;
        this.detalle = detalle;
        this.parent = dominio;
    }

}



function loadProyecto() {
    if(Registrado==1){
        const proyectos = GLOBAL.state.proyectos;
        ActiveDB = clsObservatorio.loadAsInstance(proyectos[0]);
        document.getElementById("panel-escritorio").hidden=false
    }else{
        mensajes("Aun no se ha registrado en el sistema", "orange")
        document.getElementById("panel-escritorio").hidden=true
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
    ActiveDB.addCaso(new Caso(0, "Sin detalle", ActiveDB))
    GuardarDatos()
    mensajes("Elemento creado", "Green")
}
