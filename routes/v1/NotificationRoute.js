const express = require("express");
const routes = express.Router();
const NotificationController = require('./../../controllers/v1/NotificationController');
const NotificationValdiator = require('./../../validations/v1/NotificationValidator');

const {createNotification, getNotification, restoreNotification, deleteNotification} = new NotificationController();
const {validateNotification, validateHasId} = new NotificationValdiator();

routes.post("/", validateNotification, createNotification);
routes.get("/:id", validateHasId, getNotification);
routes.patch("/restore/:id", validateHasId, restoreNotification);
routes.delete("/:id", validateHasId, deleteNotification);

module.exports = routes;