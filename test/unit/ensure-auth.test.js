const { assert } = require('chai');
const createEnsureAuth = require('../../lib/util/ensure-auth');
const tokenService = require('../../lib/util/token-service');

describe('adds payload as req.user on success', () => {

    let user = { _id: 123 }
    let token = '';
    beforeEach(() => token = tokenService.sign(user));

    const ensureAuth = createEnsureAuth();

    it('adds payload as req.user on success', () => {
        const req = {

        };
        const next = () => {
            assert.deepEqual(req.user.id, user._id);
            done();
        };
    });
});