const express = require("express");
const routes = express.Router();
const InterestController = require('./../../controllers/v1/InterestController');
const InterestValdiator = require('./../../validations/v1/InterestValidator');
const verifyTokenMiddleware = require('./../../middleware/VerifyTokenMiddleware');
const {verifyToken} = new verifyTokenMiddleware();
const {createInterest, selectInterest, getInterest, removeInterest, restoreInterest, getUserInterest} = new InterestController();
const {validateInterest, validateSelectInterest, validateHasId, validateCreateInterest} = new InterestValdiator();

routes.post("/", verifyToken, validateCreateInterest, createInterest);
routes.post("/select", verifyToken, validateSelectInterest, selectInterest);
routes.get("/", getInterest);
routes.get("/user", verifyToken, getUserInterest);
routes.patch("/restore/:id", verifyToken, validateHasId, restoreInterest);
routes.delete("/remove/:id", verifyToken, validateHasId, removeInterest);

module.exports = routes;