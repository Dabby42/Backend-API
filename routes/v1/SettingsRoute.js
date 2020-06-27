const express = require("express");
const routes = express.Router();
const SettingsController = require('./../../controllers/v1/SettingsController');
const SettingsValdiator = require('./../../validations/v1/SettingsValidator');

const {setIOSNotification, setAndriodNotification, selectAccount, reconnectAccount, deleteAccount} = new SettingsController();
const {validateSettings, validateHasId, validateIOS, validateAndriod} = new SettingsValdiator();

routes.post("/notification/andriod", validateAndriod, setAndriodNotification);
routes.post("/notification/ios", validateIOS, setIOSNotification);
routes.get("/notification/ios/:id", validateHasId, setIOSNotification);
routes.get("/notification/andriod/:id", validateHasId, setAndriodNotification);
routes.post("/", validateSettings, selectAccount);
routes.patch("/reconnect/:id", validateHasId, reconnectAccount);
routes.delete("/:id", validateHasId, deleteAccount);

module.exports = routes;
