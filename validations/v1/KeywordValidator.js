import Helpers from '../../helpers/helper';
const isBase64 = require('is-base64');
/**
 * Defines methods for validating Keyword functions
 *
 * @class KeywordValidator
 */
class KeywordValidator extends Helpers{
  
  constructor(){
    super();
  }
    
   /**
   * validates Keyword data
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

     /**
   * validates Keyword data
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   */
  validateKeyword(req, res, next) {
   
    req.check('keyword', 'Keyword field is required').notEmpty().trim();

    req.check('userId', 'User Id field is required').notEmpty().trim();


    const errors = req.validationErrors();

    if (errors) {
        return super.validationFailed(res, super.extractErrors(errors));
    }
    return next();
  }




}
  module.exports = KeywordValidator;