var GithubApi = require("github");
module.exports = function(option){
  var github = new GithubApi({
    "version" : "3.0.0",
    "url" : option.url,
  })
  if(option.token){
    github.authenticate({
      type : "oauth",
      token : option.token
    })
  }
  return {
    check : function(user, repo, callback){
      require("./lib/check-conflict")(github, user, repo, callback)
    },
    label : function(user, repo, label, callback){
      var option={
        conflictLabel : label
      }
      require("./lib/labeling")(github, user, repo, option, callback)
    }
  }
}
