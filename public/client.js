const chatBox = document.getElementById('chat-box');
const input = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const API = '/api/messages';
const sound = document.getElementById('receive-sound');

const MY_NAME = "Ayaan"; // Change this per user

// User list toggle
const headerName = document.getElementById('header-name');
const userListDiv = document.getElementById('user-list');
const usersSpan = document.getElementById('users');

headerName.addEventListener('click', () => {
    userListDiv.classList.toggle('hidden');
});

// Format timestamp
function formatTime(ts) {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
}

// Render messages
function renderMessages(messages) {
    const usernames = new Map(); // store username → avatar

    chatBox.innerHTML = messages.map(m => {
        usernames.set(m.username, m.avatar); // store avatar

        let mediaHTML = '';
        if (m.image) mediaHTML += `<img src="${m.image}">`;
        if (m.video) mediaHTML += `<video src="${m.video}" autoplay loop muted></video>`;

        const cls = m.username === MY_NAME ? 'me' : 'them';
        const avatarHTML = m.avatar ? `<img src="${m.avatar}" class="msg-avatar">` : '';

        return `<div class="message ${cls}">
                    ${avatarHTML}
                    <div>
                        <b>${m.username}</b>: ${m.content || ''}
                        ${mediaHTML}
                        <span class="timestamp">${formatTime(m.ts)}</span>
                    </div>
                </div>`;
    }).join('');

    // Populate vertical user list
  usersSpan.innerHTML = ''; // clear
usersSpan.innerHTML = Array.from(usernames)
    .filter(([username]) => username !== MY_NAME) // exclude self
    .map(([username, avatar]) => {
        const avatarImg = avatar ? `<img src="${avatar}" class="user-item-avatar">` : `<div class="user-item-avatar-placeholder"></div>`;
        return `<div class="user-item">${avatarImg}<span>${username}</span></div>`;
    })
    .join('');

    chatBox.scrollTop = chatBox.scrollHeight;

    // Play sound if last message is not mine
    const lastMsg = messages[messages.length-1];
    if (lastMsg && lastMsg.username !== MY_NAME) sound.play();
}


// Fetch messages
async function fetchMessages() {
    try {
        const res = await fetch(API);
        const data = await res.json();
        renderMessages(data);
    } catch(err) {
        console.error('Fetch error:', err);
    }
}

// Send message
async function sendMessage() {
    const content = input.value.trim();
    if (!content) return;

    await fetch(API, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username: MY_NAME, content, ts: Date.now() })
    });

    input.value = '';
    fetchMessages();
}

sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });

// Refresh every 2s
setInterval(fetchMessages, 2000);
fe
