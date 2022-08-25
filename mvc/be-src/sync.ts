import { sequelize } from "./models/conection";
import { User,Product} from "./models"

User.sequelize.sync({ alter: true })
.then(res => console.log(res) )