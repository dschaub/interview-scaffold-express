var express = require('express'),
    bodyParser = require('body-parser'),
    service = require('./app/service');

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));

// ---- add stuff here! -----

app.post('/signup', function(req, res) {
    var error;

    if (!req.body.username || !req.body.password || !req.body.deposit) {
        error = 'All fields are required.';
    }

    if (req.body.deposit && !/\d+(\.\d{2})?/.test(req.body.deposit)) {
        error = 'Deposit must be a monetary value.'
    }

    if (error) {
        res.status(400).json({ error: error });
    } else {
        service.createUser(req.body, function(err, result) {
            if (err) {
                res.status(500).json({ error: 'Failed to create user.' });
            } else {
                res.cookie('userID', result.insertId);
                res.json({ success: true });
            }
        });
    }
});

// --------------------------

app.listen(3000, function() {
    console.log('Running!');
});
