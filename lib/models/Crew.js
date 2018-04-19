const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('../util/mongoose-helpers');

const schema = new Schema({
    name: RequiredString,
    flag: String,
    ships: [String]
});

module.exports = mongoose.model('Crew', schema);