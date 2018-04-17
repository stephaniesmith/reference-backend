const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiDateTime = require('chai-datetime');
chai.use(chaiHttp);
chai.use(chaiDateTime);
const http = require('http');

const app = require('../../lib/app');

const server = http.createServer(app);
const request = chai.request(server).keepOpen();

after(() => server.close());

module.exports = request;