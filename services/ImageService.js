
const Cloudinary = require('./images/Cloudinary');

class ImageService {

    
    constructor(processor){
        this.processor = null;

        switch(processor){
            case 'cloudinary':
                this.processor = new Cloudinary();
                break;

            // case 'imagekit':
            //     this.processor = new ImageKit();
            //     break;

            default:
                this.processor = new Cloudinary();
        }
    }

    uploadBase64Image = async (data) => {
        return await this.processor.uploadBase64Image(data);
    }

    deleteImage = async (data) => {
        return await this.processor.deleteImage(data);
    }

}

module.exports = ImageService;