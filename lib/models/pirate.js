const shortid = require('shortid');
const store = new Map();

module.exports = {
    save(pirate) {
        const dbCopy = { _id: shortid(), ...pirate };
        store.set(dbCopy._id, dbCopy);
        return Promise.resolve(dbCopy);
    },
    findById(id){
        return Promise.resolve(store.get(id));
    }
};