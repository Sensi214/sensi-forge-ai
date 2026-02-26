app.post("/generate", async (req, res) => {
  try {
    const { prompt_split, prompt_full, faceImage } = req.body;

    // Generate split image
    const splitOutput = await replicate.run(
      "tgohblio/instant-id-multicontrolnet:35324a7df2397e6e57dfd8f4f9d2910425f5123109c8c3ed035e769aeff9ff3c",
      {
        input: {
          prompt: prompt_split,
          face_image_path: faceImage,
          pose_strength: 0.55,
          identity_strength: 0.85,
          width: 1536,
          height: 1024,
          negative_prompt:
            "ugly, low quality, deformed face, warped body, distorted limbs, bad anatomy, extra limbs, extra fingers, missing limbs, blurry, grainy, watermark, text, nsfw, cropped head, portrait orientation, close-up, selfie style"
        }
      }
    );

    // Generate full-body hero image
    const fullOutput = await replicate.run(
      "tgohblio/instant-id-multicontrolnet:35324a7df2397e6e57dfd8f4f9d2910425f5123109c8c3ed035e769aeff9ff3c",
      {
        input: {
          prompt: prompt_full,
          face_image_path: faceImage,
          pose_strength: 0.55,
          identity_strength: 0.85,
          width: 1536,
          height: 1024,
          negative_prompt:
            "ugly, low quality, deformed face, warped body, distorted limbs, bad anatomy, extra limbs, extra fingers, missing limbs, blurry, grainy, watermark, text, nsfw, cropped head, portrait orientation, close-up, selfie style"
        }
      }
    );

    res.json({
      image_split: Array.isArray(splitOutput) ? splitOutput[0] : splitOutput,
      image_full: Array.isArray(fullOutput) ? fullOutput[0] : fullOutput
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Generation failed" });
  }
});
