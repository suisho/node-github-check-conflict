var util = require("util");
// replace single repo
module.exports = function(github, issue, editFunc, callback){
  github.issues.getRepoIssue(issue, function(err, repo){
  	if(err){
       callback(err, repo);
       return;
  	}
    var body = repo.body;
    var editedRepo = editFunc(repo);
    var editParam = {
      user   : issue.user,
      repo   : issue.repo,
      number : issue.number,
      title     : editedRepo.title,
      body      : editedRepo.body,
      assignee  : editedRepo.assignee,
      state     : editedRepo.state,
      milestone : editedRepo.milestone,
      labels    : editedRepo.labels
    }
    
    github.issues.edit(editParam, function(err, result){
      callback(err, repo);
    })
  })
}

