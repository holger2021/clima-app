// Paquetes de terceros
const colors = require('colors');

/*
    Clase para consultas a las API's MapBox, OpenWeatherMap y almacenamiento/lectura
    en el archivo db.json de la carpeta db.
 */
const Busqueda = require("./models/busqueda");

// funciones para realizar menus y recibir la informacion que digita el usuario.
const { menu, pausa, leerInput, crearMenuLugares } = require('./helpers/inquier');

/*
 Funcion que realiza el despliegue del menu y encargado de verificar cuando
 termina la ejecucion de la aplicacion.
 */
const main = async () => {
    let opcion;

    do {
        opcion = await menu();
        await opcionMenu(opcion);
        await pausa();
    }while (opcion !== 3);
}

/*
    Funcion para evaluar la opcion del usuario, para hacer ya sea la consulta de las API's,
    mostrar los resultados y el historial de busqueda.
 */
const opcionMenu = async (opcion) => {
    const busqueda = new Busqueda();

    switch (opcion) {
        case 1:
            //elemento a buscar digitado por el usuario
            let inputBusqueda = await leerInput();
            // busqueda de las ciudades a consultar
            const lugares = await busqueda.buscarCiudad(inputBusqueda);
            // crear menu lugares encontrados en la consulta
            const id = await crearMenuLugares(lugares);
            // visualizar resultados
            if (id !== 0 ) {
                const lugarSeleccionado = lugares.find((elemento) => elemento.id == id);
                const clima = await busqueda.climaLugar(lugarSeleccionado.latitud, lugarSeleccionado.longitud);
                busqueda.almacenarHistorial(lugarSeleccionado.nombre);
                busqueda.grabarDb();
                imprimirResultado(lugarSeleccionado, clima);
            }
            break;
        case 2:
            console.log('==========Historial de busquedas==========');
            const informacion = busqueda.leerDb();
            informacion.forEach((info, index) => {
                let i = index + 1 + '';
                console.log(`${ i.green } ${ info }`);
            });
            break;
    }
}

/*
    Funcion encargada de mostrar los resultados en pantalla del lugar
    y su respectivo clima.

    Parametros: un objeto con la informacion del lugar elegido por el usuario
    y otro con la informacion del clima del respectivo lugar.
 */
const imprimirResultado = (lugarSeleccionado, clima) => {
    console.log('Ciudad: '.white, lugarSeleccionado.nombre.blue);
    console.log('==========Informacion de la ciudad=========='.brightYellow);
    console.log('Longitud: '.white, lugarSeleccionado.longitud.toString().blue);
    console.log('Latitud: '.white, lugarSeleccionado.latitud.toString().blue);
    console.log('Temperatura: '.white, clima.temperatura.toString().blue);
    console.log('Temperatura maxima: '.white, clima.temperaturaMaxima.toString().blue);
    console.log('Temperatura minima: '.white, clima.temperaturaMinima.toString().blue);
    console.log('Como esta el clima: '.white, clima.descripcion.toString().blue);
    console.log('============================================='.brightYellow);
}

main();
