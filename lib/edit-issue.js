var util = require("util");
var assert = require("assert");
var clone = require("clone");
var request = require("request");
// replace single repo
// return callback(error, executeEdit, repo)
module.exports = function(github, issue, editFunc, callback){
  var conf = github.config;
  var token = github.auth.token;
  var url = conf.protocol + "://"+conf.host+conf.url;
  github.issues.getRepoIssue(issue, function(err, rawRepo){
    if(err){
       callback(err, false, repo);
       return;
    }
    
    var milestone = null;
    try{
      milestone = rawRepo.milestone.number;
    }catch(e){}
    var assignee = null;
    try{
      assignee = rawRepo.assignee.login;
    }catch(e){}
    
    
    var labels = [];
    rawRepo.labels.forEach(function(label){
      labels.push(label.name);
    })
    
    var repo = {
      title     : rawRepo.title,
      body      : rawRepo.body,
      assignee  : assignee,
      state     : rawRepo.state,
      milestone : milestone,
      labels    : labels
    };
    var editedRepo = editFunc(clone(repo), rawRepo);
    try{
      assert.notDeepEqual(repo, editedRepo);
    }catch(e){
      callback(null, false, repo);
      return;
    }
    var encodedLabels = [];
    editedRepo.labels.forEach(function(label){
      encodedLabels.push(label);
    })
    var editParam = {
      user   : issue.user,
      repo   : issue.repo,
      number : issue.number,
      title     : editedRepo.title,
      body      : editedRepo.body,
      assignee  : editedRepo.assignee,
      state     : editedRepo.state,
      labels    : editedRepo.labels
    }
    request({
      url : url + "/" + ["repos", issue.user, issue.repo, "issues",issue.number].join("/"),
      method : "POST",
      json : {
        access_token : token,
        title     : editedRepo.title,
        body      : editedRepo.body,
        assignee  : editedRepo.assignee,
        state     : editedRepo.state,
        labels    : editedRepo.labels,
      },
    }, function(err, result,body){
      if(!err && statusCode !== 200){
        err ={
          statusCode : statusCode,
          body : body
        } 
      }
      callback(err, true, body);
    })
  })
}

