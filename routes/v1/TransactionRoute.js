const express = require("express");
const routes = express.Router();
const TransactionController = require('./../../controllers/v1/TransactionController');
const TransactionValdiator = require('./../../validations/v1/TransactionValidator');
const verifyTokenMiddleware = require('./../../middleware/VerifyTokenMiddleware');

const {verifyToken} = new verifyTokenMiddleware();

const {getTransaction, generateReference, verifyTransaction, editTransaction, deleteTransaction, activateTransaction, deactivateTransaction} = new TransactionController();
const {validateTransaction, validateRefTransaction, validateHasId} = new TransactionValdiator();


routes.post("/", verifyToken, validateTransaction, generateReference);
routes.post("/verify", verifyToken, validateRefTransaction, verifyTransaction);
routes.patch("/", verifyToken, validateTransaction,  editTransaction);
routes.get("/", verifyToken, getTransaction);
// routes.get("/unpublished", getUnpublishedTransaction);

routes.patch('/activate/:id', validateHasId, activateTransaction);
routes.patch('/deactivate/:id', validateHasId, deactivateTransaction);

routes.delete('/:id', validateHasId, deleteTransaction);



module.exports = routes;
