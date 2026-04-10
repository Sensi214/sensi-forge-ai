import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import Replicate from "replicate";
import { fileURLToPath } from "url";

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize app
const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

// Uploads directory
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "hero-forge-api-1",
    model: "flux-1.1-pro",
    timestamp: Date.now()
  });
});

/* ============================================
   HERO-FORGE: Main Ascension Generator
============================================ */

app.post("/hero-forge", async (req, res) => {
  try {
    const { image, form, tier, city, energy } = req.body || {};

    if (!image) {
      return res.status(400).json({
        success: false,
        error: "Missing base64 image."
      });
    }

    if (!form) {
      return res.status(400).json({
        success: false,
        error: "Missing form."
      });
    }

    // =================================
    // 🧠 SAVE IMAGE
    // =================================
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const filename = `hero-${Date.now()}.jpg`;
    const inputPath = path.join(uploadsDir, filename);

    fs.writeFileSync(inputPath, buffer);

    // =================================
    // 🧠 PROMPT
    // =================================
    const prompt = `
Transform this selfie into a transcendent heroic form.
Form: ${form}.
Tier: ${tier || "ascension"}.
Energy: ${energy || "white-gold"}.
City Influence: ${city || "none"}.

IDENTITY LOCK:
- SAME face
- SAME bone structure
- SAME skin tone

STRICT:
- no extra people
- no distortion
- cinematic lighting
- ultra realistic
`.trim();

    // =================================
    // 🚀 GENERATE IMAGE
    // =================================
    const output = await replicate.run(
      "black-forest-labs/flux-1.1-pro",
      {
        input: {
          prompt,
          image: inputPath,
          guidance: 3.5,
          megapixels: "1"
        }
      }
    );

    const finalImage = Array.isArray(output) ? output[0] : output;

    // =================================
    // ✅ RESPONSE
    // =================================
    return res.json({
      success: true,
      image: finalImage
    });

  } catch (error) {
    console.error("Hero-Forge generation failed:", error);

    return res.status(500).json({
      success: false,
      error: "Hero-Forge generation failed."
    });
  }
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Hero-Forge-API-1 running on port ${PORT}`);
});
