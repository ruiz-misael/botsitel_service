import helpers from "../lib/helpers.js";
import jwt from "jsonwebtoken";
import { crearCronJobs, detenerCronJobs } from '../services/procesoService.js';


import { Builder, By, until } from 'selenium-webdriver';
import { Options as ChromeOptions } from 'selenium-webdriver/chrome.js';
import { db } from '../models/index.js'; // Aquí importas los modelos definidos en el archivo de modelos
const { Carga } = db; // Usamos el modelo de Carga
const { Detalle_carga } = db; // Usamos el modelo de Detalle Carga
const { Proceso } = db; // Usamos el modelo de Proceso
const { Servicio } = db; // Usamos el modelo de Servicio
const { Resultado } = db; // Usamos el modelo de Resultado
import { sequelize } from '../config/db.js';
import { Op } from 'sequelize';
import readXlsxFile from "read-excel-file/node";
import path from "path";
import { fileURLToPath } from "url";

// Obtener el directorio base de manera compatible con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __basedir = path.resolve(path.dirname(__filename));

// Importar las librerías necesarias
import moment from "moment";
import ExcelJS from "exceljs";

// Definir los formatos de fecha
const formatoLargo = "YYYY-MM-DD HH:mm:ss";
const formatoCorto = "YYYY-MM-DD";



// Crear un nuevo libro de Excel
const workbook = new ExcelJS.Workbook();

const procesados = new Set(); // Almacena los IDs de los registros ya procesados

const Opsitel = {
    estatusServicio: async (req, res) => {
        try {
            // Obtener el primer registro de la tabla Servicio
            const data = await Servicio.findOne();

            // Verificar si no se encuentra ningún registro
            if (!data) {
                return res.status(404).send({ message: 'No se encontró el registro en la tabla Servicio.' });
            }

            // Si el registro existe, lo enviamos como respuesta
            res.status(200).send(data);

        } catch (error) {
            // Manejo de errores
            console.error('Error al obtener el estado del servicio:', error.message);
            res.status(500).send({ message: 'Error al obtener el estado del servicio.', error: error.message });
        }
    }, actEstatusServicio: async (req, res) => {
        const { id_carga, intensidad } = req.body;  // Desestructurar el estado e intensidad desde el cuerpo de la solicitud

        try {
            // Verificar que el estado sea válido
            if (typeof id_carga !== 'number' || isNaN(Number(intensidad))) {
                return res.status(400).send({ message: 'El estado e intensidad deben ser números.' });
            }


            // Actualizar el estado e intensidad en la tabla Servicio
            const [updated] = await Carga.update(
                { intensidad },   // El nuevo estado e intensidad que se desea asignar
                { where: { id_carga: id_carga } }  // Aquí puedes ajustar el filtro según el servicio a actualizar
            );

            // Verificar si alguna fila fue actualizada
            if (updated === 0) {
                return res.status(404).send({ message: 'No se encontró el servicio para actualizar.' });
            }

            /**
             * 
            // Gestionar cron jobs según el nuevo estado
            if (estado !== undefined  && estado === 2) {
                // Iniciar cron jobs según la intensidad
                crearCronJobs(1, Number(intensidad)); // Asumimos que el ID del servicio es 1
            } else if (estado !== undefined  && estado === 1) {
                // Detener cron jobs
                detenerCronJobs(1);
            }
             */



            // Responder con éxito
            res.status(200).send({ message: 'Estado actualizado correctamente y cron jobs gestionados.' });

        } catch (error) {
            // Manejo de errores
            console.error('Error al actualizar el estado del servicio:', error.message);
            res.status(500).send({ message: 'Error al actualizar el estado del servicio.', error: error.message });
        }
    },
    listaRegistos: async (req, res) => {
        try {
            // Consulta SQL pura para contar estados
            const query = `
                SELECT 
                    COUNT(CASE WHEN estado = '1' THEN 1 END) AS pendientes,
                    COUNT(CASE WHEN estado = '2' THEN 1 END) AS procesados
                FROM cargas
            `;

            // Ejecutar la consulta SQL
            const [counts] = await Carga.sequelize.query(query);

            // Obtener todos los registros usando el modelo
            const data = await Carga.findAll({ limit: 100 });

            // Combinar los resultados y enviarlos como respuesta
            res.status(200).send({
                conteos: counts[0], // Resultados de la consulta SQL
                registros: data,   // Registros de la tabla 'cargas'
            });

        } catch (error) {
            console.error('Error al obtener registros:', error.message);
            res.status(500).send({ error: 'Error al obtener registros', mensaje: error.message });
        }
    },
    procesar: async (req, res) => {

        // Configuración de opciones para maximizar la ventana
        const options = new ChromeOptions()
            .addArguments('--start-maximized', '--disable-extensions', '--disable-gpu', '--no-sandbox');


        // Crear el driver con las opciones configuradas
        const driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        let data = []; // Definir la variable que almacenará los datos de la tabla

        try {
            //verificar si existen registros
            // Obtener un registro que no haya sido procesado
            const carga = await Carga.findAll({
                where: {
                    estado: 1, // Filtrar registros pendientes
                    id: { [Op.notIn]: Array.from(procesados) }, // Excluir IDs ya procesados
                },
                order: [['id_carga', 'ASC']], // Ordenar los registros (opcional)
                limit: 15, // Limitar a 10 registros
            });

            if (carga.length > 0) {

                // Navega a la página
                await driver.get('https://checatuslineas.osiptel.gob.pe/');

                for (const c of carga) {


                    let tipo_doc = c.tipo_doc;
                    let nro_doc = c.nro_doc;
                    let id_carga = c.id_carga;

                    const fechaActual = moment();


                    console.log("EL NUMERO DE DOC ES", nro_doc);

                    // Espera hasta que el campo select sea visible
                    await driver.wait(until.elementLocated(By.id('IdTipoDoc')), 10000);  // Espera hasta 10 segundos
                    const selectElement = await driver.findElement(By.id('IdTipoDoc'));

                    // Espera hasta que la opción esté disponible
                    await driver.wait(until.elementLocated(By.css(`option[value="${tipo_doc}"]`)), 10000);  // Espera hasta 10 segundos
                    const option = await selectElement.findElement(By.css(`option[value="${tipo_doc}"]`));

                    // Hacer clic en la opción
                    await option.click();

                    // Verifica que la opción fue seleccionada
                    const selectedOption = await selectElement.getAttribute('value');
                    console.log('Opción seleccionada:', selectedOption);

                    // Localiza el campo de texto por su ID
                    const inputField = await driver.findElement(By.id('NumeroDocumento'));

                    // Limpia el campo de texto antes de ingresar el valor
                    await inputField.clear();
                    await inputField.sendKeys(nro_doc);

                    // Verifica que el texto fue ingresado correctamente
                    const enteredValue = await inputField.getAttribute('value');
                    console.log('Valor ingresado:', enteredValue);

                    // Espera a que el botón esté presente en el DOM
                    await driver.wait(until.elementLocated(By.id('btnBuscar')), 10000);

                    // Localiza el botón por su ID
                    const button = await driver.findElement(By.id('btnBuscar'));
                    // Realiza el clic en el botón
                    await button.click();

                    // Verifica si el clic fue exitoso (opcional)
                    console.log('Botón clickeado con éxito.');

                    // Si el procesamiento es exitoso, actualiza el estado
                    await Carga.update(
                        { estado: 2, fec_proc: fechaActual.tz('America/Lima').format('YYYY-MM-DD HH:mm:ss') }, // Nuevo estado
                        { where: { id_carga } } // Condición para actualizar el registro específico
                    );

                    // Realiza un pequeño retraso para esperar la carga de los datos de la tabla
                    await driver.sleep(3000); // espera 5 segundos

                    // Espera hasta que la tabla esté visible
                    await driver.wait(until.elementLocated(By.id('GridConsulta')), 20000);

                    // Encuentra la tabla
                    const table = await driver.findElement(By.id('GridConsulta'));

                    // Verifica el contenido de la tabla antes de intentar extraer las filas
                    const tableContent = await table.getText();
                    console.log('Contenido de la tabla:', tableContent);

                    // Localiza el campo select para la paginación (mostrar 100 registros)
                    const selectPagination = await driver.findElement(By.css('.dataTables_length select'));

                    // Selecciona la opción "100"
                    const option100 = await selectPagination.findElement(By.css('option[value="100"]'));
                    await option100.click();

                    // Encuentra todas las filas de la tabla (sin contar el encabezado)
                    const rows = await table.findElements(By.tagName('tr'));

                    // Verifica cuántas filas hay
                    console.log(`Número de filas encontradas: ${rows.length}`);


                    for (let i = 1; i < rows.length; i++) { // Comienza desde 1 para omitir el encabezado
                        const columns = await rows[i].findElements(By.tagName('td'));

                        if (columns.length > 0) {
                            const rowData = [];
                            for (let column of columns) {
                                const text = await column.getText();
                                rowData.push(text);
                            }

                            // Extrae los datos por separado (ejemplo para 3 columnas)
                            const modalidad = rowData[0]; // Primera columna
                            const nro_telefono = rowData[1]; // Segunda columna
                            const emp_operadora = rowData[2]; // Tercera columna

                            let resultado = {
                                tipo_doc: tipo_doc,
                                nro_doc: nro_doc,
                                modalidad: modalidad,
                                nro_telefono: nro_telefono,
                                emp_operadora: emp_operadora,

                            };

                            await Resultado.create(resultado);

                            console.log(resultado)

                            // Opcional: también puedes agregar la fila completa a `data`
                            data.push(rowData);
                        }
                    }

                };



                // Imprime los datos de la tabla
                console.log("Datos de la tabla:", data);

                // Envía los datos de la tabla como respuesta
                //res.send(data);

            } else {
                console.log("No existen registros con estado = 1. No se navega a la página.");
                await driver.quit();
                procesados.clear();
                console.log('Set de procesados limpiado.');
            }

        } catch (err) {
            console.error('Error:', err.message);
            //res.status(500).send("Error al procesar la tabla");
        } finally {
            // Cierra el navegador
            await driver.quit();
        }

    },
    plantilla: async (req, res) => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Sheet 1");

            worksheet.columns = [
                { header: "tipo_documento", key: "documento", width: 25 },
                { header: "nro_documento", key: "telefono", width: 25 },
                { header: "leyenda", key: "leyenda", width: 85 }
            ];

            // Estilizar los encabezados
            worksheet.getRow(1).eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFCCE5FF' }, // Color de fondo azul claro
                };
                cell.font = {
                    bold: true,
                    color: { argb: 'FF000000' }, // Color de texto negro
                };
                cell.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrar el texto
            });


            // Agregar datos con descripción del tipo de documento

            worksheet.addRow({
                documento: "",
                telefono: "",
                leyenda: " Para DNI: Colocar 1 .",
            });
            worksheet.addRow({
                documento: "",
                telefono: "",
                leyenda: " Para RUC: Colocar 2 .",
            });

            worksheet.addRow({
                documento: "",
                telefono: "",
                leyenda: "Para CARNÉ DE EXTRANJERÍA: Colocar 3 .",
            });

            worksheet.addRow({
                documento: "",
                telefono: "",
                leyenda: "Para DOCUMENTO LEGAL DE IDENTIDAD: colocar 5.",
            });

            worksheet.addRow({
                documento: "",
                telefono: "",
                leyenda: "La columna nro_doc debe ser llenada en formato texto.",
            });


            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "Carga De documento.xlsx"
            );

            await workbook.xlsx.write(res); // Esperar a que se complete la escritura
            res.end(); // Finalizar la respuesta
        } catch (err) {
            console.error("Error al generar la plantilla:", err.message);
            res.status(500).json({ success: false, message: "Error al generar la plantilla" });
        }
    },
    carga: async (req, res) => {
        try {
            // Verifica si el archivo está vacío
            if (!req.file) {
                return res.status(400).send({ message: "Carga de datos vacía." });
            }
            const __basedir = path.resolve(path.dirname(""));
            let sourcePath = __basedir + "/resources/cargas/" + req.file.filename;
            const datosBase = [];

            // Lee el archivo Excel
            const rows = await readXlsxFile(sourcePath);

            // Si no hay filas o solo el encabezado, retorna error
            if (!rows || rows.length <= 1) {
                return res.status(400).send({ message: "El archivo no contiene datos válidos." });
            }

            const fechaActual = moment();

            console.log("la fecha es:", fechaActual.tz('America/Lima').format('YYYY-MM-DD HH:mm:ss'));

        

            let detalle = {
                encontrados: 0,
                no_encontrados: 0,
                nombre_archivo: req.file.filename,
                fec_carga: fechaActual.tz('America/Lima').format('YYYY-MM-DD HH:mm:ss'),
                fecha_termino: "",
                estado: 1,
                total_registros : rows
            }

            let nueva_carga = await Carga.create(detalle);

                // Procesa las filas
                rows.shift(); // Elimina el encabezado
                rows.forEach((row) => {
                    if (row[0] && row[1]) { // Validación básica
                        datosBase.push({
                            tipo_doc: row[0],
                            nro_doc: row[1],
                            fec_carga: fechaActual.tz('America/Lima').format('YYYY-MM-DD HH:mm:ss'),
                            id_carga: nueva_carga.id_carga                         
    
                        });
                    }
                });            

            // Inserta los datos en la base de datos
            await Detalle_carga.bulkCreate(datosBase);

            // Responde con éxito
            return res.status(200).send({
                message: `Archivo cargado exitosamente: ${req.file.originalname}`,
            });

        } catch (error) {
            console.error("Error al procesar la carga:", error);
            return res.status(500).send({
                message: "Error al procesar la carga.",
                error: error.message,
            });
        }
    },
    reporte: async (req, res) => {

        const { desde, hasta } = req.body;

        try {

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Sheet 1");

            worksheet.columns = [
                { header: "tipo_documento", key: "tipo_documento", width: 15 },
                { header: "nro_documento", key: "nro_documento", width: 15 },
                { header: "modalidad", key: "modalidad", width: 15 },
                { header: "nro_telefono", key: "nro_telefono", width: 15 },
                { header: "emp_operadora", key: "emp_operadora", width: 15 },
                { header: "fec_proceso", key: "fec_proceso", width: 15 }, // Corregido clave
            ];


            let resultado = await Resultado.findAll();


            // Recorrer los resultados
            for (const r of resultado) {
                const { tipo_doc, nro_doc, modalidad, nro_telefono, emp_operadora, createdAt } = r;

                worksheet.addRow({
                    tipo_documento: tipo_doc,
                    nro_documento: nro_doc,
                    telefono: nro_telefono, // Corregido aquí
                    modalidad: modalidad,
                    nro_telefono: nro_telefono,
                    emp_operadora: emp_operadora,
                    fec_proceso: createdAt,
                });
            }


            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "Reporte Opsitel.xlsx"
            );

            await workbook.xlsx.write(res); // Esperar a que se complete la escritura
            res.end(); // Finalizar la respuesta


        } catch (err) {
            console.error("Error al generar el reporte:", err.message);
            res.status(500).json({ success: false, message: "Error al generar reporte" });
        }


    }
}

export default Opsitel;
