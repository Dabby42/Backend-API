const express = require("express");
const routes = express.Router();
const InterestController = require('./../../controllers/v1/InterestController');
const InterestValdiator = require('./../../validations/v1/InterestValidator');
const verifyTokenMiddleware = require('./../../middleware/VerifyTokenMiddleware');
const {verifyToken} = new verifyTokenMiddleware();
const {createInterest, selectInterest, getInterest, removeInterest, restoreInterest} = new InterestController();
const {validateInterest, validateHasId, validateCreateInterest} = new InterestValdiator();

routes.post("/", verifyToken, validateCreateInterest, createInterest);
routes.post("/select", verifyToken, validateInterest, selectInterest);
routes.get("/:id", verifyToken, validateHasId, getInterest);
routes.patch("/restore/:id", verifyToken, validateHasId, restoreInterest);
routes.delete("/remove/:id", verifyToken, validateHasId, removeInterest);

module.exports = routes;