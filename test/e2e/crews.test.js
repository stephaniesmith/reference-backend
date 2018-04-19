const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('Crews API', () => {

    before(() => dropCollection('ships'));
    before(() => dropCollection('crews'));

    let sunny = {
        name: 'Sunny',
        sails: 5
    };

    before(() => {
        return request.post('/ships')
            .send(sunny)
            .then(({ body }) => {
                sunny = body;
            });
    });

    let strawHats = {
        name: 'Straw Hats',
        flag: 'https://images-na.ssl-images-amazon.com/images/I/814tPeVWRDL._SL1500_.jpg',
        ships: []
    };

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    it('saves a crew', () => {
        strawHats.ships.push(sunny._id);

        return request.post('/crews')
            .send(strawHats)
            .then(checkOk)
            .then(({ body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.deepEqual(body, {
                    ...strawHats,
                    _id, __v 
                });
                strawHats = body;
            });
    });

    it('gets a crew by id', () => {
        return request.get(`/crews/${strawHats._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, strawHats);
            });
    });

    it('update a crew', () => {
        strawHats.name = 'Straw Hat Pirates';

        return request.put(`/crews/${strawHats._id}`)
            .send(strawHats)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, strawHats);
                return request.get(`/crews/${strawHats._id}`);
            })
            .then(({ body }) => {
                assert.deepEqual(body, strawHats);
            });
    });

    // const getFields = ({ _id, name }) => ({ _id, name });

    it.skip('gets all crews with pirate count', () => {
        return request.get('/crews')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [sunny, navy].map(getFields));
            });
    });

    it.skip('deletes a crew', () => {
        return request.delete(`/crews/${navy._id}`)
            .then(() => {
                return request.get(`/crews/${navy._id}`);
            })
            .then(res => {
                assert.equal(res.status, 404);
            });
    });

    it.skip('returns 404 on get of non-existent id', () => {
        return request.get(`/crews/${navy._id}`)
            .then(response => {
                assert.equal(response.status, 404);
                assert.match(response.body.error, new RegExp(navy._id));
            });
    });

});