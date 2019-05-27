const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const Client = require('../models/client');
const Tracking = require('../models/tracking');
const trackingController = require('../controllers/tracking');

describe('Tracking Controller', () => {
  describe('PostTracking', () => {
    before(done => {
      mongoose
        .connect(
          'mongodb+srv://romantibuai:edgarjunior@cluster0-rw3fu.mongodb.net/testing-tracking?retryWrites=true'
        )
        .then(result => {
          const tracking = new Tracking({
            trackingNumber: 'abcd1234',
            trackingInfo: [],
            _id: '5c7156a76c996c138432afaf'
          });
          return tracking.save();
        })
        .then(() => {
          done();
        });
    });

    after(done => {
      Tracking.deleteMany({})
        .then(() => {
          return mongoose.disconnect();
        })
        .then(() => {
          done();
        });
    });

    it('should throw an error if tracking number is not found', done => {
      const req = {
        body: {
          trackingNumber: 'abcd12345'
        }
      };

      trackingController
        .postTracking(req, {}, () => {})
        .then(result => {
          // console.log('result: ', result);
          expect(result).to.be.an('error');
          done();
        })
        .catch(err => {
          // console.log('err: ', err);
          done();
        });
    });

    it('should respond with status code 200 if tracking Number is found', done => {
      const req = {
        body: {
          trackingNumber: 'abcd1234'
        }
      };

      const res = {
        statusCode: 500,
        status: function(code) {
          this.statusCode = code;
          return this;
        },
        json: {
          tracking: [],
          actionRequired: false
        }
      };

      trackingController
        .postTracking(req, res, () => {})
        .then(result => {
          // console.log('result: ', result);
          expect(res.statusCode).to.equal(200);

          done();
        });
    });
  });

  describe('getProfile', () => {
    before(done => {
      mongoose
        .connect(
          'mongodb+srv://romantibuai:edgarjunior@cluster0-rw3fu.mongodb.net/testing-tracking?retryWrites=true'
        )
        .then(result => {
          const client = new Client({
            clientFirstName: 'Bob',
            clientLastName: 'Bober',
            clientUsername: 'tester',
            clientPassword: 'testing',

            _id: '5c7156a76c996c138432afaf'
          });
          return client.save();
        })
        .then(() => {
          done();
        });
    });

    after(done => {
      Client.deleteMany({})
        .then(() => {
          return mongoose.disconnect();
        })
        .then(() => {
          done();
        });
    });
    it('should throw an error if userId is incorrect', done => {
      const req = {
        params: {
          userId: '5c7156a76c996c138432afad'
        }
      };

      trackingController
        .getProfile(req, {}, () => {})
        .then(result => {
          // console.log('result: ', result);
          expect(result).to.be.an('error');
          done();
        });
    });
    it('should respond with status 200 when userId is valid', done => {
      const req = {
        params: {
          userId: '5c7156a76c996c138432afaf'
        }
      };
      const res = {
        statusCode: 500,
        status: function(code) {
          this.statusCode = code;
          return this;
        },
        json: {
          result: 'result'
        }
      };

      trackingController
        .getProfile(req, res, () => {})
        .then(result => {
          // console.log('result: ', result);
          expect(res.statusCode).to.equal(200);

          done();
        });
    });
  });
});
