const express = require("express");
const routes = express.Router();
const AuthController = require('./../../controllers/v1/AuthController');
const AuthValdiator = require('./../../validations/v1/AuthValidator');
const verifyTokenMiddleware = require('./../../middleware/VerifyTokenMiddleware');

const {authenticate, register, refreshToken} = new AuthController();
const {validateAuthLogin, validateAuth,  validateRefreshToken} = new AuthValdiator();
const {verifyRefreshToken} = new verifyTokenMiddleware();

routes.post("/signup", validateAuth, register);
// routes.post("/signin",validateAuthLogin, authenticate);

routes.post('/o/token', validateAuthLogin, authenticate )
routes.post('/o/token/refresh', validateRefreshToken, verifyRefreshToken, refreshToken )

module.exports = routes;
