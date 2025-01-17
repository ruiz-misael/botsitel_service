import { parentPort, workerData } from 'worker_threads';
import Opsitel from '../controllers/Opsitel.js';

(async () => {
    try {
        console.log(`Worker ejecutándose para registro ${workerData.id}, iteración ${workerData.iteracion}`);
        await Opsitel.procesar(); // Lógica pesada
        parentPort.postMessage(`Worker completó su tarea para registro ${workerData.id}, iteración ${workerData.iteracion}`);
    } catch (error) {
        console.error(`Error en el worker para registro ${workerData.id}, iteración ${workerData.iteracion}:`, error);
        parentPort.postMessage(`Error en worker para registro ${workerData.id}, iteración ${workerData.iteracion}`);
    }
})();