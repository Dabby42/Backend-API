const express = require("express");
const routes = express.Router();
const SettingsController = require('./../../controllers/v1/SettingsController');
const SettingsValdiator = require('./../../validations/v1/SettingsValidator');

const {setNotification, selectAccount, reconnectAccount, deleteAccount} = new SettingsController();
const {validateSettings, validateHasId, validateIOS, validateAndriod} = new InterestValdiator();

routes.post("/notification/andriod", validateSettings, validateAndriod, setAndriodNotification);
routes.post("/notification/ios", validateSettings, validateIOS, setIOSNotification);
routes.get("/notification/ios/:id", validateHasId, setIOSNotification);
routes.get("/notification/andriod/:id", validateHasId, setIOSNotification);
routes.post("/", validateSettings, selectAccount);
routes.patch("/reconnect/:id", validateHasId, reconnectAccount);
routes.delete("/:id", validateHasId, deleteAccount);

module.exports = routes;

/notification/ios