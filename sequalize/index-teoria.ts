// import { Sequelize, Model, DataTypes } from "sequelize"
// import {User} from "./db/user"

// import {sequelize} from "./db"
// import { Product } from "./db/car"
// (async () => {
//    await sequelize.sync()//Esto le dice a la BD q definimos un modelo y lo queremos inicializar(Crearlo en la BD) 
//    // sequelize.sync({alter:true})//Siempre vamos a cambiar algun dato desde los modelos y est funcion 
//                                //sirve para identificar cambios que hay en los modelos



//    // const jane = await User.create({//De la clase user creamos un nuevo User q tendra nombre y fecha de nacimiento
//    // username: 'marce',
//    // birthday: new Date(1980, 6, 20),
//    // lastName: "zapaia"
//    // });

//    // const product = await Product.create({
//    //    price: 233,
//    //    title: "computer"
//    // })

//    const product = await Product.findAll({
//       where: {
//          id: 2
//       }
//    })

//    // const todos = await Product.findAll()
//    console.log(product);
// })()