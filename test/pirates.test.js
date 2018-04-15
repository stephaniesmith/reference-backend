const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { assert } = chai;
const Pirate = require('../lib/models/pirate');


describe('pirate API', () => {
    it('saves and gets a pirate', () => {
        let pirate = {
            name: 'Monkey D. Luffy',
            role: 'captain',
            crew: 'Straw Hats'
        };

        return Pirate.save(pirate)
            .then(saved => {
                const { _id } = saved;
                assert.ok(_id);
                assert.deepEqual(saved, { _id, ...pirate });
                pirate = saved;
                return _id;
            })
            .then(_id => Pirate.findById(_id))
            .then(found => {
                assert.deepEqual(found, pirate);
            });

    });
});