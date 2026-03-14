const express = require("express");
const { findInteraction } = require("../utils/foodInteractions");
const router = express.Router();

// POST /api/interaction
// Body: { drugName, foodItem }
router.post("/", (req, res) => {
  const { drugName, foodItem } = req.body;

  if (!drugName || !foodItem) {
    return res.status(400).json({ error: "Both drugName and foodItem are required." });
  }

  const interaction = findInteraction(drugName, foodItem);
  res.json({ success: true, interaction });
});

module.exports = router;
