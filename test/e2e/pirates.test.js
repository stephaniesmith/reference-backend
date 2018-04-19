const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe.skip('Pirate API', () => {

    before(() => dropCollection('pirates'));

    let luffy = {
        name: 'Monkey D. Luffy',
        role: 'captain',
        crew: 'Straw Hat Pirates',
        wardrobe: {
            shoes: 'flip-flops'
        },
        weapons: []
    };

    let zoro = {
        name: 'Roronoa Zoro',
        role: 'crew',
        crew: 'Straw Hats',
        wardrobe: {
            shoes: 'boots'
        },
        weapons: []
    };

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    it('saves and gets a pirate', () => {
        return request.post('/pirates')
            .send(luffy)
            .then(checkOk)
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

    it('gets a pirate by id', () => {
        return request.post('/pirates')
            .send(zoro)
            .then(checkOk)
            .then(({ body }) => {
                zoro = body;
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
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, zoro);
                return request.get(`/pirates/${zoro._id}`);
            })
            .then(({ body }) => {
                assert.deepEqual(body, zoro);
            });
    });

    const getFields = ({ _id, name, role, crew }) => ({ _id, name, role, crew });

    it('gets all pirates but only _id, name, role and crew', () => {
        return request.get('/pirates')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [luffy, zoro].map(getFields));
            });
    });

    it('queries pirates', () => {
        return request.get('/pirates?role=captain')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [luffy].map(getFields));
            });
    });

    it('deletes a pirate', () => {
        return request.delete(`/pirates/${zoro._id}`)
            .then(() => {
                return request.get(`/pirates/${zoro._id}`);
            })
            .then(res => {
                assert.equal(res.status, 404);
            });
    });

    it('returns 404 on get of non-existent id', () => {
        return request.get(`/pirates/${zoro._id}`)
            .then(response => {
                assert.equal(response.status, 404);
                assert.match(response.body.error, new RegExp(zoro._id));
            });
    });

    describe('Pirate Weapons API', () => {

        const weapon = { type: 'kick', damage: 13 };

        it('Adds a weapon', () => {
            return request.post(`/pirates/${luffy._id}/weapons`)
                .send(weapon)
                .then(checkOk)
                .then(({ body }) => {
                    assert.isDefined(body._id);
                    weapon._id = body._id;
                    assert.deepEqual(body, weapon);

                    return request.get(`/pirates/${luffy._id}`);
                })
                .then(({ body }) => {
                    assert.deepEqual(body.weapons, [weapon]);
                });
        });

        it('Updates a weapon', () => {
            weapon.damage = 16;
            return request.put(`/pirates/${luffy._id}/weapons/${weapon._id}`)
                .send(weapon)
                .then(checkOk)
                .then(({ body }) => {
                    assert.equal(body.damage, weapon.damage);
                });
        });

        it('Removes a weapon', () => {
            return request.delete(`/pirates/${luffy._id}/weapons/${weapon._id}`)
                .then(checkOk)
                .then(() => {
                    return request.get(`/pirates/${luffy._id}`);                    
                })
                .then(({ body }) => {
                    assert.deepEqual(body.weapons, []);
                });
        });
    });
});