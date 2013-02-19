var GithubApi = require("github");
var url = require("url");

module.exports = function(option){
  var parse = url.parse(option.url);
  var githubOption = {
    "version" : "3.0.0",
  }
  
  if(parse){
    githubOption.protocol = parse.protocol.replace(/:$/,"");
    githubOption.host = parse.hostname;
    githubOption.url = parse.path;
    githubOption.port = parse.port;
  }
  if(option.debug){
    githubOption.debug = true;
    console.log(githubOption);
  }
  
  var github = new GithubApi(githubOption)
  if(option.token){
    github.authenticate({
      type : "oauth",
      token : option.token
    })
  }
  return {
    check : function(user, repo, callback){
      require("./lib/mergeable")(github, user, repo, callback)
    },
    label : function(user, repo, label, callback){
      require("./lib/labeling")(github, user, repo, label, callback)
    }
  }
}
