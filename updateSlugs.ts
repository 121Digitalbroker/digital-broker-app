import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;

async function updateSlugs() {
  if (!uri) {
    console.error('MONGODB_URI is not defined.');
    return;
  }

  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  if (!db) {
      console.error('Failed to get db');
      return;
  }
  const properties = await db.collection('properties').find({}).toArray();
  
  let updatedCount = 0;
  for (const prop of properties) {
    if (!prop.slug) {
      const slugBase = `${prop.projectName}-${prop.sector || ''}-${prop.city}`.toLowerCase();
      const slug = slugBase
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
        
      await db.collection('properties').updateOne(
        { _id: prop._id },
        { $set: { slug } }
      );
      updatedCount++;
    }
  }
  
  console.log(`Updated ${updatedCount} properties with slugs.`);
  process.exit(0);
}

updateSlugs();
