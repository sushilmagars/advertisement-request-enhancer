'use strict';
const sinon = require('sinon');
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const {isEqual} = require('lodash');

const AdvertisementService = require('./../advertisement.service');

describe('Advertisement service tests', () => {
    describe('#process', () => {
        const sandbox = sinon.createSandbox();
        let enhanceAdvertisementRequest;
        let stubs = {};

        beforeEach(() => {
            enhanceAdvertisementRequest = {  
               site: {id:'foo123', page:'http://www.foo.com/why-foo'},
               device: {ip: '69.250.196.118'},
               user:{id:'9cb89r'}
            };

            stubs.getPublisherInformationStub = sandbox.stub(AdvertisementService, 'getPublisherInformation');
            stubs.getDemographicInformationStub = sandbox.stub(AdvertisementService, 'getDemographicInformation');
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('should reject if site id is missing', () => {
            AdvertisementService.process(null)
                .should.be.rejectedWith(Error, 'Site id must be provided. Provided site id:');
        });

        it ('should reject if publisher id was not received in the response', () => {
            const expectedResponse = {publisher:{name:'Foo LLC'}};
            stubs.getPublisherInformationStub.resolves(expectedResponse);

            AdvertisementService.process(enhanceAdvertisementRequest.site.id)
                .should.be.rejectedWith(Error, 'Publisher id was not received');
        });

        it ('should return response with mandatory properties', () => {
            const expectedPublisherResponse = {publisher: {id: '23k5jdf9', name:'Foo LLC'}};
            const expectedDemogrhicResponse = {female_percent: 21.49, male_percent: 78.51};
            const expectedResponse = {
                site: { 
                    publisher: { id: '23k5jdf9', name: 'Foo LLC'},
                    demographics: {female_percent: 21.49, male_percent: 78.51}
                }
              };
              
            stubs.getPublisherInformationStub.resolves(expectedPublisherResponse);
            stubs.getDemographicInformationStub.resolves(expectedDemogrhicResponse);

            AdvertisementService.process(enhanceAdvertisementRequest.site.id)
                .then((res) => expect(isEqual(res, expectedResponse)).to.be.true);
        });
    });
});