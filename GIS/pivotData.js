let rawData

const byId = (id) => {
    const control = document.getElementById(id)
    return control
}

const nEl = (id) => {
    const control = document.createElement(id)
    return control
}

function showPivotArea(value) {
    if (value == true) {
        document.getElementById("map").hidden = true;
        document.getElementById("pivot").hidden = false;
    } else {
        document.getElementById("map").hidden = false;
        document.getElementById("pivot").hidden = true;
    }
    let MultiCasos = {
        "clsCasos": []
    }

    let numCasos = 0
    let numVictimas = 0


    GLOBAL.state.proyectos.forEach(proyecto => {
        proyecto.clsCasos.forEach(caso => {
            MultiCasos.clsCasos.push(caso)

            //Indicadores base
            numCasos++
            numVictimas = numVictimas + caso.npersonas
        })
    })
    byId("val_total_casos").textContent = numCasos
    byId("val_total_victimas").textContent = numVictimas
    maker_ind_departamentos(MultiCasos, numCasos, numVictimas)
    maker_ind_municipios(MultiCasos, numCasos, numVictimas)
    maker_ind_macroafectacion(MultiCasos, numCasos, numVictimas)


    function maker_ind_departamentos(MultiCasos, numCasos, numVictimas) {
        let departamentos = []
        let con_departamentos = []
        for (id in MultiCasos.clsCasos) {
            const caso = MultiCasos.clsCasos[id]

            //Indicadores por departamento
            if (departamentos.includes(caso.departamento) !== true) {
                departamentos.push(caso.departamento)
                con_departamentos[caso.departamento] = {
                    "casos": 1,
                    "victimas": caso.npersonas,
                    "departamento": caso.departamento,
                }
            } else {
                con_departamentos[caso.departamento].casos = con_departamentos[caso.departamento].casos + 1
                con_departamentos[caso.departamento].victimas = con_departamentos[caso.departamento].victimas + caso.npersonas
            }
        }

        let aOrdenar = []

        for (lugar in con_departamentos) {
            aOrdenar.push([
                con_departamentos[lugar].departamento,
                parseInt(con_departamentos[lugar].casos),
                parseInt(con_departamentos[lugar].victimas),
                ((parseInt(con_departamentos[lugar].casos) / numCasos) * 100).toFixed(2),
                ((parseInt(con_departamentos[lugar].victimas) / numVictimas) * 100).toFixed(2)
            ]
            )
        }

        function compareByCasos(a, b) {
            if (a[1] < b[1]) {
                return -1;
            }
            if (a[1] > b[1]) {
                return 1;
            }
            return 0;
        }
        const depCasos = aOrdenar.sort(compareByCasos)


        byId("val_dep_casos").innerHTML = `${depCasos[depCasos.length - 1][0]}, 
            con <b class="text-secondary">${depCasos[depCasos.length - 1][1]}</b> 
            casos, que representa <b class="text-secondary">${depCasos[depCasos.length - 1][2]}</b>  
            víctimas, un  <b class="text-secondary">%${depCasos[depCasos.length - 1][3]}</b> sobre los casos`


        function compareByVictimas(a, b) {
            if (a[2] < b[2]) {
                return -1;
            }
            if (a[2] > b[2]) {
                return 1;
            }
            return 0;
        }
        const depVictimas = aOrdenar.sort(compareByVictimas)


        byId("val_dep_victimas").innerHTML = `${depVictimas[depVictimas.length - 1][0]}, 
                con <b class="text-secondary">${depVictimas[depVictimas.length - 1][1]}</b> 
                casos, que representa <b class="text-secondary">${depCasos[depCasos.length - 1][2]}</b>  
                víctimas, un  <b class="text-secondary">%${depVictimas[depVictimas.length - 1][4]}</b> sobre las víctimas`


        const controllis = byId("pivot_lis_departamentos")

        depCasos.forEach(dep => {
            const div = nEl("div")
            div.className = "row"
            div.innerHTML = `
            <div class="col-auto me-2" style="width: 200px;">${dep[0]}</div>
            <div class="col-auto me-2" style="width: 100px;">${dep[1]}</div>
            <div class="col-auto me-2" style="width: 100px;">%${dep[3]}</div>
            <div class="col-auto me-2" style="width: 100px;">${dep[2]}</div>
            <div class="col-auto me-2" style="width: 100px;">%${dep[4]}</div>
            `
            controllis.appendChild(div)
        })


    }

    function maker_ind_municipios(MultiCasos, numCasos, numVictimas) {
        let municipios = []
        let con_municipios = []
        for (id in MultiCasos.clsCasos) {
            const caso = MultiCasos.clsCasos[id]
            for (id in caso.clsLugares) {
                let lugar = caso.clsLugares[id]
                //Indicadores por departamento
                if (municipios.includes(lugar.municipio) !== true) {
                    municipios.push(lugar.municipio)
                    con_municipios[lugar.municipio] = {
                        "casos": 1,
                        "victimas": caso.npersonas,
                        "municipio": lugar.municipio,
                    }
                } else {
                    con_municipios[lugar.municipio].casos = con_municipios[lugar.municipio].casos + 1
                    con_municipios[lugar.municipio].victimas = con_municipios[lugar.municipio].victimas + caso.npersonas
                }
            }
        }

        let aOrdenar = []

        for (lugar in con_municipios) {
            aOrdenar.push([
                con_municipios[lugar].municipio,
                parseInt(con_municipios[lugar].casos),
                parseInt(con_municipios[lugar].victimas),
                ((parseInt(con_municipios[lugar].casos) / numCasos) * 100).toFixed(2),
                ((parseInt(con_municipios[lugar].victimas) / numVictimas) * 100).toFixed(2)]
            )
        }

        function compareByCasos(a, b) {
            if (a[1] < b[1]) {
                return -1;
            }
            if (a[1] > b[1]) {
                return 1;
            }
            return 0;
        }
        const munCasos = aOrdenar.sort(compareByCasos)

        byId("val_mun_casos").innerHTML = `${munCasos[munCasos.length - 1][0]}, 
            con <b class="text-secondary">${munCasos[munCasos.length - 1][1]}</b> 
            casos, que representa <b class="text-secondary">${munCasos[munCasos.length - 1][2]}</b>  
            víctimas, un  <b class="text-secondary">%${munCasos[munCasos.length - 1][3]}</b> sobre los casos`


        //====================================
        function compareByVictimas(a, b) {
            if (a[2] < b[2]) {
                return -1;
            }
            if (a[2] > b[2]) {
                return 1;
            }
            return 0;
        }
        const munVictimas = aOrdenar.sort(compareByVictimas)


        byId("val_mun_victimas").innerHTML = `${munVictimas[munVictimas.length - 1][0]}, 
                con <b class="text-secondary">${munVictimas[munVictimas.length - 1][1]}</b> 
                casos, que representa <b class="text-secondary">${munVictimas[munVictimas.length - 1][2]}</b>  
                víctimas, un  <b class="text-secondary">%${munVictimas[munVictimas.length - 1][4]}</b> sobre las víctimas`


        const controllis = byId("pivot_lis_municipios")

        munCasos.forEach(mun => {
            const div = nEl("div")
            div.className = "row"
            div.innerHTML = `
            <div class="col-auto me-2" style="width: 200px;">${mun[0]}</div>
            <div class="col-auto me-2" style="width: 100px;">${mun[1]}</div>
            <div class="col-auto me-2" style="width: 100px;">%${mun[3]}</div>
            <div class="col-auto me-2" style="width: 100px;">${mun[2]}</div>
            <div class="col-auto me-2" style="width: 100px;">%${mun[4]}</div>

            `
            controllis.appendChild(div)
        })


    }
    function maker_ind_macroafectacion(MultiCasos, numCasos, numVictimas) {
        let macroafectacion = []
        let con_macroafectacion = []
        for (id in MultiCasos.clsCasos) {
            const caso = MultiCasos.clsCasos[id]
            //Indicadores por departamento
            if (macroafectacion.includes(caso.macrotipo) !== true) {
                macroafectacion.push(caso.macrotipo)
                con_macroafectacion[caso.macrotipo] = {
                    "casos": 1,
                    "victimas": caso.npersonas,
                    "macrotipo": caso.macrotipo,
                }
            } else {
                con_macroafectacion[caso.macrotipo].casos = con_macroafectacion[caso.macrotipo].casos + 1
                con_macroafectacion[caso.macrotipo].victimas = con_macroafectacion[caso.macrotipo].victimas + caso.npersonas
            }
        }

        let aOrdenar = []

        for (tipo in con_macroafectacion) {
            aOrdenar.push([
                con_macroafectacion[tipo].macrotipo,
                parseInt(con_macroafectacion[tipo].casos),
                parseInt(con_macroafectacion[tipo].victimas),
                ((parseInt(con_macroafectacion[tipo].casos) / numCasos) * 100).toFixed(2),
                ((parseInt(con_macroafectacion[tipo].victimas) / numVictimas) * 100).toFixed(2)]
            )
        }

        function compareByCasos(a, b) {
            if (a[1] < b[1]) {
                return -1;
            }
            if (a[1] > b[1]) {
                return 1;
            }
            return 0;
        }
        const nCasos = aOrdenar.sort(compareByCasos)

        byId("val_macrotipo_casos").innerHTML = `${nCasos[nCasos.length - 1][0]}, 
            con <b class="text-secondary">${nCasos[nCasos.length - 1][1]}</b> 
            casos, que representa <b class="text-secondary">${nCasos[nCasos.length - 1][2]}</b>  
            víctimas, un  <b class="text-secondary">%${nCasos[nCasos.length - 1][3]}</b> sobre los casos`


        //====================================
        function compareByVictimas(a, b) {
            if (a[2] < b[2]) {
                return -1;
            }
            if (a[2] > b[2]) {
                return 1;
            }
            return 0;
        }
        const tipoVictimas = aOrdenar.sort(compareByVictimas)


        byId("val_macrotipo_victimas").innerHTML = `${tipoVictimas[tipoVictimas.length - 1][0]}, 
                con <b class="text-secondary">${tipoVictimas[tipoVictimas.length - 1][1]}</b> 
                casos, que representa <b class="text-secondary">${tipoVictimas[tipoVictimas.length - 1][2]}</b>  
                víctimas, un  <b class="text-secondary">%${tipoVictimas[tipoVictimas.length - 1][4]}</b> sobre las víctimas`


        const controllis = byId("pivot_lis_macrotipo")

        tipoVictimas.forEach(item => {
            const div = nEl("div")
            div.className = "row"
            div.innerHTML = `
            <div class="col-auto me-2" style="width: 200px;">${item[0]}</div>
            <div class="col-auto me-2" style="width: 100px;">${item[1]}</div>
            <div class="col-auto me-2" style="width: 100px;">%${item[3]}</div>
            <div class="col-auto me-2" style="width: 100px;">${item[2]}</div>
            <div class="col-auto me-2" style="width: 100px;">%${item[4]}</div>

            `
            controllis.appendChild(div)
        })


    }




}

