const mysql = require('mysql');

//for connection of SQL
const con = mysql.createConnection({
    host: 'localhost',
    user: 'team58',
    password: 'team58isthebest',
    database: 'cs6400_fa23_team58'
});

con.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database');
});

module.exports = con;