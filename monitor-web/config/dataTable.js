function iniTables() {
    document.getElementById('panel-escritorio').hidden = true;
    document.getElementById('panel-escritorio').hidden = true;
    document.getElementById('element-to-print').hidden = true;
    document.getElementById('panel-Tablas').hidden = false;

    //Cargamos la base de datos actual
    const proyectos = GLOBAL.state.proyectos;
    ActiveDB = clsObservatorio.loadAsInstance(proyectos[0]);
    data = ActiveDB

    makerTable(ActiveDB)
}
function makerTable(data) {
    const contenedor = document.getElementById('panel-Tablas')
    contenedor.innerHTML = ""
    //Creamos uan tabla general
    const tableParent = document.createElement("table")
    tableParent.className = "table table-hover table-bordered mt-4"

    //========================================================
    const thead = document.createElement("thead")
    
    thead.innerHTML =
        `
    <tr class="sticky-top">
        <th class="bg-secondary text-white">MACROREGIÓN</th>
        <th class="bg-secondary text-white">DEPARTAMENTO</th>
        <th class="bg-secondary text-white">LUGAR</th>
        <th class="bg-secondary text-white">PUEBLO / ÉTNIA</th>
        <th class="bg-secondary text-white">MACROTIPO</th>
        <th class="bg-secondary text-white">SUB TIPO</th>
        <th class="bg-secondary text-white">FECHA</th>
        <th class="bg-secondary text-white">MACRO ACTOR</th>
        <th class="bg-secondary text-white">OTROS ACTORES</th>
        <th class="bg-secondary text-white">DESPLAZAMIENTO</th>
        <th class="bg-secondary text-white">AFECTADOS</th>
        <th class="bg-secondary text-white">MUJERES</th>
        <th class="bg-secondary text-white">HOMBRES</th>
        <th class="bg-secondary text-white">MENORES</th>
        <th class="bg-secondary text-white">ACCIONES</th>
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

        const td_macroactor= document.createElement("td")
        td_macroactor.style.verticalAlign="middle"
        td_macroactor.textContent = caso.macroactor
        tr.appendChild(td_macroactor)

        const td_actores = _crearCelda.data_actores(caso)
        tr.appendChild(td_actores)

        const td_desplazamiento = _crearCelda.data_desplazamiento(caso)
        tr.appendChild(td_desplazamiento)

        const td_tpersonas= document.createElement("td")
        td_tpersonas.style.verticalAlign="middle"
        td_tpersonas.textContent = caso.npersonas
        tr.appendChild(td_tpersonas)

        const td_tmujeres= document.createElement("td")
        td_tmujeres.style.verticalAlign="middle"
        td_tmujeres.style.backgroundColor="pink"
        td_tmujeres.textContent = caso.nmujeres
        tr.appendChild(td_tmujeres)

        const td_thombres= document.createElement("td")
        td_thombres.style.verticalAlign="middle"
        td_thombres.textContent = caso.nhombres
        tr.appendChild(td_thombres)

        const td_tmenores= document.createElement("td")
        td_tmenores.style.verticalAlign="middle"
        td_tmenores.textContent = caso.nmenores
        tr.appendChild(td_tmenores)

        const td_acciones = _crearCelda.data_acciones(caso)
        tr.appendChild(td_acciones)



        tbody.appendChild(tr)

    });


    //Agregamos la tabla al contenedor
    contenedor.appendChild(tableParent)

}

const _crearCelda = {
    data_lugar(parent) {

        const acordeon= document.createElement("div")
        acordeon.className=""

        const acordeonitem= document.createElement("div")
        acordeonitem.className="accordion-item"
        acordeon.appendChild(acordeonitem)

        const accordionheader= document.createElement("h3")
        accordionheader.className="accordion-header"
        acordeon.appendChild(accordionheader)

        const accordionbutton= document.createElement("div")
        accordionbutton.innerHTML=
        `
                    <button class="accordion-button ps-2 border-1 rounded bg-warning-subtle" type="button"
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
            itemlugar.className="m-2"
            collapse.appendChild(itemlugar)

        })
        const td= document.createElement("td")
        if (parent.clsLugares.length!=0){
            td.appendChild(acordeon)
        }
        return td
    },
    data_pueblo(parent){

        const acordeon= document.createElement("div")
        acordeon.className=""

        const acordeonitem= document.createElement("div")
        acordeonitem.className="accordion-item"
        acordeon.appendChild(acordeonitem)

        const accordionheader= document.createElement("h3")
        accordionheader.className="accordion-header"
        acordeon.appendChild(accordionheader)

        const accordionbutton= document.createElement("div")
        accordionbutton.innerHTML=
        `
                    <button class="accordion-button ps-2 border-1 rounded bg-warning-subtle" type="button" 
                                    data-bs-toggle="collapse" 
                                    data-bs-target="#collapsepueblo${parent.id}" 
                                    aria-expanded="true" 
                                    >
                        Pueblos (${parent.clsPueblos.length})
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
            itempueblo.className="m-2"
            collapse.appendChild(itempueblo)

        })
        const td= document.createElement("td")
        if (parent.clsPueblos.length!=0){
            td.appendChild(acordeon)
        }
        return td

    },
    data_tipos(parent){

        const acordeon= document.createElement("div")
        acordeon.className=""

        const acordeonitem= document.createElement("div")
        acordeonitem.className="accordion-item"
        acordeon.appendChild(acordeonitem)

        const accordionheader= document.createElement("h3")
        accordionheader.className="accordion-header"
        acordeon.appendChild(accordionheader)

        const accordionbutton= document.createElement("div")
        accordionbutton.innerHTML=
        `
                    <button class="accordion-button ps-2 border-1 rounded bg-warning-subtle" type="button"
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
            item.className="m-2"
            collapse.appendChild(item)

        })
        const td= document.createElement("td")
        if (parent.clsTipos.length!=0){
            td.appendChild(acordeon)
        }
        return td

    },
    data_actores(parent){

        const acordeon= document.createElement("div")
        acordeon.className=""

        const acordeonitem= document.createElement("div")
        acordeonitem.className="accordion-item"
        acordeon.appendChild(acordeonitem)

        const accordionheader= document.createElement("h3")
        accordionheader.className="accordion-header"
        acordeon.appendChild(accordionheader)

        const accordionbutton= document.createElement("div")
        accordionbutton.innerHTML=
        `
                    <button class="accordion-button ps-2 border-1 rounded bg-warning-subtle" type="button"
                                    data-bs-toggle="collapse" 
                                    data-bs-target="#collapseactor${parent.id}" 
                                    aria-expanded="true" 
                                    >
                        Actores (${parent.clsActores.length})
                    </button>
        `
        acordeon.appendChild(accordionbutton)

        const collapse= document.createElement("div")
        collapse.className="accordion-collapse collapse"
        collapse.id="collapseactor" + parent.id
        acordeon.appendChild(collapse)

        parent.clsActores.forEach(actor=>{
            const item = document.createElement("div")
            item.textContent=actor.nombre
            item.className="m-2"
            collapse.appendChild(item)

        })
        const td= document.createElement("td")
        if (parent.clsActores.length!=0){
            td.appendChild(acordeon)
        }
        return td

    },
    data_desplazamiento(parent){

        const acordeon= document.createElement("div")
        acordeon.className=""

        const acordeonitem= document.createElement("div")
        acordeonitem.className="accordion-item"
        acordeon.appendChild(acordeonitem)

        const accordionheader= document.createElement("h3")
        accordionheader.className="accordion-header"
        acordeon.appendChild(accordionheader)

        const accordionbutton= document.createElement("div")
        accordionbutton.innerHTML=
        `
                    <button class="accordion-button ps-2 border-1 rounded bg-warning-subtle" type="button"
                                    data-bs-toggle="collapse" 
                                    data-bs-target="#collapseactor${parent.id}" 
                                    aria-expanded="true" 
                                    >
                        Hechos (${parent.clsDesplazamiento.length})
                    </button>
        `
        acordeon.appendChild(accordionbutton)

        const collapse= document.createElement("div")
        collapse.className="accordion-collapse collapse"
        collapse.id="collapseactor" + parent.id
        acordeon.appendChild(collapse)

        parent.clsDesplazamiento.forEach(hecho=>{
            const item = document.createElement("div")
            item.textContent=hecho.tipo
            item.className="m-2"
            collapse.appendChild(item)

        })
        const td= document.createElement("td")
        if (parent.clsDesplazamiento.length!=0){
            td.appendChild(acordeon)
        }
        return td

    },
    data_acciones(parent){

        const acordeon= document.createElement("div")
        acordeon.className=""

        const acordeonitem= document.createElement("div")
        acordeonitem.className="accordion-item"
        acordeon.appendChild(acordeonitem)

        const accordionheader= document.createElement("h3")
        accordionheader.className="accordion-header"
        acordeon.appendChild(accordionheader)

        const accordionbutton= document.createElement("div")
        accordionbutton.innerHTML=
        `
                    <button class="accordion-button ps-2 border-1 rounded bg-warning-subtle" type="button"
                                    data-bs-toggle="collapse" 
                                    data-bs-target="#collapseaccion${parent.id}" 
                                    aria-expanded="true" 
                                    >
                        Acciones (${parent.clsAccJuridica.length})
                    </button>
        `
        acordeon.appendChild(accordionbutton)

        const collapse= document.createElement("div")
        collapse.className="accordion-collapse collapse"
        collapse.id="collapseaccion" + parent.id
        acordeon.appendChild(collapse)

        parent.clsAccJuridica.forEach(accion=>{
            const item = document.createElement("div")
            item.textContent=accion.accion
            item.className="m-2"
            collapse.appendChild(item)

        })
        const td= document.createElement("td")
        if (parent.clsAccJuridica.length!=0){
            td.appendChild(acordeon)
        }
        return td

    }

}
