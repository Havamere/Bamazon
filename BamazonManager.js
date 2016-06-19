//makes use of inquire npm
var inquirer = require("inquirer");
//makes use of mysql npm
var mysql = require("mysql");

var connection = mysql.createConnection({
	host : 'LocalHost',
	port: 3306,
	user : 'root',   //username
	password : 'root', //password
	database : 'bamazon_db'
});

connection.connect(function (err){
	//sends error message to console if one exists
	if (err) throw err;
	//logs success upon success
	console.log('Connnection Established');
});