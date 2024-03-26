const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '.env')});

const userRoute = require('./src/router/user_router');

app.listen(process.env.PORT, async()=>{
    console.log(`App Running on ${process.env.PORT} port`);
});

const loggerRequest = (req, res, next) =>{
    console.log(`Receive request ${req.method} ${req.originalUrl}`)
    next()
}
app.use(loggerRequest);
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(express.urlencoded({extended:false}));
app.use(userRoute);