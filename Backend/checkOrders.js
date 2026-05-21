import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function checkOrders() {
    await mongoose.connect(process.env.MONGODB_URL);
    const db = mongoose.connection.db;
    
    console.log("Checking orders collection...");
    const orders = await db.collection("orders").find({}).toArray();
    console.log("Total orders:", orders.length);
    if (orders.length > 0) {
        console.log("Sample order items:");
        orders.slice(0, 10).forEach((order, idx) => {
            console.log(`Order ${idx + 1} (${order._id || order.id}):`);
            if (order.items) {
                console.log(JSON.stringify(order.items, null, 2));
            } else {
                console.log("No items field. Keys:", Object.keys(order));
            }
        });
    }

    console.log("\nChecking sharedcarts collection...");
    const carts = await db.collection("sharedcarts").find({}).toArray();
    console.log("Total shared carts:", carts.length);
    if (carts.length > 0) {
        console.log("Sample cart items:");
        carts.slice(0, 5).forEach((cart, idx) => {
            console.log(`Cart ${idx + 1}:`);
            if (cart.items) {
                console.log(JSON.stringify(cart.items, null, 2));
            } else {
                console.log("No items field. Keys:", Object.keys(cart));
            }
        });
    }

    await mongoose.disconnect();
    process.exit(0);
}

checkOrders();
