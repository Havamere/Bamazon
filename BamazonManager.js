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
			//Builds selectable list for purchase prompt
			productList.push(res[i].ProductName);
		}
		console.log("---------------------------------------------------------------------------------------------------");
		// console.log(productList);
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
	})
	manage();
};

var restock = function(){

	manage();
};

var addNewProduct = function(){

	manage();
};