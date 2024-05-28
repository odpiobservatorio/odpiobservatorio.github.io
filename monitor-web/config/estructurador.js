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
                    casos.departamento,
                    casos.macroregion,
                    casos.detalleLugar,
                    casos.fecha,
                    casos.parent,
                );
                casoNew.clsTipos = loadTipos(casos.clsTipos);
                casoNew.clsLugares = loadLugares(casos.clsLugares);

                return casoNew;
            })
        }
        const loadTipos = (fromclsTipos) => {
            return fromclsTipos.map(tipos => {
                const tipoNew = new Tipo(
                    tipos.id,
                    tipos.nombre,
                    tipos.parent,
                );
                return tipoNew;
            })
        }
        const loadLugares = (clsLugares) => {
            return clsLugares.map(lugar => {
                const lugarNew = new Lugar(
                    lugar.id,
                    lugar.municipio,
                    lugar.latlng,
                    lugar.lat,
                    lugar.lng,
                );
                return lugarNew;
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
    }
}

class Caso {
    constructor(id, macrotipo, detalle, departamento, macroregion, detalleLugar, fecha, dominio) {
        this.id = id;
        this.macrotipo = macrotipo;
        this.detalle = detalle;
        this.departamento = departamento;
        this.macroregion = macroregion;
        this.detalleLugar = detalleLugar;
        this.fecha = fecha;
        this.clsTipos = []
        this.clsLugares = []
        this.parent = dominio;
    }
    addTipo(Tipo) {
        this.clsTipos.push(Tipo);
    }
    deleteTipo(id) {
        this.clsTipos.splice(id, 1);
    }
    addLugar(Lugar) {
        this.clsLugares.push(Lugar);
    }
    deleteLugar(id) {
        this.clsLugares.splice(id, 1);
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

        //Identifico la lista de tipos alterna y configuro ssus cambios
        //Cuando cambio un elemento de la lista, lo agrega a la lista de tipos
        const lstTipos = document.getElementById("lstTipos")
        const contenedorTipos = document.getElementById("contenedor-tipos")
        //Se agregan nuevos tipo
        lstTipos.onchange = () => {
            contenedorTipos.innerHTML = ""
            //Agrega un elemento tipo desde una nueva lcase tipo
            this.addTipo(new Tipo(0, lstTipos.value, this))
            GuardarDatos()
            let t = 0
            this.clsTipos.forEach(tipo => {
                tipo.id = t++
                tipo.parent = this
                tipo.makerHTMLTipo()
            })
        }
        //Se cargan todos los tipos
        contenedorTipos.innerHTML = ""
        let t = 0
        this.clsTipos.forEach(tipo => {
            tipo.id = t++
            tipo.parent = this
            tipo.makerHTMLTipo()
        })

        //Identifico el input de departamentos
        const intDepartamento = document.getElementById("intDepartamento")
        const intMacroregion = document.getElementById("intMacroregional")
        intDepartamento.value = this.departamento
        //Filtramos los lugares según la entrada del registro
        filtrarLugares(this.departamento)
        intMacroregion.value = this.macroregion

        intDepartamento.onchange = () => {
            this.departamento = intDepartamento.value
            intMacroregion.value = departamentos[intDepartamento.selectedIndex].macroregion
            this.macroregion = intMacroregion.value
            GuardarDatos()
            //Según sea el departamento, se debe filtrar los lugares
            filtrarLugares(this.departamento)
        }

        //Configuramos las acciones del listado de lugares
        const lstLugares = document.getElementById("lstLugar")
        const contenedorLugares = document.getElementById("contenedor-lugares")
        lstLugares.onchange = () => {
            contenedorLugares.innerHTML = ""
            //Preparamso las variables
            const nlugar = lstLugares.value
            const filterDep = lugares.filter(lugares => lugares.key == intDepartamento.value + nlugar)
            const latlgnParse = filterDep[0].latlng.split(",")
            //Agrega un elemento tipo desde una nueva clase lugar
            this.addLugar(new Lugar(0, filterDep[0].lugar, filterDep[0].latlng, latlgnParse[0], latlgnParse[1]))
            GuardarDatos()
            let l = 0
            this.clsLugares.forEach(lugar => {
                lugar.id = l++
                lugar.parent = this
                lugar.makerHTMLLugar()
            })
        }

        //Configuramos la entrada alterna o manual, sin usar la lista de lugares
        const btnAddLugar = document.getElementById("btnAddLugar")
        btnAddLugar.onclick = () => {
            contenedorLugares.innerHTML = ""
            //Preparamso las variables
            const nlugar = document.getElementById("intLugar").value
            const coordenadas = document.getElementById("intCoordenadas").value
            const latlgnParse = coordenadas.split(",")
            //Agrega un elemento tipo desde una nueva clase lugar
            this.addLugar(new Lugar(0, nlugar, coordenadas, latlgnParse[0], latlgnParse[1]))
            GuardarDatos()
            let l = 0
            this.clsLugares.forEach(lugar => {
                lugar.id = l++
                lugar.parent = this
                lugar.makerHTMLLugar()
            })


        }

        //Carga los lugares que existén en cada caso
        contenedorLugares.innerHTML = ""
        let l = 0
        this.clsLugares.forEach(lugar => {
            lugar.id = l++
            lugar.parent = this
            lugar.makerHTMLLugar()
        })

        //Detalles adicionales al lugar
        const intDetalleLugar = document.getElementById("intDetalleLugar")
        intDetalleLugar.oninput = () => {
            this.detalleLugar = intDetalleLugar.value
            GuardarDatos()
        }
        intDetalleLugar.value = this.detalleLugar

        //}fecha del evento
        const intFecha = document.getElementById("intFecha")
        intFecha.oninput = () => {
            this.fecha = intFecha.value
            document.getElementById("casoyear" + this.id).textContent =
                new Date(this.fecha).getFullYear()
            GuardarDatos()
        }
        intFecha.value = this.fecha

    }



}
class Tipo {
    constructor(id, nombre, dominio) {
        this.id = id;
        this.nombre = nombre;
        this.parent = dominio;
    }
    makerHTMLTipo() {
        const contenedorTipos = document.getElementById("contenedor-tipos")
        //Creo el contenedor a
        const a = document.createElement("a")
        a.className = "nav-link label-org-warning"
        a.href = "#"
        a.innerHTML = `
        ${this.nombre}
        <i class="bi bi-trash3 ms-2" id="btnborrarTipo${this.id}"></i>
        `
        contenedorTipos.appendChild(a)
        const btnBorrarTipo = document.getElementById(`btnborrarTipo${this.id}`)
        btnBorrarTipo.onclick = () => {
            this.parent.deleteTipo(this.id)
            GuardarDatos()
            //Se cargan todos los tipos
            contenedorTipos.innerHTML = ""
            let t = 0
            this.parent.clsTipos.forEach(tipo => {
                tipo.id = t++
                tipo.parent = this.parent
                tipo.makerHTMLTipo()
            })
        }

    }

}
class Lugar {
    constructor(id, municipio, latlng, lat, lng) {
        this.id = id;
        this.municipio = municipio;
        this.latlng = latlng;
        this.lat = lat;
        this.lng = lng;
    }
    makerHTMLLugar() {
        const contenedorLugares = document.getElementById("contenedor-lugares")
        //Creo el contenedor a
        const a = document.createElement("a")
        a.className = "nav-link label-org-green-light"
        a.href = "#"
        a.innerHTML = `
        ${this.municipio} (${this.lat}, ${this.lng})
        <i class="bi bi-trash3 ms-2" id="btnborrarLugar${this.id}"></i>
        <small></small>
        `
        contenedorLugares.appendChild(a)
        const btnBorrarLugar = document.getElementById(`btnborrarLugar${this.id}`)
        btnBorrarLugar.onclick = () => {
            this.parent.deleteLugar(this.id)
            GuardarDatos()
            //Se cargan todos los tipos
            contenedorLugares.innerHTML = ""
            let t = 0
            this.parent.clsLugares.forEach(lugar => {
                lugar.id = t++
                lugar.parent = this.parent
                lugar.makerHTMLLugar()
            })
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

        //Cargar macrotipos y tipos
        const lstMacrotipos = document.getElementById("intMacrotipo")
        lstMacrotipos.innerHTML = ""


        macrotipos.forEach(tipo => {
            const item = document.createElement("option")
            item.value = tipo
            item.textContent = tipo
            lstMacrotipos.appendChild(item)
        })

        const lstTipos = document.getElementById("lstTipos")
        lstTipos.innerHTML = ""
        macrotipos.forEach(tipo => {
            const item = document.createElement("option")
            item.value = tipo
            item.textContent = tipo
            lstTipos.appendChild(item)
        })

        const intDepartamento = document.getElementById("intDepartamento")
        intDepartamento.innerHTML = ""
        departamentos.forEach(dep => {
            const item = document.createElement("option")
            item.value = dep.departamento
            item.textContent = dep.departamento
            intDepartamento.appendChild(item)

        })
        filtrarLugares("Amazonas")


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
    ActiveDB.addCaso(new Caso(0, "Sin macrotipo", "Sin detalle", "Sin determinar", "Sin determinar", "", "0-0-0000", ActiveDB))
    GuardarDatos()
    ListarCasos()
    gotoEnd()
    mensajes("Elemento creado", "Green")
}

async function BorrarCaso() {

    modal.modalDelete(
        () => {
            //Esta función encrustada borra una vigencia
            ActiveDB.deleteCaso(activeIndex)
            GuardarDatos()
            ListarCasos()
            gotoFirst()
            activeIndex = 0
            mensajes("La vigencia ha sido eliminada", "blue")
        }
    )



}
async function ListarCasos() {
    const lstCasos = document.getElementById("lstCasos")
    //Lo limpiamos
    lstCasos.innerHTML = ""
    let c = 0
    ActiveDB.clsCasos.forEach(caso => {
        let año = new Date(caso.fecha).getFullYear()
        caso.id = c++
        const itemCaso = document.createElement("li");
        itemCaso.href = "#"
        itemCaso.className = "list-group-item d-flex justify-content-between align-items-start list-group-item-action border border-0"
        itemCaso.innerHTML = `    
        <div class="ms-2 me-auto">
            <div class="" id="caso${caso.id}">${caso.macrotipo}</div>   
        </div>
        <span id="casoyear${caso.id}" class="badge text-bg-primary rounded-pill">${año}</span>`


        lstCasos.appendChild(itemCaso)

        //Configuramos las acciones relacionadas con el item
        itemCaso.onclick = () => {
            caso.makerHTMLCaso()
        }

    });

}
function filtrarLugares(dep) {
    const lstLugares = document.getElementById("lstLugar")
    lstLugares.innerHTML = ""

    const filterDep = lugares.filter(lugares => lugares.departamento == dep)
    filterDep.forEach(lugar => {
        const item = document.createElement("option")
        item.value = lugar.lugar
        item.textContent = lugar.lugar
        lstLugares.appendChild(item)
    })

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