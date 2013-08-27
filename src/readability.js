var cheerio = require('cheerio');
var fetchUrl = require('fetch').fetchUrl;

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
        if (error) {
            return callback(error);
        }

        if (typeof body !== 'string') body = body.toString();

        var $ = cheerio.load(body);
        if (!$) {
            callback(new Error('parse html error'), null);
        } else {
            callback(null, $);
        }
    }
}

module.exports.read = read;
