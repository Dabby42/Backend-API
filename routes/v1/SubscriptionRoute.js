const express = require("express");
const routes = express.Router();
const SubscriptionController = require('./../../controllers/v1/SubscriptionController');
const SubscriptionValdiator = require('./../../validations/v1/SubscriptionValidator');
const verifyTokenMiddleware = require('./../../middleware/VerifyTokenMiddleware');

const {verifyToken} = new verifyTokenMiddleware();
const {getSubscription, createSubscription, editSubscription, deleteSubscription, activateSubscription, deactivateSubscription} = new SubscriptionController();
const {validateSubscription, validateHasId} = new SubscriptionValdiator();


routes.post("/", verifyToken, validateSubscription, createSubscription);
routes.patch("/", verifyToken, validateSubscription,  editSubscription);
routes.get("/", verifyToken, getSubscription);
// routes.get("/unpublished", getUnpublishedSubscription);

routes.patch('/activate/:id', verifyToken, validateHasId, activateSubscription);
routes.patch('/deactivate/:id', verifyToken, validateHasId, deactivateSubscription);

routes.delete('/:id', verifyToken, validateHasId, deleteSubscription);



module.exports = routes;
