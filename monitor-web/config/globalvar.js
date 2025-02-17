const GLOBAL = {
    state: {
        proyecto: null,
        proyectos: [],
        usuario: null,
        usuarios: [],
        publico:null,
        publicos:[]
    },
    firestore: {},
};

let aUsers = []
let activeEmail;
let Registrado=0


function IniCredential() {
    //Lee la información del form,ulario de ingreso en index.html
    const email = document.getElementById("inEmail").value
    const password = document.getElementById("inPass").value
    //Evoca la función global de ingreso, en archivo (cinfirdata.js) 
    GLOBAL.firestore.CredentialIn(email, password)

}
function IniCredentialOpen() {
    //Lee la información del form,ulario de ingreso en index.html
    const email = "wilson.largo.s@gmail.com"
    const password = "Pr1nc3sa"
    //Evoca la función global de ingreso, en archivo (cinfirdata.js) 
    GLOBAL.firestore.CredentialIn2(email, password)
}
function SignOut() {
    location.href = "../index.html"
    //GLOBAL.firestore.CredentialOut()
}
function autenticar(){
    const modal = new bootstrap.Modal(document.getElementById('myModal'));
    const texto = document.getElementById("textoModal")
    modal.show();
    const btn = document.getElementById('btnConfirm')
    btn.onclick = ()=> IniCredential()
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
const modal = {
    modalDelete(comando) {
        const modal = new bootstrap.Modal(document.getElementById('ModalDelete'));
        const texto = document.getElementById("textoModalDel")
        texto.textContent = "¿Está seguro de eliminar este elemento?"
        modal.show();
        const btn = document.getElementById('btnBorrarConfirm')
        btn.onclick = comando
    }
}
//Esta función llama a la librería para crear texto desdd html
function crearTexto(control) {
    verTexto()
    var opt = {
        margin: 1,
        filename: 'myfile.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3 },
        jsPDF: { unit: 'cm', format: 'letter', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    var element = document.getElementById(control);
    var worker = html2pdf().set(opt).from(element).save();
}
function verTexto(){
    document.getElementById('panel-escritorio').hidden= true;
    document.getElementById('panel-concordancia').hidden=true;
    document.getElementById('panel-Tablas-inicio').hidden=true;
    document.getElementById('panel-graficos').hidden=true;
    document.getElementById('element-to-print').hidden=false;
}
function verGraficos(){
    document.getElementById('panel-escritorio').hidden= true;
    document.getElementById('panel-concordancia').hidden=true;
    document.getElementById('panel-Tablas-inicio').hidden=true;
    document.getElementById('panel-graficos').hidden=false;
    ini_chat()
}
function openIni(){
    document.getElementById('btnRegistros').hidden= false;
    document.getElementById('btndocumentos').hidden= false;
    document.getElementById('btntablas').hidden= false;
    document.getElementById('btnconcord').hidden= false;
    document.getElementById('btngraficos').hidden= false;
}
function verConcordancia(){
    document.getElementById('panel-escritorio').hidden= true;
    document.getElementById('panel-Tablas-inicio').hidden=true;
    document.getElementById('panel-graficos').hidden=true;
    document.getElementById('panel-concordancia').hidden=false;
    ini_chat()
}

