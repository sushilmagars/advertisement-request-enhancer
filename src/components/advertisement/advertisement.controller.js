'use strict';
const Promise = require('bluebird');
const AdvertisementService = require('./advertisement.service');
const _ = require('lodash');
const API_RESPONSES = require('./../../shared/apiResponses.contants');
const geoip = require('geoip-country');
const AppCtrl = require('./../../shared/AppController');
const {ipAllowedCountries} = require('./../../shared/AppConstants');

class AdvertisementCtrl {
    /**
     * Enhances incoming advertisement request by injecting new properties
     * @function enhanceRequest
     * @memberof AdvertisementCtrl
     * @param {req} express request object 
     * @param {res} express response object 
     */
    enhanceRequest(req, res) {
        const siteId = req.body.site.id;
        const deviceIp = req.body.device.ip;
        const country = geoip.lookup(deviceIp).country;

        // if IP is outside allowed countries, stop transaction
        if (!_.includes(ipAllowedCountries, country)) {
            const message = `IPs from ${country} are not allowed`;
            return this.sendResponse(res, message, 'general', 'notAllowed');
        }

        return Promise.resolve()
            .then(() => AdvertisementService.process(siteId, deviceIp))
            .then((response) => {
                const deviceGeographic = {device: {geo: {country}}};
                const enhancedInfo = _.merge(req.body, response, deviceGeographic);

                return this.sendResponse(res, enhancedInfo, 'general', 'success');
            })
            .catch((error) => {
                if (error.message === 'Publisher id was not received') {
                    return this.sendResponse(res, error.message, 'general', 'unprocessableEntity');
                } else if (error.message.startsWith('Site id must be provided')) {
                    return this.sendResponse(res, error.message, 'general', 'badRequest');
                } else {
                    return this.handleErrorResponse(res, error);
                }
            })
    }

    /**
     * Alias for static sendResponse so we can call this as an instance method or static
     * @function sendResponse
     * @memberof AdvertisementCtrl
     * @param {Object} res
     * @param {*} content
     * @param {String} category
     * @param {String} type
     */
    sendResponse(res, content, category, type) {
        const {status: statusCode} = API_RESPONSES[category][type];
        const contentType = res.getHeader('content-type');
        return AppCtrl.sendResponse(res, statusCode, contentType, content);
    }
    
    /**
     * Helper function to be used as controller route catch blocks.
     *
     * @function handleErrorResponse
     * @memberof AdvertisementCtrl
     * @param {Object} res - Express http response object
     * @param {Object} err - error object
     */
    handleErrorResponse(res, err) {
        const statusCode = err.statusCode;
        const content = err.message;
        const contentType = res.getHeader('content-type');
        return AppCtrl.handleErrorResponse(res, statusCode, contentType, content);
    }
}

module.exports = AdvertisementCtrl;