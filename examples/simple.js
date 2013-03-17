var readability = require('../src/readability')

// uncoment the following line to print the debug info to console.
// readability.debug(true);


readability.read('http://www.theverge.com/2013/3/17/4113714/60-minutes-jack-dorsey-profile-on-cbs-tonight',
function(err, read) {
  var dom = read.getDocument();
  var html = '<html><head><meta charset="utf-8"><title>'+dom.title+'</title></head><body><h1>'+read.getTitle()+'</h1>'+read.getContent()+'</body></html>';
  console.log(html);
});
