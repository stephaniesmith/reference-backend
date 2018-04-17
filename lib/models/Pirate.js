const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    // fields:
    name: String,
    role: String,
    crew: String,
    joined: Date,
    wardrobe: {
        hat: String,
        top: String,
        bottom: String,
        shoes: String
    },
    bounty: Number
});

module.exports = mongoose.model('Pirate', schema);
