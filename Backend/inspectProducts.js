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

async function inspect() {
    await mongoose.connect(process.env.MONGODB_URL);
    const all = await Product.find({}).lean();
    console.log("Total products:", all.length);
    console.log("Samples:");
    all.slice(0, 30).forEach((p, idx) => {
        console.log(`${idx + 1}. ${p.name}`);
    });
    await mongoose.disconnect();
    process.exit(0);
}

inspect();
