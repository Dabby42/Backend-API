const express = require("express");
const routes = express.Router();
const KeywordController = require('./../../controllers/v1/KeywordController');
const KeywordValdiator = require('./../../validations/v1/KeywordValidator');
const verifyTokenMiddleware = require('./../../middleware/VerifyTokenMiddleware');

const {createKeyword, getKeywords, removeKeyword, restoreKeyword} = new KeywordController();
const {validateHasId, validateKeyword} = new KeywordValdiator();
const {verifyToken} = new verifyTokenMiddleware();

routes.post("/", validateKeyword, createKeyword);
routes.get("/:id",  validateHasId, getKeywords);
routes.patch("/restore/:id", validateHasId, restoreKeyword);
routes.delete("/:id",  validateHasId, removeKeyword);

module.exports = routes;