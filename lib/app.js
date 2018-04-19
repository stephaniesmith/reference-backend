const express = require('express');
// const morgan = require('morgan');
const app = express();
const errorHandler = require('./util/error-handler');

//app.use(morgan('dev'));
app.use(express.json());

// ROUTES
const pirates = require('./routes/pirates');
const ships = require('./routes/ships');
const crews = require('./routes/crews');

app.use('/crews', crews);
app.use('/ships', ships);
app.use('/pirates', pirates);

// ERROR HANDLER
app.use(errorHandler());

module.exports = app;