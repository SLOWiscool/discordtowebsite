let messages = [];

export default function handler(req, res) {
    if(req.method === 'POST') {
        const { username, content } = req.body;
        if(username && content) {
            messages.push({ username, content });
        }
        return res.status(200).json({ success: true });
    } else {
        // GET returns the message array
        return res.status(200).json(messages);
    }
}
