const router = require('express').Router();
const Ship = require('../models/Ship');
const { updateOptions } = require('../util/mongoose-helpers');

const check404 = (ship, id) => {
    if(!ship) {
        throw {
            status: 404,
            error: `Ship id ${id} does not exist`
        };
    }
};

module.exports = router
    .post('/', (req, res, next) => {
        Ship.create(req.body)
            .then(ship => res.json(ship))
            .catch(next);
    })
    
    .put('/:id', (req, res, next) => {
        Ship.findByIdAndUpdate(req.params.id, req.body, updateOptions)
            .then(ship => res.json(ship))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const { id } = req.params;

        Ship.findById(id)
            .lean()
            .then(ship => {
                check404(ship, id);
                res.json(ship);
            })
            .catch(next);
    })
    
    .get('/', (req, res, next) => {
        Ship.find(req.query)
            .lean()
            .select('name')
            .then(ships => res.json(ships))
            .catch(next);
    })
    
    .delete('/:id', (req, res, next) => {
        Ship.findByIdAndRemove(req.params.id)
            .then(removed => res.json({ removed }))
            .catch(next);
    });