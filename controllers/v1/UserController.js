import BaseController from './BaseController';
import autoBind from 'auto-bind';
import User from './../../models/User';

class UserController extends BaseController{

  constructor(){
    super();
    autoBind(this);
  }
 
  /**
   * @api {get} v1/user Get Users
   * @apiName Get Users
   * @apiGroup User
   * @apiHeader {String} Authorization
   * @apiDescription query params `limit` and `page`
   * limit tells how many records per page and page tells the current page you want to retrieve
   */
  async getUsers (req, res){

    try{
        const pageOptions = super.getPaginationOptions(req);
        let totalUsers = await User.estimatedDocumentCount({});
        let users = await User.find()
                            .skip(pageOptions.skipper)
                            .limit(pageOptions.limit)
                            .sort({ createdAt : -1})
                            .exec();
        let meta = super.getMeta(pageOptions, totalUsers);
        // console.log(users);
        return super.successPaginated(res, users, meta, 'Users Retrieved');
      
    }catch(err){
        // console.log(err);/
        return super.actionFailure(res, err);
    }
    
  }

  /**
   * @api {get} v1/user/search Search Users
   * @apiName Search Users
   * @apiGroup User
   * @apiHeader {String} Authorization
   * @apiDescription query params `limit`, `page`, `query`
   * limit tells how many records per page and page tells the current page you want to retrieve
   * while query takes in the word you are searching for
   */
  async searchUsers (req, res) {
    const {query} = req.query;
    try{
        const pageOptions = super.getPaginationOptions(req);
        let totalUsers = await User.estimatedDocumentCount({});
        let lastNameQuery = {lastName: {'$regex': `.*${query}.*`, "$options": "i" }};
        let firstNameQuery = {firstName: {'$regex': `.*${query}.*`, "$options": "i"}};
        let emailQuery = {email: {'$regex': `.*${query}.*`, "$options": "i"}};
        let phoneQuery = {phoneNumber: {'$regex': `.*${query}.*`, "$options": "i"}};
        let users = await User.find({ $or: [lastNameQuery, firstNameQuery, emailQuery, phoneQuery]})
                            .skip(pageOptions.skipper)
                            .limit(pageOptions.limit)
                            .sort({ createdAt : -1})
                            .populate('kyc')
                            .exec();
        let meta = super.getMeta(pageOptions, totalUsers);
        return super.successPaginated(res, users, meta, 'User search result Retrieved');
      
    }catch(err){
 
        return super.actionFailure(res, err);
    }
    
  }

  /**
   * @api {patch} v1/user/activate/{id} Activate User
   * @apiName Activate User
   * @apiGroup User
   * @apiHeader {String} Authorization
   * @apiDescription
   * limit tells how many records per page and page tells the current page you want to retrieve
   */
  async activateUser (req, res) {
    const {id} = req.params;
    const {userId} = req.body;
    try{
        if(userId == id) return super.actionFailure(res, 'You cannot activate or deactivate yourself');
        let user = await User.findOneAndUpdate({_id: id}, {isActive: true});
        return super.actionSuccess(res, 'User Activated');
      
    }catch(err){
        
        return super.actionFailure(res, err);
    }
    
  }

  /**
   * @api {patch} v1/user/deactivate/{id} Deactivate User
   * @apiName Deactivate User
   * @apiGroup User
   * @apiHeader {String} Authorization
   * @apiDescription
   * limit tells how many records per page and page tells the current page you want to retrieve
   */
  async deactivateUser (req, res) {
    const {id} = req.params;
    const {userId} = req.body;
    try{
        if(userId == id) return super.actionFailure(res, 'You cannot activate or deactivate yourself');
        let user = await User.findOneAndUpdate({_id: id}, {isActive: false});
        return super.actionSuccess(res, 'User Activated');
      
    }catch(err){
        
        return super.actionFailure(res, err);
    }
    
  }

}

module.exports = UserController;
