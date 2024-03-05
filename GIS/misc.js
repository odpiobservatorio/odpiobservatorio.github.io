const GLOBAL = {
    state: {
        proyecto: null,
        proyectos: [],
        usuario: null,
        usuarios: [],
    },
    firestore: {},
};

let aUsers = []
let activeEmail;


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
            return `(${hechos.map(h => procesarHecho(h.trim())).join(" ")})`
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

function loadMapConfig(input) {
    /*
    * Cargar configuracion de formato del mapa y capas
    * desde un archivo JSON y aplicarlo
    */

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const config = JSON.parse(e.target.result);

        // Cargar configuracion de formato del mapa
        const mapConfig = config.mapConfig;
        for (const key in mapConfig) {
            formatoPlano[key] = mapConfig[key];
        }

        const layers = config.layers;

        // Limpiar capas
        clearLayers();

        // Bases
        const baseLayers = ["LayerFondo", "LayerPlano"]

        // Layers
        const mapLayers = layers.filter(layer =>
            allLayers.hasOwnProperty(layer) && (!baseLayers.includes(layer))
        )

        // Macros
        const macros = layers.filter(layer => !(allLayers.hasOwnProperty(layer)))

        // Layers
        baseLayers.forEach(layer => {
            if (layers.includes(layer)) {
                document.getElementById(layer).checked = true;
                allLayers[layer]();
            }
        })

        macros.forEach(macro => {
            document.getElementById(macro).checked = true;
            seeMacro(macro);
        })

        mapLayers.forEach(layer => {
            // Agregar el check a la capa
            document.getElementById(layer).checked = true;
            // Agregar capa al mapa
            allLayers[layer]();
        });

    };
    reader.readAsText(file);
}

function saveMapConfig() {
    /*
    * Guardar configuracion de formato del mapa y capas
    * en un archivo JSON
    */

    // Obtener configuracion del mapa
    const mapConfig = formatoPlano;

    // Obtener capas activas
    const contenedor = (document.getElementById("lstLayers"));
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

    // Guardar y descargar archivo json
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config));
    const downloadElement = document.createElement('a');
    downloadElement.setAttribute("href", dataStr);
    downloadElement.setAttribute("download", "mapConfig.json");
    document.body.appendChild(downloadElement); // required for firefox
    downloadElement.click();
    downloadElement.remove();
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

function normalizeString(string) {
    return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}

function mensajes(text, color) {
    Toastify({
        text: text,
        duration: 3000,
        destination: "",
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: color,
            color: "white",
        },
        onClick: function () { } // Callback after click
    }).showToast();

}


function modalIn() {
    const modal = new bootstrap.Modal(document.getElementById('myModal'));
    const texto = document.getElementById("textoModal")


    modal.show();
    const btn = document.getElementById('btnConfirm')
    btn.onclick = ()=> IniCredential()

}
