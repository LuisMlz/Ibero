//VARIABLES GLOBALES
const authDB = indexedDB.open('vcard', 1);

function checkAuthentication() {

    authDB.onblocked = function () {
        console.log("database bloqueada")
    }

    authDB.onupgradeneeded = function (e) {
        const db = authDB.result;

        let object = db.createObjectStore("card", { KeyPath: "userId" });
        object.createIndex("userId", "userId", { unique: true });
        object.createIndex("cardBase64", "cardBase64", { unique: true });

    }

    authDB.onsuccess = function (e) {
        console.log("database onsuccess")

        const db = authDB.result;

        const transaction = db.transaction('card', 'readonly');
        const authStore = transaction.objectStore('card');

        const authenticationData = authStore.get('userId');

        authenticationData.onsuccess = function (event) {
            const result = event.target.result;
            if (result) {
                alert("REGRESAAAAAA")
                window.location.href = 'vcard.html';
            }
        };

        authenticationData.onerror = function (event) {
            console.error('Error al consultar USER ID:', event.target.error);
        };

    }

    authDB.onerror = function (e) {
        console.log("database indexdb error")
    }

}

document.addEventListener("DOMContentLoaded", checkAuthentication);

checkAuthentication();

const loginForm = document.getElementById('login-form');
const userInput = document.getElementById('user');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('btnLogin');


// Iniciar Sesión
loginButton.addEventListener('click', () => {

    const user = userInput.value;
    const password = passwordInput.value;

    if (user == "" && password == "") {
        alert("Debes ingresar usuario y contraseña")
    } else {
        if (user == "25801" && password == "12345") {
            insertAuth(user)
        } else {
            alert("No existe usuario en la Base de Datos")
        }
        //const niEmp = {
        //    user: param,
        //};

        //fetch('l', {
        //    method: 'POST',
        //    headers: {
        //        'Content-Type': 'application/json',
        //    },
        //    body: JSON.stringify(niEmp)
        //})
        //    .then((response) => {
        //        if (!response.ok) {
        //            throw new Error('Error en la solicitud de la API');
        //        }
        //        return response.json();
        //    })
        //    .then((data) => {
        //        console.log("Informacion del Usuario consultada con exito!")
        //        insertAuth(data)
        //    })
        //    .catch((error) => {
        //        console.error('Error al consumir la API:', error);
        //    });

    }

});


function insertAuth(data) {

    const db = authDB.result;

    db.onversionchange = function () {
        db.close();
        alert("La base de datos está desactualizada, por favor recargue la página.")
    };

    let store = db.transaction("card", "readwrite").objectStore("card");
    let request = store.put(data, "userId");

    request.onsuccess = (event) => {
        console.log("USER ID insertado de manera correcta"),
            window.location.href = "vcard.html"
    };
    request.onerror = (err) => { console.log("Error al insertar el USER ID" + err) };

}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("./serviceWorker.js")
            .then(banner(),
                console.log("service worker registrado"),
            )
            .catch(err => console.log("service worker no registrado", err));
    });
}


//CREACIÓN DE BANNER DE INSTALACIÓN
function banner() {

    let deferredPrompt;
    var installButton = document.getElementById('install-button');
    var dismissButton = document.getElementById('dismiss-button');
    var installBanner = document.getElementById('install-banner');

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;

        installBanner.style.display = 'block';
    });

    installButton.addEventListener('click', () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();

            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('La App ha sido instalada correctamente');
                }
                deferredPrompt = null;
            });
        }

        installBanner.style.display = 'none';
    });

    dismissButton.addEventListener('click', () => {
        installBanner.style.display = 'none';
    });

}