'use strict';
const Promise = require('bluebird');
const config = require('../../../config/environment');
const rp = require('request-promise');
const _ = require('lodash');

class AdvertisementService {
    /**
     * Process incoming advertisement request
     * @function process
     * @memberof AdvertisementService
     * @param {Object} siteId
     */
    static process(siteId) {
        if (!siteId) {
            return Promise.reject(new Error(`Site id must be provided. Provided site id: ${siteId}`));
        }

        return Promise.props({
            publisherLookUpInfo: AdvertisementService.getPublisherInformation(siteId),
            demographicInfo: AdvertisementService.getDemographicInformation(siteId),
        })
        .then(({publisherLookUpInfo, demographicInfo}) => {
            let publisherIdExist = Boolean(_.get(publisherLookUpInfo.publisher, 'id'));

            // if publisher id is missing from the response, throw a 422 and stop transaction
            if (!publisherIdExist) {
                return Promise.reject(new Error('Publisher id was not received'));
            }

            return Object.assign({}, {
                site: {
                    publisher: publisherLookUpInfo.publisher,
                    demographics: demographicInfo
                },
            })
        });
    }

    /**
     * Fetches demographic information
     * @function getDemographicInformation
     * @memberof AdvertisementService
     * @param {Object} siteId
     */
    static getDemographicInformation(siteId) {
        const requestUrl = `http://159.89.185.155:3000/api/sites/${siteId}/demographics`;

        return Promise.resolve()
            .then(() => AdvertisementService.buildRequestPayload('GET', requestUrl))
            .then((payload) => AdvertisementService.makeApiCall(payload))
            .then((res) => {
                const parsedResponse = JSON.parse(res);
                const femalePercent = Number(parsedResponse.demographics.pct_female.toFixed(2));
                const malePercent = 100 - femalePercent;

                return {
                    female_percent: femalePercent,
                    male_percent: malePercent,
                }
            });
    }

    /**
     * Fetches publisher information
     * @function getPublisherInformation
     * @memberof AdvertisementService
     * @param {Object} siteId
     */
    static getPublisherInformation(siteId) {
        const requestBody = {q: {siteID: siteId}};

        return Promise.resolve()
            .then(() => AdvertisementService.buildRequestPayload('POST', config.publisherLookUpApi.url, requestBody))
            .then((payload) => AdvertisementService.makeApiCall(payload));
    }

    /**
     * Builds request payload
     * @function buildRequestPayload
     * @memberof AdvertisementService
     * @param {String} method
     * @param {String} apiUrl
     * @param {Object} payload
     */
    static buildRequestPayload(method, apiUrl, payload) {
        const options = {
            method: method,
            uri: apiUrl,
            headers: {
                'content-type': 'application/json',
                'cache-control': 'no-cache',
            },
        }

        if (payload) {
            options.body = payload;
            options.json = true;
        }

        return options;
    }

    /**
     * Makes API call
     * @function buildRequestPayload
     * @memberof AdvertisementService
     * @param {String} method
     * @param {String} apiUrl
     * @param {Object} payload
     */
    static makeApiCall(requestBody) {
        return rp(requestBody);
    }
}

module.exports = AdvertisementService;