import Helpers from '../../helpers/helper';
import {PROVIDER} from './../../config/enums';

/**
 * Defines methods for validating Social functions
 *
 * @class SocialValidator
 */
class SocialValidator extends Helpers{
  
  constructor(){
    super();
  }
    
     /**
   * validates Social data
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   */
  validateSocial(req, res, next) {
    const {provider} = req.body;
    req.check('provider', 'Provider field is required').notEmpty().trim();

    req.check('provider', `provider must be either of the following ${PROVIDER.join(', ')}`)
      .custom(() => {
         return PROVIDER.includes(provider);
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
  module.exports = SocialValidator;