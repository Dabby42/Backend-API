const express = require("express");
const routes = express.Router();
const SubscriptionController = require('./../../controllers/v1/SubscriptionController');
const SubscriptionValdiator = require('./../../validations/v1/SubscriptionValidator');


const {getSubscription, createSubscription, editSubscription, deleteSubscription, activateSubscription, deactivateSubscription} = new SubscriptionController();
const {validateSubscription, validateHasId} = new SubscriptionValdiator();


routes.post("/", validateSubscription, createSubscription);
routes.patch("/", validateSubscription,  editSubscription);
routes.get("/", getSubscription);
// routes.get("/unpublished", getUnpublishedSubscription);

routes.patch('/activate/:id', validateHasId, activateSubscription);
routes.patch('/deactivate/:id', validateHasId, deactivateSubscription);

routes.delete('/:id', validateHasId, deleteSubscription);



module.exports = routes;
