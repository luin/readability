require('./mock-helpers.js');
var should = require('should');
var read = require('../src/readability');

describe('parameters', function() {
  describe('html', function() {
    it('should accept a html', function(done) {
      read('<html><body>Hello world!</body></html>', function(err, read) {
        read.document.body.innerHTML.should.include('Hello world!');
        done();
      });
    });

    it('should not resolve the url', function(done) {
      read('<html><body><img src="image.png"></a></body></html>', function(err, read) {
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

    describe('preprocess', function() {
      it('should preprocess document', function(done) {
        read('http://colorlines.com/archives/2011/08/dispatch_from_angola_faith-based_slavery_in_a_louisiana_prison.html',
          {
            preprocess: function(source, response, content_type, callback) {
              should.exist(source);
              source.length.should.equal(50734);
              should.exist(response);
              should.exist(response.headers);
              should.exist(content_type);
              should.exist(content_type.charset);
              callback(null, '<html><head><title>some other title</title></head><body></body></html>');
            }
          },
          function(err, read) {
            should.not.exist(err);
            should.exist(read);
            read.title.should.equal('some other title')
            read.content.should.equal(false);
            done();
          });
      });

      it('should stop processing document', function(done) {
        read('http://www.whitehouse.gov/', {
          preprocess: function(source, response, content_type, callback) {
            should.exist(source);
            source.length.should.equal(71002);
            should.exist(response);
            should.exist(response.headers);
            should.exist(content_type);
            should.exist(content_type.charset);
            callback(new Error('stop'));
          }
        }, function(err, read) {
          should.not.exist(read);
          should.exist(err);
          err.message.should.equal('stop');
          done();
        });
      });

    });

  });
});
