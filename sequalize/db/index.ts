import { Sequelize } from "sequelize"

//Conectarse a la BD:
export const sequelize = new Sequelize({
    dialect: "postgres",
    username: "lpbbcdvvslxbpe",
    password: "8abab8341f5cfee7f66d038c49e4eded36954190a9be1061b26cee3374d5d9ed",
    database: "d11vodj82etc3l",
    port: 5432,
    host: "ec2-52-207-15-147.compute-1.amazonaws.com",
    ssl: true,
    // esto es necesario para que corra correctamente
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
});



// try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
// } catch (error) {
//     console.error('Unable to connect to the database:', error);
// }