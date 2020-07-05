import express from  "express";
import RoleController from './../../controllers/v1/RoleController';
import RoleValdiator from './../../validations/v1/RoleValidator';
import RoleMiddleware from '../../middleware/RoleMiddleware';
const  routes = express.Router();

const validator = new RoleValdiator();
const role = new RoleController();
const roleMiddleware = new RoleMiddleware();

const {validateCreateRole, validateEditRole, validateAssignRole, validateRetractRole} =  validator;
const {createRole, editRole, assignRole, getRoles, deleteRole, retractRole} = role;
const {canModifyRole} = roleMiddleware;

routes.post("/", canModifyRole, validateCreateRole, createRole);
routes.get("/", getRoles);
routes.patch("/", canModifyRole, validateEditRole, editRole);
routes.delete("/", canModifyRole, validateCreateRole, deleteRole);
routes.post("/assign", canModifyRole, validateAssignRole, assignRole);
routes.post("/retract", canModifyRole, validateRetractRole, retractRole);
// implement claims later

module.exports = routes;