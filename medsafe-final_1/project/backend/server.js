const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const { loadDataset } = require("./utils/loadDataset");
const drugRoutes = require("./routes/drug");
const interactionRoutes = require("./routes/interaction");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/drug", drugRoutes);
app.use("/api/interaction", interactionRoutes);

app.get("/", (req, res) => {
  res.json({ message: "MedSafe API is running!" });
});

// Load Kaggle CSV dataset first, then start server
loadDataset().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});
