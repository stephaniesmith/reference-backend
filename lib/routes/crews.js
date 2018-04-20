const router = require('express').Router();
const Crew = require('../models/Crew');
const Pirate = require('../models/Pirate');
const { updateOptions } = require('../util/mongoose-helpers');
const check404 = require('./check-404');

module.exports = router
    .post('/', (req, res, next) => {
        Crew.create(req.body)
            .then(crew => res.json(crew))
            .catch(next);
    })
    
    .put('/:id', (req, res, next) => {
        Crew.findByIdAndUpdate(req.params.id, req.body, updateOptions)
            .then(crew => res.json(crew))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const { id } = req.params;

        Promise.all([
            Crew.findById(id)
                .populate({
                    path: 'ships',
                    select: 'name'
                })
                .lean(),
            
            Pirate.find({ crew: id })
                .lean()
                .select('name')
        ])
            .then(([crew, pirates]) => {
                check404(crew, id);
                crew.pirates = pirates;
                res.json(crew);
            })
            .catch(next);
    })
    
    .get('/', (req, res, next) => {
        Crew.find(req.query)
            .lean()
            .select('name')
            .then(crews => res.json(crews))
            .catch(next);
    })
    
    .delete('/:id', (req, res, next) => {
        const { id } = req.params;

        Pirate.find({ crew: id })
            .count()
            .then(count => {
                if(count > 0) throw 'Cannot delete crew with pirates';
                
                return Crew.findByIdAndRemove(id);
            })
            .then(removed => res.json({ removed }))
            .catch(next);
    });