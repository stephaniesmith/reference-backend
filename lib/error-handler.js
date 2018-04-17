/* eslint no-console: off */

module.exports = (err, req, res) => {
    if(!err.status || err.status !== 404) {
        console.log(`FAILED: ${req.method} ${req.url}`);
        console.log(err);
    }
    res.status(err.status || 500).send(err);
};