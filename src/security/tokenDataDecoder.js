const jwt = require('jsonwebtoken');

function parseEmail({ req }) {
  if (!req.get('authorization')) {
    return null;
  }
  const token = req.get('authorization').replace('Bearer ', '');
  const decodedToken = jwt.decode(token);
  return !!decodedToken ? decodedToken['https://montoliov.ml/rs|email'] : null;
}

module.exports = { parseEmail };
