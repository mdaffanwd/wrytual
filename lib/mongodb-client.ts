import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const options = {};

if (!uri) throw new Error("Missing MONGODB_URI");

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;
export default clientPromise;
