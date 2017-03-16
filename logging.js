var fs = require('fs');
var util = require('util');
var dateFormat = require('dateformat');
var log_file = fs.createWriteStream('debug.log', {flags : 'a'});
var log_stdout = process.stdout;

// Override console.log so that it writes both to console and a log file
console.log = function(input) {
  var date = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");

  var text = util.format('[%s] %s\n', date, input);
  log_file.write(text);
  log_stdout.write(text);
};