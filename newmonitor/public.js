const formatNum = (numero) => {
    const valorUnformat = numero
    const valFormated = valorUnformat.toLocaleString("us-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    return valFormated
}
function load_info_public() {
    const fecha_corte = new Date();
    let dia = fecha_corte.getDate()
    let mes = fecha_corte.getMonth() + 1
    let vig = fecha_corte.getFullYear()

    //GLOBAL.state.publicos
    //Iniciamos la recolección de los datos generales, casos y víctimas.
    let template_public = {
        'corte': "",
        'nCasos': 0,
        'nVictimas': 0,
        'nCasosHoy': 0,
        'nVictimasHoy': 0,
        'A_Vigencia': {
            'mayorCasos': ["", 0],
            'mayorVictimas': ["", 0],
            'text': "",
            'acumulado': [],
        }

    }

    let nCasos = 0
    let nVictimas = 0
    let nCasosHoy = 0
    let nVictimasHoy = 0

    let List_Vigencias = []
    let Data_vigencias = {}
    let List_Departamentos = []
    let Data_Departamentos = []

    for (id in split_Data) {
        const vigencia = split_Data[id]

        vigencia.clsCasos.forEach(caso => {
            nCasos++ //Aquí se suman todos los casos de cada vigencia
            nVictimas = nVictimas + parseInt(caso.npersonas)
            //Si la vigencia actual es la última, entonces guarda el dato
            if (caso.vigencia == vig) {
                nCasosHoy++
                nVictimasHoy = nVictimasHoy + parseInt(caso.npersonas)
            }
            //Verifica si hay una vigencia en la lista de vigencias
            if (List_Vigencias.includes(caso.vigencia) != true) {
                List_Vigencias.push(caso.vigencia)
                Data_vigencias[caso.vigencia] = {
                    'vigencia': caso.vigencia,
                    'casos': 0,
                    'victimas': 0
                }
            }
            //Verifica si hay departamento en la lista de departamentos
            if (List_Departamentos.includes(caso.departamento) != true) {
                List_Departamentos.push(caso.departamento)
                Data_Departamentos[caso.departamento] = {
                    'departamento': caso.departamento,
                    'casos': 0,
                    'victimas': 0
                }
            }
        });
    }

    //Conteos por año
    List_Vigencias.forEach(vig => {
        let n = 0
        for (id in split_Data) {
            const vigencia = split_Data[id]
            vigencia.clsCasos.forEach(caso => {
                if (caso.vigencia == vig) {
                    Data_vigencias[caso.vigencia].casos = n
                    Data_vigencias[caso.vigencia].victimas = Data_vigencias[caso.vigencia].victimas + parseInt(caso.npersonas)
                    n++
                }
            });
        }
        //Calcula los puntajes más altos en casos y victimas por año
        if (template_public.A_Vigencia.mayorCasos[1] < Data_vigencias[vig].casos) {
            template_public.A_Vigencia.mayorCasos[0] = Data_vigencias[vig].vigencia
            template_public.A_Vigencia.mayorCasos[1] = Data_vigencias[vig].casos
        }
        if (template_public.A_Vigencia.mayorVictimas[1] < Data_vigencias[vig].victimas) {
            template_public.A_Vigencia.mayorVictimas[0] = Data_vigencias[vig].vigencia
            template_public.A_Vigencia.mayorVictimas[1] = Data_vigencias[vig].victimas
        }
    })


    template_public.nCasos = nCasos
    template_public.nCasosHoy = nCasosHoy
    template_public.nVictimas = nVictimas
    template_public.nVictimasHoy = nVictimasHoy



    let texto_vigencias =
        `<p>Para el análisis realizado por el <i>CLÚSTER ODPI</i> en relación a la variable AÑO 
    se evidencia que la vigencia con mayor número de casos de afectaciones a los derechos de 
    los pueblos indígenas es el año <b>${template_public.A_Vigencia.mayorCasos[0]}</b> 
    con un total de <b>${template_public.A_Vigencia.mayorCasos[1]}</b> casos registrados.
    <p> En relación a el número de víctimas por año se encuentra que el año 
    <b>${template_public.A_Vigencia.mayorVictimas[0]}</b> es la vigencia con más registro de víctimas con
    un total de <b>${template_public.A_Vigencia.mayorVictimas[1]}</b> personas.`

    template_public.A_Vigencia.text = texto_vigencias
    template_public.A_Vigencia.acumulado = Data_vigencias



    template_public.corte = `${dia}/${mes}/${vig}`


    GLOBAL.state.publicos[1].consolidados = template_public
    save_public_data()

}
function opendata() {
    //console.clear()
    try {
        const data_public = GLOBAL.state.publicos[1].consolidados
        byE("nVictimas").textContent = formatNum((data_public.nVictimas))
        byE("nCasos").textContent = formatNum(data_public.nCasos)
        byE("nCasosHoy").textContent = formatNum(data_public.nCasosHoy)
        byE("nVictimasHoy").textContent = formatNum((data_public.nVictimasHoy))

        //Constuimos la información sobre vigencias
        byE("text_vigencias").innerHTML = data_public.A_Vigencia.text
        const tbody_vigencias = byE("tbody_vigencias")
        const acumulados = data_public.A_Vigencia.acumulado
        for (id in acumulados) {
            const tr = newE("tr", "tr" + id, "")

            const td_vig = newE("td", "td_vig", "fw-bold")
            td_vig.textContent = acumulados[id].vigencia
            tr.appendChild(td_vig)

            const td_casos = newE("td", "td_casos", "fw_normal text-end")
            td_casos.textContent = parseInt(acumulados[id].casos) + 1
            tr.appendChild(td_casos)

            const td_victimas = newE("td", "td_victimas", "fw_normal text-end")
            td_victimas.textContent = acumulados[id].victimas
            tr.appendChild(td_victimas)


            tbody_vigencias.appendChild(tr)

        }




        byE("lb_corte").textContent = "Fecha de actualización: " + data_public.corte
    } catch (error) {
        console.log("No en módulo público")
    }
}
function save_public_data() {
    const id = GLOBAL.firestore.updatePublico(GLOBAL.state.publicos[1])
}
