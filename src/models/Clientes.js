export default (sequelize, Sequelize) => {
    const Clients = sequelize.define("usuarios", { // Usa el nombre correcto del modelo, e.g., 'Usuarios'
        idcliente: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        idpersona: {
            type: Sequelize.INTEGER,
            references: {
                model: 'personas', // nombre de la tabla a la que hace referencia
                key: 'idpersona', // columna de referencia en la tabla relacionada
            },
            allowNull: false  // Esto hace que el campo sea obligatorio
        },
        idticket: {
            type: Sequelize.INTEGER,
            references: {
                model: 'tickets', // nombre de la tabla a la que hace referencia
                key: 'idticket', // columna de referencia en la tabla relacionada
            },
            allowNull: false  // Esto hace que el campo sea obligatorio
        },
        estado: {
            type: Sequelize.INTEGER,
            defaultValue: 1,
            allowNull: false  // Esto hace que el campo sea obligatorio
        },
        registrado_por: {
            type: Sequelize.INTEGER,
            allowNull: false  // Esto hace que el campo sea obligatorio
        },
        ip_reg: {
            type: Sequelize.STRING,
            allowNull: false  // Esto hace que el campo sea obligatorio
        },
        fec_reg: {
            type: Sequelize.DATE,
            allowNull: false  // Esto hace que el campo sea obligatorio
        },
        actualizado_por: {
            type: Sequelize.INTEGER,
            allowNull: true  // Esto hace que el campo sea obligatorio
        },
        ip_act: {
            type: Sequelize.STRING,
            allowNull: true  // Esto hace que el campo sea obligatorio
        },
        fec_actu: {
            type: Sequelize.DATE,
            allowNull: true  // Esto hace que el campo sea obligatorio
        },
    });


    Clients.associate = (models) => {
        Clients.belongsTo(models.Persons, { foreignKey: 'idpersona' });
    };


    return Clients;
};