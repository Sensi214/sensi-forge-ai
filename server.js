import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Replicate from "replicate";

dotenv.config();

const app = express();
app.use(express.json({ limit: "20mb" }));
app.use(cors());

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Health check
app.get("/", (req, res) => {
  res.json({ status: "Forge server online" });
});

// Generate route
app.post("/generate", async (req, res) => {
  try {
    const authHeader = req.headers["x-sensi-key"];

    if (authHeader !== process.env.SENSI_FORGE_SHARED_SECRET) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized Forge Access",
      });
    }

    const { faceImage, hero, tier } = req.body;

    if (!faceImage) {
      return res.status(400).json({
        success: false,
        message: "Missing face image",
      });
    }

    // Split image
    const splitOutput = await replicate.run(
      "tgohblio/instant-id-multicontrolnet:35324a7df2397e6e57dfd8f4f9d2910425f5123109c8c3ed035e769aeff9ff3c",
      {
        input: {
          prompt: `${hero} cinematic dual identity hero split`,
          face_image_path: faceImage,
          pose_strength: 0.8,
          identity_strength: 0.85,
          negative_prompt: "ugly, deformed face, blurry, watermark",
        },
      }
    );

    // Full image
    const fullOutput = await replicate.run(
      "tgohblio/instant-id-multicontrolnet:35324a7df2397e6e57dfd8f4f9d2910425f5123109c8c3ed035e769aeff9ff3c",
      {
        input: {
          prompt: `${hero} full cinematic heroic masterpiece`,
          face_image_path: faceImage,
          pose_strength: 0.8,
          identity_strength: 0.85,
          negative_prompt: "ugly, deformed face, blurry, watermark",
        },
      }
    );

    res.json({
      success: true,
      image_split: Array.isArray(splitOutput) ? splitOutput[0] : splitOutput,
      image_full: Array.isArray(fullOutput) ? fullOutput[0] : fullOutput,
    });
  } catch (error) {
    console.error("Forge Error:", error);
    res.status(500).json({
      success: false,
      message: "Generation failed",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Forge active on port ${PORT}`);
});
