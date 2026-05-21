/**
 * Remove only the newly added branded products (from seedBrandedProducts.js)
 * and restore the original product set (from seedProducts.js).
 * Run: node removeNewProducts.js
 */
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

// Exact names as inserted by seedBrandedProducts.js
// (brand field was prefixed: `${brand} | ${productData.name}`)
const newlyAddedProductNames = [
    "Adidas | Adidas Essentials 3-Stripes T-Shirt",
    "Adidas | Adidas Tiro 23 Track Pants",
    "Adidas | Adidas Women's All Me 3-Bar Training Bra",
    "Puma | Puma Essential Logo Men's Tee",
    "Puma | Puma Amplified Women's Hoodie",
    "Puma | Puma Squad Men's Joggers",
    "Nike | Nike Sportswear Club Fleece Hoodie",
    "Nike | Nike Pro Women's Mid-Rise Shorts",
    "Nike | Nike Air Men's Full-Zip Jacket",
    "H&M | H&M Slim Fit Oxford Shirt",
    "H&M | H&M Women's Flared Mini Skirt",
    "Levi's | Levi's 501 Original Fit Jeans",
    "Levi's | Levi's 711 Women's Skinny Jeans",
    "Zara | Zara Printed Floral Midi Dress",
    "Zara | Zara Men's Relaxed Fit Blazer",
    "Campus Sutra | Campus Sutra Men's Graphic Oversized Tee",
    "Campus Sutra | Campus Sutra Women's Crop Sweatshirt",
    "Adidas | Adidas Kids' Entrada 22 Jersey",
    "Puma | Puma Kids Fun Jogger Pants",
];

async function removeNewProducts() {
    console.log("\n🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ Connected.\n");

    const beforeCount = await Product.countDocuments();
    console.log(`📦 Total products before cleanup: ${beforeCount}`);

    let deleted = 0;
    let notFound = 0;

    for (const name of newlyAddedProductNames) {
        const result = await Product.deleteOne({ name });
        if (result.deletedCount > 0) {
            console.log(`🗑️  Removed: ${name}`);
            deleted++;
        } else {
            console.log(`⚠️  Not found (already removed?): ${name}`);
            notFound++;
        }
    }

    const afterCount = await Product.countDocuments();
    console.log(`\n✅ Done!`);
    console.log(`   Removed: ${deleted} products`);
    console.log(`   Not found: ${notFound} products`);
    console.log(`   Total products remaining: ${afterCount}`);

    await mongoose.disconnect();
    process.exit(0);
}

removeNewProducts().catch(err => {
    console.error("❌ Error:", err.message);
    process.exit(1);
});
