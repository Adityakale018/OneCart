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

const brandedProducts = [
    // ─── ADIDAS ───────────────────────────────────────────────────────────────
    {
        name: "Adidas Essentials 3-Stripes T-Shirt",
        brand: "Adidas",
        image1: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/7a3f15d6b72d4c0a9ebcaf79010024c5_9366/Essentials_3-Stripes_T-Shirt_Black_IJ8929_21_model.jpg",
        image2: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/f7028b5b1cc84cdcad10af79010022a8_9366/Essentials_3-Stripes_T-Shirt_Black_IJ8929_22_model.jpg",
        image3: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/7a3f15d6b72d4c0a9ebcaf79010024c5_9366/Essentials_3-Stripes_T-Shirt_Black_IJ8929_21_model.jpg",
        image4: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/f7028b5b1cc84cdcad10af79010022a8_9366/Essentials_3-Stripes_T-Shirt_Black_IJ8929_22_model.jpg",
        description: "Iconic Adidas Essentials tee with bold 3-Stripes down the sleeves. Made from soft cotton jersey for all-day comfort. A wardrobe essential that transitions from the gym to the street with ease.",
        price: 1299,
        category: "Men",
        subCategory: "Topwear",
        sizes: ["S", "M", "L", "XL", "XXL"],
        date: Date.now(),
        bestseller: true,
    },
    {
        name: "Adidas Tiro 23 Track Pants",
        brand: "Adidas",
        image1: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/5b22d7b0f68f4578bdccafb30116fc5c_9366/Tiro_23_League_Pants_Black_HS3596_21_model.jpg",
        image2: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/5b22d7b0f68f4578bdccafb30116fc5c_9366/Tiro_23_League_Pants_Black_HS3596_21_model.jpg",
        image3: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/5b22d7b0f68f4578bdccafb30116fc5c_9366/Tiro_23_League_Pants_Black_HS3596_21_model.jpg",
        image4: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/5b22d7b0f68f4578bdccafb30116fc5c_9366/Tiro_23_League_Pants_Black_HS3596_21_model.jpg",
        description: "Professional-grade Adidas Tiro 23 track pants with tapered fit and iconic 3-Stripes. Features zip pockets, moisture-absorbing fabric and ankle zips. Engineered for peak performance and everyday wear.",
        price: 2499,
        category: "Men",
        subCategory: "Bottomwear",
        sizes: ["S", "M", "L", "XL"],
        date: Date.now(),
        bestseller: false,
    },
    {
        name: "Adidas Women's All Me 3-Bar Training Bra",
        brand: "Adidas",
        image1: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/a7de0a3d05a24ac6b63bae7800e7cf15_9366/All_Me_3-Bar_Training_Bra_Pink_HZ5718_21_model.jpg",
        image2: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/a7de0a3d05a24ac6b63bae7800e7cf15_9366/All_Me_3-Bar_Training_Bra_Pink_HZ5718_21_model.jpg",
        image3: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/a7de0a3d05a24ac6b63bae7800e7cf15_9366/All_Me_3-Bar_Training_Bra_Pink_HZ5718_21_model.jpg",
        image4: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/a7de0a3d05a24ac6b63bae7800e7cf15_9366/All_Me_3-Bar_Training_Bra_Pink_HZ5718_21_model.jpg",
        description: "Supportive Adidas training bra with iconic 3-Bar design. Medium support with removable cups, smooth fabric and a secure fit. Perfect for workouts and active days.",
        price: 1799,
        category: "Women",
        subCategory: "Topwear",
        sizes: ["XS", "S", "M", "L", "XL"],
        date: Date.now(),
        bestseller: false,
    },

    // ─── PUMA ─────────────────────────────────────────────────────────────────
    {
        name: "Puma Essential Logo Men's Tee",
        brand: "Puma",
        image1: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa/global/586668/01/mod01/fnd/IND/fmt/png",
        image2: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa/global/586668/01/bv/fnd/IND/fmt/png",
        image3: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa/global/586668/01/fnd/IND/fmt/png",
        image4: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa/global/586668/01/bv/fnd/IND/fmt/png",
        description: "Classic Puma Essential tee with signature No. 1 logo. Made from soft cotton, this versatile tee is designed for comfort and everyday style. Available in a relaxed fit.",
        price: 999,
        category: "Men",
        subCategory: "Topwear",
        sizes: ["S", "M", "L", "XL", "XXL"],
        date: Date.now(),
        bestseller: true,
    },
    {
        name: "Puma Amplified Women's Hoodie",
        brand: "Puma",
        image1: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa/global/585946/01/mod01/fnd/IND/fmt/png",
        image2: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa/global/585946/01/bv/fnd/IND/fmt/png",
        image3: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa/global/585946/01/mod01/fnd/IND/fmt/png",
        image4: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa/global/585946/01/bv/fnd/IND/fmt/png",
        description: "Bold Puma Amplified hoodie with large graphic logo. Made from a cotton-blend fleece for warmth and comfort. Features a kangaroo pocket and adjustable drawstring hood.",
        price: 2799,
        category: "Women",
        subCategory: "Topwear",
        sizes: ["XS", "S", "M", "L", "XL"],
        date: Date.now(),
        bestseller: false,
    },
    {
        name: "Puma Squad Men's Joggers",
        brand: "Puma",
        image1: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa/global/677155/01/mod01/fnd/IND/fmt/png",
        image2: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa/global/677155/01/bv/fnd/IND/fmt/png",
        image3: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa/global/677155/01/mod01/fnd/IND/fmt/png",
        image4: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa/global/677155/01/bv/fnd/IND/fmt/png",
        description: "Relaxed-fit Puma Squad joggers in a soft cotton blend. Features an elastic waistband with drawstring, tapered leg and side pockets. Ideal for lounging or light workouts.",
        price: 1999,
        category: "Men",
        subCategory: "Bottomwear",
        sizes: ["S", "M", "L", "XL"],
        date: Date.now(),
        bestseller: false,
    },

    // ─── NIKE ─────────────────────────────────────────────────────────────────
    {
        name: "Nike Sportswear Club Fleece Hoodie",
        brand: "Nike",
        image1: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/a969c88c-88e4-4484-b8d5-af4e2e972f81/sportswear-club-fleece-pullover-hoodie-BSVRD4.png",
        image2: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/3ffd9c2c-7bb1-4e37-9742-df5f3d6a0745/sportswear-club-fleece-pullover-hoodie-BSVRD4.png",
        image3: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/a969c88c-88e4-4484-b8d5-af4e2e972f81/sportswear-club-fleece-pullover-hoodie-BSVRD4.png",
        image4: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/3ffd9c2c-7bb1-4e37-9742-df5f3d6a0745/sportswear-club-fleece-pullover-hoodie-BSVRD4.png",
        description: "The Nike Club Fleece Pullover Hoodie is made from soft, midweight fleece for all-day comfort. The relaxed fit and ribbed cuffs give it a classic look that pairs well with everything.",
        price: 3499,
        category: "Men",
        subCategory: "Topwear",
        sizes: ["S", "M", "L", "XL", "XXL"],
        date: Date.now(),
        bestseller: true,
    },
    {
        name: "Nike Pro Women's Mid-Rise Shorts",
        brand: "Nike",
        image1: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/ab354ed4-7f51-4b6f-b5db-8ace8c2a69a6/pro-365-mid-rise-5-shorts-t7Ffpg.png",
        image2: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/48c68a48-a51e-45e1-a1e3-b534c1aa1665/pro-365-mid-rise-5-shorts-t7Ffpg.png",
        image3: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/ab354ed4-7f51-4b6f-b5db-8ace8c2a69a6/pro-365-mid-rise-5-shorts-t7Ffpg.png",
        image4: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/48c68a48-a51e-45e1-a1e3-b534c1aa1665/pro-365-mid-rise-5-shorts-t7Ffpg.png",
        description: "Nike Pro shorts built for high-intensity training. Dri-FIT technology pulls sweat away from your skin. Mesh side panels increase airflow for when it heats up.",
        price: 1899,
        category: "Women",
        subCategory: "Bottomwear",
        sizes: ["XS", "S", "M", "L", "XL"],
        date: Date.now(),
        bestseller: false,
    },
    {
        name: "Nike Air Men's Full-Zip Jacket",
        brand: "Nike",
        image1: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0/cde6ec8f-47ea-460e-9e31-aa0cae95f13e/air-full-zip-jacket-T3X0lN.png",
        image2: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0/cde6ec8f-47ea-460e-9e31-aa0cae95f13e/air-full-zip-jacket-T3X0lN.png",
        image3: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0/cde6ec8f-47ea-460e-9e31-aa0cae95f13e/air-full-zip-jacket-T3X0lN.png",
        image4: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0/cde6ec8f-47ea-460e-9e31-aa0cae95f13e/air-full-zip-jacket-T3X0lN.png",
        description: "The Nike Air Full-Zip Jacket features a classic athletic look with modern comfort. Made from fleece-backed fabric with a full-zip closure and kangaroo pockets.",
        price: 4299,
        category: "Men",
        subCategory: "Topwear",
        sizes: ["S", "M", "L", "XL", "XXL"],
        date: Date.now(),
        bestseller: true,
    },

    // ─── H&M ──────────────────────────────────────────────────────────────────
    {
        name: "H&M Slim Fit Oxford Shirt",
        brand: "H&M",
        image1: "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F70%2Fc5%2F70c5eab4e50bef56d96756d540ba2a7d6adca2e5.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url[file:/product/main]",
        image2: "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F70%2Fc5%2F70c5eab4e50bef56d96756d540ba2a7d6adca2e5.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url[file:/product/main]",
        image3: "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F70%2Fc5%2F70c5eab4e50bef56d96756d540ba2a7d6adca2e5.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url[file:/product/main]",
        image4: "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F70%2Fc5%2F70c5eab4e50bef56d96756d540ba2a7d6adca2e5.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url[file:/product/main]",
        description: "H&M slim fit Oxford shirt in premium cotton. Clean, collared design with a front button placket. Perfect for office days, casual Fridays and everything in between.",
        price: 1499,
        category: "Men",
        subCategory: "Topwear",
        sizes: ["S", "M", "L", "XL"],
        date: Date.now(),
        bestseller: false,
    },
    {
        name: "H&M Women's Flared Mini Skirt",
        brand: "H&M",
        image1: "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F72%2Ff2%2F72f28ae0e29e3f2c7e6c1a0a4cc2e8e3b6dde571.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url[file:/product/main]",
        image2: "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F72%2Ff2%2F72f28ae0e29e3f2c7e6c1a0a4cc2e8e3b6dde571.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url[file:/product/main]",
        image3: "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F72%2Ff2%2F72f28ae0e29e3f2c7e6c1a0a4cc2e8e3b6dde571.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url[file:/product/main]",
        image4: "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F72%2Ff2%2F72f28ae0e29e3f2c7e6c1a0a4cc2e8e3b6dde571.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url[file:/product/main]",
        description: "Feminine H&M flared mini skirt with a smooth woven finish. Features an elasticated waist and a flirty A-line silhouette. Great for pairing with a tucked-in blouse or crop top.",
        price: 1199,
        category: "Women",
        subCategory: "Bottomwear",
        sizes: ["XS", "S", "M", "L"],
        date: Date.now(),
        bestseller: false,
    },

    // ─── LEVI'S ───────────────────────────────────────────────────────────────
    {
        name: "Levi's 501 Original Fit Jeans",
        brand: "Levi's",
        image1: "https://lsco.scene7.com/is/image/lscoe/005010114-front-pdp?fmt=jpeg&qlt=70&resMode=bisharp&op_usm=1.25,0.6,8,0&wid=2000&hei=2000",
        image2: "https://lsco.scene7.com/is/image/lscoe/005010114-back-pdp?fmt=jpeg&qlt=70&resMode=bisharp&op_usm=1.25,0.6,8,0&wid=2000&hei=2000",
        image3: "https://lsco.scene7.com/is/image/lscoe/005010114-front-pdp?fmt=jpeg&qlt=70&resMode=bisharp&op_usm=1.25,0.6,8,0&wid=2000&hei=2000",
        image4: "https://lsco.scene7.com/is/image/lscoe/005010114-back-pdp?fmt=jpeg&qlt=70&resMode=bisharp&op_usm=1.25,0.6,8,0&wid=2000&hei=2000",
        description: "The iconic Levi's 501 — the original blue jean since 1873. Straight-leg cut with a button fly, five pockets and the signature leather patch. A timeless classic in every wardrobe.",
        price: 3999,
        category: "Men",
        subCategory: "Bottomwear",
        sizes: ["28", "30", "32", "34", "36"],
        date: Date.now(),
        bestseller: true,
    },
    {
        name: "Levi's 711 Women's Skinny Jeans",
        brand: "Levi's",
        image1: "https://lsco.scene7.com/is/image/lscoe/188820148-front-pdp?fmt=jpeg&qlt=70&resMode=bisharp&op_usm=1.25,0.6,8,0&wid=2000&hei=2000",
        image2: "https://lsco.scene7.com/is/image/lscoe/188820148-back-pdp?fmt=jpeg&qlt=70&resMode=bisharp&op_usm=1.25,0.6,8,0&wid=2000&hei=2000",
        image3: "https://lsco.scene7.com/is/image/lscoe/188820148-front-pdp?fmt=jpeg&qlt=70&resMode=bisharp&op_usm=1.25,0.6,8,0&wid=2000&hei=2000",
        image4: "https://lsco.scene7.com/is/image/lscoe/188820148-back-pdp?fmt=jpeg&qlt=70&resMode=bisharp&op_usm=1.25,0.6,8,0&wid=2000&hei=2000",
        description: "Levi's 711 Skinny jeans in a stretch denim blend for a snug, flattering fit. Sits below the waist with a skinny leg from hip to ankle. Classic 5-pocket styling.",
        price: 3499,
        category: "Women",
        subCategory: "Bottomwear",
        sizes: ["26", "28", "30", "32"],
        date: Date.now(),
        bestseller: false,
    },

    // ─── ZARA ─────────────────────────────────────────────────────────────────
    {
        name: "Zara Printed Floral Midi Dress",
        brand: "Zara",
        image1: "https://static.zara.net/photos///2024/V/0/1/p/8080/133/620/2/w/750/8080133620_1_1_1.jpg",
        image2: "https://static.zara.net/photos///2024/V/0/1/p/8080/133/620/2/w/750/8080133620_2_1_1.jpg",
        image3: "https://static.zara.net/photos///2024/V/0/1/p/8080/133/620/2/w/750/8080133620_1_1_1.jpg",
        image4: "https://static.zara.net/photos///2024/V/0/1/p/8080/133/620/2/w/750/8080133620_2_1_1.jpg",
        description: "Zara floral-print midi dress with V-neckline, short sleeves and a flowing silhouette. Crafted from a lightweight woven fabric with an all-over floral pattern — effortlessly chic for any occasion.",
        price: 2999,
        category: "Women",
        subCategory: "Topwear",
        sizes: ["XS", "S", "M", "L"],
        date: Date.now(),
        bestseller: true,
    },
    {
        name: "Zara Men's Relaxed Fit Blazer",
        brand: "Zara",
        image1: "https://static.zara.net/photos///2024/V/0/2/p/2319/311/800/2/w/750/2319311800_1_1_1.jpg",
        image2: "https://static.zara.net/photos///2024/V/0/2/p/2319/311/800/2/w/750/2319311800_2_1_1.jpg",
        image3: "https://static.zara.net/photos///2024/V/0/2/p/2319/311/800/2/w/750/2319311800_1_1_1.jpg",
        image4: "https://static.zara.net/photos///2024/V/0/2/p/2319/311/800/2/w/750/2319311800_2_1_1.jpg",
        description: "Zara relaxed-fit blazer in a premium fabric blend. Notch lapels, welt pockets and a single-button fastening. Pairs perfectly with trousers for smart-casual or formal looks.",
        price: 4999,
        category: "Men",
        subCategory: "Topwear",
        sizes: ["S", "M", "L", "XL"],
        date: Date.now(),
        bestseller: false,
    },

    // ─── CAMPUS SUTRA (Indian Brand) ──────────────────────────────────────────
    {
        name: "Campus Sutra Men's Graphic Oversized Tee",
        brand: "Campus Sutra",
        image1: "https://images.meesho.com/images/products/340698843/8qkgy_512.webp",
        image2: "https://images.meesho.com/images/products/340698843/8qkgy_512.webp",
        image3: "https://images.meesho.com/images/products/340698843/8qkgy_512.webp",
        image4: "https://images.meesho.com/images/products/340698843/8qkgy_512.webp",
        description: "Campus Sutra oversized graphic tee with bold street-art inspired print. Drop shoulders, relaxed silhouette and a crew neck. Perfect for that effortless, laid-back street-style look.",
        price: 799,
        category: "Men",
        subCategory: "Topwear",
        sizes: ["S", "M", "L", "XL", "XXL"],
        date: Date.now(),
        bestseller: false,
    },
    {
        name: "Campus Sutra Women's Crop Sweatshirt",
        brand: "Campus Sutra",
        image1: "https://images.meesho.com/images/products/302546532/bkxvl_512.webp",
        image2: "https://images.meesho.com/images/products/302546532/bkxvl_512.webp",
        image3: "https://images.meesho.com/images/products/302546532/bkxvl_512.webp",
        image4: "https://images.meesho.com/images/products/302546532/bkxvl_512.webp",
        description: "Campus Sutra women's crop sweatshirt in cozy fleece fabric. Ribbed hem and cuffs, crew neck, and a relaxed fit. Great for a casual day out or lounging at home.",
        price: 1099,
        category: "Women",
        subCategory: "Topwear",
        sizes: ["XS", "S", "M", "L"],
        date: Date.now(),
        bestseller: false,
    },

    // ─── KIDS ─────────────────────────────────────────────────────────────────
    {
        name: "Adidas Kids' Entrada 22 Jersey",
        brand: "Adidas",
        image1: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/f8a0cb29c1db4b52bc29ae7701346f25_9366/Entrada_22_Jersey_White_HG6280_21_model.jpg",
        image2: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/f8a0cb29c1db4b52bc29ae7701346f25_9366/Entrada_22_Jersey_White_HG6280_21_model.jpg",
        image3: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/f8a0cb29c1db4b52bc29ae7701346f25_9366/Entrada_22_Jersey_White_HG6280_21_model.jpg",
        image4: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/f8a0cb29c1db4b52bc29ae7701346f25_9366/Entrada_22_Jersey_White_HG6280_21_model.jpg",
        description: "Adidas Kids' Entrada 22 football jersey. Lightweight recycled polyester with moisture-absorbing AEROREADY technology. Designed for young athletes who love the game.",
        price: 899,
        category: "Kids",
        subCategory: "Topwear",
        sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y"],
        date: Date.now(),
        bestseller: false,
    },
    {
        name: "Puma Kids Fun Jogger Pants",
        brand: "Puma",
        image1: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa/global/846841/01/mod01/fnd/IND/fmt/png",
        image2: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa/global/846841/01/bv/fnd/IND/fmt/png",
        image3: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa/global/846841/01/mod01/fnd/IND/fmt/png",
        image4: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa/global/846841/01/bv/fnd/IND/fmt/png",
        description: "Puma Kids' Fun jogger pants with an elastic waistband and drawstring for a comfy fit. Side pockets and tapered leg with Puma Cat logo on the leg. Kids love the sporty style.",
        price: 1199,
        category: "Kids",
        subCategory: "Bottomwear",
        sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y"],
        date: Date.now(),
        bestseller: false,
    },
];

async function seed() {
    console.log("🌱 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ Connected.\n");

    let inserted = 0;
    let skipped = 0;

    for (const p of brandedProducts) {
        const { brand, ...productData } = p; // strip brand field (not in schema)
        productData.name = `${brand} | ${productData.name}`; // Prefix brand in name
        const exists = await Product.findOne({ name: productData.name });
        if (exists) {
            console.log(`⏭  Skipping (already exists): ${productData.name}`);
            skipped++;
        } else {
            await Product.create(productData);
            console.log(`✅ Added: ${productData.name}`);
            inserted++;
        }
    }

    console.log(`\n🎉 Done! ${inserted} products added, ${skipped} skipped.`);
    await mongoose.disconnect();
    process.exit(0);
}

seed().catch((err) => {
    console.error("❌ Seed error:", err);
    process.exit(1);
});
