//Los archivos en los que se dividio la informacion ambiental inicializan 3 variables q tienen informacion en formato de string
//luego se concadenan en la variable ambiental y se convierten en el objeto con toda la informacion
//Hace lo mismo que tener el archivo gigante, pero se dividio la informacion por el uso del servidor
let ambiental = JSON.parse(("{" + data1 + data2 +  data3 + "}"));