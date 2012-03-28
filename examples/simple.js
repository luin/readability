var readability = require('../src/readability');


readability.debug(true);

readability.read('http://howtonode.org/really-simple-file-uploads', function(err, read) {
  console.log(read.getContent());
  console.log(read.getTitle());
});