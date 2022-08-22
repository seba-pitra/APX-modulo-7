import {sequelize} from "./db"
import { Auth } from "./db/auth"
import { User } from "./db/users"
import * as express from "express";
import * as cripto from "crypto"
import { where } from "sequelize/types";
import * as jwt from "jsonwebtoken"

const SECRET = "asdaasdasdasdasas123"//esta es la palabra clave para desencriptar el token

function getSHA256ofString(text: string){// esta funcion "hashea" la contraseña
    return cripto
    .createHash('sha256')
    .update(text)
    .digest('hex')
}

//Aca sincronzamos la BD. Asi q ya existe la tabla "auth"
sequelize.sync({ alter:true }) //Con esto se borraron tdas las tablas y se volvieron a crear
.then(res => console.log(res))

const port = process.env.PORT || 3000;
const app = express()

app.use(express.json()) 

// signup
//Registramos el usuario en la base de datos para que pueda acceder a todos los recursos
app.post("/auth",async (req, res) => {
    const {email,name,password,birthdate} = req.body

    const [user, created] = await User.findOrCreate({//este metodo busca y si no encuentra, crea los valores q le pasamos
        where: { email: req.body.email},//en el modelo User, el where indicara el campo que vamos a buscar en los registros
                                  // y en este caso buscara el campo "email" q tenga lo mismo que "req.body.email" y si no existe
                                  //creara en el modelo user una tabla nueva con los avlores q le paso en el "default"                               
        defaults: {
            email,
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
    // console.log({auth, user});
    
    res.json(auth)
})


//signin
//este endpoint tiene el fin de chequear si existe o no el usuario Y retornar un token q esconda la informacion de user para ser usado de nuevo
app.post("/auth/token", async(req,res) => {
    const {email, password} = req.body;
    const passwordHasheado = getSHA256ofString(password)//como la contraseña esta guardada "hasheada" debo bsucarla de forma "hasheada"también

    const auth = await Auth.findOne({ where: {
        email,
        password: passwordHasheado
    } })

    const token = jwt.sign({ id: auth.get("user_id") }, SECRET)//el token que tiene esto esconde el "user_id" por ej,
                                                               //y este es el texto q vamos a usar desp para invocar en otros endpoints 
                                                               //y lo desencriptaremos usaremos el mismo "SECRET"

    if (auth) {
        res.json({
            token,
        })
    } else {
        res.status(400).json({ error: "meail or password incorrect"})
    }
})


//aca quequearemos si el token q recibo es el original
app.post("/me", (req,res) => {
    const token = req.headers.authorization.split(" ")[1]//una vez obtenido el token hay q desencriptarlo

    try{//esta es la estructra para capturar errores. Si hay un error va al "catch"
        const data = jwt.verify(token, SECRET)//el metodo "verify" desencripta el token pero neecsita la palabra secreta
        res.json(data)
    } catch(e) {
        res.status(401).json({ error:true })
    }
})


app.listen(port, ()=> {
    console.log("todo ok en el port:", port);
    
})
