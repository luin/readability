require('./mock-helpers.js');
var read = require('../src/readability-output');
var should = require('should');

describe('Error, Redirection and image test', function () {
  it('should give error - page not found', function (done) {
    read('http://www.ihsmaritime360.com/article/17325/jes-international-still-in-red-for-2014', function (err, read) {
      err.status.should.be.within(400, 511);
      done();
    });
  });
  it('should give error - page not found', function (done) {
    read('http://www.theepochtimes.com/n3/1305716-live-in-a-porsche-designer-labels-draw-miami-home-buyers/', function (err, read) {
      err.status.should.be.within(400, 511);
      done();
    });
  });
  it('should give error - page not found', function (done) {
    read('http://www.rewmag.com/Article.aspx?article_id=183411', function (err, read) {
      err.status.should.be.within(400, 511);
      done();
    });
  });
  it('should redirect', function (done) {
    read('https://www.nytimes.com/2017/04/15/world/middleeast/syria-bashar-al-assad-evidence.html?hp&action=click&pgtype=Homepage&clickSource=story-heading&module=photo-spot-region&region=top-news&WT.nav=top-news&_r=0', function (err, read) {
      read.redirection.should.be.equal(true);
      done();
    });
  });
  it('should have image', function (done) {
    read('http://www.bakingbusiness.com/articles/news_home/Financial-Performance/2015/04/Gourmet_brands_boost_Barry_Cal.aspx?ID=%7BAEDD6EC2-3D41-49C0-9CB7-27E9BF7EC9F6%7D', function (err, read) {
      should.exist(read.lead_image_url);
      done();
    });
  });
  it('should', function (done) {
    read('http://feedproxy.google.com/~r/BpsResearchDigest/~3/ZESlk0ICMwk/sexual-arousal-has-similar-effect-on.html', function (err, read) {
      should.exist(read);
      done();
    });
  });
});