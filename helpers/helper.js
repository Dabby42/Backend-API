/* istanbul ignore file */
const constants = require('../config/constants');
import Transaction from './../models/Transaction';
import dotenv from 'dotenv';
dotenv.config();
const {
    FAILED, SUCCESS, HTTP_UNPROCESSABLE_ENTITY,
    HTTP_NOT_FOUND, HTTP_BAD_REQUEST, HTTP_CONFLICT,
    HTTP_FORBIDDEN, HTTP_OK, HTTP_UNAUTHORIZED
  } = constants;

class Helpers {
  
  /**
   * 
   * @param {object} errors 
   * processes the errors returned by the validator and puts it in required format
   */
  extractErrors(errors) {
    const validationErrors = {};
    errors.map(error => {
        if(validationErrors.hasOwnProperty(error.param)){
            validationErrors[error.param].push(error.msg)
        }else{
            validationErrors[error.param] = [error.msg];
        }
        return validationErrors;
    });
    return validationErrors;
  }

  /**
   * 
   * @param {var} num 
   * Checks if value is an integer
   */
  isANumber(num) {
    return Number.isInteger(Number(num));
  }

  /**
   * 
   * @param {object} res 
   * @param {object} errors 
   * formats response caused due to form validation
   */
  validationFailed(res, errors){

    let response = {
            status: FAILED,
            errors, 
            status_code: HTTP_UNPROCESSABLE_ENTITY, 
            message: 'unprocessable entity'
            
    }
    return res.status(HTTP_UNPROCESSABLE_ENTITY).send(response)
  }

  /**
   * 
   * @param {object} res 
   * @param {string} message 
   * Formats response for not found
   */
  notFound(res, message){

    let response = {
            status: FAILED,
            status_code: HTTP_NOT_FOUND, 
            message    
    }
    return res.status(HTTP_NOT_FOUND).send(response)
  }

  /**
   * 
   * @param {object} res 
   * @param {string} message 
   * Formats response for unauthorized requests
   */
  expiredToken(res, message){
    let response = {
            status: FAILED,
            status_code: HTTP_UNAUTHORIZED, 
            message,
            expiredToken: true
            
    }
    return res.status(HTTP_UNAUTHORIZED).send(response)
  }

  /**
   * 
   * @param {object} res 
   * @param {string} message 
   * Formats response for unauthorized requests
   */
  unauthorized(res, message){
    let response = {
            status: FAILED,
            status_code: HTTP_UNAUTHORIZED, 
            message
            
    }
    return res.status(HTTP_UNAUTHORIZED).send(response)
  }

  /**
   * 
   * @param {object} res 
   * @param {string} message 
   * Formats response for bad requests
   */
  badRequest(res, message){
    let response = {
            status: FAILED,
            status_code: HTTP_BAD_REQUEST, 
            message
            
    }
    return res.status(HTTP_BAD_REQUEST).send(response)
  }

  /**
   * 
   * @param {object} res 
   * @param {string} message 
   * Formats response for successful action that doesn't require data to be sent back
   */
  actionSuccess(res, message){
    let response = {
            status: SUCCESS,
            status_code: HTTP_OK, 
            message
            
    }
    return res.status(HTTP_OK).send(response)
  }

   /**
   * 
   * @param {object} res 
   * @param {string} message 
   * Formats response for failed action that doesn't require data to be sent back
   */
  actionFailure(res, message){
    let response = {
            status: FAILED,
            status_code: HTTP_CONFLICT, 
            message
            
    }
    return res.status(HTTP_CONFLICT).send(response)
  }

   /**
   * 
   * @param {object} res 
   * @param {string} message 
   * Formats response for forbidden action
   */
  forbidden(res, message){
    let response = {
            status: FAILED,
            status_code: HTTP_FORBIDDEN, 
            message
            
    }
    return res.status(HTTP_FORBIDDEN).send(response)
  }

   /**
   * 
   * @param {object} res 
   * @param {string} message 
   * Formats response for successful action that requires data to be returned
   */
  success(res, data, message = 'successful'){
    let response = {
            data,
            status: SUCCESS,
            status_code: HTTP_OK, 
            message
            
    }
    return res.status(HTTP_OK).send(response);
  }

  getPaginationOptions(req){
    let page = parseInt(req.query.page, 10) || 1;
    let limit = parseInt(req.query.limit, 10) || 5;
    let skipper = page > 0 ? (page - 1) * limit: page * limit;
    return {
        page, limit, skipper
    }
    
  }

  getMeta(pageOptions, total){
      return {
        totalPages: total % pageOptions.limit == 0 ? parseInt(total / pageOptions.limit) : parseInt(total / pageOptions.limit) + 1,
        limit: pageOptions.limit,
        page: pageOptions.page
    }
  }

   /**
   * Generates random n digit invite code that is unique to a user
   * @param {int} length 
   */
  async randomString(length = 10){
    let alpha = "ABCDEFGHIJKLMNOPQRSTUPWXYZ0123456789abcdefghijklmnopqrstuvwxyz".split('');
    let code = '';
    for(let i = 0; i < length; i++){
      // code += this.getRandomInt(alpha.length - 1);
      code += alpha[Math.floor(Math.random() * Math.floor(alpha.length - 1))];
    }
    return code;
    
  }

  async getReference(){
    let reference = this.randomString()
    try{
      
      let exists = await Transaction.findOne({reference});
      if(exists){
        this.getReference();
      }else{
        return reference
      }
    }catch(err){
      return reference
    }
    
  }
}

module.exports = Helpers;