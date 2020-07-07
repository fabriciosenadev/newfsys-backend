const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// obtain data from .env file
require('dotenv-safe').config({
    allowEmptyValues: true,
    path: '.env'
});

// route files
const routes = require('./routes');

// API start point
const api = express();

// access security
api.use(cors({
    origin: process.env.CLIENT_ADDRESS,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));

// allow to use json format
api.use(express.json());

// use all routes declared
api.use(routes);

// use port parameter from .env file if has port
api.listen(process.env.PORT || 3040);