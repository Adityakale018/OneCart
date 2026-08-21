import Product from "../model/productModel.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── POST /api/ai/chat ────────────────────────────────────────────────────────
export const aiChat = async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message?.trim()) {
            return res.status(400).json({ message: "Message is required" });
        }

        // ── 1. Semantic product search ────────────────────────────────────────
        // Extract keywords from user message for product lookup
        const searchTerms = message
            .replace(/[₹\$]/g, "")
            .replace(/under|below|less than|within|around|budget|for|me|suggest|show|find|need|want|buy|give|get/gi, "")
            .replace(/\s+/g, " ")
            .trim();

        // Budget extraction
        const budgetMatch = message.match(/(?:under|below|less than|within)\s*[₹$]?\s*(\d+)/i);
        const budget = budgetMatch ? parseInt(budgetMatch[1]) : null;

        // Fetch relevant products (max 20 for context)
        let productQuery = {};
        if (budget) productQuery.price = { $lte: budget };
        if (searchTerms.length > 2) {
            // Escape special regex chars to avoid "Invalid regular expression" errors
            const escapedTerms = searchTerms.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            productQuery.$or = [
                { name: { $regex: escapedTerms, $options: "i" } },
                { category: { $regex: escapedTerms, $options: "i" } },
                { subCategory: { $regex: escapedTerms, $options: "i" } },
                { description: { $regex: escapedTerms, $options: "i" } },
            ];
        }

        const products = await Product.find(productQuery).limit(20).lean();

        // ── 2. Build product context for Gemini ──────────────────────────────
        const productContext = products.length > 0
            ? products.map((p) =>
                `ID: ${p._id} | Name: ${p.name} | Price: ₹${p.price} | Category: ${p.category} | SubCategory: ${p.subCategory} | Description: ${p.description?.slice(0, 80)}`
            ).join("\n")
            : "No specific products found for this query.";

        // ── 3. Build Gemini prompt ────────────────────────────────────────────
        const systemPrompt = `You are OneCart AI, a friendly and expert shopping assistant for an Indian e-commerce platform.

PRODUCT CATALOG (available products):
${productContext}

INSTRUCTIONS:
- Recommend products ONLY from the catalog above using their exact IDs and names.
- When recommending products, always return a JSON block with this format embedded in your reply:
  [PRODUCTS: [{"id":"<_id>","name":"<name>","price":<price>,"reason":"<why>"}]]
- Keep your response conversational, friendly, and concise.
- If the user asks about budgets, filter by price from the catalog.
- If no suitable products exist, say so honestly and suggest alternatives.
- You can suggest product combos / bundles.
- You remember the conversation history provided.`;

        // ── 4. Call Gemini ────────────────────────────────────────────────────
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: systemPrompt,
        });

        // Build chat history for Gemini (last 10 messages)
        const history = conversationHistory.slice(-10).map((m) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }],
        }));

        // Gemini strictly requires the first message in history to be from 'user'
        while (history.length > 0 && history[0].role !== "user") {
            history.shift();
        }

        // Gemini also requires history to alternate user/model, strip consecutive same roles
        const cleanHistory = [];
        for (const msg of history) {
            if (cleanHistory.length === 0 || cleanHistory[cleanHistory.length - 1].role !== msg.role) {
                cleanHistory.push(msg);
            }
        }

        const chat = model.startChat({
            history: cleanHistory,
            generationConfig: { maxOutputTokens: 1000, temperature: 0.7 },
        });

        const result = await chat.sendMessage(message);
        const rawResponse = result.response.text();

        // ── 5. Parse product recommendations from response ────────────────────
        let recommendedProducts = [];
        const productMatch = rawResponse.match(/\[PRODUCTS:\s*(\[[\s\S]*?\])\]/);
        if (productMatch) {
            try {
                const parsed = JSON.parse(productMatch[1]);
                // Enrich with full product data
                recommendedProducts = parsed.map((rec) => {
                    const full = products.find((p) => p._id.toString() === rec.id);
                    return full ? { ...full, reason: rec.reason } : null;
                }).filter(Boolean);
            } catch (_) {
                // JSON parse failed, no recommendations
            }
        }

        // Clean the response text (remove the PRODUCTS JSON block)
        const cleanResponse = rawResponse.replace(/\[PRODUCTS:\s*\[[\s\S]*?\]\]/, "").trim();

        return res.status(200).json({
            success: true,
            message: cleanResponse,
            products: recommendedProducts,
        });
    } catch (error) {
        console.error("aiChat error:", error?.message || error);
        // Check for common Gemini API errors
        if (error?.message?.includes("API key") || error?.status === 400 || error?.status === 403) {
            return res.status(500).json({ message: "AI configuration error: Invalid or missing API key." });
        }
        if (error?.message?.includes("quota") || error?.status === 429) {
            return res.status(429).json({ message: "AI rate limit reached. Please try again in a moment." });
        }
        return res.status(500).json({ message: `AI chat error: ${error.message}` });
    }
};

// ─── GET /api/ai/suggestions ─────────────────────────────────────────────────
// Returns quick prompt suggestions based on available categories
export const getAiSuggestions = async (req, res) => {
    try {
        const categories = await Product.distinct("category");
        const suggestions = [
            "Suggest gifts under ₹1500",
            "Best sellers this week",
            `Best ${categories[0] || "fashion"} items`,
            "Create a combo under ₹3000",
            "Show me trending products",
            `Top ${categories[1] || "electronics"} picks`,
        ];
        return res.status(200).json({ success: true, suggestions });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ─── POST /api/ai/generate-product-details ────────────────────────────────────
// Accepts an uploaded image and uses Gemini Vision to auto-fill product details
export const generateProductDetails = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Image file is required" });
        }

        // Read the uploaded image and convert to base64
        const imagePath = req.file.path;
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString("base64");
        const mimeType = req.file.mimetype || "image/jpeg";

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are an expert e-commerce product analyst for an Indian fashion & clothing store.

Analyze this product image carefully and return a JSON object with the following fields:

{
  "name": "<A catchy, descriptive product title (e.g. 'Classic Oxford Button-Down Shirt')>",
  "description": "<A compelling 2-3 sentence product description that highlights key features, fabric, and style. Make it SEO-friendly and engaging.>",
  "category": "<MUST be exactly one of: Men, Women, Kids>",
  "subCategory": "<MUST be exactly one of: TopWear, BottomWear, WinterWear>",
  "price": <A realistic Indian market price as a number only (no ₹ symbol), e.g. 1299>,
  "sizes": <An array of applicable sizes from ["S", "M", "L", "XL", "XXL"], e.g. ["S","M","L","XL"]>,
  "bestseller": <true if it looks like a popular/trendy item, false otherwise>
}

Rules:
- category MUST be one of: Men, Women, Kids
- subCategory MUST be one of: TopWear, BottomWear, WinterWear
- price must be a realistic number in Indian Rupees (INR), no symbols
- sizes must be a valid JSON array with elements from ["S", "M", "L", "XL", "XXL"]
- Return ONLY the raw JSON object, no markdown, no explanation, no code fences.`;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    mimeType,
                    data: base64Image,
                },
            },
        ]);

        const rawText = result.response.text().trim();

        // Clean up response (remove markdown code fences if present)
        const cleaned = rawText
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/```\s*$/i, "")
            .trim();

        let productData;
        try {
            productData = JSON.parse(cleaned);
        } catch (parseErr) {
            console.error("Gemini returned non-JSON:", rawText);
            return res.status(500).json({
                message: "AI returned an unexpected format. Please try again.",
            });
        }

        // Sanitize and validate fields
        const validCategories = ["Men", "Women", "Kids"];
        const validSubCategories = ["TopWear", "BottomWear", "WinterWear"];
        const validSizes = ["S", "M", "L", "XL", "XXL"];

        const sanitized = {
            name: String(productData.name || "").trim(),
            description: String(productData.description || "").trim(),
            category: validCategories.includes(productData.category) ? productData.category : "Men",
            subCategory: validSubCategories.includes(productData.subCategory) ? productData.subCategory : "TopWear",
            price: Number(productData.price) > 0 ? Number(productData.price) : 999,
            sizes: Array.isArray(productData.sizes)
                ? productData.sizes.filter((s) => validSizes.includes(s))
                : ["S", "M", "L"],
            bestseller: Boolean(productData.bestseller),
        };

        // Cleanup uploaded temp file
        try { fs.unlinkSync(imagePath); } catch (_) {}

        return res.status(200).json({ success: true, product: sanitized });
    } catch (error) {
        console.error("generateProductDetails error:", error?.message || error);
        if (error?.message?.includes("API key") || error?.status === 403) {
            return res.status(500).json({ message: "AI configuration error: Invalid or missing API key." });
        }
        if (error?.message?.includes("quota") || error?.status === 429) {
            return res.status(429).json({ message: "AI rate limit reached. Please try again in a moment." });
        }
        return res.status(500).json({ message: `AI generate error: ${error.message}` });
    }
};

