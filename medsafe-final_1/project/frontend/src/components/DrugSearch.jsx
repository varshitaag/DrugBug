import { useState } from "react";
import axios from "axios";
import DrugCard from "./DrugCard";

export default function DrugSearch({ onDrugSelect, selectedDrug }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [source, setSource] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    onDrugSelect(null);

    try {
      const res = await axios.get(`/api/drug/search?name=${encodeURIComponent(query)}`);
      onDrugSelect(res.data.drug);
      setSource(res.data.source);
      setSuggestions(res.data.suggestions || []);
    } catch (err) {
      setError(err.response?.data?.error || "Drug not found. Try another name.");
    } finally {
      setLoading(false);
    }
  };

  const EXAMPLES = ["Aspirin", "Metformin", "Warfarin", "Lisinopril", "Paracetamol"];

  return (
    <div className="space-y-5">
      <div className="card">
        <h2 className="text-xl font-bold text-blue-900 mb-1">Search Your Medication</h2>
        <p className="text-gray-500 text-sm mb-4">
          Searches your local Kaggle dataset first, then OpenFDA as fallback. No API needed.
        </p>

        <div className="flex gap-3">
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Aspirin, Metformin, Warfarin..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="btn-primary whitespace-nowrap" onClick={handleSearch} disabled={loading || !query.trim()}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs text-gray-400">Try:</span>
          {EXAMPLES.map((drug) => (
            <button key={drug} onClick={() => setQuery(drug)}
              className="text-xs bg-orange-50 text-orange-600 border border-orange-200 px-2.5 py-1 rounded-full hover:bg-orange-100 transition">
              {drug}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-4 bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-3 text-sm">
            ⚠️ {error}
          </div>
        )}
      </div>

      {loading && (
        <div className="card flex items-center justify-center py-10 text-gray-400">
          <div className="animate-spin text-3xl mr-3">⏳</div>
          <span>Searching dataset...</span>
        </div>
      )}

      {selectedDrug && !loading && (
        <DrugCard drug={selectedDrug} source={source} suggestions={suggestions} />
      )}
    </div>
  );
}
