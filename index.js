require('dotenv').config();
const { leerInput, inquirerMenu, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");
const { pausa } = require('./helpers/pausa');
const { leerDB } = require('../04-tareas-hacer/helpers/guardarArchivo');


const main = async() => {

    const busquedas = new Busquedas();
    let opt = null;

    const historialDB = busquedas.leerDB();

    if(historialDB){        
        //tareas.cargarTareasFromArray(tareasDB);
        console.log(historialDB);
    }

    do{
        opt = await inquirerMenu();
        switch(opt){
            case 1:
                //Mosttrar mensaje
                const termino = await leerInput('Ciudad: ');
                
                // Buscar los lugares
                const lugares = await busquedas.ciudad(termino);
                
                // Seleccional el lugar
                const id = await listarLugares(lugares);
                if (id === '0') continue;

                // Guardar en DB
                const lugarSel = lugares.find( l => l.id === id);
                busquedas.agregarHistorial(lugarSel.nombre);

                // Clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng); 
                
                // Mostrar resultados
                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad: ',lugarSel.nombre.green);
                console.log('Lat: ',lugarSel.lat);
                console.log('Lng: ',lugarSel.lng);
                console.log('Temperatura: ', clima.temp);
                console.log('Mínima: ', clima.min);
                console.log('Máxima: ', clima.max);
                console.log('Cómo está el clima: ', clima.desc.green);

                await pausa();
            break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar,i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`.green);
                });

                await pausa();

            break;
        }

    }while(opt !== 0)
}

main();