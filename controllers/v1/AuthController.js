import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import autoBind from 'auto-bind';
import BaseController from './BaseController';
import User from './../../models/User';
import dotenv from 'dotenv';
import axios from 'axios';
import secrets from './../../config/secrets';
import {FACEBOOK, TWITTER, INSTAGRAM} from './../../config/enums';
dotenv.config();

class AuthController extends BaseController{

  constructor(){
    super();
    autoBind(this);
  }
  /**
   * @api {post} /o/token Authenticate User
   * @apiName Authenticate User
   * @apiGroup Auth
   * @apiParam {String} email user's email
   * @apiParam {String} password user's password
   */
  async register(req, res) {
    
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
      const {firstName, email, lastName, socialId} = result;
      
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
        return {socialId: id, email, firstName: first_name, lastName: last_name }
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
    const {accessToken, screenName} = req.body;
    // write twitter implementation for log in and implement long lived token
    let config = {
      headers: {'Authorization': `Bearer ${accessToken}`}  
    }
    
    try {

      let profile = await axios.get(`${secrets.twitterBaseUrl}usernames=${screenName}&user.fields=name,screen_name,email,id_str`,{ config});
      // user.firstName = profile.data[0].name;
      // user.lastName = profile.data[0].screen_name;
      // user.email = profile.data[0].email;
      // user.socialId = profile.data[0].id_str;
      console.log(profile.data)

    } catch (error) {
      console.log(error.response)
      throw new Error('Failed to authenticate User');
    }

  }

  /**
   * 
   * @param {Object} req 
   * @param {Object} res 
   */
  async authenticateInstagram(req, res){
    const {accessToken} = req.body;
    // write instagram implementation for log in and implement long lived token
    let baseURL = secrets.instagramBaseUrl;
    
    try {
      let longLivedToken = await axios.get(`${baseURL}/access_token?grant_type=ig_exchange_token&client_secret=${secrets.instagramAppSecret}&access_token=${accessToken}`)
      
      if (longLivedToken) {

        let profile = axios.get(`${baseURL}/me?fields=id,username&access_token=${longLivedToken}`);
        const user = new User();
        user.firstName = profile.username;
        user.socialId = profile.id;

        await user.save()
        return super.actionSuccess(res, user, 'User created successfully');
      } else {
        return null
      }
    } catch (error) {
      console.log(err);
      return super.actionFailure(res, `Couldn't create user`);
    }

  }



}

module.exports = AuthController;
