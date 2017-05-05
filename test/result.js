require('./mock-helpers.js');
var read = require('../src/readability-output');
var should = require('should');

describe('result', function () {
  it('should return the result', function (done) {
    read('http://colorlines.com/archives/2011/08/dispatch_from_angola_faith-based_slavery_in_a_louisiana_prison.html', function (err, read) {
      var html = '<html><head><meta charset="utf-8"><title>' + read.title + '</title></head><body><h1>' + read.title + '</h1>' + read.content + '</body></html>';
      html.should.include('<title>Dispatch From Angola: Faith-Based Slavery in a Louisiana Prison');
      done();
    });
  });

  it('should get document with frames', function (done) {
    read('http://www.whitehouse.gov/', function (err, read) {
      should.not.exist(err);
      should.exist(read);
      read.title.should.equal('The White House');
      done();
    });
  });
  it('should handle URL', function (done) {
    read('https://campustechnology.com/articles/2016/02/10/new-textbook-liberation-fund-will-help-faculty-ditch-high-priced-textbooks.aspx', function (err, read) {
      should.not.exist(err);
      should.exist(read);
      done();
    });
  });
  it('should work with NYTimes and accept cookie and redirection', function (done) {
    read('https://www.nytimes.com/2017/04/15/world/middleeast/syria-bashar-al-assad-evidence.html?hp&action=click&pgtype=Homepage&clickSource=story-heading&module=photo-spot-region&region=top-news&WT.nav=top-news&_r=0', function (err, read) {
      should.not.exist(err);
      should.exist(read);
      done();
    });
  });
});