import Helpers from '../../helpers/helper';
const isBase64 = require('is-base64');
/**
 * Defines methods for validating Interest functions
 *
 * @class InterestValidator
 */
class InterestValidator extends Helpers{
  
  constructor(){
    super();
  }
    /**
   * validates interest data
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   */
  validateInterest(req, res, next) {
   
    req.check('name', 'name field is required').notEmpty().trim();
    const errors = req.validationErrors();

    if (errors) {
        return super.validationFailed(res, super.extractErrors(errors));
    }
    return next();
  }

    /**
   * validates interest data
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   */
  validateSelectInterest(req, res, next) {
   
    req.check('interests', 'interests field is required').notEmpty().isAee;

    req.check('interests', `interests must be an array`)
      .custom(() => {
         return typeof(req.body.interests) == 'object';
      });
    const errors = req.validationErrors();

    if (errors) {
        return super.validationFailed(res, super.extractErrors(errors));
    }
    return next();
  }

     /**
   * validates interest data
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   */
  validateCreateInterest(req, res, next) {
    const {image} = req.body;
   
    req.check('name', 'name field is required').notEmpty().trim();

    req.check('image', 'image must be a base64 string')
        .custom(() => {
         
            if(isBase64(image, {mime: true})){
                
                return true;
              }else{
                  return false;
              }
        });

    const errors = req.validationErrors();

    if (errors) {
        return super.validationFailed(res, super.extractErrors(errors));
    }
    return next();
  }




   /**
   * validates interest data
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
  module.exports = InterestValidator;