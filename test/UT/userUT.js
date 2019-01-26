function UserModelMock(body) {
    this.body = body;
}

const proxyquire = require('proxyquire');
const expect = require('chai').expect;
const sinon = require('sinon');
const userRoutes = proxyquire('../../src/core/user/routes', {'./model': UserModelMock});
let users = [
    {login: '1', email: "1@test"},
    {login: '2', email: "2@test"}
];

describe('userUT', () => {
    describe('routes', () => {
        describe('getUsers', () => {
            it('should query db for all users and write them to response as json array', () => {
                UserModelMock.find = (callback) => callback(null, users);
                const jsonMethodFake = sinon.fake();

                userRoutes.getUsers({}, {json: jsonMethodFake});
                expect(jsonMethodFake.lastArg).to.equal(users);
            });
        });
        describe('getUser', () => {
            it('should query db for user by login and write it to response as json array', () => {
                UserModelMock.findOne = (queryObject, callback) => {
                    let login = queryObject.login;
                    let targetUser = users.find(user => user.login === login);
                    return callback(null, targetUser);
                };
                const jsonMethodFake = sinon.fake();

                userRoutes.getUser({params: {}}, {json: jsonMethodFake});
                expect(jsonMethodFake.lastArg).to.deep.equal([]);

                userRoutes.getUser({params: {login: '3'}}, {json: jsonMethodFake});
                expect(jsonMethodFake.lastArg).to.deep.equal([]);

                userRoutes.getUser({params: {login: '1'}}, {json: jsonMethodFake});
                expect(jsonMethodFake.lastArg).to.deep.equal([users[0]]);
            });
        });
        describe('postUser', () => {
            const error = {};
            UserModelMock.prototype.save = function (callback) {
                if (this.body === null) {
                    return callback(error, null);
                } else {
                    return callback(null, this.body);
                }
            };

            it('should get user from request, persist it in db and return db response to http response as json array', () => {
                const jsonMethodFake = sinon.fake();
                const someNewUser = {some: 'param'};

                userRoutes.postUser({body: JSON.stringify(someNewUser)}, {json: jsonMethodFake});
                expect(jsonMethodFake.lastArg).to.deep.equal(someNewUser);
            });
            it('should write error to response, if error occurs', () => {
                const jsonMethodFake = sinon.fake();

                userRoutes.postUser({body: null}, {json: jsonMethodFake});
                expect(jsonMethodFake.lastArg).to.equal(error);
            });
        });
    });
});
