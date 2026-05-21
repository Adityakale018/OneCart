/**
 * Restore original admin-uploaded products
 * 1. Deletes ALL current seeded products (Brand | Name format)
 * 2. Recovers original products from the orders collection
 * Run: node restoreOriginalProducts.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image1: { type: String, required: true },
    image2: { type: String, required: true },
    image3: { type: String, required: true },
    image4: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { type: Array, required: true },
    date: { type: Number, required: true },
    bestseller: { type: Boolean },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

async function restore() {
    console.log("\n🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ Connected.\n");

    const db = mongoose.connection.db;

    // ── Step 1: Delete all current seeded products ────────────────────────────
    const before = await Product.countDocuments();
    console.log(`📦 Current product count: ${before}`);

    await Product.deleteMany({});
    console.log(`🗑️  Deleted all ${before} seeded products.\n`);

    // ── Step 2: Recover original products from orders collection ──────────────
    const orders = await db.collection("orders").find({}).toArray();
    const recoveredMap = new Map();

    for (const order of orders) {
        if (order.items && Array.isArray(order.items)) {
            for (const item of order.items) {
                if (item._id && item.name && item.image1) {
                    const id = item._id.toString();
                    if (!recoveredMap.has(id)) {
                        recoveredMap.set(id, {
                            _id: new mongoose.Types.ObjectId(id),
                            name: item.name,
                            image1: item.image1 || "",
                            image2: item.image2 || item.image1 || "",
                            image3: item.image3 || item.image1 || "",
                            image4: item.image4 || item.image1 || "",
                            description: item.description || item.name,
                            price: item.price,
                            category: item.category || "Men",
                            subCategory: item.subCategory || "Topwear",
                            sizes: item.sizes || ["S", "M", "L", "XL"],
                            date: item.date || Date.now(),
                            bestseller: item.bestseller || false,
                        });
                    }
                }
            }
        }
    }

    console.log(`🔍 Found ${recoveredMap.size} unique original products in orders.\n`);

    let restored = 0;
    for (const [, prod] of recoveredMap) {
        try {
            await Product.create(prod);
            console.log(`✅ Restored: ${prod.name} (₹${prod.price})`);
            restored++;
        } catch (err) {
            console.log(`⚠️  Could not restore "${prod.name}": ${err.message}`);
        }
    }

    const after = await Product.countDocuments();
    console.log(`\n🎉 Done!`);
    console.log(`   Restored: ${restored} original products`);
    console.log(`   Total products now in DB: ${after}`);

    await mongoose.disconnect();
    process.exit(0);
}

restore().catch(err => {
    console.error("❌ Error:", err.message);
    process.exit(1);
});
