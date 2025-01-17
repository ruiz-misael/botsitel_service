import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

const sequelize = new Sequelize({
  
  dialect: 'mysql',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  timezone: process.env.TIME_ZONE, // Configuración de la zona horaria
  dialectOptions: {
    useUTC: false, // Evitar que Sequelize convierta automáticamente a UTC
  },
  logging: true, // Opcional, para desactivar logs de Sequelize
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { sequelize, testConnection };