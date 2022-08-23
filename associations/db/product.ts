import { Model, DataTypes } from "sequelize"
import { sequelize } from "./index";

export class Product extends Model {}

Product.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
}, { sequelize, modelName: 'Product' });