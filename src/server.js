const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('config');
const { jwtCheck, isAdminCheck } = require('./security/authAuditor.js');
const timeInterval = require('./core/timeInterval/actions');

class Server {
  start() {
    connectToDB();
    expressSetUp();
    defineEndpoints();
    startListening();
  }
}

function connectToDB() {
  console.log(`Connecting to db ${config.DBHost}.`);
  mongoose.connect(config.DBHost, config.DBOptions);
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  console.log('Connected.');
}

function expressSetUp() {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.text());
  app.use(bodyParser.json({ type: 'application/json' }));
  // CORS control
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', config.CORSAllowedDomain);
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });
}

function defineEndpoints() {
  app.get('/', (req, res) =>
    res.json({ message: 'Connection success, waiting for requests' })
  );

  app
    .route('/intervals')
    .post(jwtCheck, timeInterval.createTimeInterval);
  app
    .route('/intervals/search')
    .post(jwtCheck, timeInterval.getTimeIntervals);
  app
    .route('/intervals/:id')
    .get(jwtCheck, timeInterval.getTimeIntervalById)
    .delete(jwtCheck, timeInterval.deleteTimeInterval);
  app
    .route('/intervals/:id/close')
    .patch(jwtCheck, timeInterval.closeTimeInterval);
}

function startListening() {
  app.listen(config.ServerPort, function(req, res) {
    console.log(`REST server started and listening port ${config.ServerPort}.`);
  });
}

module.exports = new Server();
