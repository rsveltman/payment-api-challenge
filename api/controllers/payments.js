'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var util = require('util');


/**
 * DATABASE - pg-promise
 * 
 * 
 * 
**/

const promise = require('bluebird');
const initOptions = {
    promiseLib: promise // overriding the default (ES6 Promise);
};

const pgp = require('pg-promise')(initOptions);


const cn = process.env.DATABASE_URL;

const db = pgp(cn);

/**
 *  /DATABASE
 * 
**/




/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
  postPayment: postPayment,
  getPayment: getPayment
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
 
/**
 * INTERNAL FUNCTIONS
**/
// internal postPayment functions

function disguiseCardNumber(number) {
  // hide all but the last 3 digits
  return number.replace(/.(.{3})/g, "****");
}

function processCard(paramsPayment, client) {
 // a credit card transaction happens here, if it goes well return true
 return true;
}

function generateBoleto(paramsPayment, client){
 // something happens and a boleto number is returned, else it returns false
 return "(boletonumber)";
}

function processBuyer(response, paramsBuyer, res){
 
 response.buyerInfo.name = paramsBuyer['name'];
 response.buyerInfo.email = paramsBuyer['email'];
 response.buyerInfo.cpf = paramsBuyer['cpf'];
 
 // something happens here with the buyer info
 var buyerInfoOk = true;
 if (buyerInfoOk){
  response.status = 'buyer info processed';
  return response;
 } else {
  response.errorMessage = 'There was a problem with the buyer information.';
  response.status = 'error';
  res.json( response );
 }
}

function processPayment(paramsPayment, res, response, client){

 var type = paramsPayment['type'];
 response.paymentInfo.amount = paramsPayment['amount'];
  
 switch(type) {
  case "boleto":
   var bnumber = generateBoleto(paramsPayment, client);
   if (bnumber){
    response.paymentInfo.boletoNumber = bnumber;
    response.status = 'pending boleto payment';
    return response;
    
   } else {
    response.errorMessage = 'There was a problem with the boleto.';
    response.status = 'error';
    res.json( response ); // send error message
   }
   break;
   
  case "card":
   
   response.paymentInfo['card'] = {};
   response.paymentInfo.card.holder = paramsPayment['card']['holderName'];
   response.paymentInfo.card.number = disguiseCardNumber(paramsPayment['card']['number']);
   
   
   if (processCard(paramsPayment, client)){
    response.status = 'paid';
    return response;
    
   } else {     
    response.errorMessage = 'There was a problem with the credit card transaction.';
    response.status = 'error';
    res.json( response ); // send error message
   }
   break;
   
  default:
   response.errorMessage = 'Could not process payment type.';
   response.status = 'error';
   res.json( response );
 }
}


/**
 * HTTP METHODS - /payments POST, /payments/{id} GET
**/

function postPayment(req, res) {
 
 var params = req.swagger.params.paymentParameters;
 
 var client = params.value['clientId'];
 
 
 var response = {'paymentInfo':{},'buyerInfo':{},'status':''};
 // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}

 
 response = processBuyer(response, params.value['buyer'], res);
 
 response = processPayment(params.value['payment'], res, response, client);
  
 var pay_info = util.format('%j', response.paymentInfo);
 var buyer_info = util.format('%j', response.buyerInfo);
 
 db.one('INSERT INTO payments(clientid, paymentinfo, buyerinfo, status) VALUES($1, $2, $3, $4) RETURNING id', [client, pay_info, buyer_info, response.status])
 .then(data => {
  response['id'] = data.id;
  res.json( response );
 })
 .catch(error => {
  console.log('ERROR:', error); // print error;
  response.status = 'error';
  response.errorMessage = 'Could not insert to database.';
  res.json( response );
 });
 
} // function postPayment


function getPayment(req, res) {

 var payment_id = req.swagger.params.id.value;
 
 var response = {'id': payment_id,'paymentInfo':{},'buyerInfo':{},'status':''};

 
  db.one('SELECT * FROM payments WHERE id = $1', [payment_id])
  .then(data => {
   response.paymentInfo = JSON.parse(data.paymentinfo);
   response.buyerInfo = JSON.parse(data.buyerinfo);
   response.status = data.status;
   res.json( response );
  })
  .catch(error => {
   console.log('ERROR:', error); // print the error;
   response.status = 'error';
   response.errorMessage = 'Could not retrieve payment info from the database.';
   res.json( response );
  });

} // function getPayment