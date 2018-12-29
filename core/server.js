const express = require("express");
const mongoClient = require('mongodb').MongoClient;
const User = require('./user/model.js');
const TimeInterval = require('./timeInterval.js');

const url = "mongodb://localhost:27017/";
const rs = express();

rs.listen(18080, function (req, res) {
    console.log('REST server started and listening port 18080');
});

rs.get('/:email/register', function (req, res) {
    const email = req.params.email;
    mongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
        const dbo = db.db("time_manager_db");
        dbo.collection("users").findOne({email}, function (err, result) {
            if (err) throw err;
            if (!result) {
                dbo.collection("users").insertOne(new User({email: email}), function (err, result) {
                    if (err) throw err;
                });
            }
            db.close();
            res.end('New user registered successfully!');
        });
    });
});

rs.get('/:email/startInterval', function (req, res) {
    const email = req.params.email;
    mongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
        const dbo = db.db("time_manager_db");
        const pushInterval = {$push: {timeIntervals: new TimeInterval({})}};
        dbo.collection("users").updateOne({email}, pushInterval, function (err, result) {
            if (err) throw err;
            db.close();
            res.write('Interval started.\n');
            res.end(JSON.stringify(result));
        });
    });
});

rs.get('/:email/stopInterval', function (req, res) {
    const email = req.params.email;
    mongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
        const dbo = db.db("time_manager_db");

        dbo.collection("users").findOne({email}, function (err, result) {
            if (err) throw err;
            if (result) {
                const idx = result.timeIntervals.length - 1;
                const intervalToUpdate = new TimeInterval(result.timeIntervals.pop());
                intervalToUpdate.closeInterval();
                const idxKey = `timeIntervals.${idx}`;
                let idxReplacementObject = {};
                idxReplacementObject[idxKey] = intervalToUpdate;
                dbo.collection("users").updateOne({email}, {'$set': idxReplacementObject}, function (err, result) {
                    if (err) throw err;
                });
            }
            db.close();
            res.write('Interval stopped.');
        });
    });
});
