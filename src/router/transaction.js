const express = require("express");
const transactionRoute = express.Router();

const {insertRating, ratedCheck} = require('../controller/transaction_controller');

transactionRoute.post('/insert-rating', insertRating);
transactionRoute.get('/cek-rating/:outlet/:invoice', ratedCheck)

module.exports = transactionRoute;