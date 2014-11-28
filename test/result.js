require('./mock-helpers.js');
var read = require('../src/readability');

describe('result', function() {
  it('should return the result', function(done) {
    read('http://colorlines.com/archives/2011/08/dispatch_from_angola_faith-based_slavery_in_a_louisiana_prison.html',
      function(err, read) {
        var dom = read.document;
        var html = '<html><head><meta charset="utf-8"><title>' + dom.title +
          '</title></head><body><h1>' + read.title + '</h1>' + read.content + '</body></html>';
        html.should.include('<title>Dispatch From Angola: Faith-Based Slavery in a Louisiana Prison - COLORLINES</title>');
        read.close.should.be.a.Function
        read.close();
        done();
      });
  });

  it('should get document with frames', function(done) {
    read('http://www.whitehouse.gov/', function(err, read) {
      var dom = read.document;
      read.title.should.equal('The White House');
      read.close.should.be.a.Function
      read.close();
      done();
    });
  });

  it('should handle frames', function(done) {
    read('<html><body><frame /><frame />Hello world!</body></html>', function(err, read) {
      read.document.body.innerHTML.should.include('Hello world!');
      read.close.should.be.a.Function
      read.close();
      done();
    });
  });
});
