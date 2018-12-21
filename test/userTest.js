const assert = require("assert").strict;
const User = require('../core/user.js');

describe('User', function () {
    describe('#constructor()', function () {
        it('should initialise empty array if no time intervals were passed', function () {
            const user = new User({});
            assert.deepEqual(user.timeIntervals, []);
        });
    });
});