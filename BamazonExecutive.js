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
	executiveStuff();
});

var executiveStuff = function(){
	inquirer.prompt({
		type: 'list',
			name: 'options',
			message: 'Hello, what would you like to do?',
			choices: ['View Product Sales By Department', 'Create New Department']
		}).then(function(user){
			switch (user.options) {
				case 'View Product Sales By Department':
					viewSales();
				break;

				case 'Create New Department':
					makeNewDepartment();
				break;

				default:
					console.log('You broke it.')

			}
		});
};

var viewSales = function(){
	connection.query('SELECT *, (TotalSales-OverHeadCosts) TotalProfit FROM departments', function(err, res){
		if (err) throw err;
		console.log('-------------------Here is the sales mix for the company.-------------------');
		console.log('----------------------------------------------------------------------------');
		console.log('| DepartmentID | DepartmentName | OverHeadCosts | TotalSales | TotalProfit |');
		console.log('----------------------------------------------------------------------------');
		// console.log(res);
		for (var i = 0; i < res.length; i++){
			console.log('| '+' '+' '+' '+' '+' '+' '+res[i].DepartmentID+' '+' '+' '+' '+' '+' | '+
						' '+' '+res[i].DepartmentName+' '+' '+' | '+' '+' '+' '+' '+res[i].OverHeadCosts+
						' '+' '+' '+' | '+' '+' '+res[i].TotalSales+' '+' '+' | '+' '+' '+' '+
						res[i].TotalProfit+' '+' '+' |');
			console.log('----------------------------------------------------------------------------');
		};
		//executiveStuff();
	});
};

var makeNewDepartment = function(){
	connection.query('SELECT * FROM products, departments', function(err, res){
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
				type: 'input',
				name: 'DepartmentName',
				message: 'Please input the Department name.',
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
			{
				type: 'input',
				name: 'OverHeadCosts',
				message: 'Please input the over head costs of this department.'
			},
			{
				type: 'input',
				name: 'TotalSales',
				message: 'Please input the current total sales amount for this department.'
			},
		]).then(function(user){
			var newProduct = {ItemID: user.ItemID, ProductName: user.ProductName, DepartmentName: user.DepartmentName, Price: user.Price, StockQuantity: user.StockQuantity};
			var newDepartment = {DepartmentName: user.DepartmentName, OverHeadCosts: user.OverHeadCosts, TotalSales: user.TotalSales};
			connection.query('INSERT INTO products SET ?', newProduct, function(err, res){
				if (err) throw err;
				checkInventory();
			});
			connection.query('INSERT INTO departments SET ?', newDepartment, function(err, res){
				if (err) throw err;
				viewSales();
			});
			//executiveStuff();
		});
	});
};

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
		});
};