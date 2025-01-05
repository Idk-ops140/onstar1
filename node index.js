const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// SQLite setup
const db = new sqlite3.Database('./onstar.db', (err) => {
    if (err) console.error('Error opening database:', err.message);
    else console.log('Connected to SQLite database.');
});

// Create tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS stories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        content TEXT NOT NULL,
        FOREIGN KEY(userId) REFERENCES users(id)
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS friends (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        friendId INTEGER,
        status TEXT CHECK(status IN ('pending', 'accepted')) NOT NULL,
        FOREIGN KEY(userId) REFERENCES users(id),
        FOREIGN KEY(friendId) REFERENCES users(id)
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS blocked_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        reason TEXT NOT NULL,
        FOREIGN KEY(userId) REFERENCES users(id)
    )`);
});

// Signup
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, password],
        function (err) {
            if (err) return res.status(400).send('Error: Username already exists.');
            res.status(201).send('User created successfully.');
        }
    );
});

// Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        (err, user) => {
            if (err || !user) return res.status(401).send('Invalid username or password.');
            res.status(200).json(user);
        }
    );
});

// Create a story
app.post('/story', (req, res) => {
    const { userId, content } = req.body;

    const inappropriateWords = ['badword1', 'badword2']; // Example
    if (inappropriateWords.some(word => content.includes(word))) {
        db.run(
            'INSERT INTO blocked_users (userId, reason) VALUES (?, ?)',
            [userId, 'Inappropriate language'],
            (err) => {
                if (err) return res.status(500).send('Error handling user block.');
                res.status(403).send('You are temporarily blocked for inappropriate content.');
            }
        );
    } else {
        db.run(
            'INSERT INTO stories (userId, content) VALUES (?, ?)',
            [userId, content],
            (err) => {
                if (err) return res.status(500).send('Error saving story.');
                res.status(201).send('Story saved successfully.');
            }
        );
    }
});

// Add a friend
app.post('/friend-request', (req, res) => {
    const { userId, friendId } = req.body;
    db.run(
        'INSERT INTO friends (userId, friendId, status) VALUES (?, ?, ?)',
        [userId, friendId, 'pending'],
        (err) => {
            if (err) return res.status(500).send('Error sending friend request.');
            res.status(201).send('Friend request sent.');
        }
    );
});

// Respond to a friend request
app.post('/friend-response', (req, res) => {
    const { userId, friendId, response } = req.body;
    const status = response === 'accept' ? 'accepted' : 'rejected';
    db.run(
        'UPDATE friends SET status = ? WHERE userId = ? AND friendId = ?',
        [status, friendId, userId],
        (err) => {
            if (err) return res.status(500).send('Error responding to friend request.');
            res.status(200).send('Response recorded.');
        }
    );
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
