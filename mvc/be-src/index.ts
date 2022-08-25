import * as express from "express";
import * as path from "path"
import { User, Product, Auth } from "./models/index";
import { updateProfile, getProfile } from "./controllers/users-controllers";

const port = process.env.PORT || 3000;
const app = express()
const staticDirPath = path.resolve(__dirname, "../fe-dist")

app.use(
    express.json({
        limit: "50mb",
    })
) 

app.post("/profile",  async (req,res) => {
    if (!req.body) {
        res.status(400).json({ message: "No hay data" })
    }
    const updateData = await updateProfile(1, req.body)
    res.json(updateData)
})

app.get("/profile",  async (req,res) => {
    const profile = await getProfile(1)
    res.json(profile)
})

app.use(express.static(staticDirPath))

app.get("*", (req,res) => {
    res.sendFile(staticDirPath + "/index.html")
})//como incluir en el backend, el dist del codigo final

app.listen(port, ()=> {
    console.log("todo ok en el port:", port);
})

