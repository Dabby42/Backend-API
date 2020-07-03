const express = require("express");
const routes = express.Router();
const SocialController = require('./../../controllers/v1/SocialController');
const SocialValdiator = require('./../../validations/v1/SocialValidator');
const verifyTokenMiddleware = require('./../../middleware/VerifyTokenMiddleware');

const {getTimeline, getAvatar, connectAccount, getConnectedAccount, deleteConnectedAccount} = new SocialController();
const {validateSocial, validateHasId} = new SocialValdiator();
const {verifyToken} = new verifyTokenMiddleware();

routes.post("/", verifyToken, validateSocial, getTimeline);
routes.get("/", verifyToken, getConnectedAccount);
routes.post("/connect", verifyToken, validateSocial, connectAccount);
routes.post("/avatar", verifyToken, validateSocial, getAvatar);
routes.delete("/:id", verifyToken, validateHasId, deleteConnectedAccount)

module.exports = routes;