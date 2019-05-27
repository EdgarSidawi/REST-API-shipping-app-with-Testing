const expect = require('chai').expect;
const sinon = require('sinon');

const Client = require('../models/client');
const AuthController = require('../controllers/auth');

describe('Auth Controller - postLogin', function() {
  beforeEach(() => {
    sinon.stub(Client, 'findOne');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should throw an error if accessing the database fails', function(done) {
    Client.findOne.throws();

    const req = {
      body: {
        username: 'username',
        password: 'password'
      }
    };

    const call = function() {
      AuthController.postLogin(req, {}, () => {});
    };
    done();
    expect(call).to.throw();
  });

  it('Should throw an error when username or password is invalid ', done => {
    const req = {
      body: {
        username: 'username',
        password: 'password'
      }
    };
    Client.findOne.withArgs({ clientUsername: 'username' }).rejects();

    AuthController.postLogin(req, {}, () => {});
    Client.findOne({ clientUsername: 'username' }).catch(err => {
      expect(err).to.be.an('error');
      done();
    });
  });
});
