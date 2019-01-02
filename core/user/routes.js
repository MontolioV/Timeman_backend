const User = require('./model');

function getUsers(req, res) {
    User.find((err, users) => {
        res.json(users);
    });
}

function getUser(req, res) {
    User.findOne({login: req.params.login}, (err, user) => {
        (user) ? res.json([user]) : res.json([]);
    });
}

function postUser(req, res) {

}

module.exports = {getUsers, getUser, postUser};
