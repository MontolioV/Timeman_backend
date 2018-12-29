const User = require('./model');

function getUsers(req, res) {
    User.find((err, users) => {
        res.json(users);
    });
}

function getUser(req, res) {

}

function postUser(req, res) {

}

module.exports = {getUsers, getUser, postUser};
