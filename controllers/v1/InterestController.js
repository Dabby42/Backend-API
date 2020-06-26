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

    /**
   * @api {post} /v1/interest Create Interest
   * @apiName Create Interest
   * @apiGroup Interest
   * @apiParam {String} image Interest Image
   * @apiParam {String} type Type of the Interest
   */
    async createInterest(req, res) {
        let {image, type} = req.body;

        try {
            const service = new imageService('cloudinary');
            // checks if base64 image version exists and uploads to cloudinary
            if(image)image = await service.uploadBase64Image(image);
            let data = {type};

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

    /**
     * @api {get} /v1/interest/:id Get User's Interest
     * @apiName Get User's Interest
     * @apiGroup Interest
     */

    async getInterest(req, res) {
        const { type} = req.body;
        try {
            let interest = await Interest.find({type: type, isActive: true});
            let data = interest.type;
            let userInterest = new UserInterest();
            userInterest.interest = data;

            await userInterest.save();
            return super.actionSuccess(res, 'User Interest Retrieved'); 
        } catch (error) {
            console.log(error);
            return super.actionFailure(res, `Couldn't get interest`);
        }

    }

    /**
     * @api {delete} /v1/interest/:id Remove Interest
     * @apiName Remove Interest
     * @apiGroup Interest
     */
    async removeInterest(req, res) {
        const { id } = req.body;
        try{
            let userInterest = await UserInterest.findOneAndUpdate({_id: id}, {isActive: false});
            return super.actionSuccess(res, 'Interest Deleted');

        }catch(err){
            console.log(err);
            return super.actionFailure(res, `Couldn't delete interest`);
        }
    }

    /**
   * @api {patch} /v1/interest/restore/:id Restore Interest
   * @apiName Restore Interest
   * @apiGroup Interest
   */
  async restoreInterest(req, res){
    const { id } = req.body;
    try{
        let interest = await Interest.findOneAndUpdate({_id: id}, {isActive: true});
        return super.actionSuccess(res, 'Interest Restored');

    }catch(err){
        console.log(err);
        return super.actionFailure(res, `Couldn't restore interest`);
    }
  }

}

module.exports = InterestController;