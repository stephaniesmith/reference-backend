const router = require('express').Router();
const Crew = require('../models/Crew');
const { getParam, respond } = require('./route-helpers');

module.exports = router

    .param('id', getParam)

    .post('/', respond(
        ({ body }) => Crew.create(body)
    ))
    
    .put('/:id', respond(
        ({ id, body }) => Crew.updateById(id, body)
    ))

    .get('/:id', respond(
        ({ id }) => Crew.getDetailById(id)
    ))
    
    .get('/', respond(
        ({ query }) => Crew.findByQuery(query)
    ))
    
    .delete('/:id', respond(
        ({ id }) => Crew.removeById(id)
            .then(deleted => {
                return { removed: !!deleted };
            })
    ));