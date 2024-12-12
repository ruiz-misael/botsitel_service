import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
//import routes from './routes/index.js'; // Archivo modular de rutas
import { errorHandler, notFoundHandler } from './src/middlewares/errorHandlers.js';
//import db from './config/db.js';

// Configuración de variables de entorno
dotenv.config();

// Inicialización de la aplicación
const app = express();

// Middleware para protección de cabeceras HTTP
app.use(helmet());

// Middleware para habilitar CORS
app.use(cors());

// Middleware para logging en desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Middleware para parseo de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Configuración de rutas principales
//app.use('/api', routes);

// Middleware para manejar rutas no encontradas
app.use(notFoundHandler);

// Middleware para manejo de errores
app.use(errorHandler);

// Inicialización del servidor HTTP
const PORT = process.env.PORT || 3000;
const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Manejo de errores globales
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});
