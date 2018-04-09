# Online Payment API Simulation

This is an API for online payments created for the Moip Technical Challenge. One can create a new payment, check the status of an existing payment, explore the documentation through the Swagger UI, or use the checkout form to simulate a payment.

## How to Use

 

### API
Use the API key `1234` in the header as shown in the examples.

- Create a new payment with POST:

```
curl -i -X POST -H  'x-api-key: 1234' -H 'Content-Type: application/json' -d '{"payment":{"amount":"560","type":"card","card":{"holderName":"Beltrano","number":"1234321412146789","expirationDate":"2019-09-12","cvv":"123"}},"buyer":{"name":"Fulano","email":"a@a.com","cpf":"11122233345"},"clientId":"17"}'  https://banana-crisp-85488.herokuapp.com/payments
```
- Check an existing payment with GET:

```
curl -X GET -H  'x-api-key: 1234' https://banana-crisp-85488.herokuapp.com/payments/3 -H  'accept: application/json'
```

### [Documentation](https://banana-crisp-85488.herokuapp.com/documentation)

This API has an interactive documentation via [swagger-ui](https://github.com/swagger-api/swagger-ui).  You can test out different requests with the "Try It Out" button. Remember to click "Authorize" to input the `1234` key (or not, if you want to see what happens).
You can also see what the requests to the API must look like, on the "Models" section.

### [Checkout Form](https://banana-crisp-85488.herokuapp.com/checkout)
You can simulate an online payment without directly interacting with the API by submitting this form. With this, your payment will be registered as coming from a client of ID `5`. 

## The Code

In `package.json` there are 3 scripts: 
* start - this is the script that is run by heroku. Don't run this locally.
* test - runs the tests using 2 environment variables: `DATABASE_URL` and `API_KEY`. These may be changed to reflect your local configuration.
* localstart - starts in localhost with environment variables as above. Call this with `npm run-script localstart`.

### swagger.yaml

All changes must be described in the swagger document first. Add a path, then add the REST methods and create a corresponding controller file. [See this guide for the details.](https://swagger.io/docs/specification/basic-structure/)


### Security

The use of an API Key is only because this is a simulation. The next step would be to add [OAuth 2](https://swagger.io/docs/specification/authentication/oauth2/). 



# Built With

* [node.js](https://nodejs.org/en/)
* [Swagger](https://swagger.io) - API Development Framework
* [pg-promise](https://www.npmjs.com/package/pg-promise) - [Promises/A+](https://promisesaplus.com/) interface for PostgreSQL.
* [Javascript credit card validation](https://www.braemoor.co.uk/software/creditcard.shtml) - [author](software@braemoor.co.uk)


## Author

* [*It's me*](https://github.com/rsveltman)