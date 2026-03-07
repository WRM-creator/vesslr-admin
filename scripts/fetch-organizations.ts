/**
 * Temporary diagnostic script: fetch organizations from MongoDB
 * Run with: npx tsx scripts/fetch-organizations.ts
 */

import { MongoClient } from "mongodb";

const DB_URL =
  "mongodb+srv://mikejolamoses_db_user:rArvkW4hSDPMvvhn@cluster0.su03tfd.mongodb.net/test?appName=Cluster0";

async function main() {
  const client = new MongoClient(DB_URL);
  await client.connect();
  console.log("Connected to MongoDB");

  const db = client.db();
  const orgs = db.collection("organizations");

  const total = await orgs.countDocuments();
  console.log(`\nTotal organizations in DB: ${total}`);

  const docs = await orgs
    .find({})
    .sort({ createdAt: -1 })
    .limit(10)
    .toArray();

  console.log(`\nFirst ${docs.length} organizations (latest first):`);
  for (const doc of docs) {
    console.log({
      _id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      type: doc.type,
      verificationStatus: doc.verificationStatus,
      createdAt: doc.createdAt,
    });
  }

  // Check distinct types
  const types = await orgs.distinct("type");
  console.log("\nDistinct 'type' values:", types);

  // Check if there are any without a type field
  const noType = await orgs.countDocuments({ type: { $exists: false } });
  console.log(`Organizations without 'type' field: ${noType}`);

  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
