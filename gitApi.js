var util = require('util');
var request = require('request');

// Constructor
function GitApi() {  
  this.headers = {
        'User-Agent': 'github-import-script',
        'Authorization': 'token '+ process.env.GIT_API_TOKEN
      };
}

// Creates a git repository.
GitApi.prototype.createRepo = function (component, callback, api){
  // The code will run on both GitHub organizational and user accounts.
  var orgSegment = process.env.GIT_ISORGANIZATION == "true" ? '/orgs/'+ process.env.GIT_OWNER : '/user';
  var url =  util.format('%s%s/repos', process.env.GIT_API_URL, orgSegment);

  // If a repository prefix is defined, use it.
  var repoName =  process.env.REPO_PREFIX + component.$.name;
  console.log(util.format('Creating repo [%s] at [%s]', repoName, url));

  var options =  {
      url: url,
      headers: this.headers,
      form: JSON.stringify({name: repoName})
    };

  // Call GitHub API.
  request.post(options,
    function(err,httpResponse,body){ 
      if(err){
        console.log(err.message);
      }
      else{
        if(httpResponse.statusCode == 201){ // Created
          console.log(util.format('Successfully created repo [%s] at [%s]', repoName, url));
          if(callback){
            callback(component, api);
          }
        }else{
          console.log(util.format('API Error -> Http Status Code %d (%s) ->\n',
            httpResponse.statusCode, httpResponse.statusMessage, httpResponse.body));
        }

        console.log('\n');      
      }
    }
  );
}

// Imports an SVN repository into GitHub.
GitApi.prototype.importSvnRepo = function (component, api){
  var repoName =  process.env.REPO_PREFIX + component.$.name;
  var url =  util.format('%s/repos/%s/%s/import', process.env.GIT_API_URL, process.env.GIT_OWNER, repoName);

  console.log(util.format('Importing SVN repo [%s] to [%s][%s]', component.$.svnpath, repoName, url));

  var data = {
    "vcs": "subversion",
    "vcs_url": component.$.svnpath,
    "vcs_username": process.env.SVN_USER,
    "vcs_password": process.env.SVN_PASS
  }

  var importHeaders = api.headers;
  // According to https://developer.github.com/v3/migration/source_imports/ the below header is required
  // because the API is in public preview.
  importHeaders["Accept"] = "application/vnd.github.barred-rock-preview";

  var options =  {
      url: url,
      headers: importHeaders,
      form: JSON.stringify(data)
    };

  // Call GitHub API.
  request.put(options,
      function(err,httpResponse,body){ 
        if(err){
          console.log(err.message);
        }
        else{
          if(httpResponse.statusCode == 201){ // Created
            console.log(util.format('Started importing [%s] to [%s]', repoName, url));
          }else{
            console.log(util.format('API Error -> Http Status Code %d (%s) ->\n', 
              httpResponse.statusCode, httpResponse.statusMessage, httpResponse.body));
          }      
        }
      }
    );
}

// Calls the GitHub API to check the import status.
GitApi.prototype.checkImportStatus = function (component){
  var repoName =  process.env.REPO_PREFIX + component.$.name;
  var url =  util.format('%s/repos/%s/%s/import', process.env.GIT_API_URL, process.env.GIT_OWNER, repoName);

  console.log(util.format('Checking Import status for [%s]', repoName));

  var importHeaders = this.headers;
  // According to https://developer.github.com/v3/migration/source_imports/ the below header is required
  // because the API is in public preview.
  importHeaders["Accept"] = "application/vnd.github.barred-rock-preview";

  var options =  {
      url: url,
      headers: importHeaders,
    };

  // Call GitHub API.
  request.get(options,
      function(err,httpResponse,body){ 
        if(err){
          console.log(err.message);
        }
        else{
          if(httpResponse.statusCode == 200){ // Created
            var result = JSON.parse(body);
            console.log(util.format('Repository [%s] import status is [%s](%s)', 
              result.repository_url, result.status, result.status_text));
          }else{
            console.log(util.format('API Error -> Http Status Code %d (%s) ->\n', 
              httpResponse.statusCode, httpResponse.statusMessage, httpResponse.body));
          }      
        }
      }
    );
}

// export the class
module.exports = GitApi;