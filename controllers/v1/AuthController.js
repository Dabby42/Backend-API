import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import autoBind from 'auto-bind';
import BaseController from './BaseController';
import User from './../../models/User';
import Social from './../../models/Social';
import dotenv from 'dotenv';
import axios from 'axios'; 
import secrets from './../../config/secrets';
import {FACEBOOK, TWITTER, INSTAGRAM} from './../../config/enums';
import Twitter from 'twitter-lite';
// const {AuthorizationCode} = require('simple-oauth2');
const oauth = require('axios-oauth-client');
dotenv.config();

class AuthController extends BaseController{

  constructor(){
    super();
    autoBind(this);
  }
  /**
   * @api {post} v1/auth/login Login User with email and password
   * @apiName Login User with email and password
   * @apiGroup Auth
   * @apiParam {String} email user's email
   * @apiParam {String} password user's password
   */
  login = async (req, res) => {
    const { email, password, provider } = req.body;
    try{
      let user = await User.findOne({ email, provider });
   
      if(user){
        const {firstName, email, _id, lastName} = user;
        let isPasswordValid = bcrypt.compareSync(password, user.password);
       
          if (isPasswordValid) {

            if(!user.isActive) return super.actionFailure(res, 'Account has been deactivated');

            // also add the claims here when the role management is setup
            let roles = await user.getRolesForUser();
            let claims = await user.getClaimsForUser();
            
            // generate short lived token
            let token = jwt.sign({ firstName, email, id: _id, roles, claims, lastName },secrets.jwtSecret,{expiresIn: secrets.jwtTtl});
            // genrates refresh long lived token
            
            let refreshToken = jwt.sign({ email, id: _id }, secrets.jwtRefreshSecret,{expiresIn: secrets.jwtRefreshTtl });
            
            user.refreshToken = refreshToken;
            req.body.userId = _id;
            user = await user.save();
            return super.success(res,{ token, user, refreshToken, roles, claims }, 'Login Successful');

          } else {
            return super.unauthorized(res, 'Invalid Credentials');
          }
      }else{
        return super.notFound(res, "Account does not exist");
      }
    }catch(err){
        console.log(err);
        return super.unauthorized(res, 'Invalid Credentials 1');
    }
  }
  

  /**
   * @api {post} v1/auth/register Authenticate User
   * @apiName Authenticate User
   * @apiGroup Auth
   * @apiParam {String} email user's email
   * @apiParam {String} firstName user's firstName
   * @apiParam {String} lastName user's lastName
   * @apiParam {String} provider provider
   * @apiParam {String} password user's password
   */
  async register(req, res) {
     
    const { email, password, firstName, provider, lastName} = req.body;
        
    let hashedPassword = bcrypt.hashSync(password, 8);
    
    let user = new User({
        email, password: hashedPassword, firstName, lastName, 
        provider
    });
    
    try{
      let newUser = await user.save();
        // also add the claims here when the role management is setup
      let roles = await user.getRolesForUser();
      let claims = await user.getClaimsForUser();
      
      // generate short lived token
      let token = jwt.sign({ firstName, email, id: user._id, roles, claims, lastName },secrets.jwtSecret,{expiresIn: secrets.jwtTtl});
      // genrates refresh long lived token
      let refreshToken = jwt.sign({ email, id: user._id }, secrets.jwtRefreshSecret,{expiresIn: secrets.jwtRefreshTtl });
      
      return super.success(res,{ token, user, refreshToken, roles, claims }, 'Registration Successful');
        
    }catch(error){
        console.log(error);
        return super.actionFailure(res, 'Something went wrong')
    }
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
      const {firstName, email, lastName, longLivedAccessToken, longLivedAccessTokenSecret, socialId} = result;
      
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
        social = new Social({user, firstName, lastName, longLivedAccessToken, longLivedAccessTokenSecret, socialId, provider })
        social.save();
      }else{
        social.longLivedAccessToken = longLivedAccessToken;
        social.longLivedAccessTokenSecret =longLivedAccessTokenSecret;
        social.firstName = firstName;
        social.lastName = lastName;
        social.save();
      }

      return super.success(res,{ token, user, refreshToken, roles, claims }, 'Authentication Successful');

    }catch(err){
        console.log(err);
        return super.unauthorized(res, `Invalid Credentials, could not complete authentication via ${provider}`);
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
    const {accessToken, email, accessTokenSecret} = req.body;
    // write twitter implementation for log in and implement long lived token
    const client = new Twitter({
      subdomain: "api", 
      version: "1.1", 
      consumer_key: secrets.twitterConsumerKey, 
      consumer_secret: secrets.twitterConsumerSecret, 
      access_token_key: accessToken, 
      access_token_secret: accessTokenSecret 
    });
    
    try {
      let profile = await client.get("account/verify_credentials");
    
      const {name, screen_name, id_str} = profile
    
      return {
        socialId: id_str, 
        email:email, 
        longLivedAccessToken: accessToken,
        longLivedAccessTokenSecret: accessTokenSecret, 
        firstName: name, 
        lastName: screen_name 
      }
    } catch (error) {
      console.log(error);
      throw new Error('Couldnt authenticate user');
    }

  }

  /**
   * 
   * @param {Object} req 
   * @param {Object} res 
   */
  async authenticateInstagram(req, res){
    
    // write instagram implementation for log in and implement long lived token
    
    try {
      const {accessToken} = req.body;
      
      let longLivedToken = await axios.get(`${secrets.instagramBaseUrl}/access_token?grant_type=ig_exchange_token&client_secret=${secrets.instagramAppSecret}&access_token=${accessToken}`)
      
      if (longLivedToken) {
        let profile = await axios.get(`${secrets.instagramBaseUrl}/me?fields=id,username&access_token=${longLivedToken.data.access_token}`);
        const {username, id} = profile.data;
        let email ="dabbyvalentino@yahoo.com";
        return {socialId: id, email, longLivedAccessToken: longLivedToken.data.access_token,  firstName: username, lastName: username }
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
  async getTwitterRequestToken(req, res){
    let client = new Twitter({
      consumer_key: secrets.twitterConsumerKey,
      consumer_secret: secrets.twitterConsumerSecret
    });
    try {
      let response = await client.getRequestToken("http://localhost:5000/auth/twitter/redirect")
      let reqTkn = response.oauth_token;
      let reqTknSecret = response.oauth_token_secret
      
      let data = {
        reqTkn, 
        reqTknSecret,
        redirectUrl: `https://twitter.com/oauth/authorize?oauth_token=${reqTkn}`
      }
      
      return super.success(res, data, 'Request Token retrieved');

    } catch (error) {
      console.log(error);
      return super.actionFailure(res, `Couldn't retrieve request token`);
    }
         
  }

  /**
   * 
   * @param {Object} req 
   * @param {Object} res 
   */
  async getInstagramAccessToken(req, res){
    
    const code = req.params.code;
    const getAuthorizationCode = oauth.client(axios.create(), {
      url: 'https://api.instagram.com/oauth/access_token',
      grant_type: 'authorization_code',
      client_id: secrets.instagramClientId,
      client_secret: secrets.instagramAppSecret,
      redirect_uri: secrets.instagramRedirectUri,
      code: code,
    });

    try {
      const accessToken = await getAuthorizationCode();
      console.log(accessToken);
      
      let result = accessToken.access_token;
      console.log('The resulting token: ', result);

      return super.success(res, result, 'Access Token retrieved');
    } catch (error) {
      console.error('Access Token Error', error.message);
      return super.actionFailure(res, `Couldn't retrieve request token`);
    }

  }
  
  //getting the authorization dialog
  async getInstagramAuthorizationCode(req, res){
    const config = {
      client: {
        id: secrets.instagramClientId,
        secret: secrets.instagramAppSecret,
      },
      auth: {
        tokenHost: 'https://api.instagram.com',
        tokenPath: '/oauth/access_token',
        authorizePath: '/oauth/authorize',
      }
    };
    const client = new AuthorizationCode(config);
    const authorizationUri = client.authorizeURL({
      redirect_uri: secrets.instagramRedirectUri,
      scope: "user_profile,user_media",
    });

    res.redirect(authorizationUri);
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
  async getTwitterAccessToken(req, res){
    const client = new Twitter({
      consumer_key: secreets.twitterConsumerKey,
      consumer_secret: screts.twitterConsumerSecret
    });

    try {
      let oauthVerifier = req.params.oauth_verifier;
      let oauthToken = req.params.oauth_token
      let response = await client.getAccessToken({oauth_verifier: oauthVerifier, oauth_token: oauthToken})
      
      let accTkn = response.oauth_token;
      let accTknSecret = response.oauth_token_secret;
      let screenName = response.screen_name;

      let data = {accTkn, accTknSecret, screenName}
      return super.success(res, data, 'Access Token retrieved');

    } catch (error) {
      console.log(error);
      return super.actionFailure(res, `Couldn't retrieve access token`);
    }
  
  }
  
}




module.exports = AuthController;
