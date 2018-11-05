'use strict';

const express = require('express');
const router = express.Router();
const AdvertisementCtrl = require('./advertisement.controller');
const {validateRequestParams} = require('./advertisement.middleware');
const { check } = require('express-validator/check');

const controller = new AdvertisementCtrl();

router.post('/enhance',
    [
        check('site.id').exists().withMessage('site id may not be empty'),
        check('site.page').exists().withMessage('page url may not be empty'),
        check('device.ip').exists().withMessage('device ip may not be empty'),
    ],
    validateRequestParams,
    controller.enhanceRequest.bind(controller)
);

module.exports = router;