const { parseEmail } = require('../../security/tokenDataDecoder.js');
const TimeInterval = require('./model');
const _ = require('lodash');

function createTimeInterval(req, res) {
  const requestedTimeInterval =
    typeof req.body === 'string' ? JSON.parse(req.body) : {};
  requestedTimeInterval.owner = parseEmail({ req });
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
  })(req.params);
  TimeInterval.find(conditions, function(err, timeIntervalsFromDB) {
    !!timeIntervalsFromDB ? res.json([timeIntervalsFromDB]) : res.json([]);
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
  TimeInterval.where({ _id: req.params.id, end: { $exists: false } }).updateOne(
    {
      end: new Date().getTime(),
    },
    function(err) {
      res.json(err);
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
