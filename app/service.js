var mysql = require('mysql'),
    bcrypt = require('bcrypt'),
    Q = require('q');

var db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'interviews'
    });

db.connect();

module.exports = exports = {};

function query(sql, args) {
    var def = Q.defer();

    db.query(sql, args, function(err, result) {
        if (err) {
            def.reject(err);
        } else {
            def.resolve(result);
        }
    });

    return def.promise;
}

function beginTransaction() {
    var def = Q.defer();

    db.beginTransaction(function(err) {
        if (err) {
            def.reject(err);
        } else {
            console.log('transaction started');
            def.resolve();
        }
    });

    return def.promise;
}

function commitTransaction() {
    var def = Q.defer();

    db.commit(function(err) {
        if (err) {
            def.reject(err);
        } else {
            console.log('transaction committed');
            def.resolve();
        }
    });

    return def.promise;
}

exports.authenticateUser = function(username, password) {
    var def = Q.defer();

    query('select * from users where username = ? limit 1', [username]).then(function(users) {
        if (users.length === 0) {
            def.reject('No such user.');
        } else if (bcrypt.compareSync(password, users[0].password)) {
            def.resolve(users[0]);
        } else {
            def.reject('Wrong password');
        }
    }).catch(function(err) {
        def.reject(err);
    });

    return def.promise;
};

exports.createUser = function(request) {
    return query('insert into users (username, password, balance) values (?, ?, ?)',
             [request.username, bcrypt.hashSync(request.password, 10), request.deposit]);
};

exports.listTickers = function() {
    return query('select * from tickers');
};

exports.listHoldings = function(userID) {
    return query('select tickerID, sum(amount) as balance, sum(shares) as shares from transactions where userID = ? group by tickerID', [userID]);
};

exports.createTransaction = function(request) {
    var def = Q.defer();

    console.log('selecting ticker ' + request.tickerID);

    query('select * from tickers where id = ?', [request.tickerID])
        .then(function(results) {
            if (!results.length) {
                def.reject('No such ticker.');
                return;
            }

            var ticker = results[0],
                amount = request.shares * ticker.price;

            if (request.type === 'SELL') {
                amount *= -1;
            }

            console.log('about to create transaction');

            return beginTransaction()
                .then(function() {
                    console.log('creating transaction record');

                    return query('insert into transactions (userID, tickerID, type, shares, amount) values (?, ?, ?, ?, ?)',
                      [request.userID, ticker.id, request.type, request.shares, amount]);
                })
                .then(function() {
                    console.log('updating user balance');

                    return query('update users set balance = balance - ?', [amount]);
                })
                .then(function() {
                    console.log('committing db transaction');

                    return commitTransaction();
                })
                .then(function() {
                    console.log('resolving outer promise');

                    def.resolve();
                })
                .catch(function(err) {
                    console.log('got an error, rolling back');

                    db.rollback(function() {
                        def.reject(err);
                    });
                });
        })
        .catch(function(err) {
            def.reject(err);
        });

    return def.promise;
};

exports.getUserInfo = function(userID) {
    return query('select * from users where id = ?', [userID]);
}
