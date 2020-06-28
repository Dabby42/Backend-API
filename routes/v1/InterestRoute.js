const express = require("express");
const routes = express.Router();
const InterestController = require('./../../controllers/v1/InterestController');
const InterestValdiator = require('./../../validations/v1/InterestValidator');

const {createInterest, selectInterest, getInterest, removeInterest, restoreInterest} = new InterestController();
const {validateInterest, validateHasId, validateCreateInterest} = new InterestValdiator();

routes.post("/", validateCreateInterest, createInterest);
routes.post("/select", validateInterest, selectInterest);
routes.get("/:id", validateHasId, getInterest);
routes.patch("/restore/:id", validateHasId, restoreInterest);
routes.delete("/remove/:id", validateHasId, removeInterest);

module.exports = routes;