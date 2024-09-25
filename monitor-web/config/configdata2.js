//======================================================================================================
//Este módulo adminstra las acciones globales relacioanda con la base de datos, operaciones de
//crear, abrir, eliminar proyectos, así como permitir el ingreso a los datos


//Importa las instanacias de firebase y administración de base de datos
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";



//importa las acciones para almacenar en la nube
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

import {
    getFirestore,
    collection,
    onSnapshot,
    doc,
    addDoc,
    setDoc,
    getDocs,
    getDoc,
    deleteDoc,
    updateDoc,
    deleteField,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

//Importa las instanacias de firebase para autenticación
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";



// Utiliza las claves y credenciales de mi base de datos de Tomakare
const firebaseConfig = {
    apiKey: "AIzaSyAi1ZdkKtKktSKVk_afvPQ9IkkCNbmghFQ",
    authDomain: "odpiobservatorio-onic.firebaseapp.com",
    projectId: "odpiobservatorio-onic",
    storageBucket: "odpiobservatorio-onic.appspot.com",
    messagingSenderId: "560638634225",
    appId: "1:560638634225:web:4660b1f00d02fdb4f46150"
};


// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);



// Exponer las funciones globalmente
GLOBAL.firestore = {
    getProyectos, //Carga todos los proyectos
    addProyecto,
    borrarProyecto,
    getProyecto,
    updateProyecto,
    CredentialIn, //para iniciar la aplicación, evoca la función en este módulo (CredentialIn(email,pass))
    CredentialIn2,
    CredentialOut, //para cerrar la aplicación
    getUsuarios, //función para verificar usuarios programadores
}

//Función que escucha el cambio en inicio o cerrar sesión
onAuthStateChanged(auth, async (user) => {
    try {
        mensajes("Usuario registrado como: " + user.email, "orange") //Muestra que usuarios está conectado
        activeEmail = user.email

    } catch (error) {
        mensajes("Fuera de conexión", "red")
        //location.href = "../index.html"
    }

})

const storage = getStorage();


//Función para autorizar ingreso a la base de datos
async function CredentialIn(email, password) {
    try {
        const crearcredencial = await signInWithEmailAndPassword(auth, email, password)
        mensajes("A ingresado exitosamente", "green")
        Registrado = 1
        openIni()
    } catch (error) {
        //location.href = "../index.html"
        Registrado = 0
        mensajes("No está registrado correctamente", "red")
    }
}
async function CredentialIn2(email, password) {
    try {
        const crearcredencial = await signInWithEmailAndPassword(auth, email, password)
        mensajes("A ingresado exitosamente", "green")
        Registrado = 1
        openIni()
    } catch (error) {
        //location.href = "../index.html"
        Registrado = 0
        mensajes("No está registrado correctamente", "red")
    }
}
//función para cerrar la sesión de la aplicación
async function CredentialOut() {
    await signOut(auth)
    location.href = "../index.html"
}






