const expect = require('chai').expect;
const request = require('request');
const { TESTING_URL, TESTING_HOST } = require('../constants/tests');
const page = require('../routes/campgrounds');
const user = require('../models/user');


describe('when new collection created', function () {

  describe('public', function () {
      beforeEach(function () {
          collection = {title: 'This is test collection', public: true};
      });

      beforeEach(function (done) {
          request.post({url: TESTING_URL, headers: TESTING_HOST, body: collection, json: true}, function (err, resp, body) {
              response = resp;
              results = body;
              done(err);
          });
      });

      it('should respond with 201 (created)', function () {
          expect(response.statusCode).to.equal(201);
      });

      it('should create new collection', function () {
          expect(results.title).to.be.ok;
          expect(results._id).to.be.ok;
      });

      it('should have user', function () {
          expect(results.user).to.equal(user.username);
      });

      it('should collection be public', function () {
          expect(results.public).to.equal(true);
      });

      describe('and title is missing', function () {
          beforeEach(function (done) {
              request.post({url: TESTING_URL, headers: TESTING_HOST, body: {}, json: true}, function (err, resp, body) {
                  response = resp;
                  results = body;
                  done(err);
              });
          });

          it('should respond with 412 (bad request)', function () {
              expect(response.statusCode).to.equal(412);
          });
      });

      describe('with description', function () {
          beforeEach(function () {
              collection = {title: 'This is test collection', description: 'description'};
          });

          beforeEach(function (done) {
              request.post({url: TESTING_URL, headers: TESTING_HOST, body: collection, json: true}, function (err, resp, body) {
                  response = resp;
                  results = body;
                  done(err);
              });
          });

          it('should respond with 201 (created)', function () {
              expect(response.statusCode).to.equal(201);
          });

          it('should create new collection', function () {
              expect(results.description).to.equal('description');
          });
      });
  });
});
