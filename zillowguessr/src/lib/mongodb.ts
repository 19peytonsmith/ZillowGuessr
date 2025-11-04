// src/lib/mongodb.ts
import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || "zillow-webscraper";

if (!MONGODB_URI) {
  console.warn(
    "MONGODB_URI is not set. Database access will fail until it's provided."
  );
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getDb(): Promise<Db> {
  if (cachedDb) return cachedDb;
  if (!MONGODB_URI) throw new Error("MONGODB_URI not configured");

  if (!cachedClient) {
    cachedClient = new MongoClient(MONGODB_URI, {
      // use unified topology defaults
    });
    await cachedClient.connect();
  }

  cachedDb = cachedClient.db(DB_NAME);
  return cachedDb;
}
