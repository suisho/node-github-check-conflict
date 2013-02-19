var request = require("request");
var async = require("async")
var apiFactory = require("./api")
module.exports = function(github, user, repo, callback){
  var conflict =  new Conflict(github, user, repo)
  conflict.getConflictedIssues(callback);
}

var Conflict = function(github, user, repo){
  this.user = user;
  this.repo = repo;
  this.github = github;
}

Conflict.prototype.msg = function(){
  return {
    user : this.user,
    repo : this.repo
  }
}

Conflict.prototype.getConflictedIssues = function(callback){
  var mergeable = {}
  var tasks = [];
  var self = this;
  self.getOpenPullRequest(function(err,pulls){
    if(err){
      callback(err);
    }
    pulls.forEach(function(pull){

      tasks.push(function(next){
        var _msg = self.msg();
        _msg.number = pull.number
        self.github.pullRequests.get(_msg, function(err,_pull){
          mergeable[pull.number] = _pull.mergeable_state
          next()
        })
      })
    })
    async.series(tasks, function(){
      callback(null, mergeable)
    })
  });

}

Conflict.prototype.getOpenPullRequest = function(callback){
  var msg = this.msg();
  this.github.pullRequests.getAll(msg, function(err,pulls ){
    var openPulls = [];
    pulls.forEach(function(pull){
      if(pull.state !== "open"){
        return
      }
      openPulls.push(pull);
    })
    callback(err, openPulls);
  });
}


