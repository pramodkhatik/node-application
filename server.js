const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: '172.17.0.2',
  user: 'root',
  password: 'Sachin@9900',
  database: 'nodejs'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');

  // Create table if it doesn't exist
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL
    )
  `;
  connection.query(createTableQuery, err => {
    if (err) {
      console.error('Error creating table:', err);
      return;
    }
    console.log('Table created');
  });
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const newUser = { name, email, password };

  connection.query('INSERT INTO users SET ?', newUser, (err, results) => {
    if (err) {
      console.error('Error registering user:', err);
      res.status(500).send('Error registering user');
      return;
    }

    res.status(200).send('User registered successfully');
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/registration.html');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
})
