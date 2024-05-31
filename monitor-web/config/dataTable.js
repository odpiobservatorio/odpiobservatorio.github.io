let data;
function iniTables() {
    document.getElementById('panel-escritorio').hidden = true;
    document.getElementById('panel-escritorio').hidden = true;
    document.getElementById('element-to-print').hidden = true;
    document.getElementById('panel-Tablas').hidden = false;

    //Cargamos la base de datos actual
    const proyectos = GLOBAL.state.proyectos;
    ActiveDB = clsObservatorio.loadAsInstance(proyectos[0]);
    data = ActiveDB

    makerTable()
}
function makerTable() {
    const contenedor = document.getElementById('panel-Tablas')
    contenedor.innerHTML = ""
    //Creamos uan tabla general
    const tableParent = document.createElement("table")
    tableParent.className = "table table-hover table-bordered mt-4"

    //========================================================
    const thead = document.createElement("thead")
    thead.innerHTML =
        `
    <tr>
        <th>MACROREGIÓN</th>
        <th>DEPARTAMENTO</th>
        <th>LUGAR</th>
        <th>PUEBLO / ÉTNIA</th>
        <th>MACROTIPO</th>
        <th>SUB TIPO</th>
        <th>FECHA</th>
        <th># AFECTADOS</th>
    </tr>
    `
    tableParent.appendChild(thead)
    //========================================================
    //Agregar un body table
    const tbody = document.createElement("tbody")
    tableParent.appendChild(tbody)
    //========================================================

    //========================================================
    //POR CADA REGISTRO SE CREA UNA FILA EN LA TABLA TR
    console.log(data)
    data.clsCasos.forEach(caso => {
        const tr = document.createElement("tr")


        const td_macroregion = document.createElement("td")
        td_macroregion.style.verticalAlign="middle"
        td_macroregion.textContent = caso.macroregion
        tr.appendChild(td_macroregion)

        const td_departamento = document.createElement("td")
        td_departamento.style.verticalAlign="middle"
        td_departamento.textContent = caso.departamento
        tr.appendChild(td_departamento)


        const td_lugar = _crearCelda.data_lugar(caso)
        tr.appendChild(td_lugar)

        const td_pueblo = _crearCelda.data_pueblo(caso)
        tr.appendChild(td_pueblo)

        const td_macrotipo = document.createElement("td")
        td_macrotipo.style.verticalAlign="middle"
        td_macrotipo.textContent = caso.macrotipo
        tr.appendChild(td_macrotipo)

        const td_tipos = _crearCelda.data_tipos(caso)
        tr.appendChild(td_tipos)

        const td_fecha= document.createElement("td")
        td_fecha.style.verticalAlign="middle"
        td_fecha.textContent = caso.fecha
        tr.appendChild(td_fecha)

        const td_tpersonas= document.createElement("td")
        td_tpersonas.style.verticalAlign="middle"
        td_tpersonas.textContent = caso.npersonas
        tr.appendChild(td_tpersonas)





        tbody.appendChild(tr)

    });


    //Agregamos la tabla al contenedor
    contenedor.appendChild(tableParent)

}

const _crearCelda = {
    data_lugar(parent) {

        const acordeon= document.createElement("div")
        acordeon.className="accordion"
        acordeon.id=`accordion${parent.id}`

        const acordeonitem= document.createElement("div")
        acordeonitem.className="accordion-item"
        acordeon.appendChild(acordeonitem)

        const accordionheader= document.createElement("h3")
        accordionheader.className="accordion-header"
        acordeon.appendChild(accordionheader)

        const accordionbutton= document.createElement("div")
        accordionbutton.innerHTML=
        `
                    <button class="accordion-button border-0 border" type="button" style="background-color: white;" 
                                    data-bs-toggle="collapse" 
                                    data-bs-target="#collapse${parent.id}" 
                                    aria-expanded="true" 
                                    >
                        Lugares (${parent.clsLugares.length})
                    </button>
        `
        acordeon.appendChild(accordionbutton)

        const collapse= document.createElement("div")
        collapse.className="accordion-collapse collapse"
        collapse.id="collapse" + parent.id
        acordeon.appendChild(collapse)

        parent.clsLugares.forEach(lugar=>{
            const itemlugar = document.createElement("div")
            itemlugar.textContent=lugar.municipio
            itemlugar.className="label-org-gray-light"
            collapse.appendChild(itemlugar)

        })
        const td= document.createElement("td")
        td.appendChild(acordeon)
        return td
    },
    data_pueblo(parent){

        const acordeon= document.createElement("div")
        acordeon.className="accordion"
        acordeon.id=`accordionpueblo${parent.id}`

        const acordeonitem= document.createElement("div")
        acordeonitem.className="accordion-item"
        acordeon.appendChild(acordeonitem)

        const accordionheader= document.createElement("h3")
        accordionheader.className="accordion-header"
        acordeon.appendChild(accordionheader)

        const accordionbutton= document.createElement("div")
        accordionbutton.innerHTML=
        `
                    <button class="accordion-button border-0 border" type="button" style="background-color: white;" 
                                    data-bs-toggle="collapse" 
                                    data-bs-target="#collapsepueblo${parent.id}" 
                                    aria-expanded="true" 
                                    >
                        Pueblos ${parent.clsPueblos.length}
                    </button>
        `
        acordeon.appendChild(accordionbutton)

        const collapse= document.createElement("div")
        collapse.className="accordion-collapse collapse"
        collapse.id="collapsepueblo" + parent.id
        acordeon.appendChild(collapse)

        parent.clsPueblos.forEach(pueblo=>{
            const itempueblo = document.createElement("div")
            itempueblo.textContent=pueblo.nombre
            itempueblo.className="label-org-gray-light"
            collapse.appendChild(itempueblo)

        })
        const td= document.createElement("td")
        td.appendChild(acordeon)
        return td

    },
    data_tipos(parent){

        const acordeon= document.createElement("div")
        acordeon.className="accordion"

        const acordeonitem= document.createElement("div")
        acordeonitem.className="accordion-item"
        acordeon.appendChild(acordeonitem)

        const accordionheader= document.createElement("h3")
        accordionheader.className="accordion-header"
        acordeon.appendChild(accordionheader)

        const accordionbutton= document.createElement("div")
        accordionbutton.innerHTML=
        `
                    <button class="accordion-button border-0 border" type="button" style="background-color: white;" 
                                    data-bs-toggle="collapse" 
                                    data-bs-target="#collapsetipo${parent.id}" 
                                    aria-expanded="true" 
                                    >
                        Tipos (${parent.clsTipos.length})
                    </button>
        `
        acordeon.appendChild(accordionbutton)

        const collapse= document.createElement("div")
        collapse.className="accordion-collapse collapse"
        collapse.id="collapsetipo" + parent.id
        acordeon.appendChild(collapse)

        parent.clsTipos.forEach(tipo=>{
            const item = document.createElement("div")
            item.textContent=tipo.nombre
            item.className="label-org-gray-light"
            collapse.appendChild(item)

        })
        const td= document.createElement("td")
        td.appendChild(acordeon)
        return td

    }
}
