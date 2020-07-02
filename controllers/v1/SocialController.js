import autoBind from 'auto-bind';
import BaseController from './BaseController';
import Social from './../../models/Social';
import dotenv from 'dotenv';
import SocialService from './../../services/SocialService';
dotenv.config();

class SocialController extends BaseController{

  constructor(){
    super();
    autoBind(this);
  }

    /**
   * @api {post} /v1/social Get User Timeline
   * @apiName Get User Timeline
   * @apiGroup Social
   */
  async getTimeline(req, res){
      const {provider, userId} = req.body;
    try{
        const service = new SocialService(provider);
        const social = await Social.findOne({user: userId, provider});
        if(social){
            const {longLivedAccessToken, longLivedAccessTokenSecret, firstName, lastName} = social;
            console.log(social);
            
            const timeline = await service.getTimeline({longLivedAccessToken, longLivedAccessTokenSecret, firstName, lastName});
            return super.success(res, timeline, `Retrieve timeline from ${provider}`);
        }

        return super.actionFailure(res, `${provider} Account not connected`);
        

    }catch(err){
        console.log(err);
        return super.actionFailure(res, `Couldn't retrieve timeline`);
    }
  }

   /**
   * @api {post} /v1/social/avatar Get User Avatar
   * @apiName Get User Avatar
   * @apiGroup Social
   * @apiParam {String} provider social provider
   */
  async getAvatar(req, res){
    const {provider, userId} = req.body;
    try{
        const service = new SocialService(provider);
        const social = await Social.findOne({user: userId, provider});
        if(social){
            const {longLivedAccessToken} = social;
            const avatar = await service.getAvatar({longLivedAccessToken});
            return super.success(res, avatar, `Retrieve avatar from ${provider}`);
        }

        return super.actionFailure(res, `${provider} Account not connected`);
        

    }catch(err){
        console.log(err);
        return super.actionFailure(res, `Couldn't retrieve avatar`);
    }
}



}

module.exports = SocialController;
