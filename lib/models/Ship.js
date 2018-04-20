const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('../util/mongoose-helpers');

const schema = new Schema({
    name: RequiredString,
    sails: {
        type: Number,
        required: true,
        min: 1
    },
    features: [String]
}, {
    timestamps: true
});

module.exports = mongoose.model('Ship', schema);