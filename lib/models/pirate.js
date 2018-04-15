const shortid = require('shortid');
const store = new Map();

module.exports = {
    
    save(pirate) {
        return this.update(shortid(), pirate);
    },

    update(id, pirate) {
        const dbCopy = { ...pirate, _id: id };
        store.set(id, dbCopy);
        return Promise.resolve(dbCopy);
    },

    findById(id) {
        return Promise.resolve(store.get(id));
    },

    find() {
        return Promise.resolve([...store.values()]);
    },

    removeById(id) {
        const exists = store.has(id);
        store.delete(id);
        return Promise.resolve(exists);
    }
};