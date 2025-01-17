export default (sequelize, DataTypes) => {
    const Carga = sequelize.define("detalle_cargas", { // Nombre del modelo singular
        id_detalle: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_carga: {
            type: DataTypes.INTEGER,
        },
        tipo_doc: {
            type: DataTypes.INTEGER,
            allowNull: true, // Opcional
        },
        nro_doc: {
            type: DataTypes.STRING,
            allowNull: true, // Opcional
        },
        estado: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false,
        },
        registrado_por: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        ip_reg: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fec_reg: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        fec_proc: {
            type: DataTypes.DATE,
            allowNull: true,
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

    return Carga;
};
