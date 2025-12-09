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

    if (req.method === 'POST') {
        const body = JSON.parse(req.body);
        const { username, content } = body;
        if (!username || !content) return res.status(400).json({ error: 'Missing username or content' });

        await collection.insertOne({ username, content, source: 'snapchat', ts: Date.now() });
        return res.status(200).json({ success: true });
    }

    if (req.method === 'GET') {
        const messages = await collection.find({}).sort({ ts: 1 }).toArray();
        return res.status(200).json(messages);
    }

    res.status(405).json({ error: 'Method not allowed' });
}
