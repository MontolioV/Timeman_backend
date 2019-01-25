const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('config');
const user = require('./core/user/routes');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const jwtAuthz = require('express-jwt-authz');

console.log(`Connecting to db ${config.DBHost}`);
mongoose.connect(config.DBHost, config.DBOptions);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: config.jwksUri
    }),
    audience: config.jwtAudience,
    issuer: config.jwtIssuer,
    algorithms: config.jwtAlgorithms
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type: 'application/json'}));
// CORS control
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", config.CORSAllowedDomain);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => res.json({message: 'Connection success, waiting for requests'}));

app.route('/users')
// .get(user.getUsers)
// .get(jwtCheck, user.getUsers)
    .get(jwtCheck, jwtAuthz(['crud:self']), user.getUsers)
    .post(user.postUser);
app.route('/:login')
    .get(user.getUser);

app.listen(config.ServerPort, function (req, res) {
    console.log(`REST server started and listening port ${config.ServerPort}`);
});

