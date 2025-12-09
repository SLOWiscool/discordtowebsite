// api/messages.js
import fs from 'fs';
import path from 'path';

const MESSAGES_FILE = path.join(process.cwd(), 'messages.json');

// Ensure file exists
if (!fs.existsSync(MESSAGES_FILE)) fs.writeFileSync(MESSAGES_FILE, '[]');

export default function handler(req, res) {
    const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf8'));

    if (req.method === 'POST') {
        const { username, content, source } = req.body;
        if (!username || !content) return res.status(400).json({ error: 'Missing username or content' });

        messages.push({ username, content, source: source || 'snapchat', ts: Date.now() });
        fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf8');
        return res.status(200).json({ success: true });
    } else {
        // Return all messages
        return res.status(200).json(messages);
    }
}
