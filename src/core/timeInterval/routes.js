const jwt = require('jsonwebtoken');
const TimeInterval = require('./model');
const emailPropName = 'https://montoliov.ml/rs|email';

function getUsers(req, res) {
    let token = req.get('authorization').replace('Bearer ', '');
    console.log(token);
    console.log(jwt.decode(token));

    User.find(function (err, users) {
        res.json(users);
    });
}

function getUser(req, res) {
    User.findOne({login: req.params.login}, function (err, user) {
        (user) ? res.json([user]) : res.json([]);
    });
}

function postUser(req, res) {
    const newUser = new User(JSON.parse(req.body));
    newUser.save(function (err, userFromDB) {
        if (err) {
            res.json(err);
        } else {
            res.json(userFromDB);
        }
    });
}

module.exports = {getUsers, getUser, postUser};
