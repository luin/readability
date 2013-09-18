var readability = require('../src/readability')
  , helpers = require('../src/helpers')
  , jsdom = require( 'jsdom' )
  , noBody = '<html><head><title>hi</title></head>hi!</html>'; 
require('should');

describe('node-readability', function () {
  it('should get document', function (done) {
    readability.read('http://colorlines.com/archives/2011/08/dispatch_from_angola_faith-based_slavery_in_a_louisiana_prison.html', function(err, read) {
      if (err) return done(err);
      var dom = read.getDocument();
      var html = '<html><head><meta charset="utf-8"><title>'+dom.title+'</title></head><body><h1>'+read.getTitle()+'</h1>'+read.getContent()+'</body></html>';
      html.should.include('<title>Dispatch From Angola: Faith-Based Slavery in a Louisiana Prison - COLORLINES</title>');
      done();
    });
  });
  it('should get document with frames', function (done) {
    readability.read('http://www.whitehouse.gov/', function(err, read) {
      if (err) return done(err);
      var dom = read.getDocument();
      read.getTitle().should.equal('The White House');
      done();
    });
  });
  it('should handle the html that missing body tag', function (done) {
    readability.read(noBody, function (err, read) {
      err.message.should.equal('No body tag was found.');
      done();
    });
  });
  it('should let helpers.grabArticle handle html that\'s missing a body tag', function (done) {
    jsdom.env(noBody, [], function (errors, window) {
      var err = helpers.grabArticle(window.document);
      err.message.should.equal('No body tag was found.');
      done();
    });
  });
});
