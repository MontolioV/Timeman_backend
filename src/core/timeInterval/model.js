const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TimeIntervalSchema = new Schema({
  start: Number,
  end: Number,
  tags: { type: [String], index: true },
  owner: { type: String, required: true, index: true },
});

module.exports = mongoose.model('timeInterval', TimeIntervalSchema);
