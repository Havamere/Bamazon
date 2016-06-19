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
			message: 'Hello, what would you like to do?',
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

var productList = [];

var departmentList = [];

var checkInventory = function(){
	connection.query('SELECT * FROM products', function(err, res){
		if (err) throw err;
		//making it look pretty
		console.log("\n Bamazon.com Inventory Workup");
		console.log("---------------------------------------------------------------------------------------------------");
		for (var i = 0; i < res.length; i++){
			console.log('Product ID: '+res[i].ItemID+" | "+res[i].ProductName+" | $"+res[i].Price+" | Instock Quantity: "+res[i].StockQuantity+" | Department: "+res[i].DepartmentName);
		}
		console.log("---------------------------------------------------------------------------------------------------");
		manage();
		});
};

var lowInStock = function(){
	connection.query('SELECT * FROM products WHERE StockQuantity < 5', function(err, res) {
		if (err) throw err;
		console.log('\n Low Inventory Alert!');
		console.log("--------------------------------------------------------");
		for (var i = 0; i < res.length; i++){
			console.log('Product ID: '+res[i].ItemID+" | "+res[i].ProductName+" | $"+res[i].Price+" | Instock Quantity: "+res[i].StockQuantity+" | Department: "+res[i].DepartmentName);
		};
		console.log("--------------------------------------------------------");
		manage();
	})
};

var restock = function(){
	//gives latest inventory levels as reminder for manager
	//checkInventory();
	connection.query('SELECT * FROM products', function(err, res){
		if (err) throw err;
		for (var i = 0; i < res.length; i++){
			//Builds selectable list for purchase prompt
			productList.push(res[i].ProductName);
		};
		// console.log(productList);
		inquirer.prompt([
			{
				type: 'list',
				name: 'restock_item',
				message: '\n Which item would you like to restock?',
				choices: productList
			},
			{
				type: 'input',
				name: 'restock_amount',
				message: '\n And how much are you adding to stock?',
				//makes sure an actual number was entered
	 			validate: function(value) {
		 			if (isNaN(value) == true || value == null) {
		 				console.log('Please enter a valid number');
		 				return false;
		 			};
		 			return true;
		 		}
			}	
		]).then(function(user){
			connection.query('UPDATE Products SET StockQuantity = "'+(Number(user.restock_amount)+Number(res[0].StockQuantity))+'" WHERE ProductName = "'+user.restock_item+'"');
			console.log("Inventory Updated.")
			connection.query('SELECT * FROM products WHERE ProductName = "'+user.restock_item+'"', function(err, res){
				if (err) throw err;
				console.log('Product ID: '+res[0].ItemID+" | "+res[0].ProductName+" | $"+res[0].Price+" | Instock Quantity: "+res[0].StockQuantity+" | Department: "+res[0].DepartmentName);
				manage();
			});
		});
	});
};

var addNewProduct = function(){
	connection.query('SELECT * FROM products', function(err, res){
		if (err) throw err;
		for (var i = 0; i < res.length; i++){
			//Builds selectable list for purchase prompt
			departmentList.push(res[i].DepartmentName);
		};
	inquirer.prompt([
			{
				type: 'input',
				name: 'ItemID',
				message: 'Please input a unique ItemID.'
			},
			{
				type: 'input',
				name: 'ProductName',
				message: 'Please input the Product Name.'
			},
			{
				type: 'list',
				name: 'DepartmentName',
				message: 'Please select the Department this item falls under.',
				choices: departmentList
			},
			{
				type: 'input',
				name: 'Price',
				message: 'Please input the items Price.'
			},
			{
				type: 'input',
				name: 'StockQuantity',
				message: 'Please input the amount of this item you want to put into Stock.'
			},
		]).then(function(user){
			var newProduct = {ItemID: user.ItemID, ProductName: user.ProductName, DepartmentName: user.DepartmentName, Price: user.Price, StockQuantity: user.StockQuantity}
			connection.query('INSERT INTO Products SET ?', newProduct, function(err, res){
				if (err) throw err;
				checkInventory();
				//manage();
			})
		})
};