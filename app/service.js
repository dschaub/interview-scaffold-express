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

exports.getUserInfo = function(userID) {
    return query('select * from users where id = ?', [userID]);
}
