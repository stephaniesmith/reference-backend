const router = require('express').Router();
const Pirate = require('../models/Pirate');
const { updateOptions } = require('../util/mongoose-helpers');

const check404 = (pirate, id) => {
    if(!pirate) {
        throw {
            status: 404,
            error: `Pirate id ${id} does not exist`
        };
    }
};

module.exports = router
    .post('/', (req, res, next) => {
        Pirate.create(req.body)
            .then(pirate => res.json(pirate))
            .catch(next);
    })
    
    .put('/:id', (req, res, next) => {
        Pirate.findByIdAndUpdate(req.params.id, req.body, updateOptions)
            .then(pirate => res.json(pirate))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const { id } = req.params;

        Pirate.findById(id)
            .lean()
            .then(pirate => {
                check404(pirate, id);
                res.json(pirate);
            })
            .catch(next);
    })
    
    .get('/', (req, res, next) => {
        Pirate.find(req.query)
            .lean()
            .select('name crew role')
            .populate({
                path: 'crew',
                select: 'name'
            })
            .then(pirates => res.json(pirates))
            .catch(next);
    })
    
    .delete('/:id', (req, res, next) => {
        Pirate.findByIdAndRemove(req.params.id)
            .then(removed => res.json({ removed }))
            .catch(next);
    })
    
    .post('/:id/weapons', (req, res, next) => {
        Pirate.findByIdAndUpdate(req.params.id, {
            $push: { weapons: req.body }
        }, updateOptions)
            .then(pirate => {
                res.json(pirate.weapons[pirate.weapons.length - 1]);
            })
            .catch(next);
    })
    
    .put('/:id/weapons/:weaponId', (req, res, next) => {
        const { id, weaponId } = req.params;
        const { type, damage } = req.body;

        Pirate.findOneAndUpdate({
            '_id': id, 'weapons._id': weaponId
        }, {
            $set: {
                'weapons.$.type': type,
                'weapons.$.damage': damage
            }
        }, updateOptions)
            .then(pirate => {
                check404(pirate, id);
                res.json(pirate.weapons.find(w => w._id == weaponId));
            })
            .catch(next);
    })
    
    .delete('/:id/weapons/:weaponId', (req, res, next) => {
        const { id, weaponId } = req.params;

        Pirate.findByIdAndUpdate(id, {
            $pull: { 
                weapons: { _id: weaponId }
            }
        }, updateOptions)
            .then(pirate => {
                check404(pirate, id);
                res.json();
            })
            .catch(next);
    });