import secrets from './secrets';

let imageConfig = {
    cloudinary:{
        cloud_name: secrets.cloudinaryCloudName, 
        api_key: secrets.cloudinaryApiKey, 
        api_secret: secrets.cloudinaryApiSecret 
    }
    
  }

module.exports = imageConfig
