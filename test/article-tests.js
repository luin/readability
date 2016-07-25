var fs = require('fs');
var should = require('should');
var read = require('../src/readability');

var articleFixtures = __dirname + '/fixtures';


describe('Regression Tests', function() {
  [{
    fixture: 'wikipedia',
    title: 'Readability',
    include: [
      '<b>Readability</b> is the ease with which a',
      'Writing for a class of readers other than one\'s own is very difficult.',
      'He also developed several new measures of cutoff scores.'
    ],
    notInclude: [
      'Donate to Wikipedia'
    ]
  },
  {
    fixture: 'mediashift',
    title: 'Columbia\'s Lede Program Aims to Go Beyond the Data Hype',
    include: [
      'This all began at Joe',
      'Big Data models and practices aren',
      'Data-driven journalism in larger contexts',
    ],
    notInclude: [
      'Self-Publishing Your Book: Where’s the Money',
      'About EducationShift',
    ],
  },
  {
    fixture: 'kayiprihtim',
    title: '"Çizgi Roman Uyarlamaları İnceleme Yarışması" Sonuçlandı',
    include: [
      'nice seneler diliyoruz',
      'roman sitelerinden',
    ],
    notInclude: ['Yorum', 'Kategoriler'],
  },
  {
    fixture: 'psychology-today',
    title: 'Do We Become Less Optimistic As We Grow Older?',
    include: [
      'It requires thinking about the future',
      'found that from early to late adulthood',
      'This discussion about age and optimism skirts',
    ],
    notInclude: [
      'You Might Also Like',
      'Most Popular',
    ],
  },
  {
    fixture: 'ux-milk',
    title: 'より良いCSSを書くための様々なCSS設計まとめ',
    include: [
      'CSSは誰でも簡単に自由に',
      'SMACSSでは、スタイル',
      'Scoped CSS自体は、CSS設',
      'どのCSS設',
    ],
    notInclude: [
      'Web制作の作業効率を格段にア',
      'ライフハック',
      '個人情報の取り扱いについて',
    ],
  }].forEach(function(testCase) {
    it('can extract ' + testCase.fixture + ' articles', function(done) {
      var html = fs.readFileSync(articleFixtures + '/' + testCase.fixture + '.html').toString();
      read(html, function(error, article) {
        if(error) {
          done(error)
        } else {
          article.title.should.equal(testCase.title);
          (testCase.include || []).forEach(function(content) {
            article.content.should.include(content);
          });
          (testCase.notInclude || []).forEach(function(content) {
            article.content.should.not.include(content);
          });
          done();
        }
      });
    }).timeout(4000);
  });
});
