var fs = require("fs")
var conf;
try{
  conf = require("./config");
}catch(e){
  var GithubApi = require("github");
  conf = {
    user : "suisho",
    repo : "sandbox",
    github : new GithubApi({
      version: "3.0.0"
      ,debug : true
    })
  }
}
describe(' what?', function () {
  this.timeout(50000)
  it(' conflicted issues', function (done) {
    var conflict = require("../index.js");
    conflict(conf.github, conf.user, conf.repo, function(err, result){
      console.log(result)
      done();
    })
  });
});
