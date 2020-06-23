import jwt from  'jsonwebtoken';
import Middleware from './Middleware';
import secrets from './../config/secrets';

class RoleMiddleware extends Middleware{

    constructor(){
        super();
    }
  
    /**
   * 
   * @param {object} req 
   * @param {object} res 
   * @param {object} next 
   * Checks that the header has a valid token
   */
    canModifyCurrency(req, res, next) {
        let token = req.headers['authorization'];
        if (!token)
            return super.forbidden(res, 'No token provided.');
        token = token.replace('Bearer', '').trim();
        jwt.verify(token, secrets.jwtSecret, (err, decoded) => {
            if (err){
        
                return super.unauthorized(res, 'Failed to authenticate token.');
            }
            // if everything good, save to request for use in other routes
            const {id, roles, claims} = decoded;
            //   console.log(decoded);
            req.body.userId = id;
            if(super.isAdmin(roles) || super.isSuperAdmin(roles)){
                return next();
            }
            if(super.hasClaim(claims, 'currency')){
                return next();
            }

            return super.forbidden(res, 'You do not have correct permissions to carry out this operation');
        });
    }

    /**
   * 
   * @param {object} req 
   * @param {object} res 
   * @param {object} next 
   * Checks that the header has a valid token
   */
    canModifyService(req, res, next) {
        let token = req.headers['authorization'];
        if (!token)
            return super.forbidden(res, 'No token provided.');
        token = token.replace('Bearer', '').trim();
        jwt.verify(token, secrets.jwtSecret, (err, decoded) => {
            if (err){
        
                return super.unauthorized(res, 'Failed to authenticate token.');
            }
            // if everything good, save to request for use in other routes
            const {id, roles, claims} = decoded;
            //   console.log(decoded);
            req.body.userId = id;
            if(super.isAdmin(roles) || super.isSuperAdmin(roles)){
                return next();
            }
            if(super.hasClaim(claims, 'service')){
                return next();
            }

            return super.forbidden(res, 'You do not have correct permissions to carry out this operation');
        });
    }

    /**
   * 
   * @param {object} req 
   * @param {object} res 
   * @param {object} next 
   * Checks that the header has a valid token
   */
    canModifyUser(req, res, next) {
        let token = req.headers['authorization'];
        if (!token)
            return super.forbidden(res, 'No token provided.');
        token = token.replace('Bearer', '').trim();
        jwt.verify(token, secrets.jwtSecret, (err, decoded) => {
            if (err){
        
                return super.unauthorized(res, 'Failed to authenticate token.');
            }
            // if everything good, save to request for use in other routes
            const {id, roles, claims} = decoded;
            //   console.log(decoded);
            req.body.userId = id;
            if(super.isAdmin(roles) || super.isSuperAdmin(roles)){
                return next();
            }
            if(super.hasClaim(claims, 'user')){
                return next();
            }

            return super.forbidden(res, 'You do not have correct permissions to carry out this operation');
        });
    }


    /**
   * 
   * @param {object} req 
   * @param {object} res 
   * @param {object} next 
   * Checks that the header has a valid token
   */
    canViewTransactions(req, res, next) {
        let token = req.headers['authorization'];
        if (!token)
            return super.forbidden(res, 'No token provided.');
        token = token.replace('Bearer', '').trim();
        jwt.verify(token, secrets.jwtSecret, (err, decoded) => {
            if (err){
        
                return super.unauthorized(res, 'Failed to authenticate token.');
            }
            // if everything good, save to request for use in other routes
            const {id, roles, claims} = decoded;
            //   console.log(decoded);
            req.body.userId = id;
            if(super.isAdmin(roles) || super.isSuperAdmin(roles)){
                return next();
            }
            if(super.hasClaim(claims, 'transactions')){
                return next();
            }

            return super.forbidden(res, 'You do not have correct permissions to carry out this operation');
        });
    }


  
    /**
   * 
   * @param {object} req 
   * @param {object} res 
   * @param {object} next 
   * Checks that the header has a valid token
   */
    canModifyRole(req, res, next) {
        let token = req.headers['authorization'];
        if (!token)
            return super.forbidden(res, 'No token provided.');
        token = token.replace('Bearer', '').trim();
        jwt.verify(token, secrets.jwtSecret, (err, decoded) => {
            if (err){
        
                return super.unauthorized(res, 'Failed to authenticate token.');
            }
            // if everything good, save to request for use in other routes
            const {id, roles, claims} = decoded;
            //   console.log(decoded);
            req.body.userId = id;
            if(super.isSuperAdmin(roles)){
                return next();
            }
            if(super.hasClaim(claims, 'role')){
                return next();
            }

            return super.forbidden(res, 'You do not have correct permissions to carry out this operation');
        });
    }

    /**
   * 
   * @param {object} req 
   * @param {object} res 
   * @param {object} next 
   * Checks that the header has a valid token
   */
    canVerifyOrRejectKyc(req, res, next) {
        let token = req.headers['authorization'];
        if (!token)
            return super.forbidden(res, 'No token provided.');
        token = token.replace('Bearer', '').trim();
        jwt.verify(token, secrets.jwtSecret, (err, decoded) => {
            if (err){
        
                return super.unauthorized(res, 'Failed to authenticate token.');
            }
            // if everything good, save to request for use in other routes
            const {id, roles, claims} = decoded;
            //   console.log(decoded);
            req.body.userId = id;
            if(super.isSuperAdmin(roles) || super.isAdmin(roles)){
                return next();
            }
            if(super.hasClaim(claims, 'kyc')){
                return next();
            }

            return super.forbidden(res, 'You do not have correct permissions to carry out this operation');
        });
    }

}

module.exports = RoleMiddleware;