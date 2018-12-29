const proxyquire = require('proxyquire');
const expect = require('chai').expect;
const sinon = require('sinon');
let UserModelMock = {};
const userRoutes = proxyquire('../../core/user/routes', {'./model': UserModelMock});
let users = [
    {email: "1@test"},
    {email: "2@test"}
];

describe('userUT', () => {
    describe('routes', () => {
        describe('getUsers', () => {
            it('should query db for all users and write them to response as json', () => {
                UserModelMock.find = (callback) => callback(null, users);
                let fake = sinon.fake();

                userRoutes.getUsers({}, {json: fake});

                expect(fake.lastArg).to.equal(users);
            });
        });
        describe('getUser', () => {
            it('should query db for user by email and write it to response as json', () => {

            });
        });
        describe('postUser', () => {
            it('should get user from request, persist it in db and return db response to http response as json', () => {

            });
        });
    });
});
