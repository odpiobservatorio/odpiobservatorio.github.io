//======================================================================================================
//Este módulo adminstra las acciones globales relacioanda con la base de datos, operaciones de
//crear, abrir, eliminar proyectos, así como permitir el ingreso a los datos




//Importa las instanacias de firebase y administración de base de datos
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";


import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

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
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

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
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";





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

const storage = getStorage();

// Create a storage reference from our storage service
let storageRef;

async function loadfile(file) {
    try {
        //Guarda en una carpeta segun su extensión
        let extension = file.name.split('.').pop()
        if (extension == 'json') {
            storageRef = ref(storage, 'plain-text/json/' + file.name);
        } else if (extension == 'txt') {
            storageRef = ref(storage, 'plain-text/txt/' + file.name);
        } else if (extension == 'geojson') {
            storageRef = ref(storage, 'plain-text/geojson/' + file.name);
        } else {
            storageRef = ref(storage, 'plain-text/non-plain/' + file.name);
        }

        const filebloop = await uploadBytes(storageRef, file).then((snapshot) => {
            console.log('Uploaded a blob or file!');
        });
        mensajes("Se ha cargado el archivo " + file.name, "green")
    } catch (error) {
        mensajes("Reintente cargar de nuevo el archivo", "orange")
    }
}
// imagesRef now points to 'images'

const corsAnywhere = 'https://cors-anywhere.herokuapp.com/';

async function obtenerInfo() {

    const starsRef = ref(storage, 'plain-text/json/odpi.json');
    const yourUrl = starsRef


    // Get the download URL
    getDownloadURL(starsRef)
        .then((url) => {
            const corsAnywhere = 'https://cors-anywhere.herokuapp.com/';

            const yourUrl =
                'datos.comunidad.madrid/catalogo/dataset/7da43feb-8d4d-47e0-abd5-3d022d29d09e/resource/877fa8f5-cd6c-4e44-9df5-0fb60944a841/download/covid19_tia_muni_y_distritos_s.json';
                var responseClone
            fetch(corsAnywhere + url, {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/text',
                    'Access-Control-Allow-Origin': '*',
                }),
            })
                .then(function (response) {
                    responseClone = response.clone(); // 2
                    return response.json();
                })
                .catch((err) => console.log(err));


        });
}




// Referencia a las colecciones de proyectos y objetivos
const coleccionProyectos = collection(db, "proyectos");
// Referencia a las colecciones de usuarios
const coleccionUsuarios = collection(db, "usuarios");

// Create a root reference
//const storage = getStorage();
//const storageRef = ref(storage, 'json');

// 'file' comes from the Blob or File API



/* Funciones base para manejar la base de datos de proyectos */

// Función para obtener todos los proyectos de la base de datos
async function getProyectos() {
    const proyectos = [];
    const querySnapshot = await getDocs(coleccionProyectos)
    querySnapshot.forEach((doc) => {
        proyectos.push({
            ...doc.data(),
            id: doc.id,
        });
    });
    return proyectos;
}

//Verifica la lista de usuarios que hay /para filtrar administardores
async function getUsuarios() {
    const usuarios = [];
    const querySnapshot = await getDocs(coleccionUsuarios)
    querySnapshot.forEach((doc) => {

        usuarios.push({
            ...doc.data(),
            id: doc.id,

        });
    });

    return usuarios;
}


onSnapshot(coleccionUsuarios, (querySnapshot) => {
    const usuarios = [];
    querySnapshot.forEach((doc) => {
        usuarios.push({
            ...doc.data(),
            id: doc.id,
        });
    });
    aUsers = usuarios
});

//Función para autorizar ingreso a la base de datos

async function CredentialIn(email, password) {
    try {
        const crearcredencial = await signInWithEmailAndPassword(auth, email, password)
        mensajes("A ingresado exitosamente", "green")
        location.href = "../GIS/map.html"

    } catch (error) {
        if (error.code === "auth/invalid-email") {
            mensajes("Correo inválido", "red")
        }
        else if (error.code === "auth/invalid-credential") {
            mensajes("Los datos proporcionados no son válidos", "red")
        }
    }
}
//función para cerrar la sesión de la aplicación
async function CredentialOut() {
    await signOut(auth)
    location.href = "../index.html"

}

// Exponer las funciones globalmente
GLOBAL.firestore = {
    getProyectos, //Carga todos los proyectos
    CredentialIn, //para iniciar la aplicación, evoca la función en este módulo (CredentialIn(email,pass))
    CredentialOut, //para cerrar la aplicación
    getUsuarios, //función para verificar usuarios programadores
    loadfile,
    obtenerInfo
}

//Función que escucha el cambio en inicio o cerrar sesión
onAuthStateChanged(auth, async (user) => {
    try {
        mensajes("Usuario registrado como: " + user.email, "orange") //Muestra que usuarios está conectado
        document.getElementById('map').hidden = false
        document.getElementById('headerMap').hidden = false
        activeEmail = user.email

    } catch (error) {
        mensajes("Fuera de conexión", "red")
        document.getElementById('map').hidden = true
        document.getElementById('headerMap').hidden = true
        location.href = "../index.html"
    }

})




