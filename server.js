import express from "express";
import cors from "cors";
import Replicate from "replicate";

const app = express();
app.use(cors());
app.use(express.json());

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
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
          negative_prompt: "ugly, low quality, deformed face, nsfw"
        },
      }
    );

    res.json({ image: output });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Generation failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
