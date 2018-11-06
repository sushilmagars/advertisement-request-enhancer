'use strict';
require('dotenv').config({silent: true});

const commonConfigurations = {
    port: process.env.PORT || 8080,
    activeApiVersion: 'api/v1'
}

module.exports = Object.assign({}, commonConfigurations, require('./' + process.env.NODE_ENV + '.js'));