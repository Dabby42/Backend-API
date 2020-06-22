
import Helpers from './../helpers/helper';

class Middleware extends Helpers{
    constructor(){
        super();
    }

    isAdmin(roles = []){
        if(roles){
            let hasAdmin = roles.filter(role => {
                return role == 'admin';
            });
            return hasAdmin.length > 0;
        }
        return false;
    }

    isSuperAdmin(roles = []){
        if(roles){
            let hasSuperAdmin = roles.filter(role => {
                return role == 'superadmin';
            });
            return hasSuperAdmin.length > 0;
        }
        return false;
    }

    hasClaim(claims = [], claimName){
        if(claims && typeof(claims) == 'array'){
            let claimExists = claims.filter(claim => {
                return claim == claimName;
            });
            return claimExists.length > 0;
        }

        return false;
    }
}

module.exports = Middleware;