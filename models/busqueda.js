// Paquetes de node.js
const fs = require('fs');

// Paquetes de terceros
const axios = require('axios');
require('dotenv').config();

// Paquetes personalizados

/*
    Clase encargada de realizar las peticiones a las API's de MapBox y OpenWeatherMap,
    asi como hacer la escritura y lectura del historial de busqueda del usuario usando
    el archivo db.json almacenado en la carpeta /db
 */
class Busqueda {
    // Almacena el historial del usuario
    historial = [];
    // Ruta del archivo donde se va almacenar la informacion del historial.
    pathDb = './db/db.json';

    constructor() {
        this.leerDb();
    }

    // Propiedad que almacena los parametros para hacer la peticion de la Api MapBox
    get getParamsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        };
    }

    // Propiedad que almacena los parametros para hacer la peticion de la Api OpenWeatherMap
    get getParamsWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        };
    }

    /*
        Metodo encargado de realizar la peticion a la API MapBox

        Retorno: objeto con el listado de los lugares encontrados por la API MapBox
        segun lo ingresado por el usuario o un objeto vacio si ocurre un error en
        la peticion.
     */
    async buscarCiudad(lugar = '') {
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.getParamsMapbox
            })
            const respuesta = await instance.get();
            const lugares = respuesta.data.features;
            const listadoLugares = lugares.map((lugar) => {
                return {
                    id: lugar.id,
                    nombre: lugar.place_name,
                    longitud: lugar.center[0],
                    latitud: lugar.center[1]
                }
            });
            return  listadoLugares;
        }
        catch (error) {
            return [];
        }
    }

    /*
        Metodo encargado de realizar la peticion a la API OpenWeatherMap

        Retorno: objeto con el listado de las propiedades del clima obtenido por
        los valores de latitud y longitud obtenido del lugar elegido de la
        API OpenWeatherMap.

        Parametros: Latitud y longitud de el lugar a consultar la temperatura.
     */
    async climaLugar(latitud, longitud) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    ...this.getParamsWeather,
                    lat: latitud,
                    lon: longitud
                }
            });
            const respuesta = await instance.get();
            const  { main, weather } = respuesta.data;
            return {
                temperatura: main.temp,
                temperaturaMinima: main.temp_min,
                temperaturaMaxima: main.temp_max,
                descripcion: weather[0].description
            };
        }
        catch (e) {
            console.log(`error ${e}`);
            return {};
        }
    }

    /*
        Metodo para almacenar en memoria los lugares digitados por el usuario
        en la propiedad historial
     */
    almacenarHistorial(lugar = '') {
        // verifico si el lugar ya se encuentra en el historial
        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return true;
        }
        this.historial = this.historial.slice(0,4);
        this.historial.unshift(lugar);
    }

    /*
        Metodo para almacenar en el archivo db.json el historial de busqueda
        del usuario.
     */
    grabarDb() {
        const payload = {
            historial: this.historial
        }
        try {
            fs.writeFileSync(this.pathDb, JSON.stringify(payload));
        }
        catch (error) {
           console.error(`Error al almacenar en el archivo.`.red.bold);
        }
    }

    /*
        Metodo para leer del archivo db.json el historial de busqueda
        del usuario.
    */
    leerDb() {
        try {
            const informacion = fs.readFileSync(this.pathDb, {
               encoding: 'utf8'
            });
            const { historial } = JSON.parse(informacion);
            return this.historial = historial;
        }
        catch (e) {
            console.error(`Error al leer el archivo.`.red.bold);
        }
    }

}

module.exports = Busqueda;
