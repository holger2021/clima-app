const inquier = require('inquirer');
const colors = require('colors');

/*
    Variable encargada de contener la informacion del menu del usuario
 */
const choices = [
    {
        value: 1,
        name: '1. Ciudad'
    },
    {
        value: 2,
        name: '2. Historial'
    },
    {
        value: 3,
        name: '3. Salir'
    }
];

/*
    Funcion  para realizar la visualizacion del menu de tipo 'list,
    usando el paquete inquirer.js

    Retorno: la opcion elegida por el usuario.
 */
const menu = async () => {
    console.clear();
    console.log('========================================'.green);
    console.log('Bienvenido'.blue);
    console.log('========================================'.green);
    const { opcion } = await inquier.prompt({
        type: 'list',
        name: 'opcion',
        message: 'Seleccionar opcion:',
        choices: choices,
        loop: false
    });
    return opcion;
}

/*
    Funcion necesaria para que el usuario haga una pausa y visualice las opciones
    o resultados del sistemas.
 */
const pausa = async () => {
    await inquier.prompt({
        type: 'input',
        name: 'enter',
        message: 'Presione enter para continuar...'
    });
}

/*
    Funcion para obtener la informacion de la ciudad, lugar o pais que el usuario
    desee consutar.

    Retorno: la informacion digita por el usuario.
 */
const leerInput = async () => {
    const { ciudad } = await inquier.prompt({
        type: 'input',
        name: 'ciudad',
        message: 'Ciudad:',
        validate: function (value) {
            if (value.length == 0) {
                return 'Debe digitar algun valor en el campo ciudad'.red;
            }
            return true;
        }
    });
    return ciudad;
}

/*
    Funcion encargada de crear el menu de opciones de los lugares, segun lo digitado
    por el usuario, preguntando con inquiere.js cual lugar desea consultar y
    regresando el respectivo id de la opcion.

    Retorno: valor del id de la opcion elegida por el usuario. 0 si no desea consultar
    o cualquier otro valor para la opcion elegida.
 */
const crearMenuLugares = async (lugares) => {
    let idx = 0;
    const choices = lugares.map((lugar) => {
        idx += 1;
        return {
            value: lugar.id,
            name: `${ idx.toString().green }. ${ lugar.nombre }`
        }
    });

    choices.unshift({
        value: 0,
        name: '0. Salir'
    });

    const { id } = await inquier.prompt({
        type: 'list',
        name: 'id',
        message: 'Selecione ciudad:',
        choices,
        loop: false
    });
    return id;
}

module.exports = {
    menu, pausa, leerInput, crearMenuLugares
}
