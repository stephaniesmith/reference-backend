const router = require('express').Router();
const Pirate = require('../models/model');
const errorHandler = require('../error-handler');

module.exports = router
    .post('/', (req, res) => {
        Pirate.save(req.body)
            .then(pirate => res.json(pirate))
            .catch(err => errorHandler(err, req, res));
    })
    
    .put('/:id', (req, res) => {
        Pirate.findByIdAndUpdate(req.params.id, req.body)
            .then(pirate => res.json(pirate))
            .catch(err => errorHandler(err, req, res));
    })

    .get('/:id', (req, res) => {
        const { id } = req.params;

        Pirate.findById(id)
            .then(pirate => {
                if(!pirate) {
                    errorHandler({
                        status: 404,
                        error: `Pirate id ${id} does not exist`
                    }, req, res);
                }
                else res.json(pirate);
            })
            .catch(err => errorHandler(err, req, res));
    })
    
    .get('/', (req, res) => {
        Pirate.find()
            .then(pirates => res.json(pirates))
            .catch(err => errorHandler(err, req, res));
    })
    
    .delete('/:id', (req, res) => {
        Pirate.findByIdAndRemove(req.params.id)
            .then(removed => res.json({ removed }))
            .catch(err => errorHandler(err, req, res));
    });