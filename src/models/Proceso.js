export default (sequelize, DataTypes) => {
    const Proceso = sequelize.define("proceso", { // Nombre del modelo singular
        id_proceso: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        intensidad: {
            type: DataTypes.INTEGER,
            allowNull: true, // Opcional
        },
        estado: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false,
        },
        registrado_por: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ip_reg: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fec_reg: {
            type: DataTypes.DATE,
            allowNull: false,
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

    return Proceso;
};
