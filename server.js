var express = require('express'),
    queries = require('./app/queries');

var app = express();

app.use(express.static(__dirname + '/public'));

// ---- add stuff here! -----



// --------------------------

app.listen(3000, function() {
    console.log('Running!');
});
