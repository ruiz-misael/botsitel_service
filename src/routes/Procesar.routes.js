import express from 'express';
//import authenticateJWT from '../middlewares/authenticateJWT.js';
import uploadFile from "../middlewares/Upload.js";
const router = express.Router();



let intervalId = null; // Variable global para almacenar el intervalo

// Función en segundo plano
const ejecutarEnSegundoPlano = (intensidad) => {
  let count = 0;
  intervalId = setInterval(() => {
    if (count < intensidad) {
      console.log(`Ejecutando función en segundo plano - Ejecución ${count + 1}`);
      // Aquí colocas la lógica que quieres ejecutar
      count++;
    } else {
      clearInterval(intervalId); // Detener cuando se haya ejecutado tantas veces como la intensidad
    }
  }, 1000); // Ejecutar cada segundo (ajusta según sea necesario)
};




router.get('*', (req, res) => {
    res.status(404)
    res.send({ error: 'Not found' })
})


export default router;