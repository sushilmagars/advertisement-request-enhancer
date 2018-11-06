'use strict';
const express = require('express');
const bodyParser = require('body-parser');

module.exports.getApp = () => {
    const app = express();
    app.use(bodyParser.json());

    return app;
};

// TO DO: add handleErrorRoutes to handle error routes