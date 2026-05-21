import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function showCollections() {
    await mongoose.connect(process.env.MONGODB_URL);
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    // Check if there are other databases or tables
    // Print stats of each collection
    for (let coll of collections) {
        const count = await db.collection(coll.name).countDocuments();
        console.log(`- ${coll.name}: ${count} documents`);
    }

    await mongoose.disconnect();
    process.exit(0);
}

showCollections();
