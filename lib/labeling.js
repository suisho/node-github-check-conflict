var conflict = require("./check-conflict");
var edit = require("./edit-issue");
var async = require("async");

var addLabel = function(github, issue, label, callback){

}


module.exports = function(githib, option){
  var user = option.user;
  var repo = option.repo;
  var conflictLabel = option.conflictLabel;
  var nonConflictLabel = option.nonConflictLabel;
  conflict(github, user, repo, function(err, result)){
    var issueNums = Object.keys(result);
    var tasks = [];
    issueNums.forEach(function(num){
      tasks.push(function(next){
        var issue = {
          user : user,
          repo : repo,
          num : num
        };
        var label;
        if(result[num] && conflictLabel){
          label = conflictLabel
        }else if(nonConflictLabel){
          label = nonConflictLabel
        }
        var func = function(repo){
          repo.label.push(label);
        }
        edit(github, issue, func, addLabel(github, issue, label, function(err){
          next(err)
        }));
      })
    })
    async.series(tasks, function(){
      console.log("Finished");
    });
  })
})
