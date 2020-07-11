const express = require("express");
const routes = express.Router();
const UserController = require('./../../controllers/v1/UserController');
const AuthValdiator = require('../../validations/v1/AuthValidator');
const AuthMiddeware = require('../../middleware/VerifyTokenMiddleware');
const RoleMiddeware = require('../../middleware/RoleMiddleware');

const validator = new AuthValdiator();
const user = new UserController();
const verify = new AuthMiddeware();
const role = new RoleMiddeware();

const {getUsers, activateUser, deactivateUser, searchUsers} = user;
const {validateAuthLogin, validateRefreshToken} = validator;
const {verifyRefreshToken, verifyToken} = verify;
const {canModifyUser} = role;

routes.get("/",verifyToken, canModifyUser, getUsers);
routes.get("/search",verifyToken, canModifyUser, searchUsers);
routes.patch("/activate/:id",verifyToken, canModifyUser, activateUser);
routes.patch("/deactivate/:id",verifyToken, canModifyUser, deactivateUser);

module.exports = routes;
