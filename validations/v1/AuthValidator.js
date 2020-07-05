import Helpers from '../../helpers/helper';
import {PROVIDER} from './../../config/enums';
/**
 * Defines methods for validating Auth functions
 *
 * @class AuthValidator
 */
class AuthValidator extends Helpers{
  constructor(){
    super();
  }
    /**
   * validates Auth signup
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   */
  validateAuth(req, res, next) {
    req.check('firstName', 'First Name is required').notEmpty().trim();
    req.check('lastName', 'Last Name is required').notEmpty().trim();
    req.check('email', 'Email field is required').notEmpty().trim().isEmail().withMessage('Invalid email');
    req.check('password', 'Password is required').notEmpty().trim().isLength({ min: 6 })
      .withMessage('password cannot be less then 6 characters');
    
    const errors = req.validationErrors();

    if (errors) {
      return super.validationFailed(res, super.extractErrors(errors));
    }
    return next();
  }

    /**
   * validates user sign up inputs
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   */
  validateProfile(req, res, next) {

    req.check('firstName', 'First Name is required')
      .notEmpty().trim();

    req.check('lastName', 'Last Name is required')
    .notEmpty().trim();  

    const errors = req.validationErrors();

    if (errors) {
      return super.validationFailed(res, super.extractErrors(errors));
    }
    return next();
  }

   /**
   * validates user sign up inputs
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   */
  validatePasswordLogin(req, res, next) {
    const {provider} = req.body;
    req.check('provider', 'Provider is required')
      .notEmpty().trim();

    req.check('email', 'Email field is required').notEmpty().trim().isEmail().withMessage('Invalid email');
    req.check('password', 'Password is required').notEmpty().trim().isLength({ min: 6 })
      .withMessage('password cannot be less then 6 characters');
      
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
   * validates user sign up inputs
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   */
  validateProfile(req, res, next) {

    req.check('firstName', 'First Name is required')
      .notEmpty().trim();

    req.check('lastName', 'Last Name is required')
    .notEmpty().trim();  

    const errors = req.validationErrors();

    if (errors) {
      return super.validationFailed(res, super.extractErrors(errors));
    }
    return next();
  }

   /**
   * validates user sign up inputs
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   */
  validateAuthLogin(req, res, next) {
    const {provider} = req.body;
    req.check('provider', 'Provider is required')
      .notEmpty().trim();

    req.check('accessToken', 'Access Token is required')
    .notEmpty().trim();  

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
   * validates Refresh Token
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   */
  validateRefreshToken(req, res, next) {
    req.check('email', 'Email field is required').notEmpty().trim().isEmail().withMessage('Invalid email fromat');
    req.check('refreshToken', 'refreshToken is required').notEmpty().trim();
    req.check('id', 'user id is required').notEmpty().trim();
    const errors = req.validationErrors();

    if (errors) {
        return super.validationFailed(res, super.extractErrors(errors));
    }
    return next();
  }

  }
  module.exports = AuthValidator;