var should = require('should');
var request = require('supertest');
var server = require('../../../app');

describe('controllers', function() {
  
  describe('payments', function() {

    describe('POST /payments', function() {

      it('should return a 400 Bad Request error if there is a missing required parameter', function(done) {

        request(server)
          .post('/payments')
          .send({payment:{amount:200,type:"boleto"},buyer:{email:"a@a.com",cpf:"12332112322"},clientId:1})
          .set('Accept', 'application/json')
          .set('x-api-key', '1234')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.exist(err);
            
            err.should.have.property('message', 'expected 200 "OK", got 400 "Bad Request"');

            res.body.should.not.have.property('status', 'error');
            res.body.should.not.have.property('errorMessage');
            res.body.should.not.have.property('id');

            done();
          });
      });
      
      it('should return a 400 Bad Request if there is missing information', function(done) {

        request(server)
          .post('/payments')
          .send({payment:{amount:200,type:"boleto"},buyer:{name:"",email:"a@a.com",cpf:"46512332155"},clientId:1})
          .set('Accept', 'application/json')
          .set('x-api-key', '1234')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.exist(err);
            
            err.should.have.property('message', 'expected 200 "OK", got 400 "Bad Request"');

            res.body.should.not.have.property('status', 'error');
            res.body.should.not.have.property('errorMessage');
            res.body.should.not.have.property('id');

            done();
          });
      });
      
      it('should return a 400 Bad Request if the name is too short', function(done) {

        request(server)
          .post('/payments')
          .send({payment:{amount:200,type:"boleto"},buyer:{name:"n",email:"a@a.com",cpf:"11122233344"},clientId:1})
          .set('Accept', 'application/json')
          .set('x-api-key', '1234')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.exist(err);
            
            err.should.have.property('message', 'expected 200 "OK", got 400 "Bad Request"');

            res.body.should.not.have.property('status', 'error');
            res.body.should.not.have.property('errorMessage');
            res.body.should.not.have.property('id');

            done();
          });
      });
      
      it('should return a boleto number and payment ID', function(done) {

        request(server)
          .post('/payments')
          .send({payment:{amount:200,type:"boleto"},buyer:{name:"fulano",email:"a@a.com",cpf:"46556745633"},clientId:1})
          .set('Accept', 'application/json')
          .set('x-api-key', '1234')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);

            res.body.should.have.property('status', 'pending boleto payment');
            res.body.should.have.property('id').which.is.a.Number();
            res.body.should.have.property('paymentInfo').with.property('boletoNumber').which.is.a.String();

            done();
          });
      });
      
      it('should return a card payment status and ID', function(done) {

        request(server)
          .post('/payments')
          .send({payment:{amount:200,type:"card", card:{holderName:"Fulano de tal",number:"1234-3214-1214-6789",expirationDate:"2019-09-09",cvv:"123"}},buyer:{name:"fulano",email:"a@a.com",cpf:"12345678900"},clientId:1})
          .set('Accept', 'application/json')
          .set('x-api-key', '1234')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);

            res.body.should.have.property('status', 'paid');
            res.body.should.have.property('id').which.is.a.Number();

            done();
          });
      });


    }); // end POST payments
    
    describe('GET /payments/{id}', function() {

      it('should return a 400 Bad Request error if the parameter is not a number', function(done) {

        request(server)
          .get('/payments/b')
          .set('Accept', 'application/json')
          .set('x-api-key', '1234')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.exist(err);
            
            err.should.have.property('message', 'expected 200 "OK", got 400 "Bad Request"');

            res.body.should.not.have.property('id');

            done();
          });
      });
      
      it('should return an error message if the payment does not exist', function(done) {

        request(server)
          .get('/payments/999')
          .set('Accept', 'application/json')
          .set('x-api-key', '1234')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);

            res.body.should.have.property('status', 'error');
            res.body.should.have.property('errorMessage');

            done();
          });
      });
      
      it('should return a payment status and information', function(done) {

        request(server)
          .get('/payments/30')
          .set('Accept', 'application/json')
          .set('x-api-key', '1234')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);

            res.body.should.have.property('status');
            res.body.should.have.property('buyerInfo');
            res.body.should.have.property('paymentInfo');

            done();
          });
      });


    });

  });

});
