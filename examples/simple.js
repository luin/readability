var readability = require('../src/readablity');


readability.debug(true);

readability.read('http://howtonode.org/really-simple-file-uploads', function(err, read) {
  console.log(read.getArticleContent());
  console.log(read.getArticleTitle());
});