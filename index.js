'use strict';

require('dotenv').config({silent: true});
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const API_RESPONSES = require('./src/shared/apiResponses.contants');

// configurations
const config = require('./config/environment'); 
const port = config.port || 8080;

// middlewares
app.use(bodyParser.json());

// advertisement routes
const enhanceAdvertisement = require('./src/components/advertisement/advertisement.routes.js');

app.use('/advertisement', enhanceAdvertisement);

// 404 for all other endpoints
app.use('*', function(req, res) {
    const {status: statusCode, description: content} = API_RESPONSES['general']['notFound'];
    return res.status(statusCode).send(content);
});

app.listen(port, function() {
    console.log(`listening on port ${port}`);
});