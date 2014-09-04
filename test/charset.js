require('./mock-helpers.js');
var read = require('../src/readability');

describe('charset', function () {
  describe('setted in the html', function() {
    it('should convert the page to utf-8', function(done) {
      read('http://tech.sina.com.cn/it/2014-01-16/04049100515.shtml', function(err, read) {
        read.content.should.include('谷歌');
        read.title.should.include('谷歌');
        done();
      });
    });
  });
});
