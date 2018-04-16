/* eslint no-console: off */
const http = require('http');
const app = require('./lib/app');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log('server running on', server.address().port);
});