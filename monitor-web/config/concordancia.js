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
    
    let i=0
    if (campo[0] == "clsCasos") {
        MultiCasos.forEach(caso => {
            const datoA = caso[campo[1]].toLowerCase()
            if (tipo == "igual") {
                if (datoA == valor) {
                    _put_data(caso,i)
                    i++
                }
            } else {
                if (datoA.includes(valor) == true) {
                    _put_data(caso,i)
                    i++
                }
            }
        })
    } else {
        MultiCasos.forEach(caso => {
            caso[campo[0]].forEach(subcaso => {
                const datoA = subcaso[campo[1]].toLowerCase()
                if (tipo == "igual") {
                    if (datoA == valor) {
                        _put_data(caso,i)
                        i++
                    }
                } else {
                    if (datoA.includes(valor) == true) {
                        _put_data(caso,i)
                        i++
                    }
                }
            })
        })
    }


    const criterios_concordancia = document.getElementById("criterios_concordancia")
    criterios_concordancia.textContent=""
    criterios_concordancia.innerHTML=`Concordancia por "<b>${campo[1]}</b>" [<i>${tipo}</i>] "<b>${valor}</b>", número de resultados (<b>${i}</b>)`

    function _put_data(caso,id) {
        const divresultados = document.getElementById("panel_res_concordancia")
        const item= document.createElement("div")
        item.innerHTML=`
            <a class="nav-link active hchange-gray" data-bs-toggle="collapse" href="#collapse${id}" aria-expanded="false">
                <div class="row">
                    <div class="col-auto fw-bold text-end" style="width:50px;">${id + 1}.</div>
                    <div class="col-auto" style="width:150px;">CASO:${caso.id}-${caso.vigencia}</div>
                    <div class="col-auto">${caso.vigencia}</div>
                    <div class="col-auto">${caso.fecha}</div>
                    <div class="col">${caso.departamento}</div>
                    <div class="col">${caso.macrotipo}</div>
                    <div class="col">${caso.macroactor}</div>
                </div>
            </a>
            <div class="collapse ms-5 me-auto p-3 border border-1" id="collapse${id}" style="text-align: justify;">
                ${caso.detalle}
            </div>
        `
        divresultados.appendChild(item)
    }
}