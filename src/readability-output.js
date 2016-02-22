var jsdom = require('jsdom');
var request = require('request');
var helpers = require('./readability-processor');
var encodinglib = require("encoding");
var urllib = require('url');

function _findHTMLCharset(htmlbuffer) {

  var body = htmlbuffer.toString("ascii"),
    input, meta, charset;

  if (meta = body.match(/<meta\s+http-equiv=["']content-type["'][^>]*?>/i)) {
    input = meta[0];
  }

  if (input) {
    charset = input.match(/charset\s?=\s?([a-zA-Z\-0-9]*);?/);
    if (charset) {
      charset = (charset[1] || "").trim().toLowerCase();
    }
  }

  if (!charset && (meta = body.match(/<meta\s+charset=["'](.*?)["']/i))) {
    charset = (meta[1] || "").trim().toLowerCase();
  }

  return charset;
}

function _parseContentType(str) {
  if (!str) {
    return {};
  }
  var parts = str.split(";"),
    mimeType = parts.shift(),
    charset, chparts;

  for (var i = 0, len = parts.length; i < len; i++) {
    chparts = parts[i].split("=");
    if (chparts.length > 1) {
      if (chparts[0].trim().toLowerCase() == "charset") {
        charset = chparts[1];
      }
    }
  }

  return {
    mimeType: (mimeType || "").trim().toLowerCase(),
    charset: (charset || "UTF-8").trim().toLowerCase() // defaults to UTF-8
  };
}

function read(html, callback) {
  //Added Custom header in default option of Request Module
  var options = {
    url: html,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36'
    }
  };
  var overrideEncoding = options.encoding;
  var preprocess = options.preprocess;

  options.encoding = null;
  delete options.preprocess;

  var parsedURL = urllib.parse(html);
  if (['http:', 'https:', 'unix:', 'ftp:', 'sftp:'].indexOf(parsedURL.protocol) === -1) {
    jsdomParse(null, null, html);
  } else {
    request(options, function (err, res, buffer) {
      if (err) {
        return callback(err);
      }
      var redirection = false;
      if (options.url != res.request.uri.href) {
        redirection = true;
      }
      if (res.statusCode >= 200 && res.statusCode < 300) {
        var content_type = _parseContentType(res.headers['content-type']);

        if (content_type.mimeType == "text/html") {
          content_type.charset = _findHTMLCharset(buffer) || content_type.charset;
        }

        content_type.charset = (overrideEncoding || content_type.charset || "utf-8").trim().toLowerCase();

        if (!content_type.charset.match(/^utf-?8$/i)) {
          buffer = encodinglib.convert(buffer, "UTF-8", content_type.charset);
        }

        buffer = buffer.toString();

        if (preprocess) {
          preprocess(buffer, res, content_type, function (err, buffer) {
            if (err) return callback(err);
            jsdomParse(null, res, buffer, redirection);
          });
        } else {
          jsdomParse(null, res, buffer, redirection);
        }
      } else {
        err = new Error();
        err.status = 404;
        return callback(err);
      }
    });
  }

  function jsdomParse(error, meta, body, redirection) {
    if (error) {
      console.log(error);
      return callback(error);
    }
    if (typeof body !== 'string') body = body.toString();
    if (!body) {
      var err = new Error('Empty story body returned from URL');
      err.status = 204
      return callback(err);
    }
    jsdom.env({
      html: body,
      done: function (errors, window) {
        if (meta) {
          window.document.originalURL = meta.request.uri.href;
        } else {
          window.document.originalURL = null;
        }
        if (errors) {
          window.close();
          return callback(errors);
        }
        if (!window.document.body) {
          window.close();
          var err = new Error('No body tag was found.');
          err.status = 204
          return callback(err);
        }
        try {
          var readability_procesor = new helpers.ReadabilityProcessor(window, options);
          // add meta information to callback
          var obj = readability_procesor.parse();
          if (!obj) {
            readability_procesor.close();
            var err = new Error('Unable to parse');
            err.status = 204
            return callback(err);
          }
          obj.redirection = redirection;
          readability_procesor.close();
          callback(null, obj, meta);
        } catch (ex) {
          window.close();
          return callback(ex);
        }
      }
    });
  }
}
module.exports = read;
module.exports.read = function () {
  console.warn('`readability.read` is deprecated.');
  return read.apply(this, arguments);
};