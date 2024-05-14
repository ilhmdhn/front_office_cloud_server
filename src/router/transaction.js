const express = require("express");
const transactionRoute = express.Router();

const {insertRating} = require('../controller/transaction_controller');

transactionRoute.post('/insert-rating', insertRating);

module.exports = transactionRoute;