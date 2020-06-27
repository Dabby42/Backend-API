import Helpers from '../../helpers/helper';
/**
 * Defines methods for validating Subscription functions
 *
 * @class SubscriptionValidator
 */
class SubscriptionValidator extends Helpers{
  
  constructor(){
    super();
  }
    /**
   * validates interest data
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   */
  validateSubscription(req, res, next) {
  
    req.check('name', 'name field is required').notEmpty().trim();

    req.check('description', 'description field is required').notEmpty().trim();

    req.check('keywords', 'keywords field is required').notEmpty().trim()
            .isDecimal().withMessage('Keyword must be a number');

    req.check('mentions', 'mentions field is required').notEmpty().trim()
            .isDecimal().withMessage('Mentions must be a number');

    req.check('socialAccounts', 'socialAccounts field is required').notEmpty().trim()
            .isDecimal().withMessage('Mentions must be a number');;

    req.check('shares', 'shares field is required').notEmpty().trim()
            .isDecimal().withMessage('Shares must be a number');

    req.check('duration', 'duration field is required').notEmpty().trim()
            .isDecimal().withMessage('Duration must be a number');

    req.check('amount', 'amount field is required').notEmpty().trim()
            .isDecimal().withMessage('Amount must be a number');

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
  module.exports = SubscriptionValidator;