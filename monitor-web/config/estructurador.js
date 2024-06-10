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
                    casos.vigencia,
                    casos.macroactor,
                    casos.nhombres,
                    casos.nmujeres,
                    casos.nmenores,
                    casos.npersonas,
                    casos.fuente,
                    casos.fechafuente,
                    casos.enlace,
                    casos.parent,
                );
                casoNew.clsTipos = loadTipos(casos.clsTipos);
                casoNew.clsLugares = loadLugares(casos.clsLugares);
                casoNew.clsPueblos = loadPueblos(casos.clsPueblos);
                casoNew.clsPersonas = loadPersonas(casos.clsPersonas);
                casoNew.clsActores = loadActores(casos.clsActores);
                casoNew.clsDesplazamiento = loadDesplazamiento(casos.clsDesplazamiento);
                casoNew.clsAccJuridica = loadMedidas(casos.clsAccJuridica);
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
        const loadPueblos = (fromclsPueblos) => {
            return fromclsPueblos.map(pueblos => {
                const puebloNew = new Pueblo(
                    pueblos.id,
                    pueblos.nombre,
                    pueblos.Parent
                );
                return puebloNew;
            })
        }
        const loadLugares = (fromclsLugares) => {
            return fromclsLugares.map(lugar => {
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

        const loadPersonas = (fromclsPersonas) => {
            return fromclsPersonas.map(persona => {
                const personaNew = new Persona(
                    persona.id,
                    persona.nombres,
                    persona.documento,
                    persona.genero,
                    persona.edad,
                    persona.cargo,
                    persona.parent,

                );
                return personaNew;
            })
        }

        const loadActores = (fromclsActores) => {
            return fromclsActores.map(actor => {
                const actornaNew = new Actores(
                    actor.id,
                    actor.nombre,
                    actor.parent,

                );
                return actornaNew;
            })
        }

        const loadDesplazamiento = (fromclsDesplaza) => {
            return fromclsDesplaza.map(hecho => {
                const hechoNew = new Desplazamientos(
                    hecho.id,
                    hecho.tipo,
                    hecho.fechaex,
                    hecho.lugarOri,
                    hecho.entornoOri,
                    hecho.fechaDes,
                    hecho.LugarDes,
                    hecho.TipoDes,
                    hecho.parent
                );
                return hechoNew;
            })
        }

        const loadMedidas = (fromclsAccJuridica) => {
            return fromclsAccJuridica.map(medida => {
                const medidaNew = new Medidas(
                    medida.id,
                    medida.accion,
                    medida.fecha,
                    medida.respuesta,
                    medida.parent,

                );
                return medidaNew;
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
    constructor(id, macrotipo, detalle, departamento,
        macroregion, detalleLugar, fecha, vigencia, macroactor,
        nhombres, nmujeres, nmenores, npersonas, fuente, fechafuente, enlace, dominio) {
        this.id = id;
        this.macrotipo = macrotipo;
        this.detalle = detalle;
        this.departamento = departamento;
        this.macroregion = macroregion;
        this.detalleLugar = detalleLugar;
        this.fecha = fecha;
        this.vigencia = vigencia;
        this.macroactor = macroactor;
        this.nhombres = nhombres;
        this.nmujeres = nmujeres;
        this.nmenores = nmenores;
        this.npersonas = npersonas;
        this.fuente = fuente;
        this.fechafuente = fechafuente;
        this.enlace = enlace;
        this.clsTipos = []
        this.clsLugares = []
        this.clsPueblos = []
        this.clsPersonas = []
        this.clsActores = []
        this.clsDesplazamiento = []
        this.clsAccJuridica = []
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
    addPueblo(Pueblo) {
        this.clsPueblos.push(Pueblo);
    }
    deletePueblo(id) {
        this.clsPueblos.splice(id, 1);
    }
    addPersona(Persona) {
        this.clsPersonas.push(Persona);
    }
    deletePersona(id) {
        this.clsPersonas.splice(id, 1);
    }
    addActor(Actor) {
        this.clsActores.push(Actor);
    }
    deleteActor(id) {
        this.clsActores.splice(id, 1);
    }
    addDesplazamiento(Hecho) {
        this.clsDesplazamiento.push(Hecho);
    }
    deleteDesplazamiento(id) {
        this.clsDesplazamiento.splice(id, 1);
    }

    addMedidas(medida) {
        this.clsAccJuridica.push(medida);
    }
    deleteMedidas(id) {
        this.clsAccJuridica.splice(id, 1);
    }

    makerHTMLCaso() {
        const intDetalle = document.getElementById("intDetalle")
        intDetalle.value = this.detalle
        intDetalle.oninput = () => {
            this.detalle = intDetalle.value
            GuardarDatos()
        }
        this._putMacrotipo()
        this._putSubTipos()
        this._putLugares()
        this._putPueblos()


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
            this.vigencia=new Date(this.fecha).getFullYear()
            GuardarDatos()
        }
        intFecha.value = this.fecha
        this.vigencia=new Date(this.fecha).getFullYear()

        //Cantidades de las personas afectadas
        const intnPersonas = document.getElementById("intnPersonas")
        intnPersonas.oninput = () => {
            this.npersonas = intnPersonas.value
            GuardarDatos()
        }
        intnPersonas.value = this.npersonas

        const intnPersonasM = document.getElementById("intnPersonasM")
        intnPersonasM.oninput = () => {
            this.nmujeres = intnPersonasM.value
            GuardarDatos()
        }
        intnPersonasM.value = this.nmujeres

        const intnPersonasH = document.getElementById("intnPersonasH")
        intnPersonasH.oninput = () => {
            this.nhombres = intnPersonasH.value
            GuardarDatos()
        }
        intnPersonasH.value = this.nhombres

        const intnPersonasMen = document.getElementById("intnPersonasMen")
        intnPersonasMen.oninput = () => {
            this.nmenores = intnPersonasMen.value
            GuardarDatos()
        }
        intnPersonasMen.value = this.nmenores



        this._putPersonas()
        this._putActores()
        this._putDesplazamiento()
        this._putMedidas()



    }
    //==========================================================================
    //==========================================================================
    _putMacrotipo() {
        //Agrega lista a los macrotipos
        const intMacrotipo = document.getElementById("intMacrotipo")
        intMacrotipo.value = this.macrotipo

        intMacrotipo.onchange = () => {
            this.macrotipo = intMacrotipo.value
            document.getElementById("caso" + this.id).textContent = this.macrotipo
            GuardarDatos()
        }
    }
    _putSubTipos() {
        //Identifico la lista de tipos alterna y configuro sus cambios
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
    }
    _putLugares() {
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
    }
    _putPueblos() {
        //Identifico el input de pueblo
        const lstPueblos = document.getElementById("lstPueblos")
        const contenedorPueblos = document.getElementById("contenedor-pueblos")
        lstPueblos.onchange = () => {
            contenedorPueblos.innerHTML = ""
            this.addPueblo(new Pueblo(0, lstPueblos.value, this))
            GuardarDatos()
            let p = 0;
            this.clsPueblos.forEach(pueblo => {
                pueblo.id = p++
                pueblo.parent = this
                pueblo.makerHTMLPueblo()
            })
        }

        contenedorPueblos.innerHTML = ""
        let p = 0;
        this.clsPueblos.forEach(pueblo => {
            pueblo.id = p++
            pueblo.parent = this
            pueblo.makerHTMLPueblo()
        })

        const intPueblo = document.getElementById("intPueblo")
        const btnAddPueblo = document.getElementById("btnAddPueblo")
        btnAddPueblo.onclick = () => {
            contenedorPueblos.innerHTML = ""
            this.addPueblo(new Pueblo(0, intPueblo.value, this))
            GuardarDatos()
            let p = 0;
            this.clsPueblos.forEach(pueblo => {
                pueblo.id = p++
                pueblo.parent = this
                pueblo.makerHTMLPueblo()
            })

        }
    }
    _putPersonas() {
        //Identificamos el contenedor
        const contenedorPersonas = document.getElementById("contenedor-personas")

        const btnAddPersonas = document.getElementById("btnAddPersonas")
        btnAddPersonas.onclick = () => {
            contenedorPersonas.innerHTML = ""
            this.addPersona(new Persona(0, "Sin determinar", "", "Sin determinar", "", "Sin determinar", this))
            GuardarDatos()
            let p = 0
            this.clsPersonas.forEach(persona => {
                persona.id = p++
                persona.parent = this
                persona.makerHTMLPersona()
            })
        }
        contenedorPersonas.innerHTML = ""
        let p = 0
        this.clsPersonas.forEach(persona => {
            persona.id = p++
            persona.parent = this
            persona.makerHTMLPersona()
        })
    }
    _putActores() {
        const intMacroactor = document.getElementById("intMacroactor")
        intMacroactor.onchange = () => {
            this.macroactor = intMacroactor.value
            GuardarDatos()
        }
        intMacroactor.value = this.macroactor

        const lstActores = document.getElementById("lstActores")
        const divActores = document.getElementById("contenedor-actores")
        divActores.innerHTML = ""
        lstActores.onchange = () => {
            divActores.innerHTML = ""
            this.addActor(new Actores(0, lstActores.value, this))
            GuardarDatos()
            let a = 0
            this.clsActores.forEach(actor => {
                actor.id = a++
                actor.parent = this
                actor.makerActores()
            })
        }
        let a = 0
        this.clsActores.forEach(actor => {
            actor.id = a++
            actor.parent = this
            actor.makerActores()
        })

    }
    _putDesplazamiento() {
        //Identificamos el contenedor
        const contenedorDesplazamiento = document.getElementById("contenedor-desplazamiento")

        const btnAdd = document.getElementById("btnAddDesplazamiento")
        btnAdd.onclick = () => {
            contenedorDesplazamiento.innerHTML = ""
            this.addDesplazamiento(new Desplazamientos(0, "Sin determinar", "0/0/0000", "Sin determinar", "Sin determinar", "0/0/0000", "Sin determinar", "Sin determinar", this))
            GuardarDatos()
            let d = 0
            this.clsDesplazamiento.forEach(hecho => {
                hecho.id = d++
                hecho.parent = this
                hecho.makerHTMLDesplazamiento()
            })
        }
        contenedorDesplazamiento.innerHTML = ""
        let d = 0
        this.clsDesplazamiento.forEach(hecho => {
            hecho.id = d++
            hecho.parent = this
            hecho.makerHTMLDesplazamiento()
        })

    }
    _putMedidas() {
        //Identificamos el contenedor
        const contenedorMedidas = document.getElementById("contenedor-medidas")

        const btnAdd = document.getElementById("btnAddMedidas")
        btnAdd.onclick = () => {
            contenedorMedidas.innerHTML = ""
            this.addMedidas(new Medidas(0, "Sin determinar", "0-0-0000", "Sin determinar", this))
            GuardarDatos()
            let m = 0
            this.clsAccJuridica.forEach(medida => {
                medida.id = m++
                medida.parent = this
                medida.makerHTMLMedidas()
            })
        }
        contenedorMedidas.innerHTML = ""
        let m = 0
        this.clsAccJuridica.forEach(medida => {
            medida.id = m++
            medida.parent = this
            medida.makerHTMLMedidas()
        })


    }
    _putFuente() {

        //Detalles adicionales al fuente
        const intFuente = document.getElementById("intFuente")
        intFuente.oninput = () => {
            this.fuente = intFuente.value
            GuardarDatos()
        }
        intFuente.value = this.fuente


        //Detalles adicionales al fuente
        const intFuenteFecha = document.getElementById("intFuenteFecha")
        intFuenteFecha.oninput = () => {
            this.fuefechafuentente = intFuenteFecha.value
            GuardarDatos()
        }
        intFuenteFecha.value = this.fechafuente

        //Detalles adicionales al fuente
        const intContacto = document.getElementById("intContacto")
        intFuenteFecha.oninput = () => {
            this.enlace = intContacto.value
            GuardarDatos()
        }
        intContacto.value = this.enlace
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
class Pueblo {
    constructor(id, nombre, dominio) {
        this.id = id;
        this.nombre = nombre;
        this.parent = dominio;
    }
    makerHTMLPueblo() {
        const contenedorPueblos = document.getElementById("contenedor-pueblos")
        //Creo el contenedor a
        const a = document.createElement("a")
        a.className = "nav-link label-org-gray-light"
        a.href = "#"
        a.innerHTML = `
            ${this.nombre}
            <i class="bi bi-trash3 ms-2" id="btnborrarPueblo${this.id}"></i>
            `
        contenedorPueblos.appendChild(a)
        const btnBorrarPueblo = document.getElementById(`btnborrarPueblo${this.id}`)
        btnBorrarPueblo.onclick = () => {
            this.parent.deletePueblo(this.id)
            GuardarDatos()
            //Se cargan todos los tipos
            contenedorPueblos.innerHTML = ""
            let p = 0
            this.parent.clsPueblos.forEach(pueblo => {
                pueblo.id = p++
                pueblo.parent = this.parent
                pueblo.makerHTMLPueblo()
            })
        }

    }
}
class Persona {
    constructor(id, nombres, documento, genero, edad, cargo, dominio) {
        this.id = id;
        this.nombres = nombres;
        this.documento = documento;
        this.genero = genero;
        this.edad = edad;
        this.cargo = cargo;


        this.parent = dominio;
    }
    makerHTMLPersona() {
        const contenedorPersonas = document.getElementById("contenedor-personas")
        //Creamos un boton para abrir collapse persona
        const div = document.createElement("div")
        div.className = "label-org-pink"
        div.innerHTML = ` 
    <a class="nav-link" data-bs-toggle="collapse" href="#collapsePersona${this.id}" role="button"
        aria-expanded="false">
        <div class="fw-medium ms-3" id="tituloPersona${this.id}">${this.nombres}</div>
    </a>    
    `
        contenedorPersonas.appendChild(div)

        const collapse = document.createElement("div")
        collapse.className = "collapse"
        collapse.id = "collapsePersona" + this.id
        contenedorPersonas.appendChild(collapse)

        const divbody = document.createElement("div")
        divbody.className = "card card-body ms-2 me-2"
        divbody.style.background = "#E5E7E9"
        collapse.appendChild(divbody)

        //Todas las acciones para el campo nombres
        const formNombre = document.createElement("form")
        formNombre.className = "form-floating mb-2"
        formNombre.innerHTML =
            `
            <input type="text" class="form-control" id="intNombres${this.id}" placeholder="nombres">
        <label for="intNombres">Nombres</label>
    `
        divbody.appendChild(formNombre)
        const intNombres = document.getElementById(`intNombres${this.id}`)
        intNombres.oninput = () => {
            this.nombres = intNombres.value
            document.getElementById(`tituloPersona${this.id}`).textContent = intNombres.value
            GuardarDatos()
        }
        intNombres.value = this.nombres

        //Todas las acciones para el campo documento
        const formDocumento = document.createElement("form")
        formDocumento.className = "form-floating mb-2"
        formDocumento.innerHTML =
            `
            <input type="number" class="form-control" id="intDocumento${this.id}" placeholder="# Documento">
            <label for="intDocumento${this.id}"># Documento</label>
        `
        divbody.appendChild(formDocumento)

        const intDocumento = document.getElementById(`intDocumento${this.id}`)
        intDocumento.oninput = () => {
            this.documento = intDocumento.value
            GuardarDatos()
        }
        intDocumento.value = this.documento
        //Todas las acciones para el género
        const formGenero = document.createElement("form")
        formGenero.className = "form-floating mb-2"
        formGenero.innerHTML =
            `
        <select class="form-select" id="intGenero${this.id}"
            aria-label="Floating label select example">
            <option value="Hombre">Hombre</option>
            <option value="Mujer">Mujer</option>
            <option value="Mujer">LGTBIQ+</option>
            <option value="Sin determinar">Sin determinar</option>
        </select>
        <label for="intGenero${this.id}">Género</label>
                `
        divbody.appendChild(formGenero)

        const intGenero = document.getElementById(`intGenero${this.id}`)
        intGenero.onchange = () => {
            this.genero = intGenero.value
            GuardarDatos()
        }
        intGenero.value = this.genero
        //Todas las acciones para edad
        const formEdad = document.createElement("form")
        formEdad.className = "form-floating mb-2"
        formEdad.innerHTML =
            `
            <input type="number" class="form-control" id="intEdad${this.id}" placeholder="Edad">
            <label for="intEdad${this.id}">Edad</label>
            `
        divbody.appendChild(formEdad)

        const intEdad = document.getElementById(`intEdad${this.id}`)
        intEdad.oninput = () => {
            this.edad = intEdad.value
            GuardarDatos()
        }
        intEdad.value = this.edad
        //Todas las acciones para ocupacion
        const formCargo = document.createElement("form")
        formCargo.className = "form-floating mb-2"
        formCargo.innerHTML =
            `
            <input type="text" class="form-control" id="intCargo${this.id}" placeholder="# Documento">
            <label for="intCargo${this.id}">Ocupación / Cargo</label>
            `
        divbody.appendChild(formCargo)

        const intCargo = document.getElementById(`intCargo${this.id}`)
        intCargo.oninput = () => {
            this.cargo = intCargo.value
            GuardarDatos()
        }
        intCargo.value = this.cargo

        const btnBorrar = document.createElement("button")
        btnBorrar.type = "button"
        btnBorrar.className = "btn btn-secondary"
        btnBorrar.innerHTML =
            `
        Eliminar elemento
        <i class="bi bi-trash3 ms-2"></i>
        `
        btnBorrar.onclick = () => {
            this.parent.deletePersona(this.id)
            GuardarDatos()
            contenedorPersonas.innerHTML = ""
            let p = 0
            this.parent.clsPersonas.forEach(persona => {
                persona.id = p++
                persona.parent = this.parent
                persona.makerHTMLPersona()
            })

        }
        divbody.appendChild(btnBorrar)


    }
}
class Actores {
    constructor(id, nombre, dominio) {
        this.id = id;
        this.nombre = nombre;
        this.parent = dominio;
    }
    makerActores() {
        const divActores = document.getElementById("contenedor-actores")
        //Creo el contenedor a
        const a = document.createElement("a")
        a.className = "nav-link label-org-rojod-dark"
        a.href = "#"
        a.innerHTML = `
        ${this.nombre}
        <i class="bi bi-trash3 ms-2" id="btnborrarActor${this.id}"></i>
        <small></small>
        `
        divActores.appendChild(a)
        const btnBorrar = document.getElementById(`btnborrarActor${this.id}`)
        btnBorrar.onclick = () => {
            this.parent.deleteActor(this.id)
            GuardarDatos()
            //Se cargan todos los tipos
            divActores.innerHTML = ""
            let a = 0
            this.parent.clsActores.forEach(actor => {
                actor.id = a++
                actor.parent = this.parent
                actor.makerActores()
            })
        }
        const intActor = document.getElementById("intActor")
        const btnAddActor = document.getElementById(`btnAddActor`)
        btnAddActor.onclick = () => {
            this.parent.addActor(new Actores(0, intActor.value, this))
            GuardarDatos()
            //Se cargan todos los tipos
            divActores.innerHTML = ""
            let a = 0
            this.parent.clsActores.forEach(actor => {
                actor.id = a++
                actor.parent = this.parent
                actor.makerActores()
            })
        }


    }
}
class Desplazamientos {
    constructor(id, tipo, fechaex, lugarOri, entornoOri, fechaDes, LugarDes, TipoDes, dominio) {
        this.id = id;
        this.tipo = tipo;
        this.fechaex = fechaex;
        this.lugarOri = lugarOri;
        this.entornoOri = entornoOri;
        this.fechaDes = fechaDes;
        this.LugarDes = LugarDes;
        this.TipoDes = TipoDes;
        this.parent = dominio;
    }
    makerHTMLDesplazamiento() {
        const contenedorDesplazamiento = document.getElementById("contenedor-desplazamiento")
        //Creamos un boton para abrir collapse persona
        const div = document.createElement("div")
        div.className = "label-org-gray-light"
        div.innerHTML = ` 
        <a class="nav-link" data-bs-toggle="collapse" href="#collapseHecho${this.id}" role="button"
            aria-expanded="false">
            <div class="fw-medium ms-3" id="tituloHecho${this.id}">${this.tipo}</div>
        </a>    
        `
        contenedorDesplazamiento.appendChild(div)
        const collapse = document.createElement("div")
        collapse.className = "collapse"
        collapse.id = "collapseHecho" + this.id
        contenedorDesplazamiento.appendChild(collapse)

        const divbody = document.createElement("div")
        divbody.className = "card card-body ms-2 me-2"
        divbody.style.background = "#E5E7E9"
        collapse.appendChild(divbody)

        //Todas las acciones para el tipo
        const formTipo = document.createElement("form")
        formTipo.className = "form-floating mb-2"
        formTipo.innerHTML =
            `
        <select class="form-select" id="intTipo${this.id}"
            aria-label="Floating label select example">
            <option value="Individual">Individual</option>
            <option value="Colectivo">Colectivo</option>
            <option value="Unifamiliar">Unifamiliar</option>
            <option value="Multifamiliar">Multifamiliar</option>
            <option value="Sin determinar">Sin determinar</option>

        </select>
        <label for="intTipo${this.id}">Tipo desplazamiento</label>
                `
        divbody.appendChild(formTipo)

        const intTipo = document.getElementById(`intTipo${this.id}`)
        intTipo.onchange = () => {
            this.tipo = intTipo.value
            document.getElementById(`tituloHecho${this.id}`).textContent = this.tipo
            GuardarDatos()
        }
        intTipo.value = this.tipo

        //Todas las acciones para el campo fecha1
        const formFecha = document.createElement("form")
        formFecha.className = "form-floating mb-2"
        formFecha.innerHTML =
            `
            <input type="date" class="form-control" id="intFechaEx${this.id}" placeholder="Fecha salida">
            <label for="intFechaEx${this.id}">Fecha salida</label>
            `
        divbody.appendChild(formFecha)

        const intFechaEx = document.getElementById(`intFechaEx${this.id}`)
        intFechaEx.oninput = () => {
            this.fechaex = intFechaEx.value
            GuardarDatos()
        }
        intFechaEx.value = this.fechaex

        //Todas las acciones para el lugar salida
        const formSalida = document.createElement("form")
        formSalida.className = "form-floating mb-2"
        formSalida.innerHTML =
            `
            <input type="text" class="form-control" id="intLugarOri${this.id}" placeholder="Lugar de salida">
            <label for="intLugarOri${this.id}">Lugar salida</label>
            `
        divbody.appendChild(formSalida)

        const intLugarOri = document.getElementById(`intLugarOri${this.id}`)
        intLugarOri.oninput = () => {
            this.lugarOri = intLugarOri.value
            GuardarDatos()
        }
        intLugarOri.value = this.lugarOri

        //Todas las acciones para el tipo urbano
        const formTipoUrbano = document.createElement("form")
        formTipoUrbano.className = "form-floating mb-2"
        formTipoUrbano.innerHTML =
            `
        <select class="form-select" id="intTipoUrbano${this.id}"
            aria-label="Floating label select example">
            <option value="Rural">Rural</option>
            <option value="Urbano">Urbano</option>
            <option value="Mixto">Mixto</option>
        </select>
        <label for="intTipoUrbano${this.id}">Entorno salida</label>
                `
        divbody.appendChild(formTipoUrbano)

        const intTipoUrbano = document.getElementById(`intTipoUrbano${this.id}`)
        intTipoUrbano.onchange = () => {
            this.entornoOri = intTipoUrbano.value
            GuardarDatos()
        }
        intTipoUrbano.value = this.entornoOri

        //Todas las acciones para el campo fecha2
        const formFecha2 = document.createElement("form")
        formFecha2.className = "form-floating mb-2"
        formFecha2.innerHTML =
            `
            <input type="date" class="form-control" id="intFechaDes${this.id}" placeholder="Fecha salida">
            <label for="intFechaDes${this.id}">Fecha llegada</label>
                    `
        divbody.appendChild(formFecha2)

        const intFechaDes = document.getElementById(`intFechaDes${this.id}`)
        intFechaDes.oninput = () => {
            this.fechaDes = intFechaDes.value
            GuardarDatos()
        }
        intFechaDes.value = this.fechaDes

        //Todas las acciones para el lugar llegada
        const formLlegada = document.createElement("form")
        formLlegada.className = "form-floating mb-2"
        formLlegada.innerHTML =
            `
            <input type="text" class="form-control" id="intLugarDes${this.id}" placeholder="Lugar de salida">
            <label for="intLugarOri${this.id}">Lugar llegada</label>
     `
        divbody.appendChild(formLlegada)

        const intLugarDes = document.getElementById(`intLugarDes${this.id}`)
        intLugarDes.oninput = () => {
            this.LugarDes = intLugarDes.value
            GuardarDatos()
        }
        intLugarDes.value = this.LugarDes

        //Todas las acciones para el tipo urbano
        const formTipoDestino = document.createElement("form")
        formTipoDestino.className = "form-floating mb-2"
        formTipoDestino.innerHTML =
            `
        <select class="form-select" id="intTipoDestino${this.id}"
            aria-label="Floating label select example">
            <option value="Rural">Rural</option>
            <option value="Urbano">Urbano</option>
            <option value="Mixto">Mixto</option>
        </select>
        <label for="intTipoDestino${this.id}">Entorno destino</label>
                `
        divbody.appendChild(formTipoDestino)

        const intTipoDestino = document.getElementById(`intTipoDestino${this.id}`)
        intTipoDestino.onchange = () => {
            this.TipoDes = intTipoDestino.value
            GuardarDatos()
        }
        intTipoDestino.value = this.TipoDes

        //Eliminar elemento
        const btnBorrar = document.createElement("button")
        btnBorrar.type = "button"
        btnBorrar.className = "btn btn-secondary"
        btnBorrar.innerHTML =
            `
        Eliminar elemento
        <i class="bi bi-trash3 ms-2"></i>
        `
        btnBorrar.onclick = () => {
            this.parent.deleteDesplazamiento(this.id)
            GuardarDatos()
            contenedorDesplazamiento.innerHTML = ""
            let h = 0
            this.parent.clsDesplazamiento.forEach(hecho => {
                hecho.id = h++
                hecho.parent = this.parent
                hecho.makerHTMLDesplazamiento()
            })

        }
        divbody.appendChild(btnBorrar)
    }
}
class Medidas {
    constructor(id, accion, fecha, respuesta, dominio) {
        this.id = id;
        this.accion = accion;
        this.fecha = fecha;
        this.respuesta = respuesta;
        this.parent = dominio;
    }
    makerHTMLMedidas() {
        const contenedorMedidas = document.getElementById("contenedor-medidas")
        //Creamos un boton para abrir collapse persona
        const div = document.createElement("div")
        div.className = "label-org-pink"
        div.innerHTML = ` 
        <a class="nav-link" data-bs-toggle="collapse" href="#collapseMedida${this.id}" role="button"
            aria-expanded="false">
            <div class="fw-medium ms-3" id="tituloMedida${this.id}">${this.accion}</div>
        </a>    
        `
        contenedorMedidas.appendChild(div)
        const collapse = document.createElement("div")
        collapse.className = "collapse"
        collapse.id = "collapseMedida" + this.id
        contenedorMedidas.appendChild(collapse)

        const divbody = document.createElement("div")
        divbody.className = "card card-body ms-2 me-2"
        divbody.style.background = "#E5E7E9"
        collapse.appendChild(divbody)
        //Todas las acciones para el campo medida
        const formMedida = document.createElement("form")
        formMedida.className = "form-floating mb-2"
        formMedida.innerHTML =
            `
        <input type="text" class="form-control" id="intMedida${this.id}">
        <label for="intNombres">Medida</label>
    `
        divbody.appendChild(formMedida)
        const intMedida = document.getElementById(`intMedida${this.id}`)
        intMedida.oninput = () => {
            this.accion = intMedida.value
            document.getElementById(`tituloMedida${this.id}`).textContent = intMedida.value
            GuardarDatos()
        }
        intMedida.value = this.accion

        //Todas las acciones para el campo medida
        const formFecha = document.createElement("form")
        formFecha.className = "form-floating mb-2"
        formFecha.innerHTML =
            `
                <input type="date" class="form-control" id="intFecha${this.id}">
                <label for="intNombres">Fecha de acción o medida</label>
            `
        divbody.appendChild(formFecha)
        const intFecha = document.getElementById(`intFecha${this.id}`)
        intFecha.oninput = () => {
            this.fecha = intFecha.value
            GuardarDatos()
        }
        intFecha.value = this.fecha

        //Todas las acciones para el campo medida
        const formREspuesta = document.createElement("form")
        formREspuesta.className = "form-floating mb-2"
        formREspuesta.innerHTML =
            `
                <input type="text" class="form-control" id="intRespuesta${this.id}">
                <label for="intNombres">Respuesta institucional</label>
            `
        divbody.appendChild(formREspuesta)
        const intRespuesta = document.getElementById(`intRespuesta${this.id}`)
        intRespuesta.oninput = () => {
            this.respuesta = intRespuesta.value
            GuardarDatos()
        }
        intRespuesta.value = this.respuesta

        const btnBorrar = document.createElement("button")
        btnBorrar.type = "button"
        btnBorrar.className = "btn btn-secondary"
        btnBorrar.innerHTML =
            `
        Eliminar elemento
        <i class="bi bi-trash3 ms-2"></i>
        `
        btnBorrar.onclick = () => {
            this.parent.deleteMedidas(this.id)
            GuardarDatos()
            contenedorMedidas.innerHTML = ""
            let p = 0
            this.parent.clsAccJuridica.forEach(medida => {
                medida.id = p++
                medida.parent = this.parent
                medida.makerHTMLMedidas()
            })

        }
        divbody.appendChild(btnBorrar)



    }
}

function loadProyecto() {
    if (Registrado == 1) {
        const proyectos = GLOBAL.state.proyectos;
        ActiveDB = clsObservatorio.loadAsInstance(proyectos[0]);
        document.getElementById("panel-escritorio").hidden = false
        document.getElementById("element-to-print").hidden = true
        document.getElementById("panel-Tablas-inicio").hidden = true
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

        //llenar lista pueblos
        const lstPueblos = document.getElementById("lstPueblos")
        lstPueblos.innerHTML = ""
        DataPueblos.forEach(pueblo => {
            const item = document.createElement("option")
            item.value = pueblo
            item.textContent = pueblo
            lstPueblos.appendChild(item)

        })
        //llenar lista macroactor
        const intMacroactor = document.getElementById("intMacroactor")
        intMacroactor.innerHTML = ""
        DataMacroActor.forEach(actor => {
            const item = document.createElement("option")
            item.value = actor
            item.textContent = actor
            intMacroactor.appendChild(item)

        })
        //llenar lista actor
        const lstActores = document.getElementById("lstActores")
        lstActores.innerHTML = ""
        DataActor.forEach(actor => {
            const item = document.createElement("option")
            item.value = actor
            item.textContent = actor
            lstActores.appendChild(item)
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
    ActiveDB.addCaso(new Caso(0,
        "Sin macrotipo", "Sin detalle", "Sin determinar",
        "Sin determinar", "", "0-0-0000", "Sin determinar", 0, 0, 0, 0, "Sin determinar", "0-0-0000", "Sin determinar", ActiveDB))
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