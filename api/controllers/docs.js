var yaml = require("js-yaml");
var fs = require('fs');
var swaggerfile = yaml.load(fs.readFileSync("api/swagger/swagger.yaml"));

const alone = require('swagger-ui-alone');

const spec = swaggerfile;

// turn your spec into a swagger-ui page
const docs = alone(spec);

module.exports = {
  getDocs: getDocs
};

function getDocs(req, res){
    fs.writeFileSync('documentation/index.html', docs);
    res.sendFile(process.cwd() + '/documentation/index.html');
}