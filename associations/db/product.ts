import { Model, DataTypes } from "sequelize"
import { sequelize } from "./index";

export class Product extends Model {}

Product.init({
    name: DataTypes.STRING,
    Price: DataTypes.INTEGER,
}, { sequelize, modelName: 'Product' });