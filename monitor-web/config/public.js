let data_public
const formatNum = (numero) => {
    const valorUnformat = numero
    const valFormated = valorUnformat.toLocaleString("us-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    return valFormated
}

async function opendata() {
    data_public = GLOBAL.state.publicos[0]
    try {

        const nvictimas = document.getElementById("nvictimas")
        const ncasos = document.getElementById("ncasos")
        nvictimas.textContent = formatNum(data_public.consolidados[0].acumulados[0].victimas)
        ncasos.textContent = formatNum(data_public.consolidados[0].acumulados[0].casos)

        const nvictimasHoy = document.getElementById("nvictimasHoy")
        const ncasosHoy = document.getElementById("ncasosHoy")
        nvictimasHoy.textContent = formatNum(data_public.consolidados[0].actual[0].victimas)
        ncasosHoy.textContent = formatNum(data_public.consolidados[0].actual[0].casos)

        const corteData = document.getElementById("corteData")
        corteData.textContent="Informe a corte de " + data_public.corte


        
    } catch (error) {
        
    }


}
function maker_years(data){

}
