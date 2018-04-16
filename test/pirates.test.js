const { assert } = require('chai');
const request = require('./request');
const Pirate = require('../lib/models/pirate');


describe('pirate API', () => {
    
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

    it('saves a pirate', () => {

        return request
            .post('/pirates')
            .send(luffy)
            .then(({ body }) => {
                const { _id } = body;
                assert.ok(_id);
                assert.deepEqual(body, { _id, ...luffy });
                luffy = body;
                return _id;
            })
            .then(_id => Pirate.findById(_id))
            .then(found => {
                assert.deepEqual(found, luffy);
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

    it('updates pirate by id', () => {
        zoro.role = 'first sword';

        return request
            .put(`/pirates/${zoro._id}`)
            .send(zoro)
            .then(({ body }) => {
                assert.deepEqual(body, zoro);
            });
    });

    it('gets all pirates', () => {

        return request
            .get('/pirates')
            .then(({ body }) => {
                assert.deepEqual(body, [luffy, zoro]);
            });
    });

    it('deletes a pirate by id', () => {

        return request
            .del(`/pirates/${zoro._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, { removed: true });
                return Pirate.findById(zoro._id);
            })
            .then(deleted => {
                assert.isUndefined(deleted);
            });
    });

    it('returns 404 on get by bad id', () => {

        return request
            .get(`/pirates/${zoro._id}`)
            .then(response => {
                assert.equal(response.status, 404);
                assert.ok(response.body.error);
            });
    });
});