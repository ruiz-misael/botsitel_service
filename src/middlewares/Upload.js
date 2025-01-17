import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import moment from "moment";

// Obtener el directorio base de manera compatible con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __basedir = path.resolve(path.dirname(__filename));

// Ruta donde se guardarán los archivos fuera de `src`, en la carpeta `resources`
const uploadDir = path.join(__basedir, "../../resources/cargas/"); // Ruta fuera de `src`

// Depuración: Verifica la ruta donde se guardará el archivo
console.log("Ruta de carga:", uploadDir);

// Crear la carpeta si no existe
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("Directorio creado:", uploadDir);
  }
} catch (err) {
  console.error("Error al crear el directorio de cargas:", err);
}

// Filtro para aceptar solo archivos Excel
const excelFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
    "application/vnd.ms-excel", // XLS
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos Excel (.xls, .xlsx)."), false);
  }
};

// Función para generar el nombre del archivo
const generateFilename = (originalName) => {
  const now = new Date();
  const formattedDate  = moment().tz('America/Lima').format('YYYY-MM-DD_HH-mm-ss');

  const extension = path.extname(originalName);
  const baseName = path.basename(originalName, extension); // Obtén el nombre original sin extensión
  return `${baseName}_${formattedDate}${extension}`;
};

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Destino del archivo:", uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    console.log("Nombre original del archivo:", file.originalname);
    const newFilename = generateFilename(file.originalname);
    cb(null, newFilename);
  },
});

// Configurar multer con almacenamiento y filtro de archivos
const uploadFile = multer({ storage, fileFilter: excelFilter });

export default uploadFile;
