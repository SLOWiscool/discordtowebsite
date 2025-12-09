const chatBox = document.getElementById('chat-box');
const input = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const API = '/api/messages';

// Fetch and render messages
async function fetchMessages() {
    try {
        const res = await fetch(API);
        const data = await res.json();

        // Show all messages (Discord + Snapchat)
        chatBox.innerHTML = data
            .map(m => `<div class="message"><span class="username">${m.username}:</span> ${m.content}</div>`)
            .join('');

        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (err) {
        console.error('Error fetching messages:', err);
    }
}

// Send a new message
async function sendMessage() {
    const content = input.value.trim();
    if (!content) return;

    try {
        await fetch(API, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: 'Ayaan', content, source: 'snapchat'})
        });

        input.value = '';
        fetchMessages(); // refresh chat after sending
    } catch (err) {
        console.error('Failed to send message:', err);
    }
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });

// Auto-refresh every 2 seconds
setInterval(fetchMessages, 2000);

// Initial fetch
fetchMessages();
