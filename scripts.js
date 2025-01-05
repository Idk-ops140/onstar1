document.getElementById('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

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
        alert('Error: ' + (await response.text()));
    }
});
