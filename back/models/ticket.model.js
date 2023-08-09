module.exports = (sequelize, Sequelize) => {
    const Ticket = sequelize.define("ticket", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        idUtilisateur: {
            type: Sequelize.INTEGER
        },
        titre: {
            type: Sequelize.STRING
        },
        idStatus: {
            type: Sequelize.INTEGER
        },
        message: {
            type: Sequelize.TEXT
        },
        dateCreation: {
            type: Sequelize.DATE
        }
    });


    return Ticket;
};