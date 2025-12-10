import { MongoClient } from 'mongodb';

// <-- PUT YOUR FULL MONGO URI HERE
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

    // CREATE NEW MESSAGE
    if (req.method === 'POST') {
        const body = JSON.parse(req.body);
        const { id, username, content, source, ts, avatar, replyTo, mentions } = body;
        if (!id || !username || !content) return res.status(400).json({ error: 'Missing fields' });

        await collection.insertOne({ 
            _id: id, 
            username, 
            content, 
            source, 
            ts, 
            avatar, 
            replyTo, 
            mentions 
        });
        return res.status(200).json({ success: true });
    }

    // GET ALL MESSAGES
    if (req.method === 'GET') {
        const messages = await collection.find({}).sort({ ts: 1 }).toArray();
        return res.status(200).json(messages);
    }

    // EDIT MESSAGE
    if (req.method === 'PUT') {
        const { content } = JSON.parse(req.body);
        const { id } = req.query;
        await collection.updateOne({ _id: id }, { $set: { content } });
        return res.status(200).json({ success: true });
    }

    // DELETE MESSAGE
    if (req.method === 'DELETE') {
        const { id } = req.query;
        await collection.deleteOne({ _id: id });
        return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
}
