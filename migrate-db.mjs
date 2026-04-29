import { MongoClient } from 'mongodb';

// CONFIGURATION
const OLD_URI = 'mongodb+srv://user123:user123@cluster0.ofi5bhc.mongodb.net/digital-broker';
const NEW_URI = 'mongodb+srv://DigiBro123:o9mK2ukQL5uTV3NT@cluster0.wajwxbz.mongodb.net/digital-broker';

async function migrate() {
  const oldClient = new MongoClient(OLD_URI);
  const newClient = new MongoClient(NEW_URI);

  try {
    console.log('Connecting to old database...');
    await oldClient.connect();
    const oldDb = oldClient.db();

    console.log('Connecting to new database...');
    await newClient.connect();
    const newDb = newClient.db();

    const collections = await oldDb.listCollections().toArray();
    console.log(`Found ${collections.length} collections.`);

    for (const collInfo of collections) {
      const collName = collInfo.name;
      console.log(`Migrating collection: ${collName}`);
      
      const documents = await oldDb.collection(collName).find({}).toArray();
      
      if (documents.length > 0) {
        console.log(`Inserting ${documents.length} documents into ${collName}...`);
        // Use insertMany to copy all data
        await newDb.collection(collName).insertMany(documents);
        console.log(`✓ Migration of ${collName} complete.`);
      } else {
        console.log(`Skipping ${collName} (empty).`);
      }
    }

    console.log('\n====================================');
    console.log('🚀 MIGRATION COMPLETED SUCCESSFULLY!');
    console.log('====================================');

  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await oldClient.close();
    await newClient.close();
  }
}
migrate();
