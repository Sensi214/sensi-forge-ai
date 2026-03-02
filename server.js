app.post("/generate", async (req, res) => {
  const authHeader = req.headers["x-sensi-key"];

  if (authHeader !== process.env.SENSI_FORGE_SHARED_SECRET) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized Forge Access"
    });
  }

  // TEMP TEST RESPONSE
  return res.json({
    success: true,
    image: "https://via.placeholder.com/1200x1600.png",
    status: "Forge Test Successful"
  });
});
