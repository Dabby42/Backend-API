import Helpers from '../../helpers/helper';
const isBase64 = require('is-base64');
/**
 * Defines methods for validating Notification functions
 *
 * @class NotificationValidator
 */
class NotificationValidator extends Helpers{
  
  constructor(){
    super();
  }
    
   /**
   * validates notification data
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   */
  validateNotification(req, res, next) {
    
    req.check('content', 'content field is required').notEmpty().trim();

    req.check('title', 'title field is required').notEmpty().trim();

    const errors = req.validationErrors();

    if (errors) {
        return super.validationFailed(res, super.extractErrors(errors));
    }
        return next();
    }

   /**
   * validates notification data
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   */
  validateHasId(req, res, next) {
    req.body.id = req.params.id;
    req.check('id', 'id field is required').notEmpty().trim();

    const errors = req.validationErrors();

    if (errors) {
        return super.validationFailed(res, super.extractErrors(errors));
    }
    return next();
  }




}
  module.exports = NotificationValidator;