import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://superslashergamez1:adammiah2@cluster0.hxktk9m.mongodb.net/?retryWrites=true&w=majority";

let cachedClient = null;

async function connectMongo() {
    if (cachedClient) return cachedClient;
    const client = new MongoClient(uri);
    await client.connect();
    cachedClient = client;
    return client;
}

export default async function handler(req, res) {
    const client = await connectMongo();
    const collection = client.db('discordrelay').collection('messages');

    try {
        if (req.method === 'POST') {
            let body;
            try {
                body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            } catch (err) {
                return res.status(400).json({ error: 'Invalid JSON' });
            }

            const { username, content, source, ts, image, video, avatar } = body;
            if (!username || (!content && !image && !video)) {
                return res.status(400).json({ error: 'Missing username or message content' });
            }

            await collection.insertOne({
                username,
                content: content || '',
                source: source || 'snapchat',
                ts: ts || Date.now(),
                image: image || null,
                video: video || null,
                avatar: avatar || null
            });

            return res.status(200).json({ success: true });
        }

        if (req.method === 'GET') {
            const messages = await collection.find({}).sort({ ts: 1 }).toArray();
            return res.status(200).json(messages);
        }

        res.status(405).json({ error: 'Method not allowed' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
