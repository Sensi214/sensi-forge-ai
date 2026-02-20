import express from 'express';
import cors from 'cors';
import Replicate from "replicate";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors(), express.json());

// This fixes the "Cannot GET /" and shows you a status page instead
app.get('/', (req, res) => {
  res.send('<body style="background:#000;color:#0f0;text-align:center;padding:50px;font-family:monospace;">' +
           '<h1>🏺 SENSI FORGE: INSTANT-ID ACTIVE</h1>' +
           '<p>Model: 35324a7d... [READY]</p></body>');
});

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

app.post('/forge-merch', async (req, res) => {
    const { userImage, tagline } = req.body;
    try {
        console.log("🚀 Forging Aura with Instant-ID...");
        const output = await replicate.run(
          "tencentarc/instant-id-multicontrolnet:35324a7df2397e6e57dfd8f4f9d2910425f5123109c8c3ed035e769aeff9ff3c",
          { input: { face_image: userImage, prompt: `A cinematic masterpiece of ${tagline}` } }
        );
        res.json({ success: true, imageUrl: output[0] });
    } catch (err) {
        res.status(500).json({ error: "Forge failed." });
    }
});

app.listen(process.env.PORT || 3000, () => console.log("Vault Engine Online"));
