import "dotenv/config";
import mongoose from "mongoose";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { connectDB } from "./db.js";
import { Root } from "./models/Root.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedFile = join(__dirname, "seed-data.json");
const seedData = JSON.parse(readFileSync(seedFile, "utf-8"));

async function seed() {
  await connectDB(process.env.MONGO_URI!);
  console.log(`Deleting existing roots...`);
  await Root.deleteMany({});
  console.log(`Inserting ${seedData.length} roots...`);
  await Root.insertMany(seedData);
  console.log(`✓ Seeded ${seedData.length} roots`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});