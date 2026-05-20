/**
 * Seed 100+ professional branded clothing products into MongoDB
 * Images: Unsplash (cross-origin safe, no hotlink block)
 * Casing: subCategory uses "TopWear", "BottomWear", "WinterWear" to match Collections.jsx filtering.
 * Each product has 4 DISTINCT Unsplash images.
 * Run: node seedProducts.js
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

// Unsplash image utility
const u = (id) => `https://images.unsplash.com/photo-${id}?w=600&h=800&fit=crop&auto=format&q=80`;

// ─── Verified working Unsplash photo IDs ────────────────
const VALID_MEN = [
    "1521572163474-6864f9cf17ab", "1503341504253-dff4815485f1", "1529374255404-311a2a4f1fd9", "1596755094514-f87e34085b2c",
    "1562157873-818bc0726f68", "1503342217505-b0a15ec3261c", "1618354691373-d851c5c3a990", "1620799140408-edc6dcb6d633",
    "1554568218-0f1715e72254", "1527719327859-c6ce80353573", "1576566588028-4147f3842f27", "1512436991641-6745cdb1723f",
    "1584464491033-06628f3a6b7b", "1617196034183-421b4917c92d", "1598033129183-c4f50c736f10", "1602810318383-e386cc2a3ccf",
    "1603252109303-2751441dd157", "1593030761757-71fae45fa0e7", "1593032465175-481ac7f401a0", "1607345366928-199ea26cfe3e",
    "1515886657613-9f3515b0c78f", "1578681994506-b8f463449011", "1591047139829-d91aecb6caea", "1548532928-b34e3be62fc6",
    "1551028719-00167b16eac5", "1560243563-062bfc001d68", "1506629082955-511b1aa562c8", "1541099649105-f69ad21f3246"
];

const VALID_WOMEN = [
    "1572804013309-59a88b7e92f1", "1585487000160-6ebcfceb0d03", "1566174053879-31528523f8ae", "1595777457583-95e059d581b8",
    "1490481651871-ab68de25d43d", "1617922001439-4a2e6562f328", "1485968579580-b6d095142e6e", "1494790108377-be9c29b29330",
    "1534528741775-53994a69daeb", "1524504388940-b1c1722653e1", "1507003211169-0a1dd7228f2d", "1501196354995-cbb51c65aaea",
    "1506794778202-cad84cf45f1d", "1500648767791-00dcc994a43e", "1544005313-94ddf0286df2", "1508214751196-bcfd4ca60f91",
    "1488426862026-3ee34a7d66df", "1522075469751-3a6694fb2f61", "1531746020798-e6953c6e8e04", "1522335789203-aabd1fc54bc9",
    "1517841905240-472988babdf9"
];

const VALID_KIDS = [
    "1519689680058-324335c77eba", "1518831959646-742c3a14ebf7", "1502086223501-7ea6ecd79368", "1596462502278-27bfdc403348",
    "1602810318383-e386cc2a3ccf"
];

let counters = { Men: 0, Women: 0, Kids: 0 };

const get4ImagesForCategory = (cat) => {
    const list = cat === "Men" ? VALID_MEN : (cat === "Women" ? VALID_WOMEN : VALID_KIDS);
    const len = list.length;
    const startIdx = counters[cat];
    counters[cat] = (counters[cat] + 1) % len;
    
    // Select 4 distinct indices
    const indices = [
        startIdx % len,
        (startIdx + 1) % len,
        (startIdx + 2) % len,
        (startIdx + 3) % len
    ];
    return indices.map(idx => u(list[idx]));
};

const IMGS = {
    menTee: [], menShirt: [], menHoodie: [], menJacket: [], menJeans: [], menShorts: [],
    womenTop: [], womenDress: [], womenJeans: [], womenSkirt: [],
    kidsTop: [], kidsBottom: []
};

const SIZES_MEN_TOP    = ["S","M","L","XL","XXL"];
const SIZES_MEN_BOTTOM = ["28","30","32","34","36"];
const SIZES_WOMEN_TOP  = ["XS","S","M","L","XL"];
const SIZES_WOMEN_BOT  = ["26","28","30","32","34"];
const SIZES_KIDS       = ["3-4Y","5-6Y","7-8Y","9-10Y","11-12Y"];
const NOW              = Date.now();

// Helper to build a product object with exact casing for subcategories: TopWear, BottomWear, WinterWear
const p = (brand, name, desc, price, cat, sub, sizes, imgPoolIgnored, bestseller = false) => {
    const imgs = get4ImagesForCategory(cat);
    return {
        name: `${brand} | ${name}`,
        image1: imgs[0], image2: imgs[1], image3: imgs[2], image4: imgs[3],
        description: desc, price, category: cat, subCategory: sub,
        sizes, date: NOW, bestseller,
    };
};

// PRODUCTS — 108 items across 12 professional brands with correct subCategory casings (TopWear, BottomWear, WinterWear)
const products = [

    // ══════════════════════ ADIDAS ══════════════════════════
    p("Adidas","Essentials 3-Stripes Tee","Classic Adidas tee with iconic 3-Stripes on the sleeves. Soft cotton jersey for all-day comfort. A streetwear staple that effortlessly goes from gym to street.",999,"Men","TopWear",SIZES_MEN_TOP,IMGS.menTee,true),
    p("Adidas","Trefoil Graphic Tee","Adidas Originals Trefoil logo tee in premium cotton. Bold heritage branding with a relaxed silhouette — the ultimate everyday essential.",1199,"Men","TopWear",SIZES_MEN_TOP,IMGS.menTee),
    p("Adidas","Tiro 24 Track Jacket","Iconic Adidas Tiro track jacket with moisture-wicking AEROREADY technology. Zip pockets, tapered fit and bold 3-Stripes — perfect for training or streetwear.",2999,"Men","WinterWear",SIZES_MEN_TOP,IMGS.menJacket,true),
    p("Adidas","Club Stretch-Woven Shorts","Lightweight Adidas training shorts with moisture-absorbing fabric. Elastic waistband with drawstring, two side pockets and a relaxed athletic fit.",1299,"Men","BottomWear",["S","M","L","XL"],IMGS.menShorts),
    p("Adidas","Tiro 23 League Pants","Professional-grade tapered track pants with 3-Stripes branding. Zip ankle cuffs and side pockets — built for performance and everyday style.",2499,"Men","BottomWear",SIZES_MEN_TOP,IMGS.menJeans),
    p("Adidas","Entrada 22 Jersey — Men","Breathable recycled polyester match jersey with AEROREADY moisture management. Lightweight and perfect for sports or casual wear.",1499,"Men","TopWear",SIZES_MEN_TOP,IMGS.menTee),
    p("Adidas","Women's All Me Crop Tank","Adidas training crop tank with supportive design and moisture-absorbing fabric. Ribbed neckline and a trendy cropped silhouette for active days.",1699,"Women","TopWear",SIZES_WOMEN_TOP,IMGS.womenTop),
    p("Adidas","Women's Essentials Slim Jogger","Slim-fit jogger in soft cotton-blend fleece. Elastic waistband, cuffed ankles and a small Trefoil logo on the leg — effortlessly stylish.",2199,"Women","BottomWear",SIZES_WOMEN_BOT,IMGS.womenJeans,true),
    p("Adidas","Women's Dance Dress","Adidas flowing dance-inspired dress in moisture-absorbing fabric. Bold 3-Stripes detail and a sporty silhouette that transitions from studio to street.",2799,"Women","TopWear",SIZES_WOMEN_TOP,IMGS.womenDress),
    p("Adidas","Kids' Entrada 22 Jersey","Fun and functional Adidas jersey for young athletes. Made from recycled polyester with AEROREADY tech — keeps kids dry and comfortable.",899,"Kids","TopWear",SIZES_KIDS,IMGS.kidsTop),
    p("Adidas","Kids' Tiro Track Pants","Comfortable Adidas kids' track pants with elastic waistband. Tapered fit with zip ankle cuffs and signature 3-Stripes down the legs.",1099,"Kids","BottomWear",SIZES_KIDS,IMGS.kidsBottom),
    p("Adidas","Classic Bomber Jacket","Premium Adidas Heritage Bomber in a smooth fabric with ribbed collar, cuffs and hem. Front zip closure and side zip pockets — a retro icon reinvented.",4499,"Men","WinterWear",SIZES_MEN_TOP,IMGS.menJacket),

    // ══════════════════════ NIKE ══════════════════════════
    p("Nike","Sportswear Club Tee","Nike's iconic Club T-Shirt in soft 100% cotton. A simple, clean design with an embroidered Futura logo on the chest — your ultimate everyday go-to.",1299,"Men","TopWear",SIZES_MEN_TOP,IMGS.menTee,true),
    p("Nike","Dri-FIT Training Tee","Nike Dri-FIT technology pulls sweat away from your skin and moves it to the fabric surface for evaporation. Lightweight and breathable for intense training sessions.",1499,"Men","TopWear",SIZES_MEN_TOP,IMGS.menTee),
    p("Nike","Air Max Graphic Tee","Statement Nike Air Max graphic tee with bold artwork. Soft cotton jersey with a relaxed fit and crew neckline — where sportswear meets street fashion.",1599,"Men","TopWear",SIZES_MEN_TOP,IMGS.menTee),
    p("Nike","Club Fleece Pullover Hoodie","Made from soft midweight fleece for all-day comfort. Relaxed fit, kangaroo pocket and ribbed cuffs. The Nike Club Fleece Hoodie is a wardrobe cornerstone.",3499,"Men","WinterWear",SIZES_MEN_TOP,IMGS.menHoodie,true),
    p("Nike","Tech Fleece Full-Zip Hoodie","Nike Tech Fleece delivers exceptional warmth with lightweight material. Engineered spacer fabric for targeted warmth with incredible softness.",5999,"Men","WinterWear",SIZES_MEN_TOP,IMGS.menHoodie),
    p("Nike","Windrunner Jacket","The iconic Nike Windrunner — lightweight ripstop fabric with a chevron design on the chest. Full-zip closure, hood and side pockets. A true Nike classic.",4999,"Men","WinterWear",SIZES_MEN_TOP,IMGS.menJacket),
    p("Nike","Club Fleece Jogger Pants","The Nike Club Fleece Joggers are made from soft midweight fleece. Ribbed cuffs, elastic waistband with drawstring and side pockets — ultimate comfort.",2799,"Men","BottomWear",SIZES_MEN_TOP,IMGS.menJeans,true),
    p("Nike","Dri-FIT Running Shorts 5\"","Lightweight Nike running shorts with Dri-FIT technology and a built-in liner. An inner waistband pocket keeps essentials secure during your run.",1799,"Men","BottomWear",["S","M","L","XL"],IMGS.menShorts),
    p("Nike","Pro Women's Crop Top","Nike Pro training top with Dri-FIT technology and a supportive bra-like fit. Cropped length with an open back — designed for high-intensity training.",1999,"Women","TopWear",SIZES_WOMEN_TOP,IMGS.womenTop,true),
    p("Nike","Sportswear Essential Women's Tee","Soft and simple — the Nike Sportswear Essential Tee features a relaxed fit and a small Futura logo. Perfect for a laid-back day out.",1199,"Women","TopWear",SIZES_WOMEN_TOP,IMGS.womenTop),
    p("Nike","One Women's Dri-FIT Shorts","Nike One shorts with Dri-FIT technology for a sweat-free workout. A 5\" inseam with a secure waistband pocket makes these a training essential.",1599,"Women","BottomWear",SIZES_WOMEN_TOP,IMGS.womenSkirt),
    p("Nike","Kids' Futura Tee","A soft and playful Nike Futura logo tee for kids. Made from cotton jersey — comfortable, durable and perfect for active play.",799,"Kids","TopWear",SIZES_KIDS,IMGS.kidsTop),

    // ══════════════════════ PUMA ══════════════════════════
    p("Puma","Essential Logo Tee — Men","Classic Puma tee with signature No. 1 Logo. Pure cotton fabric delivers soft, breathable comfort for casual wear. A daily essential.",999,"Men","TopWear",SIZES_MEN_TOP,IMGS.menTee,true),
    p("Puma","Power Colourblock Tee","Bold Puma colourblock design with contrast panels for a sporty, energetic look. Made from breathable cotton with moisture-wicking properties.",1399,"Men","TopWear",SIZES_MEN_TOP,IMGS.menTee),
    p("Puma","Squad Men's Full-Zip Hoodie","Puma Squad hoodie in a warm cotton-blend fleece with full-zip closure. Side pockets and adjustable drawstring hood make it versatile for any occasion.",2799,"Men","WinterWear",SIZES_MEN_TOP,IMGS.menHoodie),
    p("Puma","Teamliga Training Jacket","Lightweight Puma training jacket with dryCELL moisture management. Full-zip with stand collar and side pockets — game-ready from warm-up to final whistle.",3299,"Men","WinterWear",SIZES_MEN_TOP,IMGS.menJacket),
    p("Puma","Squad Men's Joggers","Relaxed fit Puma Squad joggers in soft cotton blend. Elastic waistband, tapered leg and side pockets — wear them to the gym or the coffee shop.",1999,"Men","BottomWear",SIZES_MEN_TOP,IMGS.menJeans),
    p("Puma","Active Woven Men's Shorts","Quick-dry Puma training shorts with side pockets and elastic drawstring waistband. Lightweight woven fabric ideal for training and outdoor activities.",1299,"Men","BottomWear",["S","M","L","XL"],IMGS.menShorts),
    p("Puma","Amplified Women's Hoodie","Oversized Puma Amplified hoodie with large graphic logo. Cotton-blend fleece with kangaroo pocket and adjustable hood — cosy streetwear done right.",2799,"Women","WinterWear",SIZES_WOMEN_TOP,IMGS.womenTop,true),
    p("Puma","EVOSTRIPE Women's Pants","Puma EvoStripe pants in a flattering slim fit with iconic side stripe. Soft, stretch fabric with elastic waistband — stylish and comfortable.",2499,"Women","BottomWear",SIZES_WOMEN_BOT,IMGS.womenJeans),
    p("Puma","Fun Joggers — Kids","Puma kids' joggers with elastic waistband and drawstring. Side pockets, tapered leg and a fun Puma Cat logo — kids' favourite for play and sport.",1099,"Kids","BottomWear",SIZES_KIDS,IMGS.kidsBottom),
    p("Puma","Kids' Summer Tee","Bright, fun Puma kids' tee in soft cotton jersey with a playful Puma Cat print. Comfortable and durable — perfect for active days.",799,"Kids","TopWear",SIZES_KIDS,IMGS.kidsTop),

    // ══════════════════════ H&M ══════════════════════════
    p("H&M","Slim Fit Oxford Shirt","H&M Slim Fit Oxford shirt in premium cotton with a spread collar. Clean, versatile and tailored — perfect for smart-casual and office settings.",1499,"Men","TopWear",SIZES_MEN_TOP,IMGS.menShirt,true),
    p("H&M","Relaxed Fit Jersey T-Shirt","H&M relaxed fit tee in soft cotton jersey. Crew neckline, dropped shoulders and a slightly oversized silhouette — effortlessly modern streetwear.",799,"Men","TopWear",SIZES_MEN_TOP,IMGS.menTee),
    p("H&M","Oversized Printed Hoodie","H&M oversized hoodie with bold front graphic print. Warm cotton-blend fleece with spacious kangaroo pocket and a roomy hood for that street-ready look.",1999,"Men","WinterWear",SIZES_MEN_TOP,IMGS.menHoodie),
    p("H&M","Denim Jacket","H&M classic denim jacket in washed cotton denim. Button front closure with chest pockets and side pockets — a timeless wardrobe staple.",2799,"Men","WinterWear",SIZES_MEN_TOP,IMGS.menJacket),
    p("H&M","Slim Tapered Jeans","H&M slim tapered jeans in stretch denim. Sits at the waist with a slim fit through hips and thighs, tapering to a narrow ankle.",1999,"Men","BottomWear",SIZES_MEN_BOTTOM,IMGS.menJeans),
    p("H&M","Women's V-Neck Blouse","Elegant H&M blouse in lightweight woven fabric with a feminine V-neckline. Loose, flowing fit with subtle drape — pairs beautifully with trousers or skirts.",1299,"Women","TopWear",SIZES_WOMEN_TOP,IMGS.womenTop),
    p("H&M","Women's Floral Midi Dress","H&M floral-print midi dress in airy woven fabric. A-line silhouette with a V-neckline, puff sleeves and a tie waist — effortlessly feminine.",2499,"Women","TopWear",SIZES_WOMEN_TOP,IMGS.womenDress,true),
    p("H&M","Women's Wrap Dress","H&M wrap dress with long sleeves and a flowy midi length. Adjustable self-tie waist and a flattering V-neckline — from brunch to evening.",2199,"Women","TopWear",SIZES_WOMEN_TOP,IMGS.womenDress),
    p("H&M","Women's Flared Mini Skirt","H&M flared mini skirt in smooth woven fabric. Elasticated waistband and a playful A-line silhouette — great paired with a tucked-in crop or blouse.",1299,"Women","BottomWear",SIZES_WOMEN_BOT,IMGS.womenSkirt),
    p("H&M","Kids' Printed Sweatshirt","Cosy H&M kids' sweatshirt in soft cotton-blend fleece with fun graphic print. Ribbed cuffs and hem for a snug, comfortable fit.",799,"Kids","TopWear",SIZES_KIDS,IMGS.kidsTop),

    // ══════════════════════ ZARA ══════════════════════════
    p("Zara","Men's Structured Blazer","Zara structured blazer in premium fabric blend with notch lapels. Slim-cut with a single-button fastening and welt pockets — sharp, modern tailoring.",5999,"Men","WinterWear",SIZES_MEN_TOP,IMGS.menJacket,true),
    p("Zara","Men's Relaxed Linen Shirt","Zara relaxed linen shirt in a breathable natural weave. Classic collar, chest pocket and a straight hem — the ideal summer wardrobe staple.",2199,"Men","TopWear",SIZES_MEN_TOP,IMGS.menShirt),
    p("Zara","Men's Jogger Trousers","Zara premium jogger in smooth technical fabric. Elasticated waist with drawstring, tapered leg and zip pockets — smart-casual comfort.",2799,"Men","BottomWear",SIZES_MEN_TOP,IMGS.menJeans),
    p("Zara","Women's Printed Floral Midi Dress","Zara flowing midi dress with all-over floral print. V-neckline with ruffle trim, puff sleeves and a gathered skirt — romantic and feminine.",3499,"Women","TopWear",SIZES_WOMEN_TOP,IMGS.womenDress,true),
    p("Zara","Women's Satin Effect Blouse","Zara luxe satin-finish blouse with a relaxed silhouette. V-neckline, long sleeves with cuffs — elevates any look from casual to cocktail.",2999,"Women","TopWear",SIZES_WOMEN_TOP,IMGS.womenTop),
    p("Zara","Women's Asymmetric Dress","Zara chic asymmetric hem dress in stretch crepe. Sleeveless with a side cutout detail — a minimalist statement piece for modern women.",3999,"Women","TopWear",SIZES_WOMEN_TOP,IMGS.womenDress),
    p("Zara","Women's Pleated Mini Skirt","Zara pleated mini skirt in a soft woven fabric. Elasticated waistband and a flirty pleated silhouette — pairs with everything from sneakers to heels.",2199,"Women","BottomWear",SIZES_WOMEN_BOT,IMGS.womenSkirt),
    p("Zara","Women's Straight Leg Jeans","Zara high-waist straight-leg jeans in rigid denim. A contemporary cut with subtle distressed details — the denim staple you'll wear on repeat.",3299,"Women","BottomWear",SIZES_WOMEN_BOT,IMGS.womenJeans),
    p("Zara","Men's Slim Chinos","Zara slim-fit chinos in a stretch cotton-blend. Clean flat-front design with slash pockets — smart enough for the office, relaxed enough for weekends.",2599,"Men","BottomWear",SIZES_MEN_BOTTOM,IMGS.menJeans),

    // ══════════════════════ LEVI'S ══════════════════════════
    p("Levi's","501 Original Fit Jeans — Men","The original blue jean since 1873. Straight leg with a button fly and the iconic leather patch. There's only one 501 — and it never goes out of style.",3999,"Men","BottomWear",SIZES_MEN_BOTTOM,IMGS.menJeans,true),
    p("Levi's","511 Slim Jeans — Men","Levi's 511 Slim — a slim fit from hip to ankle with a mid-rise waist. In a stretch denim blend for easy movement. Modern, versatile and always sharp.",3499,"Men","BottomWear",SIZES_MEN_BOTTOM,IMGS.menJeans,true),
    p("Levi's","Trucker Jacket","The iconic Levi's Trucker Jacket in rigid denim with two chest flap pockets. A wardrobe staple since 1967 — pair it with everything.",4999,"Men","WinterWear",SIZES_MEN_TOP,IMGS.menJacket),
    p("Levi's","Relaxed Graphic Tee — Men","Levi's oversized graphic tee with retro-inspired artwork. Pure cotton jersey with a relaxed fit and crew neck — authentic heritage style.",1499,"Men","TopWear",SIZES_MEN_TOP,IMGS.menTee),
    p("Levi's","711 Skinny Jeans — Women","Levi's 711 Skinny fits close from hip to ankle in a stretch denim blend. Mid-rise with a classic 5-pocket design — the ultimate everyday jeans.",3499,"Women","BottomWear",SIZES_WOMEN_BOT,IMGS.womenJeans,true),
    p("Levi's","724 High Rise Straight — Women","Levi's 724 High Rise Straight jeans sit above the waist with a straight leg. Feminine silhouette in rigid denim that flatters every figure.",3799,"Women","BottomWear",SIZES_WOMEN_BOT,IMGS.womenJeans),
    p("Levi's","Perfect V-Neck Tee — Women","Levi's essential V-neck tee in soft cotton jersey with a relaxed, slightly cropped length. A minimalist piece that goes with absolutely everything.",1299,"Women","TopWear",SIZES_WOMEN_TOP,IMGS.womenTop),
    p("Levi's","Kids' 511 Slim Jeans","Levi's 511 Slim for kids in a durable stretch denim. Flexible waistband for comfort and mobility — designed to keep up with active kids.",1799,"Kids","BottomWear",SIZES_KIDS,IMGS.kidsBottom),

    // ══════════════════════ UNIQLO ══════════════════════════
    p("Uniqlo","AIRism Cotton Crew Neck Tee","Uniqlo AIRism technology combined with premium cotton for superior breathability. Moisture-wicking, quick-dry and odour-reducing — next-level everyday comfort.",999,"Men","TopWear",SIZES_MEN_TOP,IMGS.menTee,true),
    p("Uniqlo","Supima Cotton Polo Shirt","Uniqlo Supima Cotton polo in soft, luxurious long-staple cotton. A slim-fit classic with ribbed collar and sleeves — refined casual at its best.",1499,"Men","TopWear",SIZES_MEN_TOP,IMGS.menShirt),
    p("Uniqlo","Flannel Check Shirt","Uniqlo flannel checked shirt in super soft brushed cotton. Relaxed fit with a chest pocket — the go-to weekend shirt from September to March.",2199,"Men","TopWear",SIZES_MEN_TOP,IMGS.menShirt),
    p("Uniqlo","Ultra Stretch Jeans — Men","Uniqlo Ultra Stretch Active Jeans combine the look of denim with the comfort of sportswear. Slim silhouette with 360° stretch for unrestricted movement.",2799,"Men","BottomWear",SIZES_MEN_BOTTOM,IMGS.menJeans),
    p("Uniqlo","3D Knit Crew-Neck Sweater","Uniqlo 3D Knit seamless construction for a premium, well-fitted look. Soft blended yarn with no side seams — a minimalist masterpiece.",3499,"Men","WinterWear",SIZES_MEN_TOP,IMGS.menHoodie),
    p("Uniqlo","Women's AIRism Camisole","Uniqlo AIRism Camisole with silky smooth feel and moisture-wicking technology. Light support with adjustable straps — a summer wardrobe essential.",799,"Women","TopWear",SIZES_WOMEN_TOP,IMGS.womenTop),
    p("Uniqlo","Women's Linen Blend Trousers","Uniqlo linen blend wide-leg trousers in a breathable natural fabric. Clean lines, elastic waist and draped silhouette — effortlessly polished.",2499,"Women","BottomWear",SIZES_WOMEN_BOT,IMGS.womenJeans),
    p("Uniqlo","Women's Pile Fleece Sweatshirt","Uniqlo Pile Fleece pullover in ultra-soft, plush fabric. Crew neckline with a relaxed silhouette — the cosiest sweatshirt you'll ever own.",2799,"Women","WinterWear",SIZES_WOMEN_TOP,IMGS.womenTop),
    p("Uniqlo","Kids' Soft Fleece Hoodie","Uniqlo Soft Fleece hoodie for kids in ultra-cosy plush fabric. Full-zip with adjustable hood and side pockets — warm and playful.",1299,"Kids","WinterWear",SIZES_KIDS,IMGS.kidsTop),

    // ══════════════════════ MANGO ══════════════════════════
    p("Mango","Women's Satin Slip Dress","Mango elegant satin-finish slip dress with adjustable spaghetti straps. Midi length with a delicate lace trim — effortlessly luxurious.",3999,"Women","TopWear",SIZES_WOMEN_TOP,IMGS.womenDress,true),
    p("Mango","Women's Floral Wrap Dress","Mango floral wrap dress in a soft crinkle fabric. V-neckline with long sleeves and a tie waist — a bohemian piece that transitions from day to night.",3299,"Women","TopWear",SIZES_WOMEN_TOP,IMGS.womenDress,true),
    p("Mango","Women's Ruffle Sleeve Top","Mango feminine top with ruffle sleeve detail in lightweight crepe. Crew neckline and a relaxed fit — feminine, playful and utterly versatile.",1999,"Women","TopWear",SIZES_WOMEN_TOP,IMGS.womenTop),
    p("Mango","Women's Wide Leg Trousers","Mango wide-leg trousers in premium flowing fabric. High-waist with a tailored silhouette and side pockets — polished and contemporary.",3499,"Women","BottomWear",SIZES_WOMEN_BOT,IMGS.womenJeans),
    p("Mango","Women's Linen Mini Skirt","Mango linen mini skirt with a clean A-line cut. Elasticated waistband and a chic minimalist design — a summer wardrobe must-have.",1999,"Women","BottomWear",SIZES_WOMEN_BOT,IMGS.womenSkirt),
    p("Mango","Women's Embro Embroidered Dress","Mango midi dress with delicate floral embroidery detail on the bodice. Lightweight woven fabric with puff sleeves — a romantic statement piece.",4499,"Women","TopWear",SIZES_WOMEN_TOP,IMGS.womenDress),
    p("Mango","Men's Textured Shirt","Mango textured weave shirt in a breathable cotton blend. Classic collar with a straight hem — dressed up with chinos, dressed down with jeans.",2299,"Men","TopWear",SIZES_MEN_TOP,IMGS.menShirt),
    p("Mango","Women's Printed Midi Skirt","Mango printed midi skirt in lightweight chiffon. Elasticated waist and a pleated, flowing silhouette — pairs beautifully with a simple tank or blouse.",2799,"Women","BottomWear",SIZES_WOMEN_BOT,IMGS.womenSkirt),

    // ══════════════════════ JACK & JONES ══════════════════════════
    p("Jack & Jones","Slim Fit V-Neck Tee","Jack & Jones essential slim-fit V-neck tee in soft cotton jersey. A minimalist piece with clean lines that pairs perfectly with jeans or chinos.",799,"Men","TopWear",SIZES_MEN_TOP,IMGS.menTee),
    p("Jack & Jones","Graphic Oversize Tee","Jack & Jones vintage-inspired graphic tee with distressed print. Oversized fit in soft jersey — the perfect off-duty statement tee.",999,"Men","TopWear",SIZES_MEN_TOP,IMGS.menTee),
    p("Jack & Jones","Premium Hoodie","Jack & Jones premium heavyweight hoodie in a brushed fleece. Full-zip or pullover with thick cotton construction for the colder months.",2799,"Men","WinterWear",SIZES_MEN_TOP,IMGS.menHoodie,true),
    p("Jack & Jones","Denim Trucker Jacket","Jack & Jones washed denim trucker jacket with chest pockets and a button-through closure. A casual classic that layers over everything.",3499,"Men","WinterWear",SIZES_MEN_TOP,IMGS.menJacket),
    p("Jack & Jones","Slim Fit Chinos","Jack & Jones slim-fit chino trousers in a stretch cotton blend. Clean, versatile cut with a flat front — a refined alternative to jeans.",2199,"Men","BottomWear",SIZES_MEN_BOTTOM,IMGS.menJeans),
    p("Jack & Jones","Glenn Slim Fit Jeans","Jack & Jones Glenn slim-fit jeans in mid-wash stretch denim. A sleek, modern silhouette with just the right amount of stretch for all-day wear.",2799,"Men","BottomWear",SIZES_MEN_BOTTOM,IMGS.menJeans,true),
    p("Jack & Jones","Men's Cargo Trousers","Jack & Jones relaxed cargo trousers with multiple pockets and a drawstring ankle. Functional, trendy and built for the streets.",2499,"Men","BottomWear",SIZES_MEN_TOP,IMGS.menShorts),
    p("Jack & Jones","Men's Bomber Jacket","Jack & Jones bomber jacket in lightweight ripstop fabric. Ribbed collar, cuffs and hem with side zip pockets — classic cool.",4999,"Men","WinterWear",SIZES_MEN_TOP,IMGS.menJacket),

    // ══════════════════════ VERO MODA ══════════════════════════
    p("Vero Moda","Women's Smock Dress","Vero Moda feminine smock dress with elasticated chest panel and puff sleeves. Floral print on a soft woven fabric — charming and comfortable.",2799,"Women","TopWear",SIZES_WOMEN_TOP,IMGS.womenDress,true),
    p("Vero Moda","Women's Wrap Midi Dress","Vero Moda wrap dress with a flattering v-neckline and self-tie waist. Midi length in a soft printed fabric — elegant yet relaxed.",3199,"Women","TopWear",SIZES_WOMEN_TOP,IMGS.womenDress),
    p("Vero Moda","Women's Ribbed Knit Top","Vero Moda ribbed knit crop top with a scoop neckline and snug fit. Soft blended yarn in a versatile neutral — style with high-waist bottoms.",1499,"Women","TopWear",SIZES_WOMEN_TOP,IMGS.womenTop,true),
    p("Vero Moda","Women's Oversized Blazer","Vero Moda oversized blazer in a textured fabric blend. Notch lapels, two pockets and a relaxed silhouette — the season's most versatile piece.",4999,"Women","WinterWear",SIZES_WOMEN_TOP,IMGS.womenTop),
    p("Vero Moda","Women's High Waist Skinny Jeans","Vero Moda high-waist skinny jeans in a stretch denim blend. Flattering second-skin fit from waist to ankle — your most-reached-for jeans.",2999,"Women","BottomWear",SIZES_WOMEN_BOT,IMGS.womenJeans),
    p("Vero Moda","Women's Floral Maxi Dress","Vero Moda maxi dress in a lightweight floral print chiffon. V-neckline with adjustable straps and a flowy A-line silhouette — bohemian perfection.",3799,"Women","TopWear",SIZES_WOMEN_TOP,IMGS.womenDress),
    p("Vero Moda","Women's Wide Leg Jeans","Vero Moda wide-leg jeans in a rigid denim with a high-waist cut. Retro 90s silhouette that flatters every body — a fashion-forward denim staple.",3499,"Women","BottomWear",SIZES_WOMEN_BOT,IMGS.womenJeans),
    p("Vero Moda","Women's Satin Pleated Skirt","Vero Moda mid-length pleated skirt in a luxurious satin finish. Elasticated waist with a flowing pleated silhouette — dresses up beautifully.",2799,"Women","BottomWear",SIZES_WOMEN_BOT,IMGS.womenSkirt),

    // ══════════════════════ CAMPUS SUTRA ══════════════════════════
    p("Campus Sutra","Men's Oversized Graphic Tee","Campus Sutra drop-shoulder graphic tee with bold street-art print. Relaxed cotton jersey — loud, expressive and unapologetically cool.",799,"Men","TopWear",SIZES_MEN_TOP,IMGS.menTee),
    p("Campus Sutra","Men's Colourblock Hoodie","Campus Sutra colourblock hoodie in a warm cotton-blend fleece. Contrast panels, kangaroo pocket and a stylish oversized fit — fresh streetwear vibes.",1999,"Men","WinterWear",SIZES_MEN_TOP,IMGS.menHoodie,true),
    p("Campus Sutra","Men's Printed Bomber","Campus Sutra printed bomber jacket with satin-feel exterior. Ribbed trims and bold all-over graphic print — a statement outerwear piece.",3299,"Men","WinterWear",SIZES_MEN_TOP,IMGS.menJacket),
    p("Campus Sutra","Men's Slim Jogger","Campus Sutra slim-fit jogger in a soft cotton-blend. Minimal branding, elasticated waist and tapered leg — clean and contemporary.",1499,"Men","BottomWear",SIZES_MEN_TOP,IMGS.menJeans),
    p("Campus Sutra","Women's Crop Sweatshirt","Campus Sutra women's crop sweatshirt in cosy fleece fabric. Ribbed hem and cuffs with a crew neck — effortlessly cute for casual days.",1099,"Women","WinterWear",SIZES_WOMEN_TOP,IMGS.womenTop),
    p("Campus Sutra","Women's Tie-Dye Midi Dress","Campus Sutra tie-dye midi dress in a vibrant, psychedelic palette. Soft jersey knit with a relaxed silhouette — festival-ready and free-spirited.",1799,"Women","TopWear",SIZES_WOMEN_TOP,IMGS.womenDress),
    p("Campus Sutra","Kids' Character Print Tee","Campus Sutra fun character-print tee for kids. Soft, breathable cotton that's gentle on skin — bright, playful and built for adventure.",649,"Kids","TopWear",SIZES_KIDS,IMGS.kidsTop),

    // ══════════════════════ ROADSTER ══════════════════════════
    p("Roadster","Men's Classic Fit T-Shirt","Roadster everyday essential tee in soft combed cotton with a classic crew neck. Simple, clean and made to last — a wardrobe basic done right.",599,"Men","TopWear",SIZES_MEN_TOP,IMGS.menTee),
    p("Roadster","Men's Printed Casual Shirt","Roadster casual printed shirt in a soft cotton-blend fabric. Spread collar, curved hem and a relaxed fit — ideal for weekend outings.",1299,"Men","TopWear",SIZES_MEN_TOP,IMGS.menShirt),
    p("Roadster","Men's Slim Fit Jeans","Roadster slim-fit jeans in stretch denim with mid-wash finish. 5-pocket styling with a contemporary, flattering cut — reliable everyday denim.",1799,"Men","BottomWear",SIZES_MEN_BOTTOM,IMGS.menJeans),
    p("Roadster","Men's Sweatshirt","Roadster solid sweatshirt in warm fleece-back cotton. Ribbed cuffs and hem with a clean crew neckline — your most worn layer in cooler weather.",1499,"Men","WinterWear",SIZES_MEN_TOP,IMGS.menHoodie),
    p("Roadster","Women's Crop Top","Roadster women's crop top in soft jersey with a square neckline and short sleeves. Minimal, modern and versatile — pairs with high-waist anything.",799,"Women","TopWear",SIZES_WOMEN_TOP,IMGS.womenTop,true),
    p("Roadster","Women's A-Line Midi Skirt","Roadster A-line midi skirt in a flowy woven fabric with an elasticated waist. A feminine, understated piece that dresses up or down effortlessly.",1199,"Women","BottomWear",SIZES_WOMEN_BOT,IMGS.womenSkirt),
    p("Roadster","Women's Printed Summer Dress","Roadster breezy summer dress with all-over print in lightweight cotton. Strappy neckline, tiered skirt — made for warm days and golden evenings.",1499,"Women","TopWear",SIZES_WOMEN_TOP,IMGS.womenDress),
];

// ─────────────────────────────────────────────────────────────────────────────
async function seed() {
    console.log(`\n🌱 Connecting to MongoDB...`);
    await mongoose.connect(process.env.MONGODB_URL);
    console.log(`🔗 Connected.\n`);

    // Clean up all products in the database first to avoid duplicates
    console.log("🧹 Cleaning up all products in the database...");
    const cleanResult = await Product.deleteMany({});
    console.log(`🗑️  Deleted ${cleanResult.deletedCount} old products.`);

    console.log(`🚀 Seeding ${products.length} fresh products with correct casings and 4 distinct images each...\n`);

    let inserted = 0;
    for (const prod of products) {
        await Product.create(prod);
        console.log(`✅ Added: ${prod.name}`);
        inserted++;
    }

    console.log(`\n🎉 Seed finished! Added ${inserted} products.`);
    await mongoose.disconnect();
    process.exit(0);
}

seed().catch(err => { console.error("❌ Seed error:", err.message); process.exit(1); });
