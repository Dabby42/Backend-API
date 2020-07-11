import autoBind from 'auto-bind';
import BaseController from './BaseController';
import UserKeyword from '../../models/UserKeyword';
import User from '../../models/User';
import Subscription from '../../models/UserSubscription';
import dotenv from 'dotenv';

dotenv.config();

class KeywordController extends BaseController{
    constructor(){
        super();
        autoBind(this);
    }

  /**
   * @api {post} /v1/keyword/ Create Keyword
   * @apiName Create Keyword
   * @apiGroup Keyword
   * @apiParam {String} userId id of User
   * @apiParam {String} keyword keyword of User
   */
    async createKeyword(req, res) {
        const { userId, keyword } = req.body;

        try {
            let user = await User.findOne({_id:userId});
            if (user) {
                let userKeyword = await UserKeyword.findOne({keyword:keyword, user: userId});
                if (userKeyword) {
                    return super.actionFailure(res, 'Keyword exist already');
                }
                userKeyword = new UserKeyword({keyword:keyword, user: userId});
                await userKeyword.save();
                
                return super.success(res, userKeyword, 'Keywords created Successfully');
            }
            return super.actionFailure(res, `Couldn't create Keyword`);
                
        } catch (error) {
            return super.actionFailure(res, `Couldn't create Keyword`);
        }
        
    }

    /**
     * @api {get} /v1/keyword/:id Get Users' Keyword
     * @apiName Get Keywords
     * @apiGroup Keyword
     */
    async getKeywords(req, res) {
        const userId = req.params.id
        try {
            let userKeywords = await UserKeyword.find({user: userId, isActive:true });
                
            return super.success(res, userKeywords, 'Keywords Retrieved');
             
        } catch (error) {

            return super.actionFailure(res, `Couldn't get keywords`);
        }
        
    }

    /**
     * @api {delete} /v1/keyword/:id Remove keyword
     * @apiName Remove keyword
     * @apiGroup Keyword
     */
    async removeKeyword(req, res) {
        const {id} = req.body
        try{
            let userKeyword = await UserKeyword.findOneAndUpdate({_id: id}, {$set:{isActive:false}}, {new: true});
            return super.actionSuccess(res, 'Keyword Deleted');
        }catch(err){
            console.log(err);
            return super.actionFailure(res, `Couldn't delete keyword`);
        }
    }

    /**
   * @api {patch} /v1/keyword/restore/:id Restore Keyword
   * @apiName Restore Keyword
   * @apiGroup Keyword
   */
  async restoreKeyword(req, res){
    const {id} = req.body
    try{
        let userKeyword = await UserKeyword.findOneAndUpdate({_id: id}, {$set:{isActive:true}}, {new: true});
        return super.actionSuccess(res, 'Keyword Restored');
    }catch(err){
        console.log(err);
        return super.actionFailure(res, `Couldn't restore keyword`);
    }
  }

}

module.exports = KeywordController;
