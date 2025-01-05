let loggedInUser = null;  // To store current logged-in user
let users = [];  // Mocked users for this example
let stories = [];  // To store created stories
let friends = [];  // To store friends

// Display login or signup form
function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('signup-form').style.display = 'none';
}

function showSignup() {
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
}

// Login
function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    // Check if user exists (mock check)
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        loggedInUser = user;
        alert('Login successful!');
        document.getElementById('content').innerHTML = `<h2>Welcome back, ${username}!</h2>`;
        showStoryCreation();
    } else {
        alert('Invalid credentials');
    }
}

// Signup
function signup() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    // Add the user (mock registration)
    const newUser = { username, password, friends: [], stories: [] };
    users.push(newUser);
    loggedInUser = newUser;
    alert('Signup successful!');
    document.getElementById('content').innerHTML = `<h2>Welcome, ${username}!</h2>`;
    showStoryCreation();
}

// Show story creation section
function showStoryCreation() {
    document.getElementById('story-creation').style.display = 'block';
}

// Save story
function saveStory() {
    const storyContent = document.getElementById('story-content').value;
    const story = { username: loggedInUser.username, content: storyContent };
    stories.push(story);
    alert('Story saved!');
}

// Send story to a friend
function sendStory() {
    const friendUsername = prompt('Enter your friend\'s username to send the story');
    const friend = users.find(u => u.username === friendUsername);

    if (friend) {
        alert(`Story sent to ${friend.username}`);
        // This would involve sending the story via a backend in a real app
    } else {
        alert('User not found');
    }
}

// Search for friends
function sendFriendRequest() {
    const searchQuery = document.getElementById('friend-search').value;
    const friend = users.find(u => u.username === searchQuery);

    if (friend) {
        alert(`Friend request sent to ${friend.username}`);
        // Simulate friend request message
        document.getElementById('friend-request-message').style.display = 'block';
    } else {
        alert('User not found');
    }
}

// Accept or reject friend request
function acceptFriend() {
    const friendRequestUser = document.getElementById('friend-search').value;
    const friend = users.find(u => u.username === friendRequestUser);

    if (friend) {
        friends.push(friend);
        friend.friends.push(loggedInUser);
        alert(`${friend.username} is now your friend!`);
    }
}

function rejectFriend() {
    alert('Friend request rejected');
}

