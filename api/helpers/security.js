module.exports = {
    apiKeyAuth: function securityHandler(req, authOrSecDef, scopesOrApiKey, cb) {
        // check token
        if (req.headers['x-api-key'] === process.env.API_KEY ){
          console.log(req.headers['x-api-key']);
          cb(null);
        } else {
          var err = new Error('Access denied - wrong token');
          err.statusCode=403;
          cb(err);
        }
    }
};