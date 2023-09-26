/*
    -- Author:	Luis Melendez
    -- Create date: 11/09/2023
    -- Update date: 25/09/2023 
    -- Description:	PWA creado con la finalidad de mostrar el VCARD en la app
                    asi como en el navegador.
    --Update:       Se agrego la libreria SweetAlert2 para las notificaciones, asi como
                    DOMPurify para limpiar nuestras consultas e inputs de ataques
                    XSS
    --Notes:        En IOS se han tenido problemas de compatibilidad en Android al 
                    parecer todo bien.
*/
document.addEventListener("DOMContentLoaded", function() {

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

    checkAuthentication()
    banner()

    const userInput = document.getElementById('user');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('btnLogin');
    // Iniciar Sesión
    loginButton.addEventListener('click', () => {

        const user = userInput.value;
        const password = passwordInput.value;

        //LIMPIAMOS LOS INPUTS DE POSIBLES ATAQUES XSS.
        const cleanUser = DOMPurify.sanitize(user);
        const cleanPassword = DOMPurify.sanitize(password);

        if (cleanUser == "" || cleanPassword == "") {
            Swal.fire(
                'Recuerda',
                'Debes ingresar usuario y contraseña.',
                'info'
            )
        } else {
            if (cleanUser == "25801" && cleanPassword == "12345") {
                insertAuth(cleanUser)
            } else {
                Swal.fire(
                    'Lo siento',
                    'Este usuario no existe.',
                    'info'
                )
            }
            // const niEmp = {
            //    user: param,
            // };

            // fetch('l', {
            //    method: 'POST',
            //    headers: {
            //        'Content-Type': 'application/json',
            //    },
            //    body: JSON.stringify(niEmp)
            // })
            //    .then((response) => {
            //        return response.json();
            //    })
            //    .then((data) => {
            //        if(data != ""){
            //         console.log("Informacion del Usuario consultada con exito!")
            //         insertAuth(data)
            //        }else{
            //             Swal.fire(
            //                 'Lo siento.',
            //                 'Este usuario no existe.',
            //                 'info'
            //             )
            //        }
            //    })
            //    .catch((error) => {
            //          Swal.fire(
            //               'Error.',
            //               'No pudimos consultar la información, favor de reportar',
            //               'error'
            //          )
            //    });

        }

    });

    function insertAuth(data) {

        //LIMPIAMOS EL PARAMETRO PARA EVITAR ATAQUES XSS
        const cleanData = DOMPurify.sanitize(data);
        const db = authDB.result;

        db.onversionchange = function () {
            db.close();
            Swal.fire(
                'Cuidado',
                'La base de datos está desactualizada, por favor recargue la página.',
                'warning'
            )
        };

        let store = db.transaction("card", "readwrite").objectStore("card");
        let request = store.put(cleanData, "userId");

        request.onsuccess = (event) => {
            console.log("USER ID insertado de manera correcta"),
                window.location.href = "vcard.html"
        };
        request.onerror = (err) => { console.log("Error al insertar el USER ID" + err) };

    }

    //CREACIÓN DE BANNER DE INSTALACIÓN
    function banner() {

        let deferredPrompt;
        var installButton = document.getElementById('install-button');
        var dismissButton = document.getElementById('dismiss-button');
        var installBanner = document.getElementById('install-banner');
        var instructionsBanner = document.getElementById('linkInstrucciones');
        let parrafo = document.getElementById('divDescripcion');

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

        instructionsBanner.addEventListener('click', () => {
            
            var instrucciones=""
            var SO = detectarSistemaOperativo();

            if(SO == "iOS"){
                instrucciones = '<div class="col-md-12"><h2>Instrucciones de instalación</h2></div>'+
                '<div><strong>IOS</strong></div>'+
                '<div style="text-align: left;">'+
                    '<ul>'+
                        '<li><p>Toca el icono de <strong>"Compartir"</strong> en la parte inferior de tu navegador (Safari).</p></li>'+
                        '<li><p>Se desplegara un menu donde tendremos que seleccionar la opción <strong>"Agregar a inicio"</strong>.</p></li>'+
                        '<li><p>Aparecera una ventana emergente donde podremos personalizar el nombre si asi se desea. Tocar <strong>"Agregar"</strong> en la esquina superior derecha</p></li>'+
                        '<li><p>Se agregara nuestra app a tu pantalla de inicio.</p></li>'
                    '</ul>'+
                '</div>'
            }else if (SO == "Windows"){
                instrucciones = '<div class="col-md-12"><h2>Instrucciones de instalación</h2></div>'+
                '<div><strong>WIndows</strong></div>'+
                '<div style="text-align: left;">'+
                    '<ul>'+
                        '<li><p>Click en el botón <strong>"instalar"</strong> que aparece en la parte inferior dentro del banner</p></li>'+
                        '<li><p>En la parte superior derecha aparecera un apartado donde confirmaras la instalación</p></li>'+
                        '<li><p>Se agregara a tu barra de tareas y escritorio</p></li>'+
                        '<li><p>Se recomienda abrirlo en <strong>Chrome</strong> para mejor compatibilidad de sus funciones.</p></li>'+
                    '</ul>'+
                '</div>'
            }else if (SO == "Android"){
                instrucciones = '<div class="col-md-12"><h2>Instrucciones de instalación</h2></div>'+
                '<div><strong>Android</strong></div>'+
                '<div style="text-align: left;">'+
                    '<ul>'+
                        '<li><p>Click en el botón <strong>"instalar"</strong> que aparece en la parte inferior dentro del banner</p></li>'+
                        '<li><p>Se mostrara una pregunta de confirmación donde daremos un toque en <strong>"Agregar"</strong></p></li>'+
                        '<li><p>Esperamos unos momentos y se abra agregado a nuestra galeria de Apps</p></li>'+
                        '<li><p>Se recomienda abrirlo en <strong>Chrome</strong> para mejor compatibilidad de sus funciones.</p></li>'+
                    '</ul>'+
                '</div>'
            }


            Swal.fire({
                title: '<img src="images/ibero.png" width="60" height="60" class="img" alt="user">',
                html: instrucciones,
                focusConfirm: false,
                confirmButtonText:
                '<i class="fa fa-thumbs-up"></i>Entendido!',
            })
        });

        dismissButton.addEventListener('click', () => {
            installBanner.style.display = 'none';
        });


        if (window.matchMedia('(display-mode: standalone)').matches) {
            parrafo.innerText = ""
            parrafo.innerText = "Bienvenido a tu VCard"
        }

    }
    // Detectar el sistema operativo
    function detectarSistemaOperativo() {
        const userAgent = navigator.userAgent;

        if (/Android/i.test(userAgent)) {
            return "Android";
        } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
            return "iOS";
        } else if (/Windows NT/i.test(userAgent)) {
            return "Windows";
        } else if (/Mac OS/i.test(userAgent)) {
            return "macOS";
        } else if (/Linux/i.test(userAgent)) {
            return "Linux";
        } else {
            return "Desconocido";
        }
    }

});

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("./serviceWorker.js")
            .then(console.log("service worker registrado"))
            .catch(err => console.log("service worker no registrado", err));
    });
}

