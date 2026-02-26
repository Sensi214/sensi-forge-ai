import express from "express";
import cors from "cors";
import Replicate from "replicate";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

app.post("/generate", async (req, res) => {
  try {
    const { faceImage, prompt_split, prompt_full } = req.body;

    // 1. Generate Split Image (For Tier 3 Front)
    const splitOutput = await replicate.run(
      "tgohblio/instant-id-multicontrolnet:35324a7df2397e6e57dfd8f4f9d2910425f5123109c8c3ed035e769aeff9ff3c",
      {
        input: {
          prompt: prompt_split || "Cinematic dual-identity hero split",
          face_image_path: faceImage,
          pose_strength: 0.55,
          identity_strength: 0.85,
          width: 1536,
          height: 1024,
          negative_prompt: "ugly, deformed face, bad anatomy, blurry, watermark"
        }
      }
    );

    // 2. Generate Full-Body Image (For Tier 4 & Back-Face)
    const fullOutput = await replicate.run(
      "tgohblio/instant-id-multicontrolnet:35324a7df2397e6e57dfd8f4f9d2910425f5123109c8c3ed035e769aeff9ff3c",
      {
        input: {
          prompt: prompt_full || "Full body cinematic heroic masterpiece",
          face_image_path: faceImage,
          pose_strength: 0.55,
          identity_strength: 0.85,
          width: 1536,
          height: 1024,
          negative_prompt: "ugly, deformed face, bad anatomy, blurry, watermark"
        }
      }
    );

    res.json({
      image_split: Array.isArray(splitOutput) ? splitOutput[0] : splitOutput,
      image_full: Array.isArray(fullOutput) ? fullOutput[0] : fullOutput
    });

  } catch (error) {
    console.error("Forge Error:", error);
    res.status(500).json({ error: "Generation failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Forge active on port ${PORT}`));
