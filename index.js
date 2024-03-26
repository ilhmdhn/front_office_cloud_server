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

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader;
    if (token == null) return res.sendStatus(401)
  

    if (token == process.env.TOKEN){
        next()
    }else{
        res.status(401).send({
            state: false,
            data: null,
            message: 'unauth'});
    }
}

app.use(loggerRequest);
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(express.urlencoded({extended:false}));
app.use(authenticateToken);
app.use(userRoute);