module.exports = {
    apiKeyAuth: function securityHandler(req, authOrSecDef, scopesOrApiKey, cb) {
        // check token
        if (req.headers['x-api-key'] === '1234'){ // put this in an ENV VAR
          cb(null);
        } else {
          var err = new Error('Access denied - wrong token');
          err.statusCode=403;
          cb(err);
        }
    }
};