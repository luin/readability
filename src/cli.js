#!/usr/bin/env iojs
var read = require("./readability.js");
var argv = require("minimist")(process.argv.slice(2));

if(argv.h){
  process.stdout.write(
    "luin readability\n" +
    "Usage: readability --url [URL] " +
    "prints readability version of [URL].\n" +
    "Usage: readability             " +
    "reads HTML from stdin and prints readable version to stdout.\n" +
    "Usage: readability --content   " +
    "prints article.content.\n" +
    "Usage: readability -h          " +
    "prints this help.\n"
  );
  return;
}

var callback = function(err, article){
  if(err)
    console.error(err);
  if (argv.content) {
    process.stdout.write(article.content);
  } else {
    process.stdout.write(article.html);
  }
}

if(typeof argv.url === 'string'){
  read(argv.url, callback);
} else {
  var html;
  process.stdin.on("data", function(chunk){
    html += chunk;
  });
  process.stdin.on("end", function(){
    read(html, callback);
  });
}
