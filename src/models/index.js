import { sequelize } from '../config/db.js';  // Importar la instancia de Sequelize
import { DataTypes } from 'sequelize';  // Importar DataTypes
import Usuario from './Usuario.js';  // Importar los modelos
import Resultado from './Resultado.js';  // Importar los modelos
import Detalle_carga from './Detalle_carga.js';  // Importar los modelos
import Carga from './Carga.js';  // Importar los modelos
import Proceso from './Proceso.js';  // Importar los modelos
import Servicio from './Servicio.js';  // Importar los modelos

// Definir los modelos
const db = {
    Usuario: Usuario(sequelize, DataTypes),
    Resultado: Resultado(sequelize, DataTypes),
    Carga: Carga(sequelize, DataTypes),
    Proceso: Proceso(sequelize, DataTypes),
    Servicio: Servicio(sequelize, DataTypes),
    Detalle_carga: Detalle_carga(sequelize, DataTypes)
};

// Sincronizar los modelos con la base de datos
const syncDatabase = async () => {
    try {
        // Sincronizar la base de datos, sin destruir las tablas existentes
        await sequelize.sync({ force: false, alter: false });
        console.log('Database synchronized');

        // Verificar si la tabla Servicio está vacía
        const existingServicio = await db.Servicio.findOne();
        if (!existingServicio) {
            // Crear un registro inicial en la tabla Servicio si no existe ninguno
            await db.Servicio.create({
                estado: 1, // Ejemplo de valor para estado
                intensidad: 5,
                actualizado_por: 1, // Ejemplo
                fec_actu: new Date(),
            });
            console.log('Registro inicial creado en la tabla Servicio');
        } else {
            console.log('La tabla Servicio ya tiene datos.');
        }



    } catch (error) {
        console.error('Error syncing database:', error);
    }
};

export { db, syncDatabase };
