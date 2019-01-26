const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new Schema(
    {
        login: {type: String, required: true, index: true, unique: true},
        email: {type: String, required: true, index: true, unique: true}
    }
);
UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', UserSchema);