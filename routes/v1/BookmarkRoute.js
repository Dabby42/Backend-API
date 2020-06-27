const express = require("express");
const routes = express.Router();
const BookmarkController = require('./../../controllers/v1/BookmarkController');
const BookmarkValdiator = require('./../../validations/v1/BookmarkValidator');

const {createBookmark, getBookmark, removeBookmark, restoreBookmark} = new BookmarkController();
const {validateHasId, validateBookmark} = new BookmarkValdiator();

routes.post("/", validateBookmark, createBookmark);
routes.get("/:id", validateHasId, getBookmark);
routes.patch("/restore/:id", validateHasId, restoreBookmark);
routes.delete("/:id", validateHasId, removeBookmark);

module.exports = routes;