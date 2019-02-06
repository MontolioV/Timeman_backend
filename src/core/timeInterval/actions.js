const { parseEmail } = require('../../security/tokenDataDecoder.js');
const TimeInterval = require('./model');
const _ = require('lodash');

function createTimeInterval(req, res) {
  const requestedTimeInterval = { ...req.body };
  requestedTimeInterval.owner = parseEmail({ req });
  if (!requestedTimeInterval.start) {
    requestedTimeInterval.start = new Date().getTime();
  }
  const timeInterval = new TimeInterval(requestedTimeInterval);
  timeInterval.save((err, timeIntervalFromDB) => {
    if (!!err) {
      res.json(err);
    } else {
      res.json(timeIntervalFromDB);
    }
  });
}

function getTimeIntervals(req, res) {
  const conditions = (({ start, end, tags }) => {
    let result = {
      start,
      end,
      tags,
      owner: parseEmail({ req }),
    };
    return _.pickBy(result);
  })(req.query);
  TimeInterval.find(conditions, null, { sort: { start: -1 } }, function(
    err,
    timeIntervalsFromDB
  ) {
    !!timeIntervalsFromDB ? res.json(timeIntervalsFromDB) : res.json([]);
  });
}

function getTimeIntervalById(req, res) {
  TimeInterval.findOne(
    { _id: req.params.id, owner: parseEmail({ req }) },
    function(err, timeIntervalFromDB) {
      !!timeIntervalFromDB ? res.json([timeIntervalFromDB]) : res.json([]);
    }
  );
}

function closeTimeInterval(req, res) {
  TimeInterval.findOneAndUpdate(
    { _id: req.params.id, end: { $exists: false } },
    { end: new Date().getTime() },
    { new: true },
    function(err, timeIntervalFromDB) {
      if (!err) {
        res.json(timeIntervalFromDB);
      } else {
        res.json(err);
      }
    }
  );
}

function deleteTimeInterval(req, res) {
  TimeInterval.deleteOne({ _id: req.params.id }, function(err) {
    res.json(err);
  });
}

module.exports = {
  createTimeInterval,
  getTimeIntervals,
  getTimeIntervalById,
  closeTimeInterval,
  deleteTimeInterval,
};
