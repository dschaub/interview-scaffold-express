var mysql = require('mysql');

var db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'interviews'
    });

db.connect();

// add stuff here!
