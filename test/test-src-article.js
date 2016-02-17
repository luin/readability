var readInternal = require('../src/readability');
var helpers = require('../src/helpers');
var XLSX = require('XLSX');
var jsdiff = require('diff');
var request = require('request');
var parseString = require('xml2js').parseString;
var categoryFile = require('../test/category.json');
var async = require('async');

var readability = require('readability-api');

readability.configure({
  consumer_key: 'kashifeqbal',
  consumer_secret: '7DafchS4eRPnyCBSAp2u6H8eybbm9FWW',
  parser_token: 'f24a39ddc5d705ce79993948f86cb65bcde0d709'
});

/* 
  --------Readability Score--------
  Total Score 70 with Image
  
  ***Custom***
  
  ***Custom***
  --------Readability Score--------
*/
var ws_name = "SheetJS";
var categories = categoryFile.NewsCategories.ProfessionalCatList;
var dataMain = [["src", "URL", "hasTitle", "titleMatched", "hasImage", "hasAuthor", "hasContent", "hasReadableParsed", "score"]];
var runTest = function () {
  var XMLPath = "sources.xml";
  var rawJSON = loadXMLDoc(XMLPath, function (err, result) {
    if (err) {
      console.log(err);
      return err;
    }
    async.eachSeries(result.Sources.item, function (item, mainCallback) {
      console.log(item);
      var rowItem = [];
      var url = item.link[0];
      var title = item.title[0];
      var src = item.src[0];
      async.series([
        function (seriesCallback) {
          console.log("Series First Function");
          readInternal(url, function (err, read) {
            if (err) {
              console.log("Read Internal Series ERR");
              console.log(err);
              return seriesCallback(err);
            }
            return seriesCallback(null, read);
          });
        },
        function (seriesCallback) {
          console.log("Series second Function");
          var parser = new readability.parser();
          parser.parse(url, function (err, parsed) {
            if (err) {
              console.log("Read External Series ERR");
              console.log(err);
              return seriesCallback(err);
            }
            return seriesCallback(null, parsed);
          });
        }], function (err, result) {
        console.log("InnerLoop Series final callback start here");
        if (err) {
          dataMain.push([src, url, false, false, false, false, false, false, 0]);
          console.log("Series Function Error...");
          console.log(err);
          return mainCallback(null);
        }
        console.log("title: " + title);
        var parsed = result[1];
        var read = result[0];
        if (!read) {
          dataMain.push([src, url, false, false, false, false, false, false, 0]);
          console.log("Read object is undefined");
          return mainCallback(null);
        }
        //Initially Checking Image cause it will take time to download and then Score calcualtion will start
        checkImage(read.image, function (isImageValid, functionScore) {
          console.log("ImageValidity: " + isImageValid);
          var hasTitle = false;
          if (read.title && read.title != '') {
            hasTitle = true;
            var titleMatched = false;
            if (compareTitle(title, read.title)) {
              titleMatched = true;
            }
          }
          var hasAuthor = false;;
          if (read.author && read.author != '') {
            hasAuthor = true;
          }
          var hasContent = false;
          var rex = /(<([^>]+)>)/ig;
          if (typeof read.content == "string") {
            var strContent = (read.content).replace(rex, "").trim();
          } else {
            strContent = '';
          }
          if (strContent.length > 10) {
            hasContent = true;
          }
          var hasReadableParsed = false;
          if (parsed) {
            hasReadableParsed = true;
          }
          var score = 0;
          if (titleMatched) {
            score += 25;
          }
          if (hasTitle) {
            score += 5;
          }
          if (hasAuthor) {
            score += 15;
          }
          score += Math.min(Math.floor(strContent.length / 100), 10);
          dataMain.push([src, url, hasTitle, titleMatched, isImageValid, hasAuthor, hasContent, hasReadableParsed, score]);
          console.log("InnerCallback Function Called in next line...");
          return mainCallback(null);
        });
      });
    }, function done(err) {
      if (err) {
        console.log(err);
      }
      processData(dataMain);
      console.log("Complete Loop ends Here");
    });
  });
}();
var generateData = function (callback) {
  var data = [["S.no.", "Category", "Domain", "URL", "hasTitle", "titleMatched", "hasImage", "hasAuthor", "hasContent", "score"]];
  for (var i = 0; i < categories.length; i++) {
    var category = categories[i];
    var processUrl = function (callback) {
      request('http://synd.qiosk.com/rss/?pgSize=25&catidlist=' + category.Id + '&f=1&pg=0', function (error, response, body) {
        if (error) {
          console.log(error);
        } else {
          parseString(body, function (err, result) {
            if (err) {
              console.log(err);
            } else {
              result.rss.channel[0].item.forEach(function (obj, index) {
                var rowItem = [];
                var url = obj.link_orig[0];
                var title = obj.title[0];
                var desc = obj.description[0];
                readInternal(url, function (err, read) {
                  if (err) {
                    console.log(err);
                    return;
                  }
                  // Create a parser object 
                  var parser = new readability.parser();
                  parser.parse(url, function (err, parsed) {
                    if (!parsed) {
                      //Initially Checking Image cause it will take time to download and then Score calcualtion will start
                      //Scoring on image -- Max Score 20
                      checkImage(read.image, function (isImageValid, functionScore) {
                        var score = 0;
                        score = score + functionScore;
                        //Scoring on title -- Max Score 30
                        var hasTitle = false;
                        if (read.title && read.title != '') {
                          hasTitle = true;
                          score += 10;
                          var titleMatched = false;
                          if (compareTitle(title, read.title)) {
                            score += 10;
                            titleMatched = true;
                          }
                          if (read.title.length > parsed.title.length) {
                            score += 10;
                          }
                        }
                        //Scoring on author -- Max Score 10
                        var hasAuthor = false;;
                        if (read.author && read.author != '') {
                          hasAuthor = true;
                          score += 10;
                        }
                        //Scoring on content -- Max Score 10
                        var hasContent = false;

                        var rex = /(<([^>]+)>)/ig;
                        var strContent = (read.content).replace(rex, "").trim().length;
                        var strParsedContent = (parsed.content).replace(rex, "").trim().length;
                        if (strContent > strParsedContent && strContent > desc.length) {
                          score += 10;
                          hasContent = true;
                        }
                        console.log(score);
                        if (isImageValid) {
                          console.log(score / 70 * 100);
                        } else {
                          console.log(score / 60 * 100);
                        }
                        data.push([index, category.Name, domain, url, hasTitle, titleMatched, isImageValid, hasAuthor, hasContent, score]);
                      });
                    }
                  });
                });
              });
            }
          });
        };
      });
    }(addData);
    console.log(category);
    break;
  }
  callback(data);
};

function loadXMLDoc(filePath, jsonCallback) {
  var fs = require('fs');
  var xml2js = require('xml2js');
  var json;
  try {
    var fileData = fs.readFileSync(filePath, 'ascii');
    var parser = new xml2js.Parser();
    parser.parseString(fileData.substring(0, fileData.length).replace(/[\n\r]/g, '\\n').replace(/&/g, "&amp;").replace(/-/g, "&#45;"),
      function (err, result) {
        if (err) {
          jsonCallback(err);
        }
        console.log("File '" + filePath + "/ was successfully read.\n");
        jsonCallback(null, result);
      });
    return json;
  } catch (ex) {
    console.log(ex)
    jsonCallback(ex);
  }
}

function processData(data) {
  console.log(data);
  var wb = new Workbook();
  var ws = sheet_from_array_of_arrays(data);
  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;

  /* write file */
  XLSX.writeFile(wb, 'test.xlsx');
}

function checkImage(imgUrl, callback) {
  var score = 0
  var url = imgUrl;
  var magic = {
    jpg: 'ffd8ffe0',
    png: '89504e47',
    gif: '47494638'
  };
  var options = {
    method: 'GET',
    url: url,
    encoding: null // keeps the body as buffer
  };
  if (imgUrl && imgUrl != '') {
    score += 10;
    request(options, function (err, response, body) {
      if (err) {
        console.log(err);
        return callback(false, 0);
      }
      if (!err && response.statusCode == 200) {
        var magigNumberInBody = body.toString('hex', 0, 4);
        if (magigNumberInBody == magic.jpg ||
          magigNumberInBody == magic.png ||
          magigNumberInBody == magic.gif) {
          return callback(true, score + 10);
        } else {
          return callback(false, 0);
        }
      } else {
        return callback(false, 0);
      }
    });
  } else {
    return callback(false, 0);
  }

}

function compareTitle(title_one, title_two) {
  title_one = title_one.trim().replace(/[^A-Za-z\d\s]/g, '').trim().replace(/\s+/g, ' ').trim();
  title_two = title_one.trim().replace(/[^A-Za-z\d\s]/g, '').trim().replace(/\s+/g, ' ').trim();
  var diffs = jsdiff.diffChars(title_one, title_two);
  for (var i = 0; i < diffs.length; i++) {
    var diff = diffs[i];
    if (!diff.hasOwnProperty("added") || !diff.hasOwnProperty("removed")) {
      var matchTitleCount = title_two.length > title_one.length ? title_one.length : title_two.length;
      if (diff.count == matchTitleCount) {
        return true;
      }
    }
  }
  return false;
}

function datenum(v, date1904) {
  if (date1904) v += 1462;
  var epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
  var ws = {};
  var range = {
    s: {
      c: 10000000,
      r: 10000000
    },
    e: {
      c: 0,
      r: 0
    }
  };
  for (var R = 0; R != data.length; ++R) {
    for (var C = 0; C != data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;
      var cell = {
        v: data[R][C]
      };
      if (cell.v == null) continue;
      var cell_ref = XLSX.utils.encode_cell({
        c: C,
        r: R
      });

      if (typeof cell.v === 'number') cell.t = 'n';
      else if (typeof cell.v === 'boolean') cell.t = 'b';
      else if (cell.v instanceof Date) {
        cell.t = 'n';
        cell.z = XLSX.SSF._table[14];
        cell.v = datenum(cell.v);
      } else cell.t = 's';

      ws[cell_ref] = cell;
    }
  }
  if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
  return ws;
}

function Workbook() {
  if (!(this instanceof Workbook)) return new Workbook();
  this.SheetNames = [];
  this.Sheets = {};
}