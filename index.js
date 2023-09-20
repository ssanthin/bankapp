const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
const PORT = 3000;
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
// Middleware to parse POST data
app.use(bodyParser.json());  // <-- Change this line
// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'myuser',
    password: 'mypassword',
    database: 'fdeposit'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database.');
});

app.get('/insert', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'insert.html'));
});

// This is the new route to serve the page that displays account details
app.get('/view-accounts', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'viewAccounts.html'));
});
// This is the new route to serve the welcome page with the two buttons
app.get('/welcome', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
});

app.post('/', (req, res) => {
    console.log('request body',req.body)
    const formData = {
        bank_name: req.body.bankName,
        account_number: req.body.accountNumber,
        due_date: req.body.dueDate,
        amount: req.body.amount
    };

    const sql = 'INSERT INTO account_details SET ?';
    db.query(sql, formData, (err, result) => {
        if (err) {
            console.error('Error saving form data:', err);
            return res.status(500).json({ error: err.message });
        }
        console.log('Form data saved:', result);
        res.json({ success: 'Data saved successfully!' });
    });
});

app.get('/accounts', (req, res) => {
    const sql = 'SELECT * FROM account_details';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ error: err.message });
        }
        console.log('Data fetched:', results);
        res.json(results);
    });
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
