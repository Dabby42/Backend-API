import autoBind from 'auto-bind';
import AuthController from './AuthController';
import Social from './../../models/Social';
import dotenv from 'dotenv';
import SocialService from './../../services/SocialService';
import {FACEBOOK, TWITTER, INSTAGRAM} from './../../config/enums';
dotenv.config();

class SocialController extends AuthController{

  constructor(){
    super();
    autoBind(this);
  }


  /**
   * @api {get} /v1/social Get Connected Account
   * @apiName Get Connected Account
   * @apiGroup Social
   */
  async getConnectedAccount(req, res){
    const {userId} = req.body;

    try{
        let socials = await Social.find({user: userId});
        return super.success(res, socials, 'Social Accounts Retrieved');
    }catch(err){
        return super.actionFailure(res, `Couldn't retrieve social accounts`);
    }
  }

   /**
   * @api {post} /v1/social/connect Connect Account
   * @apiName Connect Account
   * @apiGroup Social
   * @apiParam {String} provider social provider
   * @apiParam {String} accessToken social accessToken
   */
  async connectAccount(req, res){
    const { provider, userId } = req.body;
    try{
      let result = null
      // switch to trigger the correct provider
      switch(provider){
        case FACEBOOK:
          result = await super.authenticateFacebook(req, res);
          break;

        case TWITTER:
          result = await super.authenticateTwitter(req, res);
          break

        case INSTAGRAM:
          result = await super.authenticateInstagram(req, res);
          break

        default:
          result = await super.authenticateFacebook(req, res);
      }
      //check if result returns required data
      if(!result) return super.unauthorized(res, 'Authentication could not be completed to account');
      const {firstName, email, lastName, longLivedAccessToken, longLivedAccessTokenSecret, socialId} = result;

      let social = await Social.findOne({user: userId, provider, socialId});
      if(!social){
        social = new Social({user:userId, firstName, lastName, longLivedAccessTokenSecret,  longLivedAccessToken, socialId, provider })
        social.save();
      }else{
        social.longLivedAccessToken = longLivedAccessToken;
        social.longLivedAccessTokenSecret = longLivedAccessTokenSecret;
        social.firstName = firstName;
        social.lastName = lastName;
        social.save();
      }
      return super.actionSuccess(res, 'Account Connected Successfully');
      
    }catch(err){
      console.log(err);
        return super.actionFailure(res, err.message);
    }
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
