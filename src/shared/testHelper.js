'use strict';
const app = require('./../../index');
const supertest = require('supertest');
const TestServer = require('./testServer');

function getSuperInstance() {
    return supertest(app);
}

module.exports = Object.freeze({
    getSuperInstance,
});