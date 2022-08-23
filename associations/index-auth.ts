import {sequelize} from "./db"
import { Auth } from "./db/auth"
import { User } from "./db/users"
import * as express from "express";
import * as cripto from "crypto"
import { where } from "sequelize/types";
import * as jwt from "jsonwebtoken"

const SECRET = "asdaasdasdasdasas123"

function getSHA256ofString(text: string){
    return cripto
    .createHash('sha256')
    .update(text)
    .digest('hex')
}

sequelize.sync({ alter:true }) 
            .then(res => console.log(res))

const port = process.env.PORT || 3000;
const app = express()

app.use(express.json()) 

app.post("/auth",async (req, res) => {
    const {email,name,password,birthdate} = req.body

    const [user, created] = await User.findOrCreate({/
        where: { email: req.body.email},
        defaults: {
            email,
            password,
            name,
            birthdate,
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
    
    res.json({auth, user,})
})


app.post("/auth/token", async(req,res) => {
    const {email, password} = req.body;
    const passwordHasheado = getSHA256ofString(password)

    const auth = await Auth.findOne({ where: {
        email,
        password: passwordHasheado
    } })

    const token = jwt.sign({ id: auth.get("user_id") }, SECRET)

    if (auth) {
        res.json({
            token,
        })
    } else {
        res.status(400).json({ error: "meail or password incorrect"})
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


app.listen(port, ()=> {
    console.log("todo ok en el port:", port);
    
})
