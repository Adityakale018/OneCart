/**
 * Upload original product images to Cloudinary and create all original admin products
 * Run: node seedOriginalProducts.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMG_DIR = path.join(__dirname, "..", "img");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_APISECRET,
});

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

// Upload a local image file to Cloudinary and return the URL
async function upload(filename) {
    const filePath = path.join(IMG_DIR, filename);
    if (!fs.existsSync(filePath)) {
        console.warn(`  ⚠️  File not found: ${filename}`);
        return null;
    }
    const result = await cloudinary.uploader.upload(filePath, { resource_type: "image" });
    return result.secure_url;
}

// Products to recreate — matching original admin uploads exactly
// Groups: each product has [img1, img2, img3, img4]
const PRODUCTS_TO_CREATE = [
    // ── Already in DB (restored from orders) — skip these ──────────────────────
    // Kids Wear, Jackets for Men, Shirt for Men, Jackets for kids,
    // Pants For Men (x2), Jacket For women
    // ─── Missing products — recreate these ─────────────────────────────────────
    {
        name: "Jacket For Kids Girl",
        description: "Stylish and warm jacket for girls. Perfect for winter and outdoor activities. Comfortable fit with durable material.",
        price: 999,
        category: "Kids",
        subCategory: "TopWear",
        sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y"],
        bestseller: false,
        imgs: ["jacket for kids girl.jpg", "jacket for kids girl1.jpg", "jacket for kids girl2.jpg", "jacket for kids girl3.jpg"],
    },
    {
        name: "Pants for Kids",
        description: "Comfortable and durable pants for kids. Elastic waistband for easy wear. Available in fun prints and solid colours.",
        price: 499,
        category: "Kids",
        subCategory: "BottomWear",
        sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y"],
        bestseller: false,
        imgs: ["kidspant1.webp", "kidspant2.jpg", "kidspant3.jpg", "kidspant4.jpg"],
    },
    {
        name: "Kids T-Shirt",
        description: "Soft and breathable cotton t-shirt for kids. Fun graphic prints, easy to wash and long-lasting.",
        price: 399,
        category: "Kids",
        subCategory: "TopWear",
        sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y"],
        bestseller: true,
        imgs: ["kidt-shirt1.jpg", "kidt-shirt2.jpg", "kidt-shirt3.jpg", "kidt-shirt4.jpg"],
    },
    {
        name: "Lower for Men",
        description: "Comfortable cotton lower for men. Perfect for lounging at home or casual outings. Elastic waistband with drawstring.",
        price: 599,
        category: "Men",
        subCategory: "BottomWear",
        sizes: ["S", "M", "L", "XL", "XXL"],
        bestseller: false,
        imgs: ["manlower1.jpg", "manlower2.jpg", "manlower3.jpg", "manlower4.jpg"],
    },
    {
        name: "Pants For Women",
        description: "Elegant and comfortable pants for women. Slim fit design with a flattering silhouette. Great for both casual and office wear.",
        price: 899,
        category: "Women",
        subCategory: "BottomWear",
        sizes: ["XS", "S", "M", "L", "XL"],
        bestseller: false,
        imgs: ["pantwoman1.jpg", "pantwoman2.jpg", "pantwoman4.jpg", "pantwoman11.jpg"],
    },
    {
        name: "Shirt For Women",
        description: "Chic and versatile shirt for women. Lightweight fabric with a relaxed fit. Can be styled multiple ways for different occasions.",
        price: 799,
        category: "Women",
        subCategory: "TopWear",
        sizes: ["XS", "S", "M", "L", "XL"],
        bestseller: true,
        imgs: ["shirtwomen1.jpg", "shirtwomen2.jpg", "shirtwomen3.jpg", "shirtwomen4.jpg"],
    },
    {
        name: "T-Shirt for Men",
        description: "Classic cotton t-shirt for men. Crew neck with short sleeves. Soft, breathable fabric ideal for everyday wear.",
        price: 499,
        category: "Men",
        subCategory: "TopWear",
        sizes: ["S", "M", "L", "XL", "XXL"],
        bestseller: true,
        imgs: ["t-shirtman1.jpg", "t-shirtman2.jpg", "t-shirtman3.jpg", "t-shirtman4.jpg"],
    },
    {
        name: "T-Shirt for Women",
        description: "Comfortable and stylish t-shirt for women. Soft cotton blend with a flattering fit. A wardrobe staple for every occasion.",
        price: 499,
        category: "Women",
        subCategory: "TopWear",
        sizes: ["XS", "S", "M", "L", "XL"],
        bestseller: false,
        imgs: ["t-shirtwomen1.jpg", "t-shirtwomen2.jpg", "t-shirtwomen3.jpg", "t-shirtwomen4.jpg"],
    },
    {
        name: "Formal Shirt for Men",
        description: "Premium formal shirt for men. Slim-fit design with fine cotton blend. Perfect for office, meetings, and formal occasions.",
        price: 1199,
        category: "Men",
        subCategory: "TopWear",
        sizes: ["S", "M", "L", "XL", "XXL"],
        bestseller: false,
        imgs: ["shirtman1.jpg", "shirtman2.jpg", "shirtman3.jpg", "shirtman4.jpg"],
    },
    {
        name: "Casual Shirt for Women",
        description: "Trendy and casual shirt for women. Lightweight woven fabric with a relaxed silhouette. Perfect for everyday styling.",
        price: 899,
        category: "Women",
        subCategory: "TopWear",
        sizes: ["XS", "S", "M", "L", "XL"],
        bestseller: false,
        imgs: ["shirtwomen11.jpg", "shirtwomen22.jpg", "shirtwomen33.jpg", "shirtwomen44.jpg"],
    },
    {
        name: "Denim Pants for Men",
        description: "Classic denim pants for men. Mid-rise with a straight leg cut. Durable fabric that gets better with every wear.",
        price: 1299,
        category: "Men",
        subCategory: "BottomWear",
        sizes: ["28", "30", "32", "34", "36"],
        bestseller: false,
        imgs: ["pantman1.jpg", "pantman2.jpg", "pantman3.jpg", "pantman4.jpg"],
    },
    {
        name: "Girls Wear",
        description: "Adorable and comfortable outfit for girls. Soft fabric with vibrant colours. Perfect for playtime and casual occasions.",
        price: 699,
        category: "Kids",
        subCategory: "TopWear",
        sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y"],
        bestseller: false,
        imgs: ["girl.webp", "girl 23.jpg", "girl.webp", "girl 23.jpg"],
    },
];

async function seed() {
    console.log("\n🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ Connected.\n");

    const before = await Product.countDocuments();
    console.log(`📦 Current products in DB: ${before} (should be ~7 restored originals)\n`);

    let created = 0;
    let skipped = 0;

    for (const prod of PRODUCTS_TO_CREATE) {
        const exists = await Product.findOne({ name: prod.name });
        if (exists) {
            console.log(`⏭  Already exists: ${prod.name}`);
            skipped++;
            continue;
        }

        console.log(`📤 Uploading images for: ${prod.name}...`);
        const [img1, img2, img3, img4] = await Promise.all(prod.imgs.map(upload));

        if (!img1) {
            console.log(`❌ Skipped (missing images): ${prod.name}`);
            skipped++;
            continue;
        }

        await Product.create({
            name: prod.name,
            image1: img1,
            image2: img2 || img1,
            image3: img3 || img1,
            image4: img4 || img1,
            description: prod.description,
            price: prod.price,
            category: prod.category,
            subCategory: prod.subCategory,
            sizes: prod.sizes,
            date: Date.now(),
            bestseller: prod.bestseller,
        });

        console.log(`✅ Created: ${prod.name} (₹${prod.price})`);
        created++;
    }

    const after = await Product.countDocuments();
    console.log(`\n🎉 Done!`);
    console.log(`   Created: ${created} new products`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Total products now in DB: ${after}`);

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch(err => {
    console.error("❌ Error:", err.message);
    process.exit(1);
});
