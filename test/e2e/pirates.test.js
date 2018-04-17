const { assert } = require('chai');
const request = require('./request');
const Pirate = require('../../lib/models/Pirate');
const { dropCollection } = require('./db');

describe('Pirate API', () => {

    before(() => dropCollection('pirates'));

    let luffy = {
        name: 'Monkey D. Luffy',
        role: 'captain',
        crew: 'Straw Hat Pirates',
        wardrobe: {
            shoes: 'flip-flops'
        },
        weapons: ['hands', 'feet', 'head']
    };

    let zoro = {
        name: 'Roronoa Zoro',
        role: 'crew',
        crew: 'Straw Hats',
        wardrobe: {
            shoes: 'boots'
        },
        weapons: ['sword', 'sword', 'sword']
    };

    // remember we started with this!
    // it.skip('saves and gets a pirate', () => {
    //     return new Pirate(luffy).save()
    //         .then(saved => {
    //             saved = saved.toJSON();
    //             const { _id, __v, joined } = saved;
    //             assert.ok(_id);
    //             assert.equal(__v, 0);
    //             assert.ok(joined);
    //             assert.deepEqual(saved, {
    //                 _id, __v, joined,
    //                 ...luffy
    //             });
    //             luffy = saved;
    //             return Pirate.findById(saved._id).lean();
    //         })
    //         .then(found => {
    //             assert.deepEqual(found, luffy);
    //         });
    // });

    it('saves and gets a pirate', () => {
        return request.post('/pirates')
            .send(luffy)
            .then(({ body }) => {
                const { _id, __v, joined } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.ok(joined);
                assert.deepEqual(body, {
                    _id, __v, joined,
                    ...luffy
                });
                luffy = body;
            });
    });

    const roundTrip = doc => JSON.parse(JSON.stringify(doc.toJSON()));

    it('gets a pirate by id', () => {
        return Pirate.create(zoro).then(roundTrip)
            .then(saved => {
                zoro = saved;
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
                return Pirate.findById(zoro._id).then(roundTrip);
            })
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

    it('queries pirates', () => {
        return request.get('/pirates?role=captain')
            .then(({ body }) => {
                assert.deepEqual(body, [luffy].map(getFields));
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