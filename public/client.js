const chatBox = document.getElementById('chat-box');
const input = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const API = '/api/messages';
const sound = document.getElementById('receive-sound');

const MY_NAME = "Ayaan"; // Change for each user

// Helper to format timestamp
function formatTime(ts) {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
}

// Render messages
function renderMessages(messages) {
    chatBox.innerHTML = messages.map(m => {
        let mediaHTML = '';
        if (m.image) mediaHTML += `<img src="${m.image}">`;
        if (m.video) mediaHTML += `<video src="${m.video}" autoplay loop muted></video>`;

        const cls = m.username === MY_NAME ? 'me' : 'them';
        const avatarHTML = m.avatar ? `<img src="${m.avatar}" class="msg-avatar">` : '';

        return `<div class="message ${cls}">
                    ${avatarHTML}
                    <b>${m.username}</b>: ${m.content || ''}
                    ${mediaHTML}
                    <span class="timestamp">${formatTime(m.ts)}</span>
                </div>`;
    }).join('');

    chatBox.scrollTop = chatBox.scrollHeight;
}


// Fetch messages
async function fetchMessages() {
    try {
        const res = await fetch(API);
        const data = await res.json();
        renderMessages(data);

        // Play sound for new messages from other users
        const lastMsg = data[data.length-1];
        if (lastMsg && lastMsg.username !== MY_NAME) sound.play();
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

// Auto-refresh
setInterval(fetchMessages, 2000);
fetchMessages();
