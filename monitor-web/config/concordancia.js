function bulk_concordancia() {
    let MultiCasos = []
    //Cargamos la base de datos actual
    const proyectos = GLOBAL.state.proyectos;
    proyectos.forEach(proyecto => {
        proyecto.clsCasos.forEach(caso => {
            MultiCasos.push(caso)
        })
    })

    const campo = document.getElementById("lstCampos_concordancia").value.split("_")
    const tipo = document.getElementById("lstTipo_concordancia").value
    const valor = document.getElementById("intConcordancia").value.toLowerCase()

    const divresultados = document.getElementById("panel_res_concordancia")
    divresultados.innerHTML = ""

    let i = 0
    let datoA=""
    if (campo[0] == "clsCasos") {
        MultiCasos.forEach(caso => {
            
            if(Number.isInteger(caso[campo[1]])==true){
                datoA = caso[campo[1]]
            }else{
                datoA = caso[campo[1]].toLowerCase()
            }
            //Buscar
            if (tipo == "igual") {
                if (datoA == valor) {
                    _put_data(caso, i,datoA,valor)
                    i++
                }
            } else {
                if (datoA.includes(valor) == true) {
                    _put_data(caso, i,datoA,valor)
                    i++
                }
            }
        })
    } else {
        MultiCasos.forEach(caso => {
            caso[campo[0]].forEach(subcaso => {
                if(Number.isInteger(caso[campo[1]])==true){
                    datoA = subcaso[campo[1]]
                }else{
                    datoA = subcaso[campo[1]].toLowerCase()
                }
                //Buscar
                if (tipo == "igual") {
                    if (datoA == valor) {
                        _put_data(caso,i,datoA,valor)
                        i++
                    }
                } else {
                    if (datoA.includes(valor) == true) {
                        _put_data(caso,i,datoA,valor)
                        i++
                    }
                }
            })
        })
    }

    const criterios_concordancia = document.getElementById("criterios_concordancia")
    criterios_concordancia.textContent = ""
    criterios_concordancia.innerHTML = `Concordancia por "<b>${campo[1]}</b>" [<i>${tipo}</i>] "<b>${valor}</b>", número de resultados (<b>${i}</b>)`

    function _put_data(caso,id,campo,valor) {

        let personas = []
        let actores = []
        let lugares = []
        let pueblos = []

        caso.clsPersonas.forEach(dato => {
            personas.push(dato.nombres)
        })
        caso.clsActores.forEach(dato => {
            actores.push(dato.nombre)
        })

        caso.clsLugares.forEach(dato => {
            lugares.push(dato.municipio)
        })

        caso.clsPueblos.forEach(dato => {
            pueblos.push(dato.nombre)
        })

        let resaltar = campo.replace(valor,`<b class="text-success">${valor}</b>`)

        const divresultados = document.getElementById("panel_res_concordancia")
        const item = document.createElement("div")
        item.innerHTML = `
            <a class="nav-link active hchange-gray" data-bs-toggle="collapse" href="#collapse${id}" aria-expanded="false">
                <div class="row">
                    <div class="col-auto fw-bold text-end" style="width:50px;">${id + 1}.</div>
                    <div class="col-auto" style="width:150px;">CASO:${caso.id + 1}-${caso.vigencia}</div>
                    <div class="col-auto" style="width:200px;">${resaltar}</div>
                    <div class="col-auto">${caso.vigencia}</div>
                    <div class="col-auto">${caso.fecha}</div>
                    <div class="col">${caso.departamento}</div>
                    <div class="col">${caso.macrotipo}</div>
                    <div class="col">${caso.macroactor}</div>
                </div>
            </a>
            <div class="collapse ms-5 me-auto p-3 border border-1" id="collapse${id}" style="text-align: justify;">
                ${caso.detalle}
                <div class="m-2">
                    <div class="fw-bold mt-1">
                        Personas
                    </div>
                    <div>
                        ${personas}
                    </div>
                    <div class="fw-bold mt-1">
                        Actores
                    </div>
                    <div>
                        ${actores}
                    </div>
                    <div class="fw-bold mt-1">
                        Lugares
                    </div>
                    <div>
                        ${lugares}
                    </div>
                    <div class="fw-bold mt-1">
                        Pueblos
                    </div>
                    <div>
                        ${pueblos}
                    </div>
                </div>
            </div>
        `
        divresultados.appendChild(item)
    }
}