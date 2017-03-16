require('dotenv').config();
var util = require('util');
var fs = require('fs');
xml2js = require('xml2js');

// local files
require('./logging.js')
var GitApi = require('./gitApi.js')

// File containing the details of the SVN repositories to import. 
var filePath = process.env.FILE_PATH;

// Read the xml file.
console.log('\nReading file: ' + filePath)
var parser = new xml2js.Parser();

fs.readFile(filePath, function(err, data) {
  if(err){
    console.log(err.message);
    return;
  }

  console.log('Parsing file content...')
  parser.parseString(data, function (err, result) {
    if(err){
      console.log(err.message);
      return;
    }

    var components = result.components.component;

    if(components){
      for (var i = 0; i < components.length; i++) {
        var component = components[i];
        console.log(util.format('Component[%d]: %s', i, JSON.stringify(component)));

        var api = new GitApi();

        if(process.argv[2] == "showStatus"){
          // If the command line parameter "showStatus" is specified, than check the repository import status.
          api.checkImportStatus(component);
        }
        else{
          // Create repo in GIT and import the SVN repo.
          api.createRepo(component, api.importSvnRepo, api);
        }
      }
    }
  });
});