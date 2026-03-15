const express = require("express");
const { findInteraction, findProblemFoodsForDrug } = require("../utils/foodInteractions");
const router = express.Router();

// GET /api/interaction/foods?drugName=metformin
router.get("/foods", (req, res) => {
  const { drugName } = req.query;

  if (!drugName) {
    return res.status(400).json({ error: "drugName is required." });
  }

  const foods = findProblemFoodsForDrug(drugName);
  res.json({ success: true, foods });
});

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
