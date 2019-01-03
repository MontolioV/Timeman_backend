const express = require("express");
const rs = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('config');
const user = require('./core/user/routes');

console.log(`Connecting to db ${config.DBHost}`);
mongoose.connect(config.DBHost, config.DBOptions);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

rs.use(bodyParser.json());
rs.use(bodyParser.urlencoded({extended: true}));
rs.use(bodyParser.text());
rs.use(bodyParser.json({type: 'application/json'}));

rs.get('/', (req, res) => res.json({message: 'Connection success, waiting for requests'}));

rs.route('/users')
    .get(user.getUsers)
    .post(user.postUser);
rs.route('/:login')
    .get(user.getUser);

rs.listen(config.ServerPort, function (req, res) {
    console.log(`REST server started and listening port ${config.ServerPort}`);
});
