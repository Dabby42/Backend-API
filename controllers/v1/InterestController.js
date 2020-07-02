import autoBind from 'auto-bind';
import BaseController from './BaseController';
import Interest from './../../models/Interest';
import UserInterest from './../../models/UserInterest';
import User from './../../models/User';
import dotenv from 'dotenv';

import imageService from './../../services/ImageService';
import { use } from '../../routes/v1/AuthRoute';
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
   * @apiParam {String} name Type of the Interest
   */
    async createInterest(req, res) {
        let {image, name} = req.body;

        try {
            const service = new imageService('cloudinary');
            // checks if base64 image version exists and uploads to cloudinary
            if(image)image = await service.uploadBase64Image(image);
            let data = {name};

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
     * @api {post} /v1/interest/select Add User's Interest
     * @apiName Add User's Interest
     * @apiGroup Interest
     */

    async selectInterest(req, res) {
        const { interests, userId} = req.body;
        try {
            interests.map(async (interest) => {
                let userInterest = await UserInterest.findOne({user: userId, interest});
               
                if(!userInterest){
                    userInterest = new UserInterest({user: userId, interest});
                    await userInterest.save();
                }
            })
            return super.actionSuccess(res, `user interest updated`);
            
        } catch (error) {
            console.log(error);
            return super.actionFailure(res, `Couldn't select interest`);
        }

    }

    /**
     * @api {delete} /v1/interest/:id remove Remove Interest
     * @apiName Remove Interest
     * @apiGroup Interest
     */
    async removeInterest(req, res) {
        const { userId } = req.body;
        try{
            let userInterest = await UserInterest.findOne({_id: userId});
            userInterest.isActive = false;
            await userInterest.save();
            return super.actionSuccess(res, 'Interest has been deleted');
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
    const {userId } = req.body;
    try{

        let userInterest = await UserInterest.findOne({_id: userId});
        userInterest.isActive = true;
        userInterest.save();
        return super.actionSuccess(res, 'Interest has been restored');

    }catch(err){
        console.log(err);
        return super.actionFailure(res, `Couldn't restore interest`);
    }
  }

    /**
   * @api {get} /v1/interest Retrieve interests
   * @apiName Retrieve Interests
   * @apiGroup Interest
   */
  async getInterest(req, res){
    try {
        let interest = await Interest.find({isActive: true});
        return super.success(res, interest,'Interest has been retrieved successfully');
    } catch (error) {
        console.log(err);
        return super.actionFailure(res, `Couldn't retrieve interest`);
    }
  }

/**
   * @api {get} /v1/interest/user Retrieve User interests
   * @apiName Retrieve User Interests
   * @apiGroup Interest
*/
  async getUserInterest(req, res){
    const {userId} = req.body;
    try {
        let interest = await UserInterest.find({isActive: true, user: userId});
        return super.success(res, interest,'User Interest has been retrieved successfully');
    } catch (error) {
        console.log(err);
        return super.actionFailure(res, `Couldn't User retrieve interest`);
    }
  }

}



module.exports = InterestController;