// Abre la base de datos IndexedDB
const authDB = indexedDB.open('vcard', 1);
const container = document.querySelector(".divVCard");

// Función para verificar la autenticación
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
            if (!result) {
                window.location.href = '/index.html';
            } else {
                peticion(result)
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

checkAuthentication();

//PROCESOS DE LA INTERFAZ
var showVCard = () => {
    var output = "<img class='vcardImage' src='' alt='NO PUDIMOS ENCONTRAR TU IMAGEN' id='vcardpwa' />";
    container.innerHTML = output;
};

document.addEventListener("DOMContentLoaded", showVCard);


//CONSULTA PARA TRAER INFORMACIÓN
function peticion(param) {

    const db = authDB.result;

    const transaction = db.transaction(['card'], 'readonly');
    const objectStore = transaction.objectStore('card');
    const getRequest = objectStore.get("cardBase64");

    getRequest.onsuccess = function (event) {
        const result = event.target.result;

        if (result) {
            var imagen = document.getElementById("vcardpwa")
            imagen.src = `data:image/png;base64,${result}`
        } else {
            const niEmp = {
                user: param,
            };

            fetch('/UIAL.Portal.WebMVC/api/DSP_Global/VCardGlobal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(niEmp)
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Error en la solicitud de la API');
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("Informacion de la API consultada con exito!")
                    var json = JSON.parse(data)
                    insertBase64(json.vcardImg)
                })
                .catch((error) => {
                    console.error('Error al consumir la API:', error);
                });
        }
    };

    getRequest.onerror = function (event) {
        console.error('Error al consultar BASE64:', event.target.error);
    };

}


//INSERTA EL BASE64
function insertBase64(data) {
    const db = authDB.result;
    db.onversionchange = function () {
        db.close();
        alert("La base de datos está desactualizada, por favor recargue la página.")
    };

    let store = db.transaction("card", "readwrite").objectStore("card");
    let requestInsert = store.put(data, "cardBase64");

    requestInsert.onsuccess = (event) => {
        console.log("base64 insertado de manera correcta");
        var imagen = document.getElementById("vcardpwa")
        imagen.src = `data:image/png;base64,${data}`

    };
    requestInsert.onerror = (err) => { console.log("Error al insertar el Base64", err) };

}