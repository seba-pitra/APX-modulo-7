import {sequelize} from "./db"
import { Auth } from "./db/auth"
import { User } from "./db/users"
import * as express from "express";
import * as cripto from "crypto"

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
    
    const [user, created] = await User.findOrCreate({
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

app.listen(port, ()=> {
    console.log("todo ok en el port:", port);
    
})
