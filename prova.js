

var mysql = require('mysql')
var connection = mysql.createConnection({
  host : 'localhost',
  utente: 'root',
  password: '',
  database:'root'



})

connection.query("select * from bho")
