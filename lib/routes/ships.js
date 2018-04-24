const router = require('express').Router();
const Ship = require('../models/Ship');
const { getParam, respond } = require('./route-helpers');

module.exports = router

    .param('id', getParam)

    .post('/', respond(
        ({ body }) => Ship.create(body)
    ))
    
    .put('/:id', respond(
        ({ id, body }) => Ship.updateById(id, body)
    ))

    .get('/:id', respond(
        ({ id }) => Ship.findById(id).lean()
    ))
    
    .get('/', respond(
        ({ query }) => {
            return Ship.find(query)
                .lean()
                .sort({ createdAt: -1 })
                .limit(100)
                .select('name createdAt updatedAt');
        }
    ))
    
    .delete('/:id', respond(
        ({ id }) => Ship.findByIdAndRemove(id)
    ));