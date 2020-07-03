import Helpers from '../../helpers/helper';
/**
 * Defines methods for validating Transaction functions
 *
 * @class TransactionValidator
 */
class TransactionValidator extends Helpers{
  
  constructor(){
    super();
  }
    /**
   * validates interest data
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   */
  validateTransaction(req, res, next) {
    const {channel} = req.body;
    let channels = ['paystack', 'paypal', 'rave'];
    req.check('channel', 'channel field is required').notEmpty().trim();

    req.check('subscription', 'subscription field is required').notEmpty().trim();

    req.check('channel', `channel must be either of the following ${channels.join(', ')}`)
      .custom(() => {
         return channels.includes(channel);
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
  validateRefTransaction(req, res, next) {
  
    req.check('reference', 'reference field is required').notEmpty().trim();

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
  module.exports = TransactionValidator;