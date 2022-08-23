//en este archivo importaremos todos los modelos para hhacer las relaciones entre si
//y evitamos el problema de dependencia circular

import { User } from "./users";
import { Product } from "./product";

User.hasMany(Product)//definimos la relacion one to many entre User y Product
Product.belongsTo(User)//aca definimos la relacion entre productos y usuarios

export { User, Product } 