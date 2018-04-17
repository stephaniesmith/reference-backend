const { assert } = require('chai');
const Pirate = require('../../lib/models/Pirate');

describe('Pirate model', () => {

    it('valid model', () => {
        const data = {
            name: 'Monkey D. Luffy',
            role: 'captain',
            crew: 'Straw Hats',
            wardrobe: {
                hat: 'straw',
                top: 'red vest',
                bottom: 'trousers',
                shoes: 'flip flops'
            },
            bounty: 300000000
        };

        const pirate = new Pirate(data);

        assert.deepEqual(pirate.toJSON(), { _id: pirate._id, ...data });
    });
});