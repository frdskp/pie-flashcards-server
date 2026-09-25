import "dotenv/config";
import mongoose from "mongoose";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { connectDB } from "./db.js";
import { Root } from "./models/Root.js";
import { curatedRoots } from "./data/curatedRoots.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedFile = join(__dirname, "seed-data.json");
const seedData = JSON.parse(readFileSync(seedFile, "utf-8"));

const curatedSet = new Set(curatedRoots);
const enrichedData = seedData.map((entry: any) => ({
  ...entry,
  isCurated: curatedSet.has(entry.root),
}));

async function seed() {
  await connectDB(process.env.MONGO_URI!);
  console.log("Deleting existing roots...");
  await Root.deleteMany({});
  console.log(`Inserting ${enrichedData.length} roots...`);
  await Root.insertMany(enrichedData);
  const curatedCount = enrichedData.filter((e: any) => e.isCurated).length;
  console.log(`✓ Seeded ${enrichedData.length} roots (${curatedCount} curated)`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});