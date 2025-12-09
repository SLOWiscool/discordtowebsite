const chatBox = document.getElementById('chat-box');
const input = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const API = '/api/messages';

async function fetchMessages() {
    const res = await fetch(API);
    const data = await res.json();

    // Only show messages NOT from Discord
    const snapMessages = data.filter(m => m.source !== 'discord');
    chatBox.innerHTML = snapMessages.map(m => `<div class="message"><span class="username">${m.username}:</span> ${m.content}</div>`).join('');
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const content = input.value.trim();
    if (!content) return;
    await fetch(API, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: 'Ayaan', content, source: 'snapchat'})
    });
    input.value = '';
    fetchMessages();
}

sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });

// Refresh chat every 2 seconds
setInterval(fetchMessages, 2000);
fetchMessages();
