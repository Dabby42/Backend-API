const express = require("express");
const routes = express.Router();
const AuthController = require('./../../controllers/v1/AuthController');
const AuthValdiator = require('./../../validations/v1/AuthValidator');

const {authenticate, register, getTwitterRequestToken, getTwitterAccessToken} = new AuthController();
const {validateAuthLogin, validateAuth} = new AuthValdiator();

routes.post("/signup",validateAuth, register);
// routes.post("/signin",validateAuthLogin, authenticate);

routes.post('/o/token',  authenticate )
routes.get("/start-auth", getTwitterRequestToken)
routes.get("/callback/:oauth_verifier/:oauth_token", getTwitterAccessToken)

module.exports = routes;
