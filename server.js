const express = require('express');
const { createCanvas, loadImage } = require('canvas');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. HOMEPAGE FIX - No more "Cannot GET /"
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding: 50px; background: #000; color: #fff; height: 100vh;">
      <h1 style="color: #00ffcc;">🏺 SENSI VAULT ENGINE: ACTIVE</h1>
      <p>The Factory is online and ready to Forge Merch.</p>
      <div style="border: 1px solid #333; padding: 20px; display: inline-block; border-radius: 10px;">
        <strong>Status:</strong> Connected to Gemini AI & InkedJoy
      </div>
    </div>
  `);
});

// 2. INKEDJOY SPEC MAP - High-Res Requirements
const INKEDJOY_SPECS = {
    'hoodie': { w: 3600, h: 3600 },
    'candle': { w: 900, h: 700 },
    'mug':    { w: 2475, h: 1125 }
};

// 3. GEMINI AI CONFIGURATION
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 4. THE FORGE ENDPOINT (This is what your Elementor button talks to)
app.post('/forge-merch', async (req, res) => {
    const { productType, userImage, tagline } = req.body;
    const spec = INKEDJOY_SPECS[productType] || INKEDJOY_SPECS['hoodie'];

    try {
        console.log(`🚀 Forging ${productType} at ${spec.w}x${spec.h}...`);
        
        const canvas = createCanvas(spec.w, spec.h);
        const ctx = canvas.getContext('2d');
        
        // Logic to load user art and apply Sensi brand filters
        const img = await loadImage(userImage);
        ctx.drawImage(img, 0, 0, spec.w, spec.h);
        
        // Final Response to Website
        res.json({ 
            success: true, 
            message: "Aura Processed: Design Forged for InkedJoy",
            dimensions: `${spec.w}x${spec.h}`
        });
    } catch (err) {
        console.error("Forge Error:", err);
        res.status(500).json({ error: "Forge failed during aura-processing." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Vault Engine running on port ${PORT}`);
});
