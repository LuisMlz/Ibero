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
                window.location.href = 'index.html';
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
           var json = "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII="
            insertBase64(json)
            // const niEmp = {
            //     user: param,
            // };

            // fetch('/UIAL.Portal.WebMVC/api/DSP_Global/VCardGlobal', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(niEmp)
            // })
            //     .then((response) => {
            //         if (!response.ok) {
            //             throw new Error('Error en la solicitud de la API');
            //         }
            //         return response.json();
            //     })
            //     .then((data) => {
            //         console.log("Informacion de la API consultada con exito!")
            //         var json = JSON.parse(data)
            //         insertBase64(json.vcardImg)
            //     })
            //     .catch((error) => {
            //         console.error('Error al consumir la API:', error);
            //     });
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