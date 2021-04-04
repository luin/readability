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
    ],
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
  },
  {
    fixture: 'douban-group-topic',
    title: '半年面试了上百人，经验总结。。',
    include: [
      '看到组里很多初出社会的小伙伴愁工作的事，我想给大家讲一讲个人的经验，希望尽量给大家一点帮助，少走一点弯路',
      '其他就不一一列举了，重点是展示出【高匹配度】',
      '最近工作遇到瓶颈，毕竟不会一直一帆风顺，调整好了之后会继续分享经验的，谢谢大家这么久的关注。',
    ],
    notInclude: [
      '最赞回应',
      '最新话题',
      '北京豆网科技有限公司',
    ],
  },
  {
    fixture: 'ifeng',
    title: '熊玲:什么样的婚姻才是鸡肋婚姻？',
    include: [
      '沃尔沃“憋”不住了，最高狂降8万，性能不输BBA，白菜价愣没人',
      '打开APP',
    ],
    notInclude: [
      '它是“迷恋婚姻又排拒婚姻”的一种复杂婚姻情感心理状态。它意味着即便你有千条理由走出婚姻，背后却有万种吸引力把你留在围城里。',
      '在婚姻十字路口的人，你若要想你们的关系和好如初，就必须有重修婚姻的姿态，即必须有妥协的态度。',
      '重修婚姻的办法很多很多，但最简单也是最核心的办法只有一个，那就是接受。',
    ],
  },
  {
    fixture: 'ifeng',
    title: '熊玲:什么样的婚姻才是鸡肋婚姻？',
    include: [
      '它是“迷恋婚姻又排拒婚姻”的一种复杂婚姻情感心理状态。它意味着即便你有千条理由走出婚姻，背后却有万种吸引力把你留在围城里。',
      '在婚姻十字路口的人，你若要想你们的关系和好如初，就必须有重修婚姻的姿态，即必须有妥协的态度。',
      '重修婚姻的办法很多很多，但最简单也是最核心的办法只有一个，那就是接受。',
    ],
    notInclude: [
      '沃尔沃“憋”不住了，最高狂降8万，性能不输BBA，白菜价愣没人',
      '打开APP',
    ],
    options: {
      candidateFilters: [
        function (candidateNode) {
          if (candidateNode.tagName === 'ARTICLE' && candidateNode.getAttribute('type') === 'video') {
            return false;
          }

          return true;
        }
      ],
    },
  }].forEach(function(testCase) {
    it('can extract ' + testCase.fixture + ' articles', function(done) {
      var html = fs.readFileSync(articleFixtures + '/' + testCase.fixture + '.html').toString();
      read(html, testCase.options || {}, function(error, article) {
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
