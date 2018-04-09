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
var path = require('path');
module.exports = {
  getCheckout: getCheckout
};

function getCheckout(req, res){
    res.sendFile(path.dirname(require.main.filename) + '/checkout/payform.html');
}