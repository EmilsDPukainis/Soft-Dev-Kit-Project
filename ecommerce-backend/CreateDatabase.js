

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('ecommerce-backend/mydatabase.db');

db.serialize(() => {
  
  db.run(`
  CREATE TABLE IF NOT EXISTS Users (
    user_id INTEGER PRIMARY KEY ,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    surname TEXT NOT NULL )`
    );

  db.run(`
  CREATE TABLE IF NOT EXISTS Admins (
    admin_id INTEGER PRIMARY KEY ,
    username TEXT NOT NULL,
    password TEXT NOT NULL
  )
`);


  db.run(`
  CREATE TABLE IF NOT EXISTS Categories (
    category_id INTEGER PRIMARY KEY ,
    category_name TEXT NOT NULL
  )
`);
db.run(`
  CREATE TABLE IF NOT EXISTS Products (
    product_id INTEGER PRIMARY KEY ,
    product_name TEXT ,
    description TEXT,
    price REAL ,
    amount INTEGER ,
    category_id INTEGER,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
  )
`);
db.run(`
    CREATE TABLE IF NOT EXISTS Payments (
        payment_id INTEGER PRIMARY KEY ,
        user_id INTEGER,
        card_number TEXT,
        expiration_date TEXT,
        cvv TEXT,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    )
`);
// Create ShoppingCart table
db.run(`
  CREATE TABLE IF NOT EXISTS ShoppingCart (
    cart_id INTEGER PRIMARY KEY ,
    user_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
  )
`);

// Create Orders table
db.run(`
  CREATE TABLE IF NOT EXISTS Orders (
    order_id INTEGER PRIMARY KEY ,
    user_id INTEGER,
    total_price REAL,
    order_date DATETIME,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
  )
`);

// Create OrderDetails table
db.run(`
  CREATE TABLE IF NOT EXISTS OrderDetails (
    order_detail_id INTEGER PRIMARY KEY ,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
  )
`);
});

  
  
module.exports = db;
