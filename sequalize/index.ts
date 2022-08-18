import {sequelize} from "./db"
import { Car } from "./db/car"
import * as express from "express";

const port = 3000;
const app = express()

app.use(express.json()) 

app.post("/cars",async (req:any,res:any) => {
    await sequelize.sync()
    //Ahora existirá un nuevo auto en la DB:
    const newCar = await Car.create(req.body)
    res.json(newCar)
})

app.get("/cars", async (req,res) => {
    await sequelize.sync()
    const allCars = await Car.findAll()
    res.json(allCars)
})

app.get("/cars/:carId", async (req,res) => {
    await sequelize.sync()
    const {carId} = req.params;
    const myCar = await Car.findAll({
        where: { id: carId }
    })
    res.json(myCar)
})

app.patch("/cars/:carId",async (req,res) => {
    await sequelize.sync();
    const {carId} = req.params
    await Car.update(req.body, {
        where: { id: carId }
    })
    const myCar = await Car.findAll({
        where: { id: carId }
    })
    res.json(myCar)
})

app.delete("/cars/:carId",async (req,res) => {
    await sequelize.sync();
    const { carId } = req.params
    await Car.destroy({
        where: { id: carId }
    })
    res.json({message: "deleted"})
})

app.listen(port, () => {
    console.log("El puerto funciona en el numero:" + port);
})