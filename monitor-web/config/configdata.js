//======================================================================================================
//Este módulo adminstra las acciones globales relacioanda con la base de datos, operaciones de
//crear, abrir, eliminar proyectos, así como permitir el ingreso a los datos


//Importa las instanacias de firebase y administración de base de datos
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";


//importa las acciones para almacenar en la nube
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
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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


// Referencia a las colecciones de proyectos y objetivos
const coleccionProyectos = collection(db, "observatorio");
// Referencia a las colecciones de usuarios
const coleccionUsuarios = collection(db, "usuarios");
const coleccionPublicos = collection(db, "public");



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

async function getPublicos() {
    const publicos = [];
    const querySnapshot = await getDocs(coleccionPublicos)
    querySnapshot.forEach((doc) => {
        publicos.push({
            ...doc.data(),
            id: doc.id,
        });
    });
   
    return publicos;
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

// Función para agregar un objeto de proyecto a la base de datos
async function addProyecto(objProyecto) {
    const docRef = await addDoc(coleccionProyectos, objProyecto);
    cargarProyectos()
    return docRef.id;
}

// Funcion para eliminar un proyecto por id
async function borrarProyecto(id) {
    await deleteDoc(doc(db, "observatorio", id));
    mensajes("se eliminó esta vigencia", "orange")
    mostrar_escritorio()
    cargarProyectos()
}

// Función para obtener un proyecto por id
async function getProyecto(id) {
    const docRef = doc(db, "observatorio", id);
    const docSnap = await getDoc(docRef);

    return docSnap.exists() ? ({
        ...docSnap.data(),
        id: docSnap.id,
    }) : null;
}

async function getPublico(id) {
    const docRef = doc(db, "public", id);
    const docSnap = await getDoc(docRef);

    return docSnap.exists() ? ({
        ...docSnap.data(),
        id: docSnap.id,
    }) : null;
}

// Función para actualizar un proyecto
async function updateProyecto(proyecto) {
    const docRef = doc(db, "observatorio", proyecto.id);
    await setDoc(docRef, proyecto);
}

async function updatePublico(publico) {
    const docRef = doc(db, "public", publico.id);
    await setDoc(docRef, publico);
}


// Escuchar si hay en un cambio en la coleccion de proyectos y actualizar automaticamente la lista de proyectos
onSnapshot(coleccionProyectos, (querySnapshot) => {
    const proyectos = [];
    querySnapshot.forEach((doc) => {
        proyectos.push({
            ...doc.data(),
            id: doc.id,
        });
    });
    GLOBAL.state.proyectos = proyectos;
});

onSnapshot(coleccionPublicos, (querySnapshot) => {
    const publicos = [];
    querySnapshot.forEach((doc) => {
        publicos.push({
            ...doc.data(),
            id: doc.id,
        });
    });
    
    GLOBAL.state.publicos = publicos;
    opendata()
});

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


// Función para agregar un objeto de proyecto a la base de datos
async function addData(objData) {
    const docRef = await addDoc(coleccionDatos, objData);
    return docRef.id;
}
// Exponer las funciones globalmente
GLOBAL.firestore = {
    getProyectos, //Carga todos los proyectos
    getPublicos,
    addProyecto,
    borrarProyecto,
    getProyecto,
    getPublico,
    updateProyecto,
    updatePublico,
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
        //Registrado = 1
        openIni()
    } catch (error) {
        //location.href = "../index.html"
        //Registrado = 0
    }
}
//función para cerrar la sesión de la aplicación
async function CredentialOut() {
    await signOut(auth)
    location.href = "../index.html"
}






