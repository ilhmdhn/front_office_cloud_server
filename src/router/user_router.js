const express = require("express");
const {insertUserLogin} = require('../controller/user_controller');
const userRoute = express.Router();

userRoute.post('/user-login', insertUserLogin);

module.exports = userRoute;