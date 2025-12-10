import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI; // Set this in Vercel Environment Variables
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

    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body);

    if (req.method === 'POST') {
        const { id, username, content, source, ts, avatar, replyTo, mentions, image, video } = body;
        if (!id || !username || (!content && !image && !video)) return res.status(400).json({ error: 'Missing fields' });

        await collection.insertOne({ id, username, content, source, ts, avatar, replyTo, mentions, image, video });
        return res.status(200).json({ success: true });
    }

    if (req.method === 'PUT') {
        const { content } = body;
        if (!content) return res.status(400).json({ error: 'Missing content' });
        await collection.updateOne({ id: req.query.id }, { $set: { content } });
        return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
        await collection.deleteOne({ id: req.query.id });
        return res.status(200).json({ success: true });
    }

    if (req.method === 'GET') {
        const messages = await collection.find({}).sort({ ts: 1 }).toArray();
        return res.status(200).json(messages);
    }

    res.status(405).json({ error: 'Method not allowed' });
}
