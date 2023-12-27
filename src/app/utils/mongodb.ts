import { MongoClient, Db, Collection } from 'mongodb';

let cachedClient: MongoClient | null = null;

export async function connectToDatabase(): Promise<Db> {
    if (cachedClient) {
        return cachedClient.db('wyuCalendar');
    }

    const client = await MongoClient.connect(process.env.MONGODB_URL || '');

    cachedClient = client;
    return client.db('wyuCalendar');
}

export async function mongodb() {
    const db = await connectToDatabase();
    const collection: Collection = db.collection('wyuCalendar');
    return collection
}

export async function closeDatabaseConnection() {
    if (cachedClient) {
        await cachedClient.close();
        cachedClient = null;
    }
}
