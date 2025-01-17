import helpers from "../lib/helpers.js";
import jwt from "jsonwebtoken";
import { crearCronJobs, detenerCronJobs } from '../services/procesoService.js';
import { Builder, By, until } from 'selenium-webdriver';
import { Options as ChromeOptions } from 'selenium-webdriver/chrome.js';
import { db } from '../models/index.js'; // Aquí importas los modelos definidos en el archivo de modelos
const { Usuario } = db; // Usamos el modelo de Resultado
import { sequelize } from '../config/db.js';
import { Op } from 'sequelize';
import readXlsxFile from "read-excel-file/node";
import path from "path";
import { fileURLToPath } from "url";

// Obtener el directorio base de manera compatible con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __basedir = path.resolve(path.dirname(__filename));


const SECRET_KEY = process.env.SECRET_KEY; // Mueve esto fuera de la función si no cambia


// Importar las librerías necesarias
import moment from "moment";
import ExcelJS from "exceljs";


// Definir los formatos de fecha
const formatoLargo = "YYYY-MM-DD HH:mm:ss";
const formatoCorto = "YYYY-MM-DD";



// Crear un nuevo libro de Excel
const workbook = new ExcelJS.Workbook();


const Auth = {


    token: async (req, res) => {
        res.send(true);
    },
    login: async (req, res) => {

        try {
            const { usuario, password } = req.body;
    
            // Verifica si "usuario" y "password" están presentes
            if (!usuario || !password) {
                return res.status(400).send({
                    message: 'Usuario y contraseña son obligatorios',
                });
            }
    
            // Buscar el usuario en la base de datos
            const userRecord = await Usuario.findOne({
                where: { usuario },
            });
    
            if (!userRecord) {
                return res.status(404).send({
                    message: 'Usuario no encontrado',
                });
            }
    
            const { id_usuario, rol, password: password_db, nombres } = userRecord;
    
            // Validar la contraseña
            const isValidPassword = await helpers.matchPassword(password, password_db);
            if (!isValidPassword) {
                return res.status(401).send({
                    message: 'Contraseña incorrecta',
                });
            }
    
            // Generar el token JWT
            const token = jwt.sign(
                { usuario, id_usuario, rol }, // Datos que quieres incluir en el token
                SECRET_KEY,
                {
                    algorithm: 'HS256',
                    expiresIn: 43200, // 12 horas
                }
            );
    
            // Construir la respuesta de la sesión
            const sesion = {
                usuario,
                rol,
                nombres,
                token,
                autenticado: true,
            };
    
            return res.status(200).send(sesion);
    
        } catch (error) {
            console.error('Error en login:', error.message);
            return res.status(500).send({
                message: 'Ocurrió un error al intentar iniciar sesión',
                error: error.message,
            });
        }

    },
    listaUsuarios: async (req, res) => {
        try {
            const usuarios = await Usuario.findAll({
                where: {
                    estado: 1,
                },
            });

            res.status(200).send(usuarios);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            res.status(500).send({
                message: 'Ocurrió un error al obtener la lista de usuarios',
                error: error.message,
            });
        }
    },
    registroUsuario: async (req, res) => {
        let { nombres, usuario, email, password, rol } = req.body;

        // Validate request
        if (!req.body.usuario) {
            res.status(400).send({
                message: "El contenido no debe estar vacio!",
            });
            return;
        }

        password = await helpers.encryptPassword(req.body.password);

        const nuevo_usuario = {
            nombres,
            usuario,
            email,
            password,
            rol
        };

        await Usuario.create(nuevo_usuario)
            .then((data) => {
                res.send({
                    message: "Usuario Registrado correctamente",
                });
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message || "Ocurrio un error al crear el usuario.",
                });
            });



    }




}

export default Auth;