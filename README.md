# Readability
Turn any web page into a clean view. This module is based on arc90's readability project.

## Features
1. Optimized for more websites.
2. Supporting HTML5 tags(`article`, `section`) and Microdata API.
3. Focusing on both accuracy and performance. 4x times faster than arc90's version.
3. Supporting encodings such as GBK and GB2312.

## Install

    $ npm install node-readability-kashif

## Usage

`read(html [, options], callback)`

Where

  * **html** url or html code.
  * **callback** is the callback to run - `callback(error, article, meta)`

Example
```javascript
var read = require('node-readability');

read('http://howtonode.org/really-simple-file-uploads', function(err, article, meta) {
  // Main Article
  console.log(article.content);
  
  // Title
  console.log(article.title);
  
  //uri
  console.log(article.uri);
  
  //lead_image_url
  console.log(article.lead_image_url);
  
  //excerpt
  console.log(article.excerpt);
  
  //redirection -- boolean tells redirection is happening or not
  console.log(article.redirection);
  
  //Author
  console.log(article.byline);
  
  // Response Object from Request Lib
  console.log(meta);
});
read('http://howtonode.org/really-simple-file-uploads', function(err, article, meta) {
  if(err){
    console.log(err);
    if(err.status >= 400 && err.status < 511){
      console.log("Page not found");
    }
  }
});
```
**NB** If the page has been marked with charset other than utf-8, it will be converted automatically. Charsets such as GBK, GB2312 is also supported.

## article object

### content
The article content of the web page. Return `false` if failed.

### title
The article title of the web page. It's may not same to the text in the `<title>` tag.

### uri
The article uri of the web page.

### lead_image_url
The article main image of web page. Pick from meta tag og:image.
  
### excerpt
The article expert of web page.

### redirection 
boolean tells redirection is happening or not.

### Author
The article author of web page.


## meta object
response object from request lib. If you need to get current url after all redirect or get some headers it can be useful.



