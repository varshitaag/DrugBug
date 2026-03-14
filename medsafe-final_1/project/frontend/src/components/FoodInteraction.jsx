import { useState } from "react";
import axios from "axios";
import InteractionResult from "./InteractionResult";

const FOOD_EXAMPLES = [
  "Grapefruit", "Spinach", "Alcohol", "Milk", "Coffee",
  "Bananas", "Cheese", "Green Tea",
];

export default function FoodInteraction({ prefilledDrug }) {
  const [drugName, setDrugName] = useState(prefilledDrug || "");
  const [foodItem, setFoodItem] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    if (!drugName.trim() || !foodItem.trim()) {
      setError("Please enter both a drug name and a food item.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await axios.post("/api/interaction", {
        drugName: drugName.trim(),
        foodItem: foodItem.trim(),
      });
      setResult(res.data.interaction);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to check interaction. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="card">
        <h2 className="text-xl font-bold text-blue-900 mb-1">
          Check Drug–Food Interaction
        </h2>
        <p className="text-gray-500 text-sm mb-4">
          Find out if your medication reacts with something you're eating.
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1">
              💊 Drug Name
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Warfarin, Metformin..."
              value={drugName}
              onChange={(e) => setDrugName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1">
              🥗 Food / Drink
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Grapefruit, Alcohol, Milk..."
              value={foodItem}
              onChange={(e) => setFoodItem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
            />
            {/* Food quick-pick */}
            <div className="mt-2 flex flex-wrap gap-2">
              {FOOD_EXAMPLES.map((food) => (
                <button
                  key={food}
                  onClick={() => setFoodItem(food)}
                  className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full hover:bg-blue-100 transition"
                >
                  {food}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-3 text-sm">
              ⚠️ {error}
            </div>
          )}

          <button
            className="btn-primary w-full mt-1"
            onClick={handleCheck}
            disabled={loading || !drugName.trim() || !foodItem.trim()}
          >
            {loading ? "⏳ Analyzing Interaction..." : "🔍 Check Interaction"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="card text-center py-10 text-gray-400">
          <div className="text-4xl mb-3 animate-pulse">🧬</div>
          <p className="font-medium">Analyzing drug-food interaction...</p>
          <p className="text-sm">This may take a few seconds</p>
        </div>
      )}

      {result && !loading && (
        <InteractionResult
          result={result}
          drugName={drugName}
          foodItem={foodItem}
        />
      )}
    </div>
  );
}
