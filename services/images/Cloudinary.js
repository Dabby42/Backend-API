import clouder from 'cloudinary';
import imageConfig from './../../config/image';
let cloudinary = clouder.v2;
cloudinary.config(imageConfig.cloudinary);

class Cloudinary{

    /**
     * Uploads base64 image to cloudinary
     * @param {base64String} image
     */
    uploadBase64Image = async (image) => {
        try{
            let uploadedImage = await cloudinary.uploader.upload(image, (error, result) => {});
            const {public_id, secure_url} = uploadedImage;
            if(public_id && secure_url){
                return {id: public_id, url: secure_url}
            }else{
                return null;
            }
        }catch(err){
            console.log(err, "someting went wrong with image")
            return null
        }
    }

    /**
     * @param {String} publicId
     */
    deleteImage = async (publicId) => {
        return await cloudinary.uploader.destroy(publicId, (error, result) => {
            if(error){
                return null;
            }else{
                
                if(result.result == 'ok'){
                    return true;
                }else{
                    return false;
                }
                
            }
        });
    }

}

module.exports = Cloudinary;