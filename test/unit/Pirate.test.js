const { assert } = require('chai');
const Pirate = require('../../lib/models/Pirate');

describe('Pirate model', () => {

    it('works with valid model', () => {
        const pirate = new Pirate({
            name: 'Monkey D. Luffy',
            role: 'captain',
            crew: 'Straw Hat Pirates',
            joined: Date.now(),
            wardrobe: {
                hat: 'straw',
                top: 'red vest',
                bottom: 'trousers',
                shoes: 'flip-flops'
            },
            bounty: 300000000
        });

        assert.isUndefined(pirate.validateSync());
    });

    it('has default date of now', () => {
        const pirate = new Pirate();
        assert.ok(pirate.joined);
        assert.isAtMost(pirate.joined - Date.now(), 5);
    });

    it('required fields', () => {
        const pirate = new Pirate({});
        const { errors } = pirate.validateSync();
        assert.equal(Object.keys(errors).length, 4);
        assert.equal(errors['name'].kind, 'required');
        assert.equal(errors['role'].kind, 'required');
        assert.equal(errors['crew'].kind, 'required');
        assert.equal(errors['wardrobe.shoes'].kind, 'required');
    });

    it('role must be enum, bounty must be positive number', () => {
        const pirate = new Pirate({
            name: 'test', crew: 'test', 
            role: 'bad',
            bounty: -500
        });
        const { errors } = pirate.validateSync();
        assert.equal(errors['role'].kind, 'enum');
        assert.equal(errors['bounty'].kind, 'min');
    });
});