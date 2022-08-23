import {sequelize} from "./db"
import { Comercio } from "./db/comercios";
import * as express from "express";
import { index } from "./lib/algolia";

const port = process.env.PORT || 3000;
const app = express()

sequelize.sync({ alter: true })

app.use(express.json()) 

app.post("/comercios", async (req,res) => {
    const newComercio = await Comercio.create(req.body)
    const algoliaRes = await index//en este punto registramos el "comercio" en algolia
    .saveObject({
      objectID: newComercio.get("id"),
      name: newComercio.get("nombre"),
      _geoloc: {
        "lat": newComercio.get("lat"),
        "lng": newComercio.get("lng")
      }
    })
    .then(res => {
    console.log(res);
    })
    .catch(e => {
    console.log(e)
})
    res.json(newComercio)
})

app.get("/comercios",  async (req,res) => {
    const todos = await Comercio.findAll({})
    res.json(todos)
})

app.get("/comercios/:id",  async (req,res) => {
    const comercio = await Comercio.findByPk(req.params.id)
    res.json(comercio)
})

function bodyToIndex(body, id?) { //pasamos el formato del body al formato del algolia
    const respuesta:any = {}
    if (body.nombre) {
        respuesta.nombre = body.nombre
    }
    if (body.rubro) {
        respuesta.rubro = body.rubro
    }
    if (body.lat && body.lng) {
        respuesta._geoloc = {
            lat: body.lat,
            lng: body.lng
        }
    }
    if(id) {
        respuesta.objectID = id
    }
    return respuesta
}

app.put("/comercios/:id",  async (req,res) => {
    const comercio = await Comercio.update(req.body, {
        where:{ id: req.params.id } 
    })
    const indexItem = bodyToIndex(req.body, req.params.id)
    const algoliaRes = await index.partialUpdateObject(indexItem)
    res.json(comercio)
})

app.get("/comercios-cerca-de",  async (req,res) => {
    const {lat,lng} = req.query
    const {hits} = await index.search("", {
        aroundLatLng: [lat, lng].join(","),
        aroundRadius: 10000
    })
    res.json(hits)
})

app.get("*", express.static(__dirname + "/public"))

app.listen(port, ()=> {
    console.log("todo ok en el port:", port);
})

// index.search("", {//busca ""(todos) en las longitudes y latitudes que le establecemos
//     aroundLatLng: '40.71, -74.01',
//     aroundRadius: 100000
// })
// .then(res => {
//     console.log(res);
// })

// index
//   .saveObject({
//       objectID: '1',
//       name: "termo para mate - muy bueno!",
//       price:350,
//       "_geoloc": {
//         "lat": 40.639751,
//         "lng": -73.778925
//       }
//   }).then(res => {
//     console.log(res);
// }).catch(e => {
//     console.log(e)
// })
