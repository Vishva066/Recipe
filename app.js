const express = require('express');
const session = require('express-session');

const app = express();

const loginroute = require('./src/routes/loginroutes');

const pageroute = require('./src/routes/pageroutes');

const apiroute = require('./src/routes/apiroutes')

app.use(session({
    secret: '1',
    resave: false,
    saveUninitialized: false
}));

app.use(express.json())

app.use('/',pageroute, loginroute,apiroute )


app.listen(3002, () => {
    console.log("The server has started at port 3001")
})
