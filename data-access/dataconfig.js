//======================================================================================================
//Este módulo adminstra las acciones globales relacioanda con la base de datos, operaciones de
//crear, abrir, eliminar proyectos, así como permitir el ingreso a los datos




//Importa las instanacias de firebase y administración de base de datos
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";


import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

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

//Esta función descarga un archivo en firebase storage y lo guarda en memoria
//Es un archivo plano tipo texto, ya sea json, txt, o geojson
async function readFile(path, name) {
    const starsRef = ref(storage, path);
    const link = await getDownloadURL(starsRef);
    const res = await fetch(link);
    const data = await res.json();
    //Evoca una función en GlobalMapGrafics y lo coloca en el mapa
    InterPretarData(data, name)
}

//Esta función me crea uan lista de archivos en mi nube
//los lista para poder acceder a ellos por su ruta

async function ListFilesFirebase() {
    // Create a reference under which you want to list
const cListFiles= document.getElementById("selPathFiles")
cListFiles.innerHTML=''


//Crea listas por cada carpeta que tengo en firebase y por su tipo
    const pJson = ref(storage, 'plain-text/json');

    // Find all the prefixes and items.
    listAll(pJson)
        .then((res) => {

            res.prefixes.forEach((folderRef) => {
                // All the prefixes under listRef.
                // You may call listAll() recursively on them.
            });
            res.items.forEach((itemRef) => {
                // All the items under listRef.

                const itemLista = document.createElement('option')
                itemLista.value=itemRef._location.path_
                itemLista.textContent=(itemRef._location.path_).replace('plain-text/json/','')
                cListFiles.appendChild(itemLista)

            });
        }).catch((error) => {
            // Uh-oh, an error occurred!
        });

        const pGeoJson = ref(storage, 'plain-text/geojson');

        // Find all the prefixes and items.
        listAll(pGeoJson)
            .then((res) => {
    
                res.prefixes.forEach((folderRef) => {
                    // All the prefixes under listRef.
                    // You may call listAll() recursively on them.
                });
                res.items.forEach((itemRef) => {
                    // All the items under listRef.

                    const itemLista = document.createElement('option')
                    itemLista.value=itemRef._location.path_
                    itemLista.textContent=(itemRef._location.path_).replace('plain-text/geojson/','')
                    cListFiles.appendChild(itemLista)
    
                });
            }).catch((error) => {
                // Uh-oh, an error occurred!
            });

            const pText = ref(storage, 'plain-text/text');

            // Find all the prefixes and items.
            listAll(pText)
                .then((res) => {
        
                    res.prefixes.forEach((folderRef) => {
                        // All the prefixes under listRef.
                        // You may call listAll() recursively on them.
                    });
                    res.items.forEach((itemRef) => {
                        // All the items under listRef.

                        const itemLista = document.createElement('option')
                        itemLista.value=itemRef._location.path_
                        itemLista.textContent=(itemRef._location.path_).replace('plain-text/text/','')
                        cListFiles.appendChild(itemLista)
        
                    });
                }).catch((error) => {
                    // Uh-oh, an error occurred!
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
    readFile,
    ListFilesFirebase,
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




