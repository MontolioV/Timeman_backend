const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TimeIntervalSchema = new Schema(
    {
        start: {type: Number, required: true, default: new Date().getTime()},
        end: Number,
        tags: {type: Array, index: true},
        owner: {type: String, required: true, index: true}
    }
);

module.exports = mongoose.model('timeInterval', TimeIntervalSchema);