const express = require("express");
const routes = express.Router();
const ArticleController = require('./../../controllers/v1/ArticleController');
const ArticleValdiator = require('./../../validations/v1/ArticleValidator');


const {getPublishedArticle, createArticle, deleteArticle, restoreArticle, publish, unpublish, getUnpublishedArticle} = new ArticleController();
const {validateArticle, validateHasId} = new ArticleValdiator();


routes.post("/",validateArticle, createArticle);
routes.get("/", getPublishedArticle);
routes.get("/unpublished", getUnpublishedArticle);

routes.patch('/publish/:id', validateHasId, publish);
routes.patch('/restore/:id', validateHasId, restoreArticle);
routes.patch('/unpublish/:id', validateHasId, unpublish);

routes.delete('/:id', validateHasId, deleteArticle);


module.exports = routes;
