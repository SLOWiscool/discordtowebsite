const chatBox = document.getElementById('chat-box');
const input = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const API = '/api/messages';

let lastDiscordId = null;

// Request notifications
if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
}

async function fetchMessages() {
    const res = await fetch(API);
    const data = await res.json();

    // Update chat box
    chatBox.innerHTML = data.map(m => {
        const pfp = `<img src="${m.avatar || 'default.png'}" class="pfp">`;
        const cls = m.source === 'discord' ? 'them' : 'me';
        const timestamp = new Date(m.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let media = '';
        if (m.image) media = `<img src="${m.image}" class="media">`;
        if (m.video) media = `<video src="${m.video}" class="media" controls></video>`;
        return `<div class="message ${cls}">
                    ${pfp}<span class="username">${m.username}</span>
                    <span class="timestamp">${timestamp}</span>
                    <div class="content">${m.content || ''}</div>
                    ${media}
                </div>`;
    }).join('');
    chatBox.scrollTop = chatBox.scrollHeight;

    // Notify for new Discord messages
    const newDiscordMsg = data.find(m => m.source === "discord" && m.id !== lastDiscordId);
    if (newDiscordMsg && Notification.permission === "granted") {
        new Notification(newDiscordMsg.username, {
            body: newDiscordMsg.content || "Sent an image/GIF",
            icon: newDiscordMsg.avatar
        });
        lastDiscordId = newDiscordMsg.id;
    }
}

async function sendMessage() {
    const content = input.value.trim();
    if (!content) return;
    await fetch(API, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ 
            id: Date.now().toString(), 
            username: 'Ayaan', 
            content, 
            source: 'snapchat', 
            ts: Date.now() 
        })
    });
    input.value = '';
    fetchMessages();
}

sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });

setInterval(fetchMessages, 2000);
fetchMessages();
