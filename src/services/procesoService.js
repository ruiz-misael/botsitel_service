import cron from 'node-cron';

import { Worker } from 'worker_threads';
//import { ejecutarProceso } from './procesoService.js'; // Tu lógica específica
import Opsitel from '../controllers/Opsitel.js';
import { wss } from '../websocket/websocket.js';
import { WebSocket } from 'ws';
const cronJobs = {}; // Almacenamos los cron jobs por ID

/**
 * NOTIFICACIONES
 */

const notification = () => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({ event: 'allWorkersCompleted', data: { message: 'Todos los workers han terminado su tarea.' } });
            client.send(message);
        }
    });
};

let totalWorkers = 0;  // Número total de workers
let completedWorkers = 0;  // Contador de workers que han completado su tarea

const locks = new Map(); // Mapa para gestionar bloqueos


// Función para crear cron jobs según la intensidad
export const crearCronJobs = (id, intensidad) => {

    totalWorkers = intensidad;  // Actualiza el número total de workers

    intensidad = intensidad * 1;

    // Verifica si ya existen cron jobs para el ID
    if (cronJobs[id]) {
        console.log(`Ya existen cron jobs para el registro ${id}.`);
        return;
    }

    // Arreglo para almacenar los cron jobs creados
    const jobs = [];

    for (let i = 0; i < intensidad; i++) {
        // Define el cron job para ejecutarse cada minuto
        const job = cron.schedule('* * * * *', () => {
            // Ejecutar la tarea en un worker thread para garantizar la ejecución en background

            const lockKey = `${id}-${i + 1}`; // Llave única para cada id e iteración

            // Verifica si ya hay un proceso en ejecución
            if (locks.get(lockKey)) {
                console.log(`Tarea ya en ejecución para ${lockKey}.`);
                return;
            }

            // Establecer el bloqueo
            locks.set(lockKey, true);

            const worker = new Worker(
                new URL('./worker.js', import.meta.url), // Ruta a tu archivo worker
                {
                    workerData: { id, iteracion: i + 1 },
                }
            );

            // Manejo de errores en el worker
            worker.on('error', (error) => {
                console.error(`Error en el worker para registro ${id}, iteración ${i + 1}:`, error);
            });

            // Confirmación de finalización
            worker.on('exit', (code) => {
                if (code !== 0) {
                    console.error(`Worker finalizó con código ${code} para registro ${id}, iteración ${i + 1}`);
                } else {
                    console.log(`Worker completó su tarea para registro ${id}, iteración ${i + 1}`);
                }


                // Liberar el bloqueo
                locks.delete(lockKey);

                // Aumentar el contador de workers completados
                completedWorkers++;

                // Si todos los workers han terminado, notificar a los clientes
                if (completedWorkers === totalWorkers) {
                    notification();  // Enviar notificación
                    completedWorkers = 0;  // Restablecer el contador para el siguiente ciclo
                }


            });
        });

        // Inicia el cron job inmediatamente
        job.start();

        // Almacena el cron job
        jobs.push(job);

        // Registro de creación
        console.log(`Cron job ${i + 1} creado y ejecutándose para el registro ${id}`);
    }

    // Asocia los cron jobs creados con el ID
    cronJobs[id] = jobs;
    console.log(`Se crearon y están ejecutándose ${intensidad} cron jobs simultáneamente en background para el registro ${id}.`);

};

// Función para detener cron jobs
export const detenerCronJobs = (id) => {
    // Verifica si existen cron jobs para el ID
    if (!cronJobs[id]) {
        console.log(`No se encontraron cron jobs para el registro ${id}.`);
        return;
    }

    // Detén todos los cron jobs asociados con el ID
    cronJobs[id].forEach(job => job.stop());
    console.log(`Se detuvieron ${cronJobs[id].length} cron jobs para el registro ${id}.`);

    // Elimina los cron jobs del objeto para liberar recursos
    delete cronJobs[id];
};

// Función para gestionar cron jobs según el nuevo estado
export const gestionarCronJobs = (estado, id, intensidad) => {
    if (estado === 2) {
        // Iniciar cron jobs según la intensidad
        crearCronJobs(id, Number(intensidad)); // Asumimos que el ID del servicio es 1
    } else if (estado === 1) {
        // Detener cron jobs
        detenerCronJobs(id);
    }
};