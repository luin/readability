var readability = require('../src/readability');

// uncoment the following line to print the debug info to console.
// readability.debug(true);

readability.read('http://jb.qm120.com/', function (err, $) {
    console.log($('body').html());
});
