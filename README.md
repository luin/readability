# node-readability

node-readability的cheerio版。支持GBK、GB2312等编码的网页抓取和解析。Turn any web page into a clean view. This module is based on arc90's readability project.

## Install

    npm install node-readability-cheerio

## Usage

    readability.read(html [, options], callback)

Where

  * **html** url or html code.
  * **options** is an optional options object
  * **callback** is the callback to run - `callback(error, $)`

Example

    var readability = require('node-readability-cheerio');

    readability.read('http://howtonode.org/really-simple-file-uploads', function(err, $) {
        console.log($('body').html());
    });

More about '$': https://github.com/MatthewMueller/cheerio#selectors

**NB** If the file has been marked with charset other than utf-8, it is converted automatically. Charsets such as GBK, GB2312 is also supported via [iconv](https://github.com/bnoordhuis/node-iconv).

## Options

node-readability support all the options that [fetch](https://github.com/andris9/fetch) support.

Possible option values

 * **maxRedirects** how many redirects allowed, defaults to 10
 * **disableRedirects** set to true if redirects are not allowed, defaults to false
 * **headers** optional header fields, in the form of `{'Header-Field':'value'}`
 * **maxResponseLength** maximum allowed length for the file, the remainder is cut off. Defaults to `Infinity`
 * **method** defaults to GET
 * **payload** request body
 * **disableGzip** set to false, to disable content gzipping, needed for Node v0.5.9 which has buggy zlib
 * **cookies** an array of cookie definitions in the form of `['name=val']`
 * **cookieJar** for sharing cookies between requests, see below
 * **outputEncoding**
 * **disableDecoding** set to true to disable automatic charset decoding to utf-8
 * **overrideCharset** set input encoding
 * **asyncDnsLoookup** use high performance asynchronous DNS resolution based on c-ares instead of a thread pool calling getaddrinfo(3)
 * **timeout** set a timeout in ms
 * **agent** pass-through http.request agent parameter

## License

This code is under the Apache License 2.0.  http://www.apache.org/licenses/LICENSE-2.0
