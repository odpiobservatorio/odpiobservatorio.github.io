
function IniCredential() {

    //Lee la información del form,ulario de ingreso en index.html
    const email = document.getElementById("inEmail").value
    const password = document.getElementById("inPass").value
    //Evoca la función global de ingreso, en archivo (dataconfig.js) 
    GLOBAL.firestore.CredentialIn(email, password)




}

function SignOut() {
    GLOBAL.firestore.CredentialOut()
}

let superUser
async function ActiveSuper(){
    
    let filteredUsers = aUsers.filter(user => user.usuario == activeEmail);
    if (filteredUsers.length == 0) {
        mensajes("Usuario visitante", "orange")
        //AtiveSuperUser = true
        superUser= false

    } else {
        mensajes("Usuario administrador", "blue")
        //AtiveSuperUser = false
        superUser= true
    }
}