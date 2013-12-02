var read = require('../src/readability');
var helpers = require('../src/helpers');
var jsdom = require( 'jsdom' );
var noBody = '<html><head><title>hi</title></head>hi!</html>';
require('should');

describe('node-readability', function () {
  it('should get document', function (done) {
    read.read('http://colorlines.com/archives/2011/08/dispatch_from_angola_faith-based_slavery_in_a_louisiana_prison.html', function(err, read) {
      if (err) return done(err);
      var dom = read.document;
      var html = '<html><head><meta charset="utf-8"><title>'+dom.title+'</title></head><body><h1>'+read.title+'</h1>'+read.content+'</body></html>';
      html.should.include('<title>Dispatch From Angola: Faith-Based Slavery in a Louisiana Prison - COLORLINES</title>');
      done();
    });
  });
  it('should get document with frames', function (done) {
    read('http://www.whitehouse.gov/', function(err, read) {
      if (err) return done(err);
      var dom = read.document;
      read.title.should.equal('The White House');
      done();
    });
  });
  it('should handle the html that missing body tag', function (done) {
    read(noBody, function (err, read) {
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
