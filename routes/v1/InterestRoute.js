const express = require("express");
const routes = express.Router();
const InterestController = require('./../../controllers/v1/InterestController');
const InterestValdiator = require('./../../validations/v1/InterestValidator');

const {createInterest, getInterest, removeInterest, restoreInterest} = new InterestController();
const {validateInterest, validateHasId} = new InterestValdiator();

routes.post("/", validateInterest, createInterest);
routes.get("/:id", validateHasId, getInterest);
routes.patch("/restore/:id", validateHasId, restoreInterest);
routes.delete("/:id", validateHasId, removeInterest);

module.exports = routes;