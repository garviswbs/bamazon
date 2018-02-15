const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');
const pass = require('./pass.js');
// var stock;
// var inputQuant;
// var inputID;
// var order = "SELECT stock_quantity FROM products WHERE item_id = (answers.Order_Quantity) ";

// create the connection information for the sql database
const connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: pass,
    database: "bamazon"
});

var orderQuest = [{
        type: 'input',
        name: 'Order_ID',
        message: "Enter Product ID (Number)",
        validate: function inputID(value) {
            if (isNaN(value) === false) {
                return true;
                console.log("truth")
            }
            return false;
            console.log("false")
        }
    },
    {
        type: 'input',
        name: 'Order_Quantity',
        message: "Enter Order Quantity (Number)",
        validate: function inputQuant(value) {
            if (isNaN(value) === false) {
                return true;
                console.log("truth")
            }
            return false;
            console.log("false")
        }
    }
];

var yesNoQuest = [{
    type: 'confirm',
    name: 'yes_no',
    message: "Confirm Order (Y/N)"
}]
var purchase = function () {
    connection.query("SELECT stock_quantity , price , product_name FROM products WHERE item_id = " + inputID + ";", function (err, result, fields) {
        if (err) throw err;
        var stock = result[0].stock_quantity;
        var updateStock = stock - inputQuant;
        var price = result[0].price;
        var item = result[0].product_name;
        var orderPrice = inputQuant * price;

        stock >= inputQuant ? console.log(` \nYour Cart: \n(${inputQuant}) ${item} ($${price} ea.)\nTotal Price: $${orderPrice} usd\n`) : console.log("Insufficient inventory to fulfill your order..");

        inquirer.prompt(yesNoQuest).then(answers => {
            if (answers.yes_no === true) {
                connection.query(`UPDATE products SET stock_quantity = ${updateStock} WHERE item_id = ${inputID}`, function (err, result, fields) {
                    if (err) throw err;
                    connection.query("SELECT * FROM products", function (err, result, fields) {
                        if (err) throw err;
                        console.log("----Updated Stock List----");
                        console.table(result);
                        console.log("Your Order is on the way!");
                        connection.end();
                    });
                })
            } else if (answers.yes_no === false) {
                console.log("Why are you wasting our time?");
                connection.end();
            }
        })
    })
}

var start = () => {
    //Prompt Order orderQuest 
    inquirer.prompt(orderQuest).then(answers => {
        //User Inputs
        var inputID = answers.Order_ID;
        var inputQuant = answers.Order_Quantity;

        connection.query("SELECT stock_quantity , price , product_name FROM products WHERE item_id = " + inputID + ";", function (err, result, fields) {
            if (err) throw err;
            var stock = result[0].stock_quantity;
            var updateStock = stock - inputQuant;
            var price = result[0].price;
            var item = result[0].product_name;
            var orderPrice = inputQuant * price;

            stock >= inputQuant ? console.log(` \nYour Cart: \n(${inputQuant}) ${item} ($${price} ea.)\nTotal Price: $${orderPrice} usd\n`) : console.log("Insufficient inventory to fulfill your order..");

            inquirer.prompt(yesNoQuest).then(answers => {
                if (answers.yes_no === true) {
                    connection.query(`UPDATE products SET stock_quantity = ${updateStock} WHERE item_id = ${inputID}`, function (err, result, fields) {
                        if (err) throw err;
                        connection.query("SELECT * FROM products", function (err, result, fields) {
                            if (err) throw err;
                            console.log("----Updated Stock List----");
                            console.table(result);
                            console.log("Your Order is on the way!");
                            connection.end();
                        });
                    })
                } else if (answers.yes_no === false) {
                    console.log("Why are you wasting our time?");
                    connection.end();
                }
            })
        })

    })
}

connection.query("SELECT * FROM products", function (err, result, fields) {
    if (err) throw err;
    console.table(result);
    start();
});