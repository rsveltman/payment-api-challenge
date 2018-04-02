var should = require('should');
var request = require('supertest');
var server = require('../../../app');

describe('security', function(){
  
  describe('API key', function(){
    
    it('should return a 403 Forbidden error if there is no API Key in the header', function(done) {
  
      request(server)
        .post('/payments')
        .send({payment:{amount:300,type:"boleto"},buyer:{email:"ciclano@a.com",cpf:"44455566677"},clientId:3})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          should.exist(err);
          
          err.should.have.property('message', 'expected 200 "OK", got 403 "Forbidden"');

          res.body.should.not.have.property('status', 'error');
          res.body.should.not.have.property('errorMessage');
          res.body.should.not.have.property('id');

          done();
        });
    });
    
    it('should return a 403 Forbidden error if the API Key is wrong', function(done) {
  
      request(server)
        .post('/payments')
        .send({payment:{amount:300,type:"boleto"},buyer:{email:"ciclano@a.com",cpf:"44455566677"},clientId:3})
        .set('Accept', 'application/json')
        .set('x-api-key', '134')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          should.exist(err);
          
          err.should.have.property('message', 'expected 200 "OK", got 403 "Forbidden"');

          res.body.should.not.have.property('status', 'error');
          res.body.should.not.have.property('errorMessage');
          res.body.should.not.have.property('id');

          done();
        });
    });
    
    
  });
  
});