export default (sequelize, DataTypes) => {
    const Usuario = sequelize.define("usuario", { // Nombre del modelo singular
        id_usuario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombres: {
            type: DataTypes.STRING,
            allowNull: true, // Opcional
        },
        usuario: {
            type: DataTypes.STRING,
            unique: true, // Campo único
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true, // Opcional
        },
        rol: {
            type: DataTypes.STRING,
            allowNull: true, // Opcional
        },
        password: {
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

    return Usuario;
}

