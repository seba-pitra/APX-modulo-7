import * as express from "express";
import * as cripto from "crypto"
import * as jwt from "jsonwebtoken"
import {sequelize} from "./db"
import { User } from "./db/models";
import { Product } from "./db/models";
import { Auth } from "./db/models";

const port = 3000;
const app = express()
const SECRET = "secret-word"

sequelize.sync({ alter: true })

function getSHA256ofString(text: string){
    return cripto
    .createHash('sha256')
    .update(text)
    .digest('hex')
}

app.use(express.json())

app.post("/auth",async (req, res) => {
    const {email,name,password} = req.body

    const [user, created] = await User.findOrCreate({
        where: { email: req.body.email},
        defaults: {
            email,
            password,
            name,
        }
    })

    const [auth, authCreated] = await Auth.findOrCreate({
        where: { user_id: user.get("id")},
        defaults: {
            email,
            password: getSHA256ofString(req.body.password),
            user_id: user.get("id")
        }
    })
    
    res.json({auth, user})
})

app.post("/auth/token", async(req,res) => {
    const {email, password} = req.body;
    const passwordHasheado = getSHA256ofString(password)

    const auth = await Auth.findOne({ 
        where: {
            email,
            password: passwordHasheado
        }
    })

    const token = jwt.sign({ id: auth.get("user_id") }, SECRET)
                                                        
    if (auth) {
        res.json({ token, })
    } else {
        res.status(400).json({ error: "email or password incorrect"})
    }
})

function authMiddleware(req,res, next) {
    const token = req.headers.authorization.split(" ")[1]
    try{
        const data = jwt.verify(token, SECRET)
        req.body._user = data;
        next()
    } catch(e) {
        res.status(401).json({ error:true })
    }
}

app.get("/me", authMiddleware, async (req,res) => {
    const user = await User.findByPk(req.body._user.id)
    res.json({user,})
})


app.post("/products",authMiddleware, async (req:any,res:any) => {
    const {name, price} = req.body
    const user = await User.findByPk(req.body._user.id)
    const product = await Product.create({
        name, 
        price,
        UserId: user.get("id")
    })
    res.json(product)
})

app.get("/me/products", authMiddleware, async (req,res) => {
    const user = await User.findByPk(req.body._user.id)
    const products = await Product.findAll({
        where: {
            UserId: user.get("id")
        },
        include: [User]//incluye el modelo User en la busqueda. Cuando muestre los resultados mostrará la data del user
    })
    res.json(products)
})

app.listen(port, () => {
    console.log("El puerto funciona en el numero:" + port);
})