var express = require('express'),
    mysqlModel = require('mysql-model'),
    mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'saghf'
});
connection.connect(function(err) {
    if (err) console.log( err);
});
var MyAppModel = mysqlModel.createConnection(connection);
module.exports = MyAppModel;


// pass !IPfthEEbnK$8w5r69h&Oh@7vl
// user admin_saghf

