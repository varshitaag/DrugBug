import { useState } from "react";
import DrugSearch from "./components/DrugSearch";
import MedicationReminder from "./components/MedicationReminder";
import useMedicationReminderScheduler from "./hooks/useMedicationReminderScheduler";

const TABS = [
  { id: "drug", label: "💊 Drug Info" },
  { id: "reminder", label: "⏰ Reminders" },
];

export default function App() {
  useMedicationReminderScheduler();

  const [activeTab, setActiveTab] = useState("drug");
  const [selectedDrug, setSelectedDrug] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              🏥 <span className="text-orange-400">MedSafe</span>
            </h1>
            <p className="text-blue-200 text-sm">
              Drug & Food Interaction Checker
            </p>
          </div>
          <span className="text-xs bg-orange-500 px-3 py-1 rounded-full font-semibold">
            HEAL-A-THON 2026
          </span>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm border border-gray-100">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-orange-500 text-white shadow"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6 pb-10">
          {activeTab === "drug" && (
            <DrugSearch
              onDrugSelect={setSelectedDrug}
              selectedDrug={selectedDrug}
            />
          )}
          {activeTab === "reminder" && <MedicationReminder />}
        </div>
      </div>
    </div>
  );
}
