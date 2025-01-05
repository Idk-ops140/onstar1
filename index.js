app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send('Username and password required.');

    db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username.trim(), password],
        function (err) {
            if (err) return res.status(400).send('Error: Username already exists or invalid.');
            res.status(201).send('Signup successful!');
        }
    );
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send('Username and password required.');

    db.get(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username.trim(), password],
        (err, user) => {
            if (err || !user) return res.status(401).send('Invalid username or password.');
            res.status(200).json({ message: 'Login successful!', userId: user.id });
        }
    );
});
