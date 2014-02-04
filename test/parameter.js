require('./mock-helpers.js');
var read = require('../src/readability');

describe('parameters', function () {
  describe('html', function() {
    it('should accept a html', function(done) {
      read('<html><body>Hello world!</body></html>', function(err, read) {
        read.document.body.innerHTML.should.include('Hello world!');
        done();
      });
    });

    it('should throw when missing body tag', function (done) {
      read('<html><head><title>hi</title></head>hi!</html>', function (err, read) {
        err.message.should.equal('No body tag was found.');
        done();
      });
    });

    it('should not resolve the url', function(done) {
      read('<html><body><img src="image.png"></a></body></html>', function(err, read){
        read.document.body.innerHTML.should.include('src="image.png"');
        done();
      });
    });
  });

  describe('options', function() {
    it('should pass the options to request lib', function(done) {
      read('http://dribbble.com/', {
        method: 'POST'
      }, function(err, read) {
        read.document.body.innerHTML.should.include('redirected');
        done();
      });
    });

  });
});


