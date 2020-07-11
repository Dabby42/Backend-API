const express = require("express");
const routes = express.Router();
const AuthController = require('./../../controllers/v1/AuthController');
const AuthValidator = require('./../../validations/v1/AuthValidator');
const verifyTokenMiddleware = require('./../../middleware/VerifyTokenMiddleware');

const {authenticate, register, refreshToken, updateProfile, login, getBearerToken, getTwitterRequestToken, getInstagramAuthorizationCode, getTwitterAccessToken, getInstagramAccessToken} = new AuthController();
const {validateAuthLogin, validatePasswordLogin, validateAuth, validateProfile, validateRefreshToken} = new AuthValidator();
const {verifyRefreshToken, verifyToken} = new verifyTokenMiddleware();

routes.post("/profile", validateProfile, verifyToken, updateProfile);
routes.post('/o/token',  authenticate )
routes.post('/login', validatePasswordLogin, login )
routes.post('/register', validateAuth, register )
routes.get("/start-auth", getTwitterRequestToken)
routes.get("/callback/:oauth_verifier/:oauth_token", getTwitterAccessToken)
routes.post('/o/token/bearer', getBearerToken )
routes.post('/o/token/refresh', validateRefreshToken, verifyRefreshToken, refreshToken )
routes.get("/callback/:code", getInstagramAccessToken);
routes.get("/", getInstagramAuthorizationCode);


module.exports = routes;
