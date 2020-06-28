const express = require("express");
const routes = express.Router();
const ArticleController = require('./../../controllers/v1/ArticleController');
const ArticleValdiator = require('./../../validations/v1/ArticleValidator');
const verifyTokenMiddleware = require('./../../middleware/VerifyTokenMiddleware');

const {verifyToken} = new verifyTokenMiddleware();
const {getPublishedArticle, createArticle, deleteArticle, restoreArticle, publish, unpublish, getUnpublishedArticle} = new ArticleController();
const {validateArticle, validateHasId} = new ArticleValdiator();


routes.post("/",validateArticle, createArticle);
routes.get("/", verifyToken, getPublishedArticle);
routes.get("/unpublished", verifyToken, getUnpublishedArticle);

routes.patch('/publish/:id', verifyToken, validateHasId, publish);
routes.patch('/restore/:id', verifyToken, validateHasId, restoreArticle);
routes.patch('/unpublish/:id',verifyToken, validateHasId, unpublish);

routes.delete('/:id', validateHasId, deleteArticle);


module.exports = routes;
