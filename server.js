import express from "express";
import cors from "cors";
import Replicate from "replicate";

const app = express();

// 1. Enable CORS for WordPress communication
app.use(cors());

// 2. Expand capacity to handle large image data
app.use(express.json({ limit: '50mb' }));

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Health check
app.get("/", (req, res) => {
  res.send("Sensi Forge AI is live 🔥");
});

app.post("/generate", async (req, res) => {
  try {
    const { prompt, faceImage } = req.body;

    const output = await replicate.run(
      "tgohblio/instant-id-multicontrolnet:35324a7df2397e6e57dfd8f4f9d2910425f5123109c8c3ed035e769aeff9ff3c",
      {
        input: {
          prompt: prompt,
          pose_strength: 0.5,
          face_image_path: faceImage,
          negative_prompt: "ugly, low quality, deformed face, nsfw",
        },
      }
    );

    const imageUrl = Array.isArray(output) ? output[0] : output;
    res.json({ image: imageUrl });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Generation failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
