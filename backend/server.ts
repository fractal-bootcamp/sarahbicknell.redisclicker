import express from "express";
import { exportedRedisClient } from "./redis";
import path from "path";
const app = express();
import cors from "cors";
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.static(path.join(__dirname, 'build')))

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/api/click/:userId", async (req, res) => {
  const now = new Date();
  const userId = req.params.userId;
  const bufferCount = await exportedRedisClient.countClicksInTimeRange(userId);
  if (bufferCount >= 10) return res.status(429).json({ bufferCount });
  exportedRedisClient.addClick(now, userId);
  console.log(`Fetched buffer count for user ${userId}: ${bufferCount}`);
  return res.status(200).json({ bufferCount });
});
app.get("/api/count/", async (req, res) => {
  const count = await exportedRedisClient.getCount();
  res.json({ count });
});
app.get("/api/buffer/:userId", async (req, res) => {
  const userId = req.params.userId;
  const bufferCount = await exportedRedisClient.countClicksInTimeRange(userId);
  res.json({ bufferCount });
});
app.get('*', (req, res) => { // {{ edit_3 }}
    res.sendFile(path.join(__dirname, 'build', 'index.html')); // {{ edit_4 }}
  });
app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
