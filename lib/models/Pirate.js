const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['captain', 'crew', 'cook', 'navigator', 'first sword']
    },
    crew: {
        type: String,
        required: true
    },
    joined: {
        type: Date,
        default: Date.now
    },
    wardrobe: {
        hat: String,
        top: String,
        bottom: String,
        shoes: {
            type: String,
            required: true
        },
        accessory: String
    },
    bounty: {
        type: Number,
        min: 0
    }
});

module.exports = mongoose.model('Pirate', schema);