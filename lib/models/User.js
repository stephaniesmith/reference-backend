const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { RequiredString } = require('./required-types');
const bcrypt = require('bcryptjs');

const schema = new Schema({
    email: RequiredString,
    hash: RequiredString
});

schema.methods = {
    
    generateHash(password) {
        this.hash = bcrypt.hashSync(password, 8);
    },

    comparePassword(password) {
        return bcrypt.compareSync(password, this.hash);
    }
};

module.exports = mongoose.model('User', schema);