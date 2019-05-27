const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleware = require('../middleware/is-auth');

describe('Auth Middleware', function() {
  it('should throw an error if no authorization header is present', function() {
    const req = {
      get: function() {
        return null;
      }
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      'Not authenticated.'
    );
  });

  it('should throw an error if the authorization header has one string', function() {
    const req = {
      get: function() {
        return 'abcd';
      }
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });
  it('should yield a userId after decoding the token', function() {
    const req = {
      get: function() {
        return 'Bearer aldjflakjdflkjadlfkj';
      }
    };
    sinon.stub(jwt, 'verify');
    jwt.verify.returns({ userId: 'abcd' });
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property('userId');
    expect(req).to.have.property('userId', 'abcd');
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore();
  });
  it('should throw an error if token cannot be verified', function() {
    const req = {
      get: function() {
        return 'Bearer abcd';
      }
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });
});
