import dotenv from 'dotenv';
import fs from 'fs';

if(process.env.NODE_ENV == 'test'){
    try{
      let dotenvt = dotenv.parse(fs.readFileSync('.env.test'));
      for (const k in dotenvt) {
        process.env[k] = dotenvt[k]
      }
    }catch(err){
      
    }
    
}
dotenv.config();

const secrets = {
  port: process.env.PORT,
  
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtTtl: process.env.JWT_TTL,
  jwtRefreshTtl: process.env.JWT_REFRESH_TTL,
  
  mongoUri: process.env.MONGO_URI,
  mongoUser: process.env.MONGO_USER,
  mongoPass: process.env.MONGO_PASS,

  mailHost: process.env.MAIL_HOST,
  mailPort: process.env.MAIL_PORT,
  mailUsername: process.env.MAIL_USERNAME,
  mailPassword: process.env.MAIL_PASSWORD,
  mailAddressFrom: process.env.MAIL_ADDRESS_FROM,
  emailVerifyLinkBase: process.env.EMAIL_VERIFY_LINK,
  emailResetLinkBase: process.env.EMAIL_RESET_LINK,
  emailTokenTtl: process.env.EMAIL_TOKEN_TTL,

  facebookClientId: process.env.FACEBOOK_CLIENT_ID,
  facebookAppSecret: process.env.FACEBOOK_APP_SECRET,
  facebookRedirectUri: process.env.FACEBOOK_REDIRECT_URI,
  facebookBaseUrl: process.env.FACEBOOK_BASE_URL,

  instagramClientId: process.env.INSTAGRAM_CLIENT_ID,
  instagramAppSecret: process.env.INSTAGRAM_APP_SECRET,
  instagramRedirectUri: process.env.INSTAGRAM_REDIRECT_URI,
  instagramBaseUrl: process.env.INSTAGRAM_BASE_URL,

  twitterConsumerKey: process.env.TWITTER_CONSUMER_KEY,
  twitterConsumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  twitterCallbackUri: process.env.TWITTER_CALLBACK_URI,
  twitterBaseUrl: process.env.TWITTER_BASE_URL,

  googleClientId: process.env.GOOGLE_CLIENT_ID,

  paystackSecretKey: process.env.PAYSTACK_SECRET_KEY,
  paystackPublicKey: process.env.PAYSTACK_PUBLIC_KEY,
  paystackBaseUrl: process.env.PAYSTACK_BASE_URL,

  raveSecretKey: process.env.RAVE_SECRET_KEY,
  ravePublicKey: process.env.RAVE_PUBLIC_KEY,
  raveBaseUrl: process.env.RAVE_BASE_URL,
  raveEncryptionKey: process.env.RAVE_ENCRYPTION_KEY,

  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME, 
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY, 
  cloudinaryApiSecret: process.env.CLOUDINARY_SECRET,

  apnKeyId: process.env.APN_KEY_ID,
  apnTeamId: process.env.APN_TEAM_ID,
  apnKeyP8: process.env.KEY_P8_FILE,

  gcmApiKey: process.env.GCM_API_KEY

};

module.exports = secrets;