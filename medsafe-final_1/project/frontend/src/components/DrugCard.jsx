import { useState } from "react";

const Section = ({ title, content, icon }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = content.length > 200;
  const display = isLong && !expanded ? content.slice(0, 200) + "..." : content;

  return (
    <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
      <h4 className="text-sm font-semibold text-blue-900 mb-1">{icon} {title}</h4>
      <p className="text-gray-600 text-sm leading-relaxed">{display}</p>
      {isLong && (
        <button onClick={() => setExpanded(!expanded)} className="text-orange-500 text-xs mt-1 hover:underline">
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
};

export default function DrugCard({ drug, source, suggestions = [] }) {
  return (
    <div className="card space-y-4">
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-2xl font-bold text-blue-900">{drug.brandName}</h3>
          <p className="text-orange-500 font-medium">{drug.genericName}</p>
          <p className="text-gray-400 text-xs mt-1">Manufacturer: {drug.manufacturer}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">✓ Found</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            source === "local-dataset"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-500"
          }`}>
            {source === "local-dataset" ? "📦 Local Dataset" : "🌐 OpenFDA"}
          </span>
        </div>
      </div>

      {suggestions.length > 1 && (
        <div className="bg-orange-50 border border-orange-100 rounded-lg px-4 py-3">
          <p className="text-xs font-semibold text-orange-700 mb-2">Similar matches:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(1).map((s) => (
              <span key={s} className="text-xs bg-white border border-orange-200 text-orange-600 px-2.5 py-1 rounded-full">{s}</span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <Section title="What Does It Do?" icon="🎯" content={drug.purpose} />
        <Section title="Composition / Description" icon="🧪" content={drug.description} />
        <Section title="Dosage Instructions" icon="💉" content={drug.dosage} />
        <Section title="Side Effects" icon="⚠️" content={drug.warnings} />
      </div>

      {drug.foodInteractions?.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
          <div>
            <h4 className="text-sm font-bold text-red-800">🥗 Foods to watch with this tablet</h4>
            <p className="text-xs text-red-700 mt-1">
              Based on the drug name and composition, these foods or drinks may cause problems.
            </p>
          </div>

          <div className="space-y-2">
            {drug.foodInteractions.map((interaction) => (
              <div key={interaction.summary} className="bg-white border border-red-100 rounded-lg p-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <p className="font-semibold text-gray-800 capitalize">
                    {interaction.foodKeywords.join(", ")}
                  </p>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    interaction.riskLevel === "HIGH"
                      ? "bg-red-500 text-white"
                      : interaction.riskLevel === "MODERATE"
                        ? "bg-yellow-300 text-yellow-900"
                        : "bg-green-500 text-white"
                  }`}>
                    {interaction.riskLevel}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{interaction.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 text-sm text-orange-800">
        💡 <strong>Tip:</strong> The risky foods list above is based on this medicine's name and composition. Always confirm with your doctor for personal dietary advice.
      </div>
    </div>
  );
}
