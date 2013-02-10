var async = require("async")
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
  var self = this;
  var setupTasks = [
    function(next){
      self.getDefaultBranchSha(function(err, defaultBranchSha){
       next(err, defaultBranchSha)
      })
    },
    function(next){
      self.getOpenPullRequestNum(function(err,nums){
        next(err, nums)
      });
    }
  ]
  async.series(setupTasks, function(err, result){
    self._getConflictedIssues(result[0], result[1], callback)
  });
}
Conflict.prototype._getConflictedIssues = function(defaultBranchSha, nums, callback){
  var tasks = [];
  var self = this;
  var issuesResult = {};
  nums.forEach(function(num){
    tasks.push(function(next){
      self.hasIssueMergeSha(num, defaultBranchSha, function(err, hasSha){
        issuesResult[num] = hasSha;
        next(err);
      })
    });
  });
  async.series(tasks, function(err, result){
    callback(err, issuesResult);
  });
}
Conflict.prototype.getOpenPullRequestNum = function(callback){
  var msg = this.msg();
  this.github.pullRequests.getAll(msg,function(err,issues){
    var nums = [];
    issues.forEach(function(issue){
      if(issue.state == "open"){
        nums.push(issue.number);
      }
    })
    callback(err, nums);
  });
}

Conflict.prototype.getDefaultBranchSha = function(callback){
  var self = this;
  var msg = this.msg();
  self.github.repos.get(msg, function(err, result){
    var refMsg = self.msg();
    refMsg.ref = "heads/" + result.default_branch;
    self.github.gitdata.getReference(refMsg, function(err, ref){
     callback(err, ref.object.sha);
    });
  })
}

Conflict.prototype.hasIssueMergeSha = function(num, sha, callback){
  this.issuesMergeSha(num, function(err, parentsSha){
    var hasSha = false;
    parentsSha.forEach(function(_sha){
      if(_sha == sha){
        hasSha = true;
        return;
      }
    });
    callback(err, hasSha);
  });
}
// get ref number's merged parents sha
Conflict.prototype.issuesMergeSha = function(num, callback){
  var self = this
  var msg = this.msg();
  msg.ref = "pull/"+ num + "/merge";
  self.github.gitdata.getReference(msg,function(err, repo){
    var comMsg = self.msg();
    comMsg.sha = repo.object.sha;
    self.github.gitdata.getCommit(comMsg, function(err, repo){
      var parentsSha = [];
      repo.parents.forEach(function(parent){
        parentsSha.push(parent.sha);
      })
      callback(err, parentsSha);
    })
  });
}
