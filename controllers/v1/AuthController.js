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
      const result = null;
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
        user = new User({email, firstName, lastName, socialId});
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
      req.body.userId = _id;
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
   */
  async authenticateFacebook(req, res){
    const {accessToken} = req.body;
    // write facebook implementation for log in and implement long lived token
  }

  /**
   * 
   * @param {Object} req 
   * @param {Object} res 
   */
  async authenticateTwitter(req, res){
    const {accessToken} = req.body;
    // write twitter implementation for log in and implement long lived token
  }

  /**
   * 
   * @param {Object} req 
   * @param {Object} res 
   */
  async authenticateInstagram(req, res){
    const {accessToken} = req.body;
    // write instagram implementation for log in and implement long lived token
  }



}

module.exports = AuthController;
