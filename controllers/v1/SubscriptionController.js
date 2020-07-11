import autoBind from 'auto-bind';
import BaseController from './BaseController';
import Subscription from './../../models/Subscription';
import dotenv from 'dotenv';

dotenv.config();

class SubscriptionController extends BaseController{

  constructor(){
    super();
    autoBind(this);
  }
  /**
   * @api {post} /v1/subscription Create Subscription
   * @apiName Create Subscription
   * @apiGroup Subscription
   * @apiParam {String} name Subscription name
   * @apiParam {String} description Subscription Description
   * @apiParam {Number} keywords Number of Keywords allowed
   * @apiParam {Number} mentions Number of Mentions allowed
   * @apiParam {Number} shares Number of Shares allowed
   * @apiParam {Number} duration Subscription Duration
   * @apiParam {Number} socialAccounts Number of Social Accounts allowed
   * @apiParam {Number} amount Subscription Amount
   */
  async createSubscription(req, res) {
    let {name, description, keywords, mentions, socialAccounts, user, shares, duration, amount} = req.body;

    try{

        let subscription = new Subscription({
            name, description, keywords, mentions, 
            socialAccounts, user, shares, duration, 
            amount
        });
        await subscription.save();

        return super.success(res, subscription, 'Created Subscription Successfully');

    }catch(err){
   
        return super.actionFailure(res, `Couldn't create subscription`);
    }
  }

  /**
   * @api {patch} /v1/subscription Edit Subscription
   * @apiName Edit Subscription
   * @apiGroup Subscription
   * @apiParam {String} name Subscription name
   * @apiParam {String} description Subscription Description
   * @apiParam {Number} keywords Number of Keywords allowed
   * @apiParam {Number} mentions Number of Mentions allowed
   * @apiParam {Number} shares Number of Shares allowed
   * @apiParam {Number} duration Subscription Duration
   * @apiParam {Number} socialAccounts Number of Social Accounts allowed
   * @apiParam {Number} amount Subscription Amount
   * @apiParam {String} id of Subscription
   */
  async editSubscription(req, res) {
    let {name, description, keywords, mentions, socialAccounts, userId, id, shares, duration, amount} = req.body;

    try{
        let subscription = await Subscription.findOneAndUpdate({_id: id}, {
            name, description, keywords, mentions, 
            socialAccounts, userId, shares, duration, 
            amount
        }, {new: true});

        return super.success(res, subscription, 'Edited Subscription Successfully');

    }catch(err){
   
        return super.actionFailure(res, `Couldn't edit subscription`);
    }
  }

  /**
   * @api {get} /v1/subscription Get Subscriptions
   * @apiName Get Subscriptions
   * @apiGroup Subscription
   */
  async getSubscription(req, res){
    try{
        let subscription = await Subscription.find({isActive: true});
        return super.success(res, subscription, 'Subscription Retrieved');

    }catch(err){
        console.log(err);
        return super.actionFailure(res, `Couldn't retrieve subscription`);
    }
  }

  /**
   * @api {patch} /v1/subscription/activate/:id Activate Subscription
   * @apiName Activate Subscription
   * @apiGroup Subscription
   */
  async activateSubscription(req, res){
    const { id } = req.body;
    try{
        let subscription = await Subscription.findOneAndUpdate({_id: id}, {isActive: true}, {new: true});
        return super.actionSuccess(res, 'Subscription Activated');

    }catch(err){
        console.log(err);
        return super.actionFailure(res, `Couldn't activate subscription`);
    }
  }

  /**
   * @api {patch} /v1/subscription/deactivate/:id Deactivate Subscription
   * @apiName Deactivate Subscription
   * @apiGroup Subscription
   */
  async deactivateSubscription(req, res){
    const { id } = req.body;

    try{
        let subscription = await Subscription.findOneAndUpdate({_id: id}, {isActive: false}, {new: true});
        return super.actionSuccess(res, 'Subscription Deactivated');

    }catch(err){
        console.log(err);
        return super.actionFailure(res, `Couldn't activate subscription`);
    }
  }

  /**
   * @api {delete} /v1/subscription/:id Delete Subscription
   * @apiName Delete Subscription
   * @apiGroup Subscription
   */
  async deleteSubscription(req, res){
    const { id } = req.body;
    try{
        let subscription = await Subscription.findOneAndDelete({_id: id});
        return super.actionSuccess(res, 'Subscription Deleted');

    }catch(err){
        console.log(err);
        return super.actionFailure(res, `Couldn't delete subscription`);
    }
  }

  /**
   * @api {patch} /v1/subscription/restore/:id Restore Subscription
   * @apiName Restore Subscription
   * @apiGroup Subscription
   */
  async restoreSubscription(req, res){
    const { id } = req.body;
    try{
        let subscription = await Subscription.findOneAndUpdate({_id: id}, {isActive: true});
        return super.actionSuccess(res, 'Subscription Restored');

    }catch(err){
        console.log(err);
        return super.actionFailure(res, `Couldn't restore subscription`);
    }
  }


}

module.exports = SubscriptionController;
