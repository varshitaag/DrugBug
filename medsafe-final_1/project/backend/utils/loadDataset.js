const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

let drugDatabase = [];
let drugIndex = {}; // lowercase name → record (O(1) lookup)

/**
 * Loads the Kaggle CSV into memory once at startup.
 *
 * Supported Kaggle dataset column names:
 *   Medicine Name | name | Drug Name | drug_name
 *   Composition   | composition | Ingredients
 *   Uses          | uses | Indication
 *   Side_effects  | side_effects | Side Effects
 *   Manufacturer  | manufacturer
 */
function loadDataset() {
  return new Promise((resolve) => {
    const filePath = path.join(__dirname, "../data/medicine_details.csv");

    if (!fs.existsSync(filePath)) {
      console.warn(
        "⚠️  No dataset found at backend/data/medicine_details.csv\n" +
        "   Download from Kaggle, rename to medicine_details.csv, and place it there.\n" +
        "   App will fall back to OpenFDA for drug searches."
      );
      return resolve();
    }

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const normalized = {
          name:         row["Medicine Name"] || row["name"] || row["Drug Name"] || row["drug_name"] || "",
          composition:  row["Composition"]   || row["composition"] || row["Ingredients"] || "",
          uses:         row["Uses"]          || row["uses"] || row["Indication"] || "",
          sideEffects:  row["Side_effects"]  || row["side_effects"] || row["Side Effects"] || "",
          manufacturer: row["Manufacturer"]  || row["manufacturer"] || "",
        };

        if (normalized.name.trim()) {
          drugDatabase.push(normalized);
          drugIndex[normalized.name.toLowerCase()] = normalized;
        }
      })
      .on("end", () => {
        console.log(`✅ Dataset loaded: ${drugDatabase.length} drugs indexed.`);
        resolve();
      })
      .on("error", (err) => {
        console.error("❌ Failed to load dataset:", err.message);
        resolve(); // don't crash — fall back to OpenFDA
      });
  });
}

/**
 * Search by name: exact → startsWith → contains.
 * Returns top 5 matches.
 */
function searchDrug(query) {
  const q = query.toLowerCase().trim();

  if (drugIndex[q]) return [drugIndex[q]];

  const startsWith = drugDatabase.filter((d) =>
    d.name.toLowerCase().startsWith(q)
  );
  if (startsWith.length > 0) return startsWith.slice(0, 5);

  return drugDatabase
    .filter((d) => d.name.toLowerCase().includes(q))
    .slice(0, 5);
}

function isDatabaseLoaded() {
  return drugDatabase.length > 0;
}

module.exports = { loadDataset, searchDrug, isDatabaseLoaded };
