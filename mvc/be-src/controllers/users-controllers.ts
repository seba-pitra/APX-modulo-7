import { User, Product } from "../models";
import { cloudinary } from "../lib/cloudinary";
import { where } from "sequelize/types";


export async function updateProfile(userId ,updateData) {
    if (updateData.pictureDataURL) {
        const imagen = await cloudinary.uploader.upload(updateData.pictureDataURL,//esta es la imagen
        {
            resource_type: "image",//tipo de archivo puede ser video tambien
            discard_original_filename: true,//que no use el nombre original, que le haga un nombre nuevo
            width: 1000//limite el ancho a 1000
        });
        
        const updateDataComplete = {
            fullname: updateData.fullname,
            bio: updateData.bio,
            pictureURL: imagen.secure_url//esta es la url
        }

        await User.update(updateDataComplete, { 
            where: { 
                id: userId
            }
        })
        return updateDataComplete
    }
}

export async function getProfile(userId) {
    const userProfile = User.findByPk(userId)
    return userProfile
}