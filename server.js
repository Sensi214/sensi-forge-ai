import express from 'express';
import pkg from 'canvas';
const { createCanvas, loadImage } = pkg;
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. HOMEPAGE FIX
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding: 50px; background: #000; color: #fff; height: 100vh;">
      <h1 style="color: #00ffcc;">🏺 SENSI FORGE AI: ONLINE</h1>
      <p>Custom AI Engine is Active.</p>
    </div>
  `);
});

// 2. GEMINI AI CONFIGURATION
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 3. YOUR SPECIFIC PROJECT LOGIC
app.post('/forge-merch', async (req, res) => {
    const { userImage, tagline } = req.body;

    try {
        console.log("🚀 Processing AI Request...");
        
        // Add your specific logic here for your other project
        
        res.json({ 
            success: true, 
            message: "AI Processing Complete",
            status: "Aura Captured"
        });
    } catch (err) {
        console.error("Forge Error:", err);
        res.status(500).json({ error: "Processing failed." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Vault Engine running on port ${PORT}`);
});
