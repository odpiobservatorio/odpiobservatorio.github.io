
/* Mi lenguaje de busqueda */

/*
Ejemplo:
`
    (id > 2 && departamento == Antioquia)
    .||.
    (id == 10 && departamento == Cundinamarca)
    .&&.
    (id similar 10 || departamento similar Cundinamarca)
`

`
    (Year == 2023)
    .&&.
    (Perpetrador similar FF || Perpetrador similar ESMAD)
`
*/

function procesarHecho(cadena) {
    if (cadena == "&&" || cadena == "||") {
        return cadena;
    } else {
        const hecho = cadena.split(" ");
        const parsed = {
            "==": `(objeto["${hecho[0]}"]).toString().toUpperCase() == "${hecho[2].toUpperCase()}"`,
            ">": `objeto["${hecho[0]}"] > "${hecho[2]}"`,
            "<": `objeto["${hecho[0]}"] < "${hecho[2]}"`,
            "similar": `((objeto["${hecho[0]}"]).toString().toUpperCase()).includes("${hecho[2].toUpperCase()}")`,
        }
        return parsed[hecho[1]];
    }
}

function convertirQuery(raw) {

    // Separar por punto los predicados grandes y eliminar los parentesis
    const predicados = raw.split(".").map(
        t => t.replace(/\(|\)/g, '')
            .trim()
    );
    // Separar por coma los predicados pequeños
    return predicados.map(predicado => {
        if (predicado === "&&" || predicado === "||") {
            return predicado;
        } else {
            const hechos = predicado.split(/(\|\||&&)/g);
            return `(${hechos.map(h =>procesarHecho(h.trim())).join(" ")})`
        }
    }).join(" ").replace(/\n/g, ' ');
}


/* Lenguaje de guardado de configuracion */

// Estructura archivo de configuracion

/*  
loadMapConfig({
    mapConfig: {
        "color": "orange",
        "opacidad": "0.5",
        "markType": "green",
        "size": 0.2,
    },

    layers: [
        "LayerPlano",
        "LayerResguardos",
        "LayerDepartamentos",
    ]
})
*/
 
function loadMapConfig(config) {

    // Cargar configuracion de formato del mapa
    const mapConfig = config.mapConfig;
    for (const key in mapConfig) {
        formatoPlano[key] = mapConfig[key];
    }

    const layers = config.layers;

    // Agregar capas al mapa
    clearLayers();

    layers.forEach(layer => {
        // Agregar el check a la capa
        document.getElementById(layer).checked = true;

        // Agregar capa al mapa
        allLayers[layer]();
    });
}

function saveMapConfig() {

    // Obtener configuracion del mapa
    const mapConfig = formatoPlano;

    // Obtener capas activas
    const contenedor = (document.getElementById("lstResGis"));
    const listaChecks = contenedor.querySelectorAll(".form-check-input");

    const layers = []
    listaChecks.forEach(checkbox => {
        if (checkbox.checked) {
            layers.push(checkbox.id);
        }
    });

    // Crear objeto de configuracion
    const config = {
        mapConfig: mapConfig,
        layers: layers,
    }
    
    console.log(config);    
}


/* Funciones de utilidad */

function getColor(color = false) {
    /* 
    * Retorna -- un solo color si no se da argumentos -- 
    * o un array de colores del tamaño q le especifiquemos 
    */
    if (color) {
        const colors = []
        for (let i = 0; i < color; i++) {
            let color = "#";
            for (let i = 0; i < 6; i++) {
                color = color + ("0123456789ABCDEF")[Math.floor(Math.random() * 16)];
            }
            colors.push(color)
        }
        return colors
    } else {
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color = color + ("0123456789ABCDEF")[Math.floor(Math.random() * 16)];
        }
        return color
    }
}
