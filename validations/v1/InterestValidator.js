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
    const {name, image} = req.body;
   
    req.check('name', 'name field is required').notEmpty().trim();

    req.check('image', 'image must be a base64 string')
        .custom(() => {
            if (image){
                if(image.trim().length > 0){
                    if(isBase64(image, {mime: true})){
                        
                        return true;
                      }else{
                          return false;
                      }
                }
            }
            return true;
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