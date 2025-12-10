const chatBox = document.getElementById('chat-box');
const input = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const API = '/api/messages';

async function fetchMessages() {
    const res = await fetch(API);
    const data = await res.json();

    chatBox.innerHTML = data.map(m => `
        <div class="message ${m.username === 'Ayaan' ? 'me' : 'them'}">
            ${m.content}
        </div>
    `).join('');

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

setInterval(fetchMessages, 1500);
fetchMessages();
