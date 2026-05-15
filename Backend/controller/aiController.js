import Product from "../model/productModel.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
            .replace(/under|below|less than|around|budget|for|me|suggest|show|find|need|want/gi, "")
            .trim();

        // Budget extraction
        const budgetMatch = message.match(/(?:under|below|less than|within)\s*[₹$]?\s*(\d+)/i);
        const budget = budgetMatch ? parseInt(budgetMatch[1]) : null;

        // Fetch relevant products (max 20 for context)
        let productQuery = {};
        if (budget) productQuery.price = { $lte: budget };
        if (searchTerms.length > 2) {
            productQuery.$or = [
                { name: { $regex: searchTerms, $options: "i" } },
                { category: { $regex: searchTerms, $options: "i" } },
                { subCategory: { $regex: searchTerms, $options: "i" } },
                { description: { $regex: searchTerms, $options: "i" } },
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
        console.error("aiChat error:", error);
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
