import express from "express";
import cors from "cors";
import Replicate from "replicate";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json({ limit: "20mb" }));
app.use(cors());

// ============================
// HEALTH CHECK
// ============================
app.get("/", (req, res) => {
  res.json({ status: "Forge server online" });
});

// ============================
// REPLICATE INIT
// ============================
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// ============================
// GENERATE ROUTE
// ============================
app.post("/generate", async (req, res) => {
  const authHeader = req.headers["x-sensi-key"];

  if (authHeader !== process.env.SENSI_FORGE_SHARED_SECRET) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized Forge Access",
    });
  }

  const { faceImage } = req.body;

  if (!faceImage) {
    return res.status(400).json({
      success: false,
      message: "Missing face image",
    });
  }

  try {
    console.log("🔥 Forge request received");

    // SPLIT IMAGE (Tier 3 Front)
    const splitOutput = await replicate.run(
      "tgolbido/instant-id-multicontrolnet:3532a4d7f2397e6e57dfd84f9d2910425f123109c8c3ed035e769aef9f9f1f3c",
      {
        input: {
          prompt: "Cinematic dual-identity hero split portrait",
          face_image_path: faceImage,
          pose_strength: 0.55,
          identity_strength: 0.85,
          width: 1024,
          height: 1024,
        },
      }
    );

    // FULL IMAGE (Tier 4 Masterpiece)
    const fullOutput = await replicate.run(
      "tgolbido/instant-id-multicontrolnet:3532a4d7f2397e6e57dfd84f9d2910425f123109c8c3ed035e769aef9f9f1f3c",
      {
        input: {
          prompt: "Full body cinematic heroic masterpiece",
          face_image_path: faceImage,
          pose_strength: 0.55,
          identity_strength: 0.85,
          width: 1024,
          height: 1536,
        },
      }
    );

    return res.json({
      success: true,
      image_split: Array.isArray(splitOutput) ? splitOutput[0] : splitOutput,
      image_full: Array.isArray(fullOutput) ? fullOutput[0] : fullOutput,
      status: "Forge Generation Complete",
    });
  } catch (error) {
    console.error("Forge error:", error);
    return res.status(500).json({
      success: false,
      message: "Generation failed",
    });
  }
});

// ============================
// START SERVER
// ============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Forge active on port ${PORT}`);
});
