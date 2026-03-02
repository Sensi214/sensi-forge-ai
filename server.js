import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json({ limit: "20mb" }));
app.use(cors());

// ===============================
// HEALTH CHECK (optional but smart)
// ===============================
app.get("/", (req, res) => {
  res.json({ status: "Forge server online" });
});

// ===============================
// FORGE GENERATE ROUTE
// ===============================
app.post("/generate", async (req, res) => {
  const authHeader = req.headers["x-sensi-key"];

  // Security check
  if (authHeader !== process.env.SENSI_FORGE_SHARED_SECRET) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized Forge Access"
    });
  }

  // TEMP TEST RESPONSE (safe mode)
  return res.json({
    success: true,
    image_split: "https://via.placeholder.com/800x600.png",
    image_full: "https://via.placeholder.com/1200x1600.png",
    status: "Forge Test Successful"
  });
});

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Forge active on port ${PORT}`);
});
