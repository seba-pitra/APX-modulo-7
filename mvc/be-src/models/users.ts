import { Model, DataTypes } from "sequelize"
import { sequelize } from "./conection";

export class User extends Model {}

User.init({
    fullname: DataTypes.STRING,
    bio: DataTypes.STRING,
    pictureURL: DataTypes.STRING
}, { sequelize, modelName: 'User' });