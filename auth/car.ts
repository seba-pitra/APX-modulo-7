import { Model, DataTypes } from "sequelize"
import { sequelize } from "./db";

export class Car extends Model {} //Aca definimos que propiedades va a tener la BD
Car.init({
    price: DataTypes.INTEGER,
    name: DataTypes.STRING,
    state: DataTypes.STRING,
    model: DataTypes.INTEGER
}, { sequelize, modelName: 'cars' });