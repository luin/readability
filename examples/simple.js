var read = require('../src/readability');

read('http://colorlines.com/archives/2011/08/dispatch_from_angola_faith-based_slavery_in_a_louisiana_prison.html',
function(err, article, meta) {
  var dom = article.document;
  var html = '<html><head><meta charset="utf-8"><title>'+dom.title+'</title></head><body><h1>'+article.title+'</h1>'+article.content+'</body></html>';
  console.log(html);
  console.log(meta);
});
