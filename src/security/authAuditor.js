const config = require('config');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const jwtAuthz = require('express-jwt-authz');

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
// TODO: 26.01.19 Define scope for privileged user.
const isAdminCheck = jwtAuthz(['crud:self']);

module.exports = {jwtCheck, isAdminCheck};