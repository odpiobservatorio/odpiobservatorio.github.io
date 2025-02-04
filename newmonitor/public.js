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
    }

    let nCasos = 0
    let nVictimas = 0
    let nCasosHoy=0

    
    for (id in split_Data) {
        const vigencia = split_Data[id]
        vigencia.clsCasos.forEach(caso => {
            nCasos++ //Aquí se suman todos los casos de cada vigencia
            nVictimas = nVictimas + parseInt(caso.npersonas)
            if(caso.vigencia=vig){
                console.log(caso.vigencia)
            }
        });
    }

    template_public.nCasos = nCasos
    template_public.nVictimas = nVictimas
    template_public.corte = `${dia}/${mes}/${vig}`

    GLOBAL.state.publicos[1].consolidados = template_public
    save_public_data()

}
function opendata() {
    console.clear()
    try {
        const data_public = GLOBAL.state.publicos[1].consolidados
        byE("nVictimas").textContent = formatNum((data_public.nVictimas))
        byE("nCasos").textContent = formatNum(data_public.nCasos)
        byE("lb_corte").textContent= "Fecha de actualización: " + data_public.corte
    } catch (error) {
        console.log("No en módulo público")
    }
}
function save_public_data() {
    const id = GLOBAL.firestore.updatePublico(GLOBAL.state.publicos[1])
}
