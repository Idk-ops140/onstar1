document.getElementById('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    const username = usernameField.value.trim();
    const password = passwordField.value.trim();

    if (!username || !password) {
        alert('Username and password are required.');
        return;
    }

    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            alert('Signup successful!');
            document.getElementById('auth').style.display = 'none';
            document.getElementById('storyCreator').style.display = 'block';
        } else {
            const errorText = await response.text();
            alert('Error: ' + errorText);
        }
    } catch (error) {
        alert('Network error: ' + error.message);
    }
});
