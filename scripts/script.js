const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const forgetPasswordForm = document.getElementById('forget-password-form');
const resetPasswordForm = document.getElementById('reset-password-form');
const dashboardPage = document.getElementById('dashboard-page');
const chatPage = document.getElementById('chat-page');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard.html';
    } else {
      alert('Invalid email or password');
    }
  } catch (error) {
    console.error(error);
  }
});

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    if (data.message) {
      alert(data.message);
      window.location.href = '/login.html';
    } else {
      alert('Error registering user');
    }
  } catch (error) {
    console.error(error);
  }
});

forgetPasswordForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  try {
    const response = await fetch('/api/auth/forget-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (data.message) {
      alert(data.message);
    } else {
      alert('Error sending password reset link');
    }
  } catch (error) {
    console.error(error);
  }
});

resetPasswordForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const token = document.getElementById('token').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }
  try {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, password }),
    });
    const data = await response.json();
    if (data.message) {
      alert(data.message);
      window.location.href = '/login.html';
    } else {
      alert('Error resetting password');
    }
  } catch (error) {
    console.error(error);
  }
});

if (dashboardPage) {
  const userNameElement = document.getElementById('user-name');
  const userEmailElement = document.getElementById('user-email');
  const token = localStorage.getItem('token');
  if (token) {
    const userData = JSON.parse(atob(token.split('.')[1]));
    userNameElement.textContent = userData.name;
    userEmailElement.textContent = userData.email;
  }
  const editProfileButton = document.getElementById('edit-profile-button');
  editProfileButton.addEventListener('click', editUserProfile);
  const startChatButton = document.getElementById('start-chat-button');
  startChatButton.addEventListener('click', startNewChat);
}

if (chatPage) {
  const chatContainer = document.getElementById('chat-container');
  const chatInput = document.getElementById('chat-input');
  const chatSendButton = document.getElementById('send-button');

  chatSendButton.addEventListener('click', async () => {
    const messageText = chatInput.value.trim();
    if (messageText) {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: messageText
          }),
        });
        const data = await response.json();
    if (data.message) {
  const chatMessage = document.createElement('div');
  chatMessage.classList.add('chat-message');
  chatMessage.innerHTML = `
    <span class="message-text">${data.message}</span>
    <span class="message-timestamp">${new Date().toLocaleTimeString()}</span>
  `;
  chatContainer.appendChild(chatMessage);
  chatInput.value = '';
} else {
  alert('Error sending message');
}
      } catch (error) {
        console.error(error);
      }
    }
  });

  // Fetch and display chat history
  async function fetchChatHistory() {
    try {
      const response = await fetch('/api/chat');
      const data = await response.json();
      if (data.messages) {
        data.messages.forEach((message) => {
          const chatMessage = document.createElement('div');
          chatMessage.classList.add('chat-message');
          chatMessage.innerHTML = `
            <span class="message-text">${message.message}</span>
            <span class="message-timestamp">${message.timestamp}</span>
          `;
          chatContainer.appendChild(chatMessage);
        });
      } else {
        alert('Error fetching chat history');
      }
    } catch (error) {
      console.error(error);
    }
  }

  fetchChatHistory();
}

function editUserProfile() {
  const token = localStorage.getItem('token');
  if (token) {
    const userData = JSON.parse(atob(token.split('.')[1]));
    const name = prompt('Enter new name:', userData.name);
    const email = prompt('Enter new email:', userData.email);
    if (name && email) {
      fetch('/api/auth/update-profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            alert(data.message);
            window.location.reload();
          } else {
            alert('Error updating profile');
          }
        })
        .catch((error) => console.error(error));
    }
  }
}

function startNewChat() {
  window.location.href = '/chat.html';
}
