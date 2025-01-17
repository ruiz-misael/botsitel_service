export default (sequelize, DataTypes) => {
    const Carga = sequelize.define("cargas", { // Nombre del modelo singular
        id_carga: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre_base: {
            type: DataTypes.STRING,
            allowNull: true, // Opcional
        },
        intensidad: {
            type: DataTypes.STRING,
            allowNull: true, // Opcional
            defaultValue: 5,
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
        fec_carga: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        fec_termino: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        fec_proc: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        encontrados: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        no_encontrados: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        total_reg: {
            type: DataTypes.INTEGER,
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
        nombre_archivo: {
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
