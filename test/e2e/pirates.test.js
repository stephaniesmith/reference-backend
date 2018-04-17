const { assert } = require('chai');
const request = require('./request');
const Pirate = require('../../lib/models/Pirate');
const mongoose = require('mongoose');

describe('Pirate API', () => {

    before(() => {
        return mongoose.connection.dropCollection('pirates')
            .catch(err => {
                if(err.codeName !== 'NamespaceNotFound') throw err;
            });
    });

    let luffy = {
        name: 'Monkey D. Luffy',
        role: 'captain',
        crew: 'Straw Hat Pirates',
        wardrobe: {
            shoes: 'flip-flops'
        }
    };

    let zoro = {
        name: 'Roronoa Zoro',
        role: 'crew',
        crew: 'Straw Hats',
        wardrobe: {
            shoes: 'boots'
        }
    };

    const join = ({ _id, __v, joined }, original) => ({ 
        _id, __v, joined, 
        ...original 
    });

    const roundTrip = doc => JSON.parse(JSON.stringify(doc.toJSON()));

    // remember we started with this!
    // it.skip('saves and gets a pirate', () => {
    //     return new Pirate(luffy).save()
    //         .then(saved => {
    //             saved = saved.toJSON();
    //             const { _id, __v, joined } = saved;
    //             assert.ok(_id);
    //             assert.ok(__v);
    //             assert.ok(joined);
    //             assert.deepEqual(saved, join(saved, luffy));
    //             luffy = saved;
    //             return Pirate.findById(saved._id).lean();
    //         })
    //         .then(found => {
    //             assert.deepEqual(found, luffy);
    //         });
    // });

    it('saves a pirate', () => {
        return request.post('/pirates')
            .send(luffy)
            .then(({ body }) => {
                assert.deepEqual(body, join(body, luffy));
                luffy = body;
            });
    });
   
    it('gets a pirate by id', () => {
        return new Pirate(zoro).save()
            .then(saved => {
                zoro = roundTrip(saved);
                return request.get(`/pirates/${zoro._id}`);
            })
            .then(({ body }) => {
                assert.deepEqual(body, zoro);
            });
    });

    it('update a pirate', () => {
        zoro.role = 'first sword';

        return request.put(`/pirates/${zoro._id}`)
            .send(zoro)
            .then(({ body }) => {
                assert.deepEqual(body, zoro);
                return Pirate.findById(zoro._id);
            })
            .then(roundTrip)
            .then(updated => {
                assert.deepEqual(updated, zoro);
            });
    });

    const getFields = ({ _id, name, role, crew }) => ({ _id, name, role, crew });

    it('gets all pirates but only _id, name, role and crew', () => {
        return request.get('/pirates')
            .then(({ body }) => {
                assert.deepEqual(body, [luffy, zoro].map(getFields));
            });
    });

    it('deletes a pirate', () => {
        return request.delete(`/pirates/${zoro._id}`)
            .then(() => {
                return Pirate.findById(zoro._id);
            })
            .then(found => {
                assert.isNull(found);
            });
    });

    it('returns 404 on get of non-existent id', () => {
        return request.get(`/pirates/${zoro._id}`)
            .then(response => {
                assert.equal(response.status, 404);
                assert.match(response.body.error, /^Pirate id/);
            });
    });
});