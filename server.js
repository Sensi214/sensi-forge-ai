app.post("/generate", async (req, res) => {
  try {
    const { prompt, faceImage } = req.body;

    const output = await replicate.run(
      "tgohblio/instant-id-multicontrolnet:35324a7df2397e6e57dfd8f4f9d2910425f5123109c8c3ed035e769aeff9ff3c",
      {
        input: {
          prompt: prompt,
          face_image_path: faceImage,
          pose_strength: 0.5,
          negative_prompt: "ugly, low quality, deformed face, nsfw",

          // ⭐ THE FIX ⭐
          width: 1536,
          height: 1024
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
