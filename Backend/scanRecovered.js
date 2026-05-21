import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function recover() {
    await mongoose.connect(process.env.MONGODB_URL);
    const db = mongoose.connection.db;
    
    const orders = await db.collection("orders").find({}).toArray();
    const recoveredMap = new Map();
    
    for (let order of orders) {
        if (order.items && Array.isArray(order.items)) {
            for (let item of order.items) {
                if (item._id && item.name) {
                    // Extract fields matching the product schema
                    const prod = {
                        _id: new mongoose.Types.ObjectId(item._id),
                        name: item.name,
                        image1: item.image1,
                        image2: item.image2,
                        image3: item.image3,
                        image4: item.image4,
                        description: item.description,
                        price: item.price,
                        category: item.category,
                        subCategory: item.subCategory,
                        sizes: item.sizes,
                        date: item.date || Date.now(),
                        bestseller: item.bestseller || false
                    };
                    recoveredMap.set(item._id.toString(), prod);
                }
            }
        }
    }

    console.log(`Recovered ${recoveredMap.size} unique older products from orders collection.`);
    recoveredMap.forEach((p, id) => {
        console.log(`- ID: ${id}, Name: ${p.name}, Price: ${p.price}`);
    });

    await mongoose.disconnect();
    process.exit(0);
}

recover();
