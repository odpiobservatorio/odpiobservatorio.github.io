//Loader

console.log("........Loading.........")

// Utilizamos fetch para cargar el archivo JSON
fetch("test.json").then(response => response.json()).then(data => {
    let tex = (data, null, 2); // Puedes personalizar cómo se muestra la información
    console.log(tex)
}).catch(error => console.error("Error al cargar el archivo JSON:", error));

