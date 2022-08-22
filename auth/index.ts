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
    // console.log({auth, user});
    
    res.json({auth, user,})
})


//signin
//este endpoint tiene el fin de chequear si existe o no el usuario Y retornar un token q esconda la informacion de user para ser usado de nuevo
app.post("/auth/token", async(req,res) => {
    const {email, password} = req.body;
    const passwordHasheado = getSHA256ofString(password)//como la contraseña esta guardada "hasheada" debo buscarla de forma "hasheada"también

    const auth = await Auth.findOne({ where: {
        email,
        password: passwordHasheado
    } })

    const token = jwt.sign({ id: auth.get("user_id") }, SECRET)//el token que tiene esto esconde el "user_id" en este ej,
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


function authMiddleware(req,res, next) {//los middleware son funciones que se conectan con la funcion q sigue, en este caso
                                        //"authmiddleware" estara enganchada al endpoint "Get"
    const token = req.headers.authorization.split(" ")[1]//una vez obtenido el token hay q desencriptarlo
    // const token = req.get("authorization").split(" ")[1]//es lo mismo que la linea de arriba 

    try{//esta es la estructra para capturar errores. Si hay un error va al "catch"
        const data = jwt.verify(token, SECRET)//el metodo "verify" desencripta el token pero neecsita la palabra secreta
        req.body._user = data;//le adjuntamos al req que va a recibir el endpoint la data.
        next()
    } catch(e) {
        res.status(401).json({ error:true })
    }
}

//aca quequearemos si el token q recibo es el original
app.get("/me", authMiddleware, async (req,res) => {
    // console.log(req.body._user);
    const user = await User.findByPk(req.body._user.id)
    
    res.json({user,})
    //entonces se uso un middleware para acceder a la data mediante el token y anidar la funcion al objeto
})


app.listen(port, ()=> {
    console.log("todo ok en el port:", port);
    
})
