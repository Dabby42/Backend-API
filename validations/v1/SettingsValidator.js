import Helpers from '../../helpers/helper';
const isBase64 = require('is-base64');
/**
 * Defines methods for validating Settings functions
 *
 * @class SettingsValidator
 */
class SettingsValidator extends Helpers{
  
  constructor(){
    super();
  }
    /**
   * validates Settings data
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   */
  validateSettings(req, res, next) {
   
    req.check('provider', 'type field is required').notEmpty().trim();

    req.check('id', 'type field is required').notEmpty().trim();

    const errors = req.validationErrors();

    if (errors) {
        return super.validationFailed(res, super.extractErrors(errors));
    }
    return next();
  }

  
   /**
   * validates Settings data
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   */
  validateIOS (req, res, next) {
    
    req.check('title', 'title field is required').notEmpty().trim();
    req.check('deviceTokens', 'device Token field is required').notEmpty().trim();
    req.check('content', 'content field is required').notEmpty().trim();
    req.check('bundleIdentifier', 'bundle Identifier field is required').notEmpty().trim();

    const errors = req.validationErrors();

    if (errors) {
        return super.validationFailed(res, super.extractErrors(errors));
    }
    return next();

  }

  /**
   * validates Settings data
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   */
  validateAndriod (req, res, next){
    req.check('regToken', 'reg Token field is required').notEmpty().trim();
    req.check('content', 'content field is required').notEmpty().trim();
    req.check('title', 'title field is required').notEmpty().trim();

    const errors = req.validationErrors();

    if (errors) {
        return super.validationFailed(res, super.extractErrors(errors));
    }
    return next();
  }


   /**
   * validates Settings data
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
  module.exports = SettingsValidator;