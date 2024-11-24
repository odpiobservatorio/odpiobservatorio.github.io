let join_Data = [];
let split_Data;
function openIni() {
    byE("menu_general").hidden = false
    //alert("ingresamos")
    //console.log(GLOBAL.state.vigencias)

    const temp_vigencias = GLOBAL.state.vigencias

    temp_vigencias.forEach(vigencia => {

        vigencia.clsCasos.forEach(caso => {
            join_Data.push({
                "clsCasos": caso
            })
        })
    })
    split_Data = GLOBAL.state.vigencias
}
function run_casos() {
    const contenedor = byE("panel_escritorio")
    contenedor.innerHTML = ""
    //Creamos un selector de vigencias
    const selVigencias = newE("select", "selVigencias", "form-control")
    contenedor.appendChild(selVigencias)
    //Ahora agregamos las vigencias

    let last_vigencia;
    split_Data.forEach(vigencia => {
        const item = newE("option", "option" + vigencia.id, "")
        item.value=vigencia.id
        item.textContent=vigencia.id
        selVigencias.appendChild(item)
        last_vigencia=vigencia.id
        //console.log(vigencia)
    })
    selVigencias.value=last_vigencia

}