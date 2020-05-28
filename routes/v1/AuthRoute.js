const express = require("express");
const routes = express.Router();
const AuthController = require('./../../controllers/v1/AuthController');
const AuthValdiator = require('./../../validations/v1/AuthValidator');

const {authenticate} = AuthController;
const {validateAuthLogin} = AuthValdiator;

routes.post("/signup",validateAuth, register);
routes.post("/signin",validateAuthLogin, authenticate);

module.exports = routes;
