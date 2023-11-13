const express = require('express');
const app = express();

const port = 3001;
const staticRegistrationCode = '1234';

const cartController = require('../ecommerce-frontend/src/Components/Client/ClientElements/CartController');


app.use(express.json());

const db = require('./CreateDatabase');

app.get('/api/Products', (req, res) => {
  const { category_id } = req.query;
  console.log('Received category_id:', category_id);
  
  let query = 'SELECT Products.product_id, Products.product_name, Products.price, Products.amount, Products.description, Products.category_id, Categories.category_name FROM Products LEFT JOIN Categories ON Products.category_id = Categories.category_id';

  if (category_id) {
    query += ` WHERE Products.category_id = '${category_id}'`;
  }

  db.all(query, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ products: rows });
  });
});

app.post('/api/Products', (req, res) => {
  const { name, description } = req.body;
  db.run('INSERT INTO Products (product_name, description) VALUES (?, ?)', [name, description], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Product added successfully' });
  });
});
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM admins WHERE username = ?', [username], (err, row) => {

    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the provided password with the password from the database
    if (password !== row.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ message: 'Admin logged in successfully' });

  });

});

app.get('/api/Categories', (req, res) => {
  db.all('SELECT category_id, category_name FROM Categories', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ categories: rows });
  });
});


app.post('/api/admin/register', (req, res) => {
  const { username, password, registrationCode  } = req.body;
  if (registrationCode !== staticRegistrationCode) {
    return res.status(401).json({ error: 'Invalid registration code' });
  }

  // Insert the admin user into the database
  db.run('INSERT INTO admins (username, password) VALUES (?, ?)', [username, password], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Admin user registered successfully' });
  });
});
// Add a new endpoint to check if a username and password exist
app.get('/api/admin/checkCredentials', async (req, res) => {
  try {
    const { username, password } = req.query;
    
    // Check if username exists
    let query = 'SELECT COUNT(*) AS usernameCount FROM Admins WHERE username = ?';
    let params = [username];

    db.get(query, params, (err, usernameRow) => {
      if (err) {
        console.error('Error checking username existence:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const usernameExists = usernameRow.usernameCount > 0;

        // Check if password exists
        query = 'SELECT COUNT(*) AS passwordCount FROM Admins WHERE username = ? AND password = ?';
        params = [username, password];

        db.get(query, params, (err, passwordRow) => {
          if (err) {
            console.error('Error checking password existence:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            const passwordExists = passwordRow.passwordCount > 0;
            res.json({ usernameExists, passwordExists });
          }
        });
      }
    });
  } catch (error) {
    console.error('Error during credentials existence check:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/checkCredentials', async (req, res) => {
  try {
    const { username, password } = req.query;

    // Check if username exists
    let query = 'SELECT COUNT(*) AS usernameCount FROM Users WHERE username = ?';
    let params = [username];

    db.get(query, params, (err, usernameRow) => {
      if (err) {
        console.error('Error checking username existence:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const usernameExists = usernameRow.usernameCount > 0;

        // Check if password exists
        query = 'SELECT COUNT(*) AS passwordCount FROM Users WHERE username = ? AND password = ?';
        params = [username, password];

        db.get(query, params, (err, passwordRow) => {
          if (err) {
            console.error('Error checking password existence:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            const passwordExists = passwordRow.passwordCount > 0;
            res.json({ usernameExists, passwordExists });
          }
        });
      }
    });
  } catch (error) {
    console.error('Error during credentials existence check:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/admin/Products', (req, res) => {
  const { category_id } = req.query;
  console.log('Received category_id:', category_id);
  
  let query = 'SELECT Products.product_id, Products.product_name, Products.price, Products.amount, Products.description, Products.category_id, Categories.category_name FROM Products LEFT JOIN Categories ON Products.category_id = Categories.category_id';

  if (category_id) {
    query += ` WHERE Products.category_id = '${category_id}'`;
  }

  db.all(query, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ products: rows });
  });
});



app.post('/api/admin/Products', (req, res) => {
  const { product_name, description, price, amount, category_id } = req.body;
  db.run(
    'INSERT INTO Products (product_name, description, price, amount, category_id) VALUES (?, ?, ?, ?, ?)',
    [product_name, description, price, amount, category_id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Product added successfully' });
    }
  );
});

app.delete('/api/admin/Products/:product_id', (req, res) => {
  const productId = req.params.product_id;
  db.run('DELETE FROM Products WHERE product_id = ?', [productId], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Product deleted successfully' });
  });
});

app.put('/api/admin/Products/:product_id', (req, res) => {
  const productId = req.params.product_id;
  const { product_name, description, price, amount, category_id } = req.body;

  db.run(
    'UPDATE Products SET product_name = ?, description = ?, price = ?, amount = ?, category_id = ? WHERE product_id = ?',
    [product_name, description, price, amount, category_id, productId],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Product updated successfully' });
    }
  );
});


app.get('/api/admin/Categories', (req, res) => {
  db.all('SELECT category_id, category_name FROM Categories', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ categories: rows });
  });
});

app.post('/api/admin/Categories', (req, res) => {
  const { category_name } = req.body;
  db.run('INSERT INTO Categories (category_name) VALUES (?)', [category_name], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Category added successfully' });
  });
});

app.delete('/api/admin/Categories/:category_id', (req, res) => {
  const categoryId = req.params.category_id;
  db.run('DELETE FROM Categories WHERE category_id = ?', [categoryId], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Category deleted successfully' });
  });
});

app.put('/api/admin/Categories/:category_id', (req, res) => {
  const categoryId = req.params.category_id;
  const { category_name } = req.body;

  // Check if categoryId is defined before updating the category
  if (categoryId && Number.isInteger(parseInt(categoryId)) && categoryId > 0) {
    db.run(
      'UPDATE Categories SET category_name = ? WHERE category_id = ?',
      [category_name, categoryId],
      (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.json({ message: 'Category updated successfully' });
      }
    );
  } else {
    console.error('CategoryId is undefined or invalid');
    res.status(400).json({ error: 'CategoryId is undefined or invalid' });
  }
});

app.get('/api/search', async (req, res) => {
  const { query } = req.query;

  try {
    // Perform a database search based on the query
    const searchQuery = `%${query.toLowerCase()}%`;
    const searchResult = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM Products WHERE LOWER(product_name) LIKE ?', [searchQuery], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    res.json({ products: searchResult });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});



app.post('/api/register', async (req, res) => {
  const { username, password, email, name, surname } = req.body;

  try {
      // Check if the username or email already exists
      const existingUser = await new Promise((resolve, reject) => {
          db.get('SELECT * FROM Users WHERE username = ? OR email = ?', [username, email], (err, row) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(row);
              }
          });
      });

      if (existingUser) {
          // User with the same username or email already exists
          return res.status(409).json({ error: 'Username or email already in use.' });
          } else {
      // Insert the new user into the Users table
      db.run(
        'INSERT INTO Users (username, password, email, name, surname) VALUES (?, ?, ?, ?, ?)',
        [username, password, email, name, surname]
      );

      res.status(201).json({ success: true, message: 'Registration successful' });
    }
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Check the credentials against the database
  db.get('SELECT * FROM Users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message, loggedIn: false });
    }

    if (row) {
      // Successfully logged in
      res.json({ success: true, message: 'Login successful', loggedIn: true, user: row });
    } else {
      // Invalid credentials
      res.status(401).json({ success: false, message: 'Invalid credentials', loggedIn: false });
    }
  });
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  // No need to interact with the database for logout
  res.json({ success: true, message: 'Logout successful', loggedIn: false });
});

// Example protected endpoint that requires authentication
app.get('/api/protected', (req, res) => {
  // You can check the session or token here, but for simplicity, let's assume there's no session
  res.status(401).json({ error: 'Unauthorized' });
});

app.get('/api/login', async (req, res) => {
  const { username, password } = req.query;

  try {
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM Users WHERE username = ? AND password = ?', [username, password], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    if (user) {
      req.session.user = user; // Store user data in the session
      res.status(200).json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/api/cart', (req, res) => {
  console.log('Request Body:', req.body); // Log the request body
  try {
    const { product_id } = req.body;  // Change to product_id

    if (!product_id) {
      throw new Error('Product ID is required');
    }

    // Modify addToCart to handle only product_id
    const updatedCart = cartController.addToCart({ product_id });
    res.json({ cart: updatedCart });
  } catch (error) {
    console.error('Error in /api/cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example endpoint to get cart items
app.get('/api/cart', (req, res) => {
  
  try {
    const cartItems = cartController.getCartItems();
    res.json({ cart: cartItems });
  } catch (error) {
    console.error('Error in /api/cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
