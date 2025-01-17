// Manejar errores no controlados
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  console.error('Stack trace:', err.stack);
  process.exit(1); // Evitar en producción si es posible
});

// Manejar promesas no controladas
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  //process.exit(1); // Evitar en producción si es posible
});
import bodyParser  from "body-parser";
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
//import { sequelize } from './src/config/database.js';  // Asegúrate de que la ruta sea correcta
import routes from './src/routes/index.js';
import { errorHandler, notFoundHandler } from './src/middlewares/errorHandlers.js';
import { syncDatabase } from './src/models/index.js';
import { createWebSocketServer } from './src/websocket/websocket.js';
import http from 'http';
// Configuración de variables de entorno
dotenv.config();

// Inicialización de la aplicación
const app = express();

// Middleware para protección de cabeceras HTTP
app.use(helmet());




// Crear la única instancia del servidor WebSocket
const server = http.createServer(app);
createWebSocketServer(server);  // Esta llamada asegura que solo hay una instancia de WebSocket







// Middleware para habilitar CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

// Middleware para logging en desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// parse application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de rutas principales
app.use("/", routes);

// Middleware para manejar rutas no encontradas
app.use(notFoundHandler);

// Middleware para manejo de errores
app.use(errorHandler);

// Función para crear la base de datos si no existe

// Inicializar la conexión a Sequelize y sincronizar modelos

// Iniciar el servidor
const startServer = async () => {
  try {
    // Sincronizar base de datos
    await syncDatabase();

    // Iniciar el servidor
    const PORT = process.env.APP_PORT;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
};

startServer();