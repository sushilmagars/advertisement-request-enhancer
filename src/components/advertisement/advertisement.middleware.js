'use strict';

const {validationResult} = require('express-validator/check');
const _ = require('lodash');
const AppCtrl = require('./../../shared/AppController');
const API_RESPONSES = require('./../../shared/apiResponses.contants');

class AdvertisementMiddleware {
    static validateRequestParams(req, res, next) {
        const errors = validationResult(req);
        const contentType = res.getHeader('content-type');
        const {status: statusCode} = API_RESPONSES['general']['badRequest'];
        
        if (!errors.isEmpty()) {
            return AppCtrl.sendResponse(res, statusCode, contentType, errors.array());
        }

        next();
    }
}

module.exports = AdvertisementMiddleware;