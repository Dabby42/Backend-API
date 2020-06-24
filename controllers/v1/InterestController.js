import autoBind from 'auto-bind';
import BaseController from './BaseController';
import Interest from './../../models/Interest';
import UserInterest from './../../models/UserInterest';
import dotenv from 'dotenv';

import imageService from './../../services/ImageService';
dotenv.config();

class InterestController extends BaseController{
    constructor(){
        super();
        autoBind(this);
    }

    async createInterest(req, res) {
        let {image, name} = req.body;

        const service = new imageService('cloudinary');

        try {
            // checks if base64 image version exists and uploads to cloudinary
            if(image)image = await service.uploadBase64Image(image);
            let data = {};
            data.name = name

            // checks if image uploaded and add it to the data
            if(image) data.image = image.url;
            
            let interest = new Interest(data);
            await interest.save();

            return super.success(res, interest, 'Created Interest Successfully');
        } catch (error) {
            if(image) await service.deleteImage(image.id);
            return super.actionFailure(res, `Couldn't create interest`);
        }
        
    }

    async getInterest(req, res) {
        const { id } = req.body;
        try {
            let interest = await interest.find({_id: id});
            let data = interest.name;
            let UserInterest = new UserInterest();
            UserInterest.interest = data;

            await UserInterest.save();
            return super.actionSuccess(res, 'User Interest Created'); 
        } catch (error) {
            console.log(err);
            return super.actionFailure(res, `Couldn't get interest`);
        }
        
    }

    async deleteInterest(req, res) {
        const { id } = req.body;
        try{
            let interest = await interest.find({_id: id});
            return super.actionSuccess(res, 'Interest Deleted');

        }catch(err){
            console.log(err);
            return super.actionFailure(res, `Couldn't delete interest`);
        }
    }

}

module.exports = InterestController;