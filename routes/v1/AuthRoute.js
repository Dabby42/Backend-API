const express = require("express");
const routes = express.Router();
const AuthController = require('./../../controllers/v1/AuthController');
const AuthValidator = require('./../../validations/v1/AuthValidator');
const verifyTokenMiddleware = require('./../../middleware/VerifyTokenMiddleware');

const {authenticate, register, refreshToken, updateProfile, getBearerToken,getTwitterRequestToken, getTwitterAccessToken} = new AuthController();
const {validateAuthLogin, validateAuth, validateProfile, validateRefreshToken} = new AuthValidator();
const {verifyRefreshToken, verifyToken} = new verifyTokenMiddleware();

routes.post("/signup", validateAuth, register);
routes.post("/profile", validateProfile, verifyToken, updateProfile);

routes.post('/o/token',  authenticate )
routes.get("/start-auth", getTwitterRequestToken)
routes.get("/callback/:oauth_verifier/:oauth_token", getTwitterAccessToken)
routes.post('/o/token/bearer', getBearerToken )
routes.post('/o/token/refresh', validateRefreshToken, verifyRefreshToken, refreshToken )

module.exports = routes;
