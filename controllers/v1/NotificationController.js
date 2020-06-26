import autoBind from 'auto-bind';
import BaseController from './BaseController';
import dotenv from 'dotenv';
import Notification from './../../models/Notification';
dotenv.config();

class NotificationController extends BaseController{
  constructor(){
    super();
    autoBind(this);
  }

  /**
   * @api {post} /v1/notification Create Notofication
   * @apiName  Create Notification
   * @apiGroup Notification
   */

  async createNotification (req, res) {
    const { title, content } = req.body;

    try {
      let data = {title, content};
      let notification = new Notification(data);
      await notification.save();

      return super.success(res, notification, 'Notification created Successfully');
    } catch (err) {
      console.log(err);
      return super.actionFailure(res, `Couldn't create notification`);
    }
  }

  /**
   * @api {get} /v1/notification Get Notification
   * @apiName Get Notification
   * @apiGroup Notification
   */
  async getNotification(req, res){
    const {id} = req.body
    try {
      let notification = await Notification.findById({_id: id});
      return super.success(res, notification, 'Notification Retrieved');

    } catch (err) {
      console.log(err);
      return super.actionFailure(res, `Couldn't retrieve notification`);
    }
  }

  /**
   * @api {delete} /v1/notification/:id Delete Notification
   * @apiName Delete Notification
   * @apiGroup Notification
   */
  async deleteNotification(req, res){
    const { id } = req.body;
    try{
        let notification = await Notification.findOneAndUpdate({_id: id}, {isActive: false});
        return super.actionSuccess(res, 'Notification Deleted');

    }catch(err){
        console.log(err);
        return super.actionFailure(res, `Couldn't delete notification`);
    }
  }

  /**
   * @api {patch} /v1/notification/restore/:id Restore Notification
   * @apiName Restore Notification
   * @apiGroup Notification
   */
  async restoreNotification(req, res){
    const { id } = req.body;
    try{
        let notification = await Notification.findOneAndUpdate({_id: id}, {isActive: true});
        return super.actionSuccess(res, 'Notification Restored');

    }catch(err){
        console.log(err);
        return super.actionFailure(res, `Couldn't restored notification`);
    }
  }
  

}

module.exports = NotificationController;