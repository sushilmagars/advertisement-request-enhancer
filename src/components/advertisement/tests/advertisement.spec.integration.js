'use strict';
const TestHelper = require('./../../../shared/testHelper');
const sinon = require('sinon');
const AdvertisementService = require('./../advertisement.service');

describe('Advertisement integration tests', () => {
    const sandbox = sinon.createSandbox();
    const url = `/advertisement/enhance`;
    let request;
    let data;

    beforeEach(function() {
        this.timeout(10000);

        request = TestHelper.getSuperInstance();
        data = {
            site: {id: '123123', page: 'http://www.foo.com/why-foo'},
            device: {ip: '69.250.196.118'},
            user: {id: '9cb89r'}
        }

    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('POST /advertisement', function () {
        it('should return 200 with json response', function (done) {

            request.post(url)
                .set('Content-Type', 'application/json')
                .send(JSON.stringify(data))
                .expect(200)
                .end(done);
        });

        it('should return 404 if no resource is found', function (done) {

            request.post('/advertisement/someFakeUrl')
                .set('Content-Type', 'application/json')
                .send(JSON.stringify(data))
                .expect(404, done)
        });

        it('respond with 400 if request is missing site id', function (done) {
            delete data.site.id;

            request.post(url)
                .set('Content-Type', 'application/json')
                .send(JSON.stringify(data))
                .expect(400, done)
        });

        it('respond with 400 if request is missing site page url', function (done) {
            delete data.site.page;

            request.post(url)
                .set('Content-Type', 'application/json')
                .send(JSON.stringify(data))
                .expect(400, done)
        });

        it('respond with 400 if request is missing device ip', function (done) {
            delete data.device.ip;

            request.post(url)
                .set('Content-Type', 'application/json')
                .send(JSON.stringify(data))
                .expect(400, done)
        });

        it('respond with 400 if request is missing device ip', function (done) {
            delete data.device.ip;

            request.post(url)
                .set('Content-Type', 'application/json')
                .send(JSON.stringify(data))
                .expect(400, done)
        });

        it('respond with 200 if request device ip is not from US', function (done) {
            data.device.ip = `159.89.175.14`; // india ip address

            request.post(url)
                .set('Content-Type', 'application/json')
                .send(JSON.stringify(data))
                .expect(200)
                .expect('IPs from IN are not allowed')
                .end(done)
        });

        it('respond with 422 if response is unprocessable', function (done) {
            const expectedResponse = {publisher:{name:'Foo LLC'}};
            sandbox.stub(AdvertisementService, 'getPublisherInformation').resolves(expectedResponse);

            request.post(url)
                .set('Content-Type', 'application/json')
                .send(JSON.stringify(data))
                .expect(422)
                .expect('Publisher id was not received')
                .end(done)
        });
    });
});