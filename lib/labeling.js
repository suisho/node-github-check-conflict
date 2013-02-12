var conflict = require("./check-conflict");
var edit = require("./edit-issue");
var async = require("async");


module.exports = function(github, repo, user, label, callback){
  conflict(github, user, repo, function(err, result){
    var issueNums = Object.keys(result);
    var tasks = [];
    issueNums.forEach(function(num){
      tasks.push(function(next){
        var issue = {
          user : user,
          repo : repo,
          number : num
        };
        
        var func = function(repo){
          if(result[num]){
            repo.labels.push(label);
          }else{
            var index = repo.labels.indexOf(label);
            if(index > -1){
              repo.labels.splice(index,1);
            }
          }
          return repo;
        }
        edit(github, issue, func, function(err, executeEdit, result){
          var _result = {
            num : num,
            executeEdit : executeEdit,
            result : result
          }
          next(err,_result)
        });
      })
    })
    async.series(tasks, function(err, result){
      callback(err, result)
    });
  })
}
