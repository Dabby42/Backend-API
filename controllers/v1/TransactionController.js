import autoBind from 'auto-bind';
import BaseController from './BaseController';
import Transaction from './../../models/Transaction';
import UserSubscription from './../../models/UserSubscription';
import User from './../../models/User';
import Subscription from './../../models/Subscription';
import dotenv from 'dotenv';
import { INITIATED, COMPLETED } from '../../config/enums';
import PaymentService from './../../services/PaymentService';
import moment from 'moment';

dotenv.config();

class TransactionController extends BaseController{

  constructor(){
    super();
    autoBind(this);
  }
  /**
   * @api {post} /v1/transaction Create Transaction
   * @apiName Create Transaction
   * @apiGroup Transaction
   * @apiParam {String} channel Transaction channel
   * @apiParam {String} subscription Transaction subscription uuid
   */
  async generateReference(req, res) {
    let {userId, subscription, channel} = req.body;
    try{

        let transaction = new Transaction({
            user: userId, subscription, channel,
            reference: await super.getReference()
        });


        transaction = await transaction.save();
        transaction = await Transaction.findOne({_id: transaction._id}).populate('subscription').exec();
        
        return super.success(res, transaction, 'Created Transaction Successfully');

    }catch(err){
        console.log(err)
        return super.actionFailure(res, `Couldn't generate reference`);
    }
  }

  /**
   * @api {post} /v1/transaction Edit Transaction
   * @apiName Edit Transaction
   * @apiGroup Transaction
   * @apiParam {String} channel Transaction channel
   * @apiParam {String} subscription Transaction subscription uuid
   */
  async editTransaction(req, res) {
    let {userId, subscription, id, channel} = req.body;

    try{
        let transaction = await Transaction.findOneAndUpdate({_id: id}, {
            user: userId, subscription, channel
        }, {new: true});

        return super.success(res, transaction, 'Edited Transaction Successfully');

    }catch(err){
   
        return super.actionFailure(res, `Couldn't edit transaction`);
    }
  }

  /**
   * @api {get} /v1/transaction Get Transactions
   * @apiName Get Transactions
   * @apiGroup Transaction
   */
  async getTransaction(req, res){
    try{
        let transaction = await Transaction.find({isActive: true, status: {$ne: INITIATED}})
                                            .populate('user').populate('subscription').exec();
        return super.success(res, transaction, 'Transaction Retrieved');

    }catch(err){
        console.log(err);
        return super.actionFailure(res, `Couldn't retrieve transaction`);
    }
  }

  /**
   * @api {post} /v1/transaction/verify Verify Transaction
   * @apiName Verify Transaction
   * @apiGroup Transaction
   */
  async verifyTransaction(req, res){
    const { reference, userId } = req.body;
    try{
        let service = new PaymentService('rave');
        let result = await service.verifyTransaction(reference);
        let user = await User.findOne({_id: userId}).populate('userSubscription').exec();
        if(result){
            let transaction = await Transaction.findOne({reference}).populate('user').populate('subscription').exec();
            if(transaction.subscription.amount >= result.amount){
                //get the user here
                transaction.amount = transaction.subscription.amount;
                transaction.status = COMPLETED;
                if(user.userSubscription){
                  if(user.userSubscription.subscription == transaction.subscription._id){
                    
                  }
                  let userSubscription = new UserSubscription({
                    subscription: transaction.subscription,
                    user: userId, startDate: moment(), endDate: moment().add('days', transaction.subscription.duration)
                  })
                  await userSubscription.save();
                  user.userSubscription = userSubscription;
                  await user.save();
                  return super.success(res, userSubscription, 'Subscription Successful');
                }else{
                  let userSubscription = new UserSubscription({
                    subscription: transaction.subscription,
                    user: userId, startDate: moment(), endDate: moment().add(transaction.subscription.duration, 'days')
                  })
                  await userSubscription.save();
                  user.userSubscription = userSubscription;
                  await user.save();
                  return super.success(res, userSubscription, 'Subscription Successful');
                }
                // check if user already has subscription if yes, check the type, if same update else create new
                let userSub = await UserSubscription.find({user: userId});
                await transaction.save();
            }
        }
        let transaction = await Transaction.findOneAndUpdate({_id: id}, {isActive: true}, {new: true});
        return super.actionSuccess(res, 'Transaction Activated');

    }catch(err){
        console.log(err);
        return super.actionFailure(res, `Couldn't activate transaction`);
    }
  }

  /**
   * @api {patch} /v1/transaction/deactivate/:id Deactivate Transaction
   * @apiName Deactivate Transaction
   * @apiGroup Transaction
   */
  async activateTransaction(req, res){
    const { id } = req.body;

    try{
        let transaction = await Transaction.findOneAndUpdate({_id: id}, {isActive: true}, {new: true});
        return super.actionSuccess(res, 'Transaction Activated');

    }catch(err){
        console.log(err);
        return super.actionFailure(res, `Couldn't activate transaction`);
    }
  }

  /**
   * @api {patch} /v1/transaction/deactivate/:id Deactivate Transaction
   * @apiName Deactivate Transaction
   * @apiGroup Transaction
   */
  async deactivateTransaction(req, res){
    const { id } = req.body;

    try{
        let transaction = await Transaction.findOneAndUpdate({_id: id}, {isActive: false}, {new: true});
        return super.actionSuccess(res, 'Transaction Deactivated');

    }catch(err){
        console.log(err);
        return super.actionFailure(res, `Couldn't dactivate transaction`);
    }
  }

  /**
   * @api {delete} /v1/transaction/:id Delete Transaction
   * @apiName Delete Transaction
   * @apiGroup Transaction
   */
  async deleteTransaction(req, res){
    const { id } = req.body;
    try{
        let transaction = await Transaction.findOneAndUpdate({_id: id}, {isActive: false}, {new: true});
        return super.actionSuccess(res, 'Transaction Deleted');

    }catch(err){
        console.log(err);
        return super.actionFailure(res, `Couldn't delete transaction`);
    }
  }

  /**
   * @api {patch} /v1/transaction/restore/:id Restore Transaction
   * @apiName Restore Transaction
   * @apiGroup Transaction
   */
  async restoreTransaction(req, res){
    const { id } = req.body;
    try{
        let transaction = await Transaction.findOneAndUpdate({_id: id}, {isActive: true});
        return super.actionSuccess(res, 'Transaction Restored');

    }catch(err){
        console.log(err);
        return super.actionFailure(res, `Couldn't restored transaction`);
    }
  }


}

module.exports = TransactionController;
