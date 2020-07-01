import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import autoBind from 'auto-bind';
import BaseController from './BaseController';
import User from './../../models/User';
import Social from './../../models/Social';
import dotenv from 'dotenv';
import axios from 'axios';
import twitter from 'twitter';
import secrets from './../../config/secrets';
import {FACEBOOK, TWITTER, INSTAGRAM} from './../../config/enums';
dotenv.config();



class AuthController extends BaseController{

  constructor(){
    super();
    autoBind(this);
  }
  /**
   * @api {post} v1/auth/register Authenticate User
   * @apiName Authenticate User
   * @apiGroup Auth
   * @apiParam {String} email user's email
   * @apiParam {String} password user's password
   */
  async register(req, res) {
    
  }

  /**
   * @api {post} v1/auth/profile Update User Profile
   * @apiName Update User Profile
   * @apiGroup Auth
   * @apiParam {String} firstName user's firstName
   * @apiParam {String} lastName user's lastName
   */
  async updateProfile(req, res) {
    const { userId, lastName, firstName } = req.body;

    try{
      let user = await User.findOneAndUpdate({_id: userId}, {firstName, lastName}, {new: true});
      return super.success(res, user, 'Profile updated')
    }catch(err){
      return super.actionFailure(res, 'Couldnt update profile');
    }
  }

  /**
   * @api {post} v1/auth/o/token Authenticate User
   * @apiName Authenticate User
   * @apiGroup Auth
   * @apiParam {String} provider provider name e.g facebook, twitter
   * @apiParam {String} accessToken user's accessToken from socials
   */
  async authenticate(req, res){
    const { provider } = req.body;
    try{
      let result = null
      // switch to trigger the correct provider
      switch(provider){
        case FACEBOOK:
          result = await this.authenticateFacebook(req, res);
          break;

        case TWITTER:
          result = await this.authenticateTwitter(req, res);
          break

        case INSTAGRAM:
          result = await this.authenticateInstagram(req, res);
          break

        default:
          result = await this.authenticateFacebook(req, res);
      }

      //check if result returns required data
      if(!result) return super.unauthorized(res, 'Authentication could not be completed');
      const {firstName, email, lastName, longLivedAccessToken, socialId} = result;
      
      let user = await User.findOne({email, provider});

      if(!user){
        user = new User({email, firstName, lastName, provider, socialId});
        await user.save()
      } 
      // also add the claims here when the role management is setup
      let roles = await user.getRolesForUser();
      let claims = await user.getClaimsForUser();
      
      // generate short lived token
      let token = jwt.sign({ firstName, email, id: user._id, roles, claims, lastName },secrets.jwtSecret,{expiresIn: secrets.jwtTtl});
      // genrates refresh long lived token
      let refreshToken = jwt.sign({ email, id: user._id }, secrets.jwtRefreshSecret,{expiresIn: secrets.jwtRefreshTtl });
      
      user.refreshToken = refreshToken;
      req.body.userId = user._id;

      user = await user.save();
      let social = await Social.findOne({user: user._id, provider, socialId});
      
      if(!social){
        social = new Social({user, firstName, lastName, longLivedAccessToken, socialId, provider })
        social.save();
      }else{
        social.longLivedAccessToken = longLivedAccessToken;
        social.firstName = firstName;
        social.lastName = lastName;
        social.save();
      }

      return super.success(res,{ token, user, refreshToken, roles, claims }, 'Authentication Successful');

    }catch(err){
        console.log(err);
        return super.unauthorized(res, 'Invalid Credentials, could not complete authentication');
    }
  }

   /**
   * 
   * @param {Object} req 
   * @param {Object} res 
   * @param {Object} next 
   * @api {post} v1/auth/o/token/refresh Refresh user token
   * @apiName Refresh User Token
   * @apiGroup Auth
   * @apiParam {String} email user's email
   * @apiParam {String} id user's id
   * @apiParam {String} refreshToken User's refresh token
   */
  async refreshToken(req, res, next){
    const {id, email, refreshToken} = req.body;
    try{
      let user = await User.findOne({_id: id, email, refreshToken});
      if(user){

        // also add the claims here when the role management is setup
        let roles = await user.getRolesForUser();
        let claims = await user.getClaimsForUser();
        

        let {email, firstName, lastName, provider, socialId} = user;

        let token = jwt.sign({ firstName, email, id: user._id, roles, claims, lastName },secrets.jwtSecret,{expiresIn: secrets.jwtTtl});
      
        return super.success(res,{ token, user, refreshToken: user.refreshToken, roles, claims }, 'Token refresh Successful');  
      }else{
        return super.notFound(res, "Account does not exist");
      }
      
    }catch(err){
      console.log(err);
      return super.unauthorized(res, 'Invalid Credentials');
    }

  }

  /**
   * 
   * @param {Object} req 
   * @param {Object} res 
   */
  async authenticateFacebook(req, res){
    const {accessToken} = req.body;
    // write facebook implementation for log in and implement long lived token
    
    try {
      let longLivedToken = await axios.get(`${secrets.facebookBaseUrl}/oauth/access_token?grant_type=fb_exchange_token&client_id=${secrets.facebookClientId}&client_secret=${secrets.facebookAppSecret}&fb_exchange_token=${accessToken}`)
      
      if (longLivedToken) {

        let profile = await axios.get(`${secrets.facebookBaseUrl}/me?fields=id,email,last_name,first_name&access_token=${longLivedToken.data.access_token}`);
        const {first_name, last_name, email, id} = profile.data;

        return {socialId: id, email, longLivedAccessToken: longLivedToken.data.access_token,  firstName: first_name, lastName: last_name }
      } else {
        throw new Error('Couldnt authenticate user')
      }
    } catch (err) {
      throw new Error('Couldnt authenticate user')
    }
  }

  /**
   * 
   * @param {Object} req 
   * @param {Object} res 
   */
  async authenticateTwitter(req, res){
    //access tokens are not explicitly expired
    const {accessToken} = req.body;
    // write twitter implementation for log in and implement long lived token
    try {
      let profile = await axios.get(`${secrets.twitterBaseUrl}/1.1/account/verify_credentials.json`);
      console.log(profile);
      
      const {name, screen_name, email, id_str} = profile;

      return {socialId: id_str, email, longLivedAccessToken: accessToken,  firstName: name, lastName: screen_name }
    } catch (err) {
      throw new Error('Couldnt authenticate user');
    }


  }

  async getBearerToken(req, res) {
    try{
    const headers = {
      Authorization:
        'Basic ' +
        Buffer.from(
          '379677495-244O7ySXR8bXPBTpVXjkAU1c3yEyrRtJNo1DG4jA:kWrtrUyS0mKqUpTFYKVLA9NZp5MZqrZS97cq4E4Mm1cZA',
        ).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    };
    let config = {headers};

    const result = await axios.get('https://api.twitter.com/oauth/authorize?oauth_token=379677495-244O7ySXR8bXPBTpVXjkAU1c3yEyrRtJNo1DG4jA')
    // const results = await axios.post('https://api.twitter.com/oauth2/token', {grant_type: 'client_credentials'}, config);
    console.log(result.data);
  }catch(err){
    console.log(err.response);
  }
 
  }

  /**
   * 
   * @param {Object} req 
   * @param {Object} res 
   */
  async authenticateInstagram(req, res){
    
  }  

}

module.exports = AuthController;
