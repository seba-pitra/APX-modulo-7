import * as express from "express";
import {sequelize} from "./db"
import { User } from "./db/models";
import { Product } from "./db/models";

const port = 3000;
const app = express()
// sequelize.sync({ alter: true })

app.use(express.json()) 

app.get("/test",async (req:any,res:any) => {
    // const user = await User.create({
    //     name: "sebi",
    //     email: "seba@gmail.com"
    // })
    // const product = await Product.create({
    //     name:"Mate", 
    //     price: 350,
    //     UserId: 1
    // })
    const products = await Product.findAll({
        where: {
            UserId: 1
        },
        include: [User]//incluye el modelo User en la busqueda
    })
    res.json(products)
})

app.listen(port, () => {
    console.log("El puerto funciona en el numero:" + port);
})