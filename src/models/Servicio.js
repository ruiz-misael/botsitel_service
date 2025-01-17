export default (sequelize, DataTypes) => {
    const Servicio = sequelize.define("servicio", { // Nombre del modelo singular
        id_servicio: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        estado: {
            type: DataTypes.STRING, // Opción para mantener estado como texto
            allowNull: true, // Opcional
        },
        fecha_ini: {
            type: DataTypes.DATE,
            allowNull: true, // Opcional
        },
        intensidad: {
            type: DataTypes.INTEGER,
            allowNull: true, // Opcional
        },
        actualizado_por: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        ip_act: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fec_actu: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    });

    return Servicio;
};
