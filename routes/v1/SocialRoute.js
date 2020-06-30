const express = require("express");
const routes = express.Router();
const SocialController = require('./../../controllers/v1/SocialController');
const SocialValdiator = require('./../../validations/v1/SocialValidator');
const verifyTokenMiddleware = require('./../../middleware/VerifyTokenMiddleware');

const {getTimeline, getAvatar, connectAccount, getConnectedAccount} = new SocialController();
const {validateSocial} = new SocialValdiator();
const {verifyToken} = new verifyTokenMiddleware();

routes.post("/", verifyToken, validateSocial, getTimeline);
routes.get("/", verifyToken, getConnectedAccount);
routes.post("/connect", verifyToken, validateSocial, connectAccount);
routes.post("/avatar", verifyToken, validateSocial, getAvatar);

module.exports = routes;