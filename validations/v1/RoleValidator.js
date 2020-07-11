import Helpers from '../../helpers/helper';

/**
 * Defines methods for validating Role functions
 *
 * @class RoleValidator
 */
class RoleValidator extends Helpers{
  
  constructor(){
    super();
  }
    /**
   * validates Role data
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   */
  async validateCreateRole(req, res, next) {
    req.check('roleName', 'roleName is required').notEmpty().trim();

    const errors = req.validationErrors();

    if (errors) {
        return super.validationFailed(res, super.extractErrors(errors));
    }
    return next();
  }

   /**
   * validates Role data
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   */
  async validateEditRole(req, res, next) {
    req.check('roleName', 'roleName is required').notEmpty().trim();
    req.check('roleId', 'roleId is required').notEmpty().trim();

    const errors = req.validationErrors();

    if (errors) {
        return super.validationFailed(res, super.extractErrors(errors));
    }
    return next();
  }

  /**
   * validates Role data
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   */
  async validateAssignRole(req, res, next) {
    req.check('user_id', 'user_id is required').notEmpty().trim();
    req.check('roleName', 'roleName is required').notEmpty().trim();

    const errors = req.validationErrors();

    if (errors) {
        return super.validationFailed(res, super.extractErrors(errors));
    }
    return next();
  }

  /**
   * validates Role data
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   */
  async validateRetractRole(req, res, next) {
    req.check('user_id', 'user_id is required').notEmpty().trim();
    req.check('roleName', 'roleName is required').notEmpty().trim();

    const errors = req.validationErrors();

    if (errors) {
        return super.validationFailed(res, super.extractErrors(errors));
    }
    return next();
  }

  }
  module.exports = RoleValidator;