import mongoose from 'mongoose';
import { MONGO_URI, DB_NAME } from '#config';

try {
  const client = await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
  console.log(`\x1b[35mConnected to MongoDB @ ${client.connection.host} - ${client.connection.name}\x1b[0m`);
} catch (error) {
  console.error(`\x1b[31mMongoDB connection error, ${error}\x1b[0m`);
  process.exit(1);
}
