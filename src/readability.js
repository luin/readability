var jsdom = require('jsdom'),
  fetchUrl = require("fetch").fetchUrl,
  helpers = require('./helpers')

exports.debug = function (debug) {
  helpers.debug(debug);
};

exports.debug(false);

function Readablity(document, options) {
  this._document = document;
  this.iframeLoads = 0;
  // Cache the body HTML in case we need to re-use it later
  this.bodyCache = null;
  this._articleContent = '';

  this.cache = {};

  helpers.prepDocument(this._document);
  this.cache = {
    'body': this._document.body.innerHTML
  };
}

Readablity.prototype.getContent = function () {
  if (typeof this.cache['article-content'] !== 'undefined') {
    return this.cache['article-content'];
  }

  articleContent = helpers.grabArticle(this._document);
  if (helpers.getInnerText(articleContent, false) === "") {
    this._document.body.innerHTML = this.cache['body'];
    articleContent = helpers.grabArticle(this._document, true);
    if (helpers.getInnerText(articleContent, false) === "") {
      return this.cache['article-content'] = false;
    }
  }

  return this.cache['article-content'] = articleContent.innerHTML;
}

Readablity.prototype.getTitle = function () {
  if (typeof this.cache['article-title'] !== 'undefined') {
    return this.cache['article-title'];
  }

  var title = this._document.title;
  var betterTitle;
  var commonSeparatingCharacters = [' | ', ' _ ', ' - ', '«', '»', '—'];

  var self = this;
  commonSeparatingCharacters.forEach(function (char) {
    var tmpArray = title.split(char);
    if (tmpArray.length > 1) {
      if (betterTitle) return self.cache['article-title'] = title;
      betterTitle = tmpArray[0].trim();
    }
  });

  if (betterTitle && betterTitle.length > 10) {
    return this.cache['article-title'] = betterTitle;
  }

  return this.cache['article-title'] = title;
}

Readablity.prototype.getDocument = function () {
  return this._document;
}

Readablity.prototype.getHTML = function () {
  return this._document.getElementsByTagName('html')[0].innerHTML;
}

function read(html, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  if (html.indexOf('<') === -1) {
    fetchUrl(html, options, jsdomParse);
  } else {
    jsdomParse(null, null, html);
  }

  function jsdomParse(error, meta, body) {
    if (typeof body !== 'string') body = body.toString();
    jsdom.env({
      html: body,
      done: function (errors, window) {
        try {
          callback(null, new Readablity(window.document, options));
        } catch (e) {
          callback(e);
        }
      }
    });
  }
}

module.exports.read = read;