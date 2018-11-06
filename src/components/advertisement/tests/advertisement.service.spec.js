'use strict';
const sinon = require('sinon');
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const AdvertisementService = require('./../advertisement.service');

describe('Advertisement service tests', () => {
    describe('#process', () => {
        const sandbox = sinon.createSandbox();
        let enhanceAdvertisementRequest;
        let stubs = {};

        beforeEach(function() {
            enhanceAdvertisementRequest = {  
               site: {id:'foo123', page:'http://www.foo.com/why-foo'},
               device: {ip: '69.250.196.118'},
               user:{id:'9cb89r'}
            };
        });

        it('should throw error if site id is missing', () => {
            delete enhanceAdvertisementRequest.site.id;
            AdvertisementService.process()
                .should.be.rejected;
        });
    });
});