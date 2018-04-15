const express = require('express');
const app = express();
const pirates = require('./routes/pirates');

app.use(express.json());

app.use('/pirates', pirates);


module.exports = app;