var readability = require('../src/readability')
  , should = require('should');

// uncoment the following line to print the debug info to console.
// readability.debug(true);


describe('node-readability', function () {

  it('should get document', function (done) {
    readability.read('http://colorlines.com/archives/2011/08/dispatch_from_angola_faith-based_slavery_in_a_louisiana_prison.html', function(err, read) {
      if (err) return done(err)
      var dom = read.getDocument();
      var html = '<html><head><meta charset="utf-8"><title>'+dom.title+'</title></head><body><h1>'+read.getTitle()+'</h1>'+read.getContent()+'</body></html>';
      html.should.include('<title>Dispatch From Angola: Faith-Based Slavery in a Louisiana Prison - COLORLINES</title>')
      done()
    });
  });

  // @todo: Find the real edge case for this issue
  it('should get document at http://www.theverge.com/2013/3/17/4113714/60-minutes-jack-dorsey-profile-on-cbs-tonight', function (done) {
    readability.read('http://www.theverge.com/2013/3/17/4113714/60-minutes-jack-dorsey-profile-on-cbs-tonight', function(err, read) {
      if (err) return done(err)
      var dom = read.getDocument();
      var html = '<html><head><meta charset="utf-8"><title>'+dom.title+'</title></head><body><h1>'+read.getTitle()+'</h1>'+read.getContent()+'</body></html>';
      html.should.include('<title>\'60 Minutes\' profile of Twitter creator Jack Dorsey airing tonight at 7PM ET/PT | The Verge</title>')
      done()
    });
  })
});
