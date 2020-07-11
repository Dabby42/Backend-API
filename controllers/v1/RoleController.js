import BaseController from './BaseController';
import autoBind from 'auto-bind';
import User from './../../models/User';
let mongoose = require('mongoose');
let gateman = require("gatemanjs").GateMan(mongoose);

class RoleController extends BaseController{

    constructor(){
        super();
        autoBind(this);
      }
    /**
    * @api {get} v1/role Get Role
    * @apiName Get Role
    * @apiGroup Roles
    * @apiHeader {String} Authorization
    */
   getRoles = async (req, res) => {
    const {roleName} = req.body;
    
    try{
        let roles = await gateman.getRoles();
        if(roles){
            return super.success(res, roles, 'Role has been created');
        }
    }catch(err){
            return super.actionFailure(res, err.message);
    }
}

    /**
    * @api {post} v1/role Create Role
    * @apiName Create Role
    * @apiGroup Roles
    * @apiParam {String} roleName Name of the Role to create
    * @apiHeader {String} Authorization
    */
    createRole = async (req, res) => {
        const {roleName} = req.body;
        
        try{
            let role = await gateman.createRole(roleName);
            if(role){
                return super.success(res, 'Role has been created');
            }
        }catch(err){
                return super.actionFailure(res, err.message);
        }
    }

    /**
    * @api {delete} v1/role Delete Role
    * @apiName Delete Role
    * @apiGroup Roles
    * @apiParam {String} roleName Name of the Role to create
    * @apiHeader {String} Authorization
    */
   deleteRole = async (req, res) => {
        const {roleName} = req.body;
        try{
            let role = await gateman.removeRole(roleName);
            if(role){
                return super.actionSuccess(res, 'Role has been deleted');
            }
            return super.notFound(res, 'Role does not exist');
            
        }catch(err){
                return super.actionFailure(res, err.message);
        }
    }
    
    /**
    * @api {patch} v1/role
    * @apiName Edit Role
    * @apiGroup Roles
    * @apiParam {String} roleId id of the role
    * @apiParam {String} roleName Name of the Role to aedit
    * @apiHeader {String} Authorization
    */
    editRole = async (req, res) => {
        return super.actionSuccess(res, 'Nothing happened');
    }
 
    /**
    * @api {post} v1/role/assign Assign Role
    * @apiName Assign Role
    * @apiGroup Roles
    * @apiParam {String} user_id id of the user
    * @apiParam {String} roleName Name of the Role to assign
    * @apiHeader {String} Authorization
   */
    assignRole = async (req, res) => {
        const {user_id, roleName} = req.body;

        try{
            let user = await User.findById(user_id);
            let role = await user.assign(roleName);
            if(!user.roles.includes(roleName)){
                user.roles.push(roleName);
                user.save();
            }
            
            if(user && role){
                return super.actionSuccess(res, 'Role has been assigned to user');
            }

            return super.actionFailure(res, 'Role Could not be assigned to user');

        }catch(err){
            return super.actionFailure(res, err.message);
        }
    }

    /**
    * @api {post} v1/role/retract Retract Role
    * @apiName Retract Role
    * @apiGroup Roles
    * @apiParam {String} user_id id of the user
    * @apiParam {String} roleId id of the role
    * @apiHeader {String} Authorization
   */
    retractRole = async (req, res) => {
        const {user_id, roleName} = req.body;

        try{
            let user = await User.findById(user_id);
            await user.retract(roleName);

            if(user){
                let roles = user.roles.filter(item => {
                    return item != roleName
                })
                user.roles = roles;
                user.save();
                return super.actionSuccess(res, 'Role has been retracted from user');
            }

            return super.actionFailure(res, 'Role Could not be retracted from user');

        }catch(err){
            console.log(err);
            return super.actionFailure(res, err.message);
        }
    }
  
}

module.exports = RoleController;
