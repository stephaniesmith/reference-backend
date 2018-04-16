const router = require('express').Router();
const Pirate = require('../models/model');

module.exports = router
    .post('/', (req, res) => {
        Pirate.save(req.body)
            .then(pirate => res.json(pirate));
    })
    
    .put('/:id', (req, res) => {
        Pirate.findByIdAndUpdate(req.params.id, req.body)
            .then(pirate => res.json(pirate));
    })

    .get('/:id', (req, res) => {
        const { id } = req.params;

        Pirate.findById(id)
            .then(pirate => {
                if(!pirate) {
                    res.status(404).json({
                        error: `Pirate id ${id} does not exist`
                    });
                }
                else res.json(pirate);
            });
    })
    
    .get('/', (req, res) => {
        Pirate.find()
            .then(pirates => res.json(pirates));
    })
    
    .delete('/:id', (req, res) => {
        Pirate.findByIdAndRemove(req.params.id)
            .then(removed => res.json({ removed }));
    });