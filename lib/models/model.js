const shortid = require('shortid');
const store = new Map();

module.exports = {
    
    save(model) {
        return this.findByIdAndUpdate(shortid(), model);
    },

    findByIdAndUpdate(id, model) {
        const dbCopy = { ...model, _id: id };
        store.set(id, dbCopy);
        return Promise.resolve(dbCopy);
    },

    findById(id) {
        return Promise.resolve(store.get(id));
    },

    find() {
        return Promise.resolve([...store.values()]);
    },

    findByIdAndRemove(id) {
        const exists = store.has(id);
        if(exists) store.delete(id);
        return Promise.resolve(exists);
    }
};