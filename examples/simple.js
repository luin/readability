var read = require('../src/readability');

read('http://colorlines.com/archives/2011/08/dispatch_from_angola_faith-based_slavery_in_a_louisiana_prison.html',
function(err, read) {
  var dom = read.document;
  var html = '<html><head><meta charset="utf-8"><title>'+dom.title+'</title></head><body><h1>'+read.title+'</h1>'+read.content+'</body></html>';
  console.log(html);
});
