var request = require('request')
var util = require('util')
module.exports = function(baseUrl, baseOptions){
  return new Api(baseUrl, baseOptions);
}

//後方互換性維持
module.exports.backward = function(github, baseOptions){
  var conf = github.config;
  var token = github.auth.token;
  var url = conf.protocol + "://"+conf.host+conf.url;
  return new Api(url,opt);
}


function Api(baseUrl, baseOptions){
  this.baseUrl = baseUrl.replace(/\/$/,"");
  this.baseOptions = baseOptions;
}

var placeHolder = function(path, options){
  if(options.query){
    //processing placeholder
    Object.keys(options.query).forEach(function(q){
      path = path.replace(":"+q, options.query[q])
    })
  }
  return path
}

var extendOption = function(baseOption, extendOption){
  
}

Api.prototype.get = function(path, options, callback){
  var params = request.initParams("", options, callback)
  path = path.replace(/^\//,"");
  path = placeHolder(path, options);
  option = extendOption(baseOptions, options)
  var url  = this.baseUrl + "/" + path
  params.url = url;
  params.options.url = url;
  request.get(params.url, params.options, params.callback)
}

