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

var productList = [];

connection.connect(function (err){
	//sends error message to console if one exists
	if (err) throw err;
	//logs success upon success
	console.log('Connnection Established');
});

connection.query('SELECT * FROM products', function(err, res){
	if (err) throw err;
	console.log("Welcome to Bamazon.com.  What would you like to buy today?")
	console.log("--------------------------------------------------------------");
	for (var i = 0; i < res.length; i++){
		console.log(res[i].ItemID+" | "+res[i].ProductName+" | "+res[i].Price);
		productList.push(res[i].ProductName);
	}
	console.log("--------------------------------------------------------------");
});

inquirer.prompt([
// 	{
// 		type: 'input',
// 		name: 'username',
// 		message: 'What is your name?'
// 	},
// 	{
// 		type: 'input',
// 		name: 'password',
// 		message: 'And what is your password?'
// 	},
	{
		type: 'list',
		name: 'productList',
		message: "Which product would you like to purchase today?",
		choices: productList,
 	},
 	{
 		type: 'input',
 		name: 'amount',
 		message: 'And how many would you like to purchase?'
 		validate: function(value) {
 			if (isNaN(value)) {
 				return 'Please enter a valid number';
 			}
 			return true;
 		}
 	}

 	]).then(function(user){
 		
 	});