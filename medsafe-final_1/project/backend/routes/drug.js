const express = require("express");
const axios = require("axios");
const { searchDrug, isDatabaseLoaded } = require("../utils/loadDataset");
const { findProblemFoodsForDrug } = require("../utils/foodInteractions");
const router = express.Router();

function buildDrugPayload(drug) {
  const payload = {
    brandName: drug.brandName,
    genericName: drug.genericName,
    manufacturer: drug.manufacturer,
    purpose: drug.purpose,
    warnings: drug.warnings,
    dosage: drug.dosage,
    description: drug.description,
  };

  return {
    ...payload,
    foodInteractions: findProblemFoodsForDrug(payload),
  };
}

// GET /api/drug/search?name=aspirin
router.get("/search", async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: "Drug name is required" });

  // ── 1. Try local Kaggle dataset first ──────────────────────────────
  if (isDatabaseLoaded()) {
    const results = searchDrug(name);

    if (results.length > 0) {
      const d = results[0];
      return res.json({
        success: true,
        source: "local-dataset",
        drug: buildDrugPayload({
          brandName:    d.name,
          genericName:  d.composition || "See composition",
          manufacturer: d.manufacturer || "N/A",
          purpose:      d.uses || "No usage information available.",
          warnings:     d.sideEffects || "No side effects information available.",
          dosage:       "Follow your doctor's prescription.",
          description:  d.composition || "N/A",
        }),
        suggestions: results.map((r) => r.name),
      });
    }
  }

  // ── 2. Fallback: OpenFDA brand name search ─────────────────────────
  try {
    const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:%22${encodeURIComponent(name)}%22&limit=1`;
    const response = await axios.get(url);
    const result = response.data.results[0];

    return res.json({
      success: true,
      source: "openfda",
      drug: buildDrugPayload({
        brandName:    result.openfda?.brand_name?.[0] || name,
        genericName:  result.openfda?.generic_name?.[0] || "N/A",
        manufacturer: result.openfda?.manufacturer_name?.[0] || "N/A",
        purpose:      result.purpose?.[0] || result.indications_and_usage?.[0] || "No purpose information available.",
        warnings:     result.warnings?.[0] || result.warnings_and_cautions?.[0] || "No warnings available.",
        dosage:       result.dosage_and_administration?.[0] || "No dosage information available.",
        description:  result.description?.[0] || "No description available.",
      }),
      suggestions: [],
    });
  } catch {
    // ── 3. Fallback: OpenFDA generic name search ─────────────────────
    try {
      const url2 = `https://api.fda.gov/drug/label.json?search=openfda.generic_name:%22${encodeURIComponent(name)}%22&limit=1`;
      const r2 = await axios.get(url2);
      const result = r2.data.results[0];

      return res.json({
        success: true,
        source: "openfda",
        drug: buildDrugPayload({
          brandName:    result.openfda?.brand_name?.[0] || name,
          genericName:  result.openfda?.generic_name?.[0] || name,
          manufacturer: result.openfda?.manufacturer_name?.[0] || "N/A",
          purpose:      result.purpose?.[0] || result.indications_and_usage?.[0] || "No purpose information available.",
          warnings:     result.warnings?.[0] || result.warnings_and_cautions?.[0] || "No warnings available.",
          dosage:       result.dosage_and_administration?.[0] || "No dosage information available.",
          description:  result.description?.[0] || "No description available.",
        }),
        suggestions: [],
      });
    } catch {
      return res.status(404).json({ error: "Drug not found. Try a different name or spelling." });
    }
  }
});

module.exports = router;
