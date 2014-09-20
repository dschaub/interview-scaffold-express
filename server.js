var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    service = require('./app/service');

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// ---- add stuff here! -----

function errorHandler(status, message) {
    return function(err) {
        res.status(status).json({ error: message });
    };
}

app.get('/me', function(req, res) {
    var userID = req.cookies.userID;

    if (!userID) {
        res.status(401).send({ error: 'Not logged in.' });
        return;
    }

    service.getUserInfo(userID)
        .then(function(users) {
            if (!users.length) {
                res.status(401).send({ error: 'No such user.' });
            } else {
                res.send(users[0]);
            }
        })
        .catch(errorHandler(500, 'Could not get current user.'));
});

app.post('/login', function(req, res) {
    if (req.cookies.userID) {
        res.status(400).send({ error: 'Already logged in.' });
        return;
    }

    if (!req.body.username || !req.body.password) {
        res.status(400).send({ error: 'Username and password are required.' });
        return;
    }

    service.authenticateUser(req.body.username, req.body.password)
        .then(function(user) {
            res.cookie('userID', user.id);
            res.send({ success: true });
        })
        .catch(errorHandler(401, 'Login failed.'));
});

app.post('/signup', function(req, res) {
    var error;

    if (!req.body.username || !req.body.password || !req.body.deposit) {
        error = 'All fields are required.';
    }

    if (req.body.deposit && !/\d+(\.\d{2})?/.test(req.body.deposit)) {
        error = 'Deposit must be a monetary value.'
    }

    if (error) {
        res.status(400).send({ error: error });
        return;
    }

    service.createUser(req.body)
        .then(function(result) {
            res.cookie('userID', result.insertId);
            res.send({ success: true });
        })
        .catch(errorHandler(500, 'Failed to create user.'));
});

app.get('/tickers', function(req, res) {
    service.listTickers()
        .then(function(tickers) {
            res.send(tickers);
        })
        .catch(errorHandler(500, 'Failed to load tickers.'));
});

app.get('/holdings', function(req, res) {
    var userID = req.cookies.userID;

    if (!userID) {
        res.status(401).send({ error: 'Must be logged in.' });
        return;
    }

    service.listHoldings(userID)
        .then(function(holdings) {
            res.send(holdings);
        })
        .catch(errorHandler(500, 'Failed to load holdings.'));
});

// --------------------------

app.listen(3000, function() {
    console.log('Running!');
});
