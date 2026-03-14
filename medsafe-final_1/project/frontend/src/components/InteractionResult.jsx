const RISK_CONFIG = {
  HIGH: {
    color: "bg-red-100 border-red-400 text-red-800",
    badge: "bg-red-500 text-white",
    icon: "🚨",
    label: "HIGH RISK",
  },
  MODERATE: {
    color: "bg-yellow-50 border-yellow-400 text-yellow-800",
    badge: "bg-yellow-400 text-yellow-900",
    icon: "⚠️",
    label: "MODERATE RISK",
  },
  LOW: {
    color: "bg-green-50 border-green-400 text-green-800",
    badge: "bg-green-500 text-white",
    icon: "✅",
    label: "LOW RISK",
  },
  NO_INTERACTION: {
    color: "bg-blue-50 border-blue-300 text-blue-800",
    badge: "bg-blue-500 text-white",
    icon: "💚",
    label: "NO INTERACTION",
  },
};

export default function InteractionResult({ result, drugName, foodItem }) {
  const config = RISK_CONFIG[result.riskLevel] || RISK_CONFIG["LOW"];

  return (
    <div className={`card border-2 ${config.color} space-y-4`}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-bold">
            {config.icon} {drugName} + {foodItem}
          </h3>
          <p className="text-sm opacity-75">Interaction Analysis</p>
        </div>
        <span
          className={`text-sm font-bold px-4 py-1.5 rounded-full ${config.badge}`}
        >
          {config.label}
        </span>
      </div>

      {/* Summary */}
      <div className="bg-white bg-opacity-60 rounded-xl p-4">
        <h4 className="text-sm font-bold uppercase tracking-wide mb-1 opacity-60">
          Summary
        </h4>
        <p className="font-medium text-base">{result.summary}</p>
      </div>

      {/* Why it happens */}
      {result.interactionExists && (
        <div className="bg-white bg-opacity-60 rounded-xl p-4">
          <h4 className="text-sm font-bold uppercase tracking-wide mb-1 opacity-60">
            🔬 Why This Happens
          </h4>
          <p className="text-sm leading-relaxed">{result.explanation}</p>
        </div>
      )}

      {/* Precautions */}
      <div className="bg-white bg-opacity-60 rounded-xl p-4">
        <h4 className="text-sm font-bold uppercase tracking-wide mb-1 opacity-60">
          🛡️ What You Should Do
        </h4>
        <p className="text-sm leading-relaxed">{result.precautions}</p>
      </div>

      {/* Timing */}
      <div className="bg-white bg-opacity-60 rounded-xl p-4">
        <h4 className="text-sm font-bold uppercase tracking-wide mb-1 opacity-60">
          ⏱️ Timing Advice
        </h4>
        <p className="text-sm leading-relaxed">{result.timing}</p>
      </div>

      <p className="text-xs opacity-50 text-center">
        ⚕️ This is informational only. Always consult your doctor or pharmacist.
      </p>
    </div>
  );
}
