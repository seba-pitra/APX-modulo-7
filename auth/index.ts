import {sequelize} from "./db"
import { Car } from "./car"
import * as express from "express";

const port = process.env.PORT || 3000;
const app = express()

app.use(express.json()) 

app.get("/auth",async (req:any,res:any) => {
    res.json({hola:true})
})

app.listen(port, ()=> {
    console.log("todo ok en el port:", port);
    
})
