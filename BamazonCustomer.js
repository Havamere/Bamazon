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
	//making it look pretty
	console.log("Welcome to Bamazon.com.  What would you like to buy today?")
	console.log("--------------------------------------------------------------");
	for (var i = 0; i < res.length; i++){
		console.log('Product ID: '+res[i].ItemID+" | "+res[i].ProductName+" | $"+res[i].Price);
		//Builds selectable list for purchase prompt
		productList.push(res[i].ProductName);
	}
	console.log("--------------------------------------------------------------");
	// console.log(productList);
	//runs purchase program AFTER item list console.logs
	purchase();
});

var purchase = function(){
	inquirer.prompt([
	{
		type: 'list',
		name: 'product',
		message: "Which product would you like to purchase today?",
		//list built on initial connection 
		choices: productList
 	},
 	{
 		type: 'input',
 		name: 'amount',
 		message: 'And how many would you like to purchase?',
 		//makes sure an actual number was entered
 		validate: function(value) {
 			if (isNaN(value) == true || value == null) {
 				console.log('Please enter a valid number');
 				return false;
 			}
 			return true;
 		}
 	}

 	]).then(function(user){
 		connection.query('SELECT * FROM Products WHERE ProductName = ?', user.product, function(err,res){
 			if (err) throw err;
 			//checks to see if enough products are in stock
 			if (user.amount > (res[0].StockQuantity - user.amount)) {
 				console.log('Insufficient quantity.  Please select less to buy.')
 				//re-runs the program so that the user can try again
 				purchase();
 			} else {
 				//shows user what they purchased, how many, and at what price
 				console.log('You have ordered '+user.amount+' '+user.product+' at $'+res[0].Price);
 				//gives user the total amount of purchase
 				console.log('Your total cost is $'+(res[0].Price*user.amount));
 				//updates database
 				connection.query('UPDATE Products SET StockQuantity = "'+(res[0].StockQuantity - user.amount)+'" WHERE ProductName = "'+user.product+'"');
 			}
 		});
		//ends connection to allow new program to be run
		connection.end();
 	});
 }
