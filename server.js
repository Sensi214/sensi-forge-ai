import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

app.post('/forge-instant-id', async (req, res) => {
    const { userFaceImage, poseImage } = req.body;

    const output = await replicate.run(
      "tencentarc/instant-id-multicontrolnet:35324a7df2397e6e57dfd8f4f9d2910425f5123109c8c3ed035e769aeff9ff3c",
      {
        input: {
          face_image: userFaceImage,
          pose_image: poseImage,
          prompt: "High quality hoodie design, cinematic lighting, masterpiece",
        }
      }
    );
    res.json({ success: true, url: output[0] });
});
