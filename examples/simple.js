var readability = require('../src/readability')
  , fs = require('fs')

// uncoment the following line to print the debug info to console.
// readability.debug(true);


readability.read('http://colorlines.com/archives/2011/08/dispatch_from_angola_faith-based_slavery_in_a_louisiana_prison.html',
function(err, read) {
  var dom = read.getDocument();
  var html = '<html><head><meta charset="utf-8"><title>'+dom.title+'</title></head><body><h1>'+read.getTitle()+'</h1>'+read.getContent()+'</body></html>';
  console.log(html);
});
