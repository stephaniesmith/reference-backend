const router = require('express').Router();
const Crew = require('../models/Crew');
const { updateOptions } = require('../util/mongoose-helpers');

const check404 = (crew, id) => {
    if(!crew) {
        throw {
            status: 404,
            error: `Crew id ${id} does not exist`
        };
    }
};

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

        Crew.findById(id)
            .lean()
            .then(crew => {
                check404(crew, id);
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
        Crew.findByIdAndRemove(req.params.id)
            .then(removed => res.json({ removed }))
            .catch(next);
    });