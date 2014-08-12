var mysql = require('mysql'),
    bcrypt = require('bcrypt');

var db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'interviews'
    });

db.connect();

module.exports = exports = {};

exports.createUser = function(request, callback) {
    db.query('insert into users (username, password, balance) values (?, ?, ?)',
             [request.username, bcrypt.hashSync(request.password, 10), request.deposit],
             callback);
};
