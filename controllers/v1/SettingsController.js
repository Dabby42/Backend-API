import autoBind from 'auto-bind';
import BaseController from './BaseController';
import Settings from './../../models/Settings';
import {FACEBOOK, TWITTER, INSTAGRAM} from './../../config/enums';
import apn from "apn";
import gcm from 'node-gcm';
// import apnOptions from './../../config/apnOptions';
import secrets from './../../config/secrets';

// let service = new apn.Provider(apnOptions);

class SettingsController extends BaseController{
    constructor(){
        super();
        autoBind(this);
    }

    /**
     * @api {post} /v1/settings/notification/ios Set iOS Notification
     * @apiName Set iOS Notification
     * @apiGroup Settings
     * @apiParam {String} deviceToken  Device Token
     * @apiParam {String} title Title of the notification
     * @apiParam {String} content Content of the notification
     * @apiParam {String} bundleIdentifier App Bundle Identity
     */ 

    async setIOSNotification(req, res) {
        const { deviceTokens, title, content, bundleIdentifier} = req.body;
        
        try {
    
          let notification = new apn.Notification({
            alert: {
              title: title,
              body: content
            },
            topic: bundleIdentifier,
            payload: {
              "sender": "node-apn",
            },
            pushType: 'background'
          });
      
          service.send(notification, deviceTokens).then(response => {
            console.log(response.sent);
            console.log(response.failed);
          });
          let settings = await Settings.findById({_id: id});
          settings.pushNotification = true;
          return super.actionSuccess(res, 'Notification set successfully');
          
        } catch (err) {
            console.log(err);
            return super.actionFailure(res, `Couldn't set notification`);
            
        }
    
    }

    /**
     * @api {get} /v1/settings/notification/ios/:id Stop iOS Notification
     * @apiName Stop iOS Notification
     * @apiGroup Settings
     */ 
    async stopIOSNotification(req, res) {
        const {id} = req.body;
        try {
            service.shutdown();
            let settings = await Settings.findById({_id: id});
            settings.pushNotification = false;
            return super.actionSuccess(res, 'Notifications stopped successfully');
        } catch (error) {
            console.log(err);
            return super.actionFailure(res, `Couldn't stop notifications`);
            
        }
    }

     /**
     * @api {post} /v1/settings/notification/andriod Set Andriod Notification
     * @apiName Set Andriod Notification
     * @apiGroup Settings
     * @apiParam {String} regToken  Device Token
     * @apiParam {String} title Title of the notification
     * @apiParam {String} content Content of the notification
     */

    async setAndriodNotification(req, res) {
        const { regToken, title, content} = req.body;
        try {
            
            // Set up the sender with your GCM/FCM API key (declare this once for multiple messages)
            const sender = new gcm.Sender(secrets.gcmApiKey);
            
            // Prepare a message to be sent
            const message = new gcm.Message();

            message.addData('title', title );
            message.addData('message', content);
            
            // Specify which registration IDs to deliver the message to
            var regTokens = regToken;
            
            // Actually send the message
            sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                console.log(response);
            });
            let settings = await Settings.findById({_id: id});
            settings.pushNotification = true;
            return super.actionSuccess(res, 'Notifications set successfully');
        
        } catch (error) {
            return super.actionFailure(res, `Couldn't set notification`);
        }

    }

    /**
     * @api {get} /v1/settings/notification/andriod/:id Stop Notification
     * @apiName Stop Notification
     * @apiGroup Settings
     */ 
    async stopAndriodNotification(req, res) {
        
    }

    /**
     * @api {post} /v1/settings Select Account
     * @apiName Select Account
     * @apiGroup Settings
     * @apiParam {String} provider Account Provider
     */
    async selectAccount(req, res) {
        const {id, provider} = req.body;

        try{
            // switch to trigger the correct provider
            let settings = await Settings.find({_id: id});

            switch(provider){
                case FACEBOOK:
                    settings.facebook.isActive = true;              
                break;

                case TWITTER:
                    settings.twitter.isActive = true;
                break

                case INSTAGRAM:
                    settings.instagram.isActive = true;
                break

                default:
                    settings.facebook.isActive = true;
            }
            await settings.save();
            return super.actionSuccess(res, 'Account selected successfully');

        }catch(err){
            console.log(err);
            return super.actionFailure(res, 'Account could not be selected');
        }
  
    }


    /**
     * @api {delete} /v1/settings/:id Delete Account
     * @apiName Delete Account
     * @apiGroup Settings
     */
    async deleteAccount(req, res) {
        const { provider, id } = req.body;
        try{
            
            let settings = await Settings.findById({_id: id});
            if (provider == facebook) {
                settings.facebook.isActive = false;
            } else if (provider == twitter) {
                settings.twitter.isActive = false;
            } else {
                settings.instagram.isActive = false;
            }
            await settings.save();
            return super.actionSuccess(res, 'Account deleted successfully');

        }catch(err){
            console.log(err);
            return super.actionFailure(res, `Account could not be deleted`);
        }
    }

     /**
     * @api {patch} /v1/settings/reconnect/:id Reconnect Account
     * @apiName Reconnect Account
     * @apiGroup Settings
     */
    async reconnectAccount(req, res){
        const { id, provider } = req.body;
        try{
            let settings = await Settings.findById({_id: id});
            if (provider == facebook) {
                settings.facebook.isActive = false;
            } else if (provider == twitter) {
                settings.twitter.isActive = false;
            } else {
                settings.instagram.isActive = false;
            }
            await settings.save();
            return super.actionSuccess(res, 'Account reconnected successfully');
    
        }catch(err){
            console.log(err);
            return super.actionFailure(res, `Couldn't restore account`);
        }
    }
}

module.exports = SettingsController;