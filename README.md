#Clima App
***
Aplicación que se encarga de solicitar un lugar/ciudad y desplegar 
la información de los lugares que coincidan con lo digitado, para mostrar
datos como la longitud, latitud y el clima a través de las consultas a las
API Mapbox y OpenWeatherMap

## API's Requeridas
***
Este ejemplo hace solicitudes a las siguientes API's:
* [OpenWeatherMap](https://openweathermap.org/api)
* [MapBox](https://api.mapbox.com)

## Paquetes de terceros usados
* [Axios](https://www.npmjs.com/package/axios):    ^0.21.1
* [colors](https://www.npmjs.com/package/colors): ^1.4.0
* [dotenv](https://www.npmjs.com/package/dotenv): ^10.0.0
* [inquirer](https://www.npmjs.com/package/inquirer): ^8.1.1

## Instalación
****
Se debe instalar los archivos necesarios de node:

```
    npm install
```

## Variables de entorno 
****
Se deben modificar las variables de entorno usadas en el archivo
example.env con la informacion de las keys de las respectivas API's

```
    MAPBOX_KEY=
    OPENWEATHER_KEY=
```

