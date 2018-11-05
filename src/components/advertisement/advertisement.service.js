'use strict';
const Promise = require('bluebird');
const config = require('../../../config/environment')
const rp = require('request-promise');
const _ = require('lodash');

class AdvertisementService {
    static process(siteId) {
        if (!siteId) {
            throw new Error(`Site id must be provided. Provided site id: ${siteId}`);
        }

        return Promise.props({
            publisherLookUpInfo: AdvertisementService.getPublisherInformation(siteId),
            demographicInfo: AdvertisementService.getDemographicInformation(siteId),
        })
        .then(({publisherLookUpInfo, demographicInfo}) => {
            let publisherIdExist = Boolean(_.get(publisherLookUpInfo.publisher, 'id'));

            // if publisher id is missing from the response, throw a 422 and stop transaction
            if (!publisherIdExist) {
                throw new Error('Publisher id was not received');
            }

            return Object.assign({}, {
                site: {
                    publisher: publisherLookUpInfo.publisher,
                    demographics: demographicInfo
                },
            })
        });
    }

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

    static getPublisherInformation(siteId) {
        const requestBody = {q: {siteID: siteId}};

        return Promise.resolve()
            .then(() => AdvertisementService.buildRequestPayload('POST', config.publisherLookUpApi.url, requestBody))
            .then((payload) => AdvertisementService.makeApiCall(payload));
    }

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

    static makeApiCall(requestBody) {
        return rp(requestBody);
    }
}

module.exports = AdvertisementService;