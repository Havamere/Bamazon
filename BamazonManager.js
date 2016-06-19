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
	manage();
});

var manage = function() {
	inquirer.prompt({
			type: 'list',
			name: 'options',
			message: 'Hello, what would you like to do?'
			choices: ['View Products for Sale','View Low Inventory','Add to Inventory','Add New Product']
		}).then(function(user){
			switch (user.options){
				case 'View Products for Sale':
					checkInventory();
				break;

				case 'View Low Inventory':
					lowInStock();
				break;

				case 'Add to Inventory':
					restock();
				break;

				case 'Add New Product':
					addNewProduct();
				break;

				default:
					console.log("You broke it!");
			};
		})
}

var productList = []

var checkInventory = function(){
	connection.query('SELECT * FROM products', function(err, res){
		if (err) throw err;
		//making it look pretty
		console.log("---------------------------------------------------------------------------------------------------");
		console.log("Bamazon.com Inventory Workup");
		for (var i = 0; i < res.length; i++){
			console.log('Product ID: '+res[i].ItemID+" | "+res[i].ProductName+" | $"+res[i].Price+" | Instock Quantity: "+res[i].StockQuantity+" | Department: "+res[i].Department);
		}
		console.log("---------------------------------------------------------------------------------------------------");
		});
	manage();
};

var lowInStock = function(){
	connection.query('SELECT ProductName, StockQuantity FROM products WHERE StockQuantity < 5', function(err, res) {
		if (err) throw err;
		console.log("--------------------------------------------------------");
		console.log('Low Inventory Alert!');
		for (var i = 0; i < res.length; i++){
			console.log('Product ID: '+res[i].ItemID+" | "+res[i].ProductName+" | $"+res[i].Price+" | Instock Quantity: "+res[i].StockQuantity+" | Department: "+res[i].Department);
		};
		console.log("--------------------------------------------------------");
	})
	manage();
};

var restock = function(){
	//gives latest inventory levels as reminder for manager
	checkInventory();
	connection.query('SELECT * FROM products', function(err, res){
		if (err) throw err;
		for (var i = 0; i < res.length; i++){
			//Builds selectable list for purchase prompt
			productList.push(res[i].ProductName);
		};
		// console.log(productList);
	});
	inquirer.prompt([
		{
			type: 'list',
			name: 'restock_item',
			message: 'Which item would you like to restock?',
			choices: productList
		},
		{
			type: 'input',
			name: 'restock_amount',
			message: 'And how much are you adding to stock?',
			//makes sure an actual number was entered
 			validate: function(value) {
	 			if (isNaN(value) == true || value == null) {
	 				console.log('Please enter a valid number');
	 				return false;
	 			};
	 			return true;
	 		};
		}	
	]).then(function(user){
		connection.query('UPDATE Products SET StockQuantity = "'+user.restock_amount+'" WHERE ProductName = "'+user.restock_item+'"');
		console.log("Inventory Updated.")
		connection.query('SELECT * FROM products WHERE ProductName = "'+user.restock_item+'"', function(err, res){
			console.log('Product ID: '+res[0].ItemID+" | "+res[0].ProductName+" | $"+res[0].Price+" | Instock Quantity: "+res[0].StockQuantity+" | Department: "+res[0].Department);
		})
	})
	manage();
};

var addNewProduct = function(){

	manage();
};