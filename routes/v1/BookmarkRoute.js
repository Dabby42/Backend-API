const express = require("express");
const routes = express.Router();
const BookmarkController = require('./../../controllers/v1/BookmarkController');
const BookmarkValdiator = require('./../../validations/v1/BookmarkValidator');
const verifyTokenMiddleware = require('./../../middleware/VerifyTokenMiddleware');

const {createBookmark, getBookmark, removeBookmark, restoreBookmark} = new BookmarkController();
const {validateHasId, validateBookmark} = new BookmarkValdiator();
const {verifyToken} = new verifyTokenMiddleware();

routes.post("/", verifyToken, validateBookmark, createBookmark);
routes.get("/", verifyToken, getBookmark);
routes.patch("/restore/:id", verifyToken, validateHasId, restoreBookmark);
routes.delete("/:id", verifyToken, validateHasId, removeBookmark);

module.exports = routes;