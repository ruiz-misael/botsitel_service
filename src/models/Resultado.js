export default (sequelize, DataTypes) => {
    const Resultado = sequelize.define("resultados", { // Nombre del modelo singular
        id_resultado: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        }, 
        id_carga: {
            type: DataTypes.INTEGER,
            allowNull: true, // Opcional
        },
        tipo_doc: {
            type: DataTypes.INTEGER,
            allowNull: true, // Opcional
        },
        nro_doc: {
            type: DataTypes.STRING,
            allowNull: true, // Opcional
        },
        modalidad: {
            type: DataTypes.STRING,
            allowNull: true, // Opcional
        },
        nro_telefono: {
            type: DataTypes.STRING,
            allowNull: true, // Opcional
        },
        emp_operadora: {
            type: DataTypes.STRING,
            allowNull: true, // Opcional
        },
        estado: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: true,
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

    return Resultado;
};
