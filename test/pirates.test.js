const { assert } = require('chai');
const request = require('./request');
const Pirate = require('../lib/models/model');

describe('Pirate API', () => {

    let luffy = {
        name: 'Monkey D. Luffy',
        role: 'captain',
        crew: 'Straw Hats'
    };

    let zoro = {
        name: 'Roronoa Zoro',
        role: 'crew',
        crew: 'Straw Hats'
    };

    // // remember we started with this!
    // it('saves and gets a pirate', () => {
    //     return Pirate.save(data)
    //         .then(saved => {
    //             assert.deepEqual(body, { _id: saved._id, ...luffy });
    //         });
    // });

    it('saves a pirate', () => {
        return request.post('/pirates')
            .send(luffy)
            .then(({ body }) => {
                assert.ok(body._id);
                assert.deepEqual(body, { _id: body._id, ...luffy });
                luffy = body;
            });
    });

    it('gets a pirate by id', () => {
        return Pirate.save(zoro)
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
                return Pirate.findById(zoro._id);
            })
            .then(updated => {
                assert.deepEqual(updated, zoro);
            });
    });

    it('gets all pirates', () => {
        return request.get('/pirates')
            .then(({ body }) => {
                assert.deepEqual(body, [luffy, zoro]);
            });
    });

    it('deletes a pirate', () => {
        return request.delete(`/pirates/${zoro._id}`)
            .then(() => {
                return Pirate.findById(zoro._id);
            })
            .then(found => {
                assert.isUndefined(found);
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