import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image1: String, image2: String, image3: String, image4: String,
    description: String, price: Number, category: String,
    subCategory: String, sizes: Array, date: Number, bestseller: Boolean,
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

async function cleanup() {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ Connected.\n");

    // Delete all products whose name contains " | " (the seeded branded ones with broken CDN images)
    const result = await Product.deleteMany({ name: /\s\|\s/ });
    console.log(`🗑️  Deleted ${result.deletedCount} products with broken brand CDN images.`);

    await mongoose.disconnect();
    console.log("\n✅ Done! You can now add fresh products via the Admin Panel.");
    process.exit(0);
}

cleanup().catch(err => { console.error("❌ Error:", err); process.exit(1); });
