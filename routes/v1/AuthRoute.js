const express = require("express");
const routes = express.Router();
const AuthController = require('./../../controllers/v1/AuthController');
const AuthValdiator = require('./../../validations/v1/AuthValidator');

const {authenticate} = AuthController;
const {validateAuthLogin} = AuthValdiator;

routes.get("/signup",validateAuth, register);
routes.get("/signin",validateAuthLogin, authenticate);

module.exports = routes;
