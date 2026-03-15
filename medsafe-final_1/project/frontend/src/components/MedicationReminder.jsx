import { useState, useEffect } from "react";

const STORAGE_KEY = "medsafe_reminders";

function getNotificationStatus() {
  if (typeof window === "undefined") return "unsupported";
  if (!("Notification" in window)) return "unsupported";
  if (!window.isSecureContext) return "insecure";
  return Notification.permission;
}

export default function MedicationReminder() {
  const [reminders, setReminders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });
  const [form, setForm] = useState({ drugName: "", time: "", note: "" });
  const [notificationStatus, setNotificationStatus] = useState(getNotificationStatus());
  const [saved, setSaved] = useState(false);

  // Save to localStorage whenever reminders change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  }, [reminders]);

  // Keep status in sync if user changes site notification setting.
  useEffect(() => {
    const sync = () => setNotificationStatus(getNotificationStatus());
    window.addEventListener("focus", sync);
    return () => window.removeEventListener("focus", sync);
  }, []);

  const requestPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setNotificationStatus("unsupported");
      return;
    }
    if (!window.isSecureContext) {
      setNotificationStatus("insecure");
      return;
    }
    const perm = await Notification.requestPermission();
    setNotificationStatus(perm);
  };

  const sendTestNotification = () => {
    if (notificationStatus !== "granted") return;
    new Notification("💊 MedSafe reminder test", {
      body: "Notifications are working for your browser.",
    });
  };

  const addReminder = () => {
    if (!form.drugName.trim() || !form.time) return;
    const newReminder = {
      id: Date.now(),
      drugName: form.drugName.trim(),
      time: form.time,
      note: form.note.trim(),
    };
    setReminders((prev) => [...prev, newReminder]);
    setForm({ drugName: "", time: "", note: "" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const deleteReminder = (id) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const formatTime = (t) => {
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    return `${hour > 12 ? hour - 12 : hour || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  return (
    <div className="space-y-5">
      {/* Notification Permission Banner */}
      {notificationStatus !== "granted" && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-yellow-800 text-sm">
              🔔 Enable Notifications
            </p>
            <p className="text-yellow-700 text-xs">
              {notificationStatus === "unsupported"
                ? "This browser does not support notifications."
                : notificationStatus === "insecure"
                  ? "Notifications require a secure context (localhost or https)."
                  : notificationStatus === "denied"
                    ? "Notifications are blocked. Enable them from browser site settings."
                    : "Allow notifications to get reminded when it's time to take your medicine."}
            </p>
          </div>
          <button
            onClick={requestPermission}
            className="btn-secondary text-sm whitespace-nowrap"
            disabled={notificationStatus === "unsupported" || notificationStatus === "insecure"}
          >
            Enable
          </button>
        </div>
      )}

      {notificationStatus === "granted" && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
          <p className="text-sm text-green-800 font-medium">✅ Notifications enabled</p>
          <button onClick={sendTestNotification} className="btn-secondary text-sm">
            Send Test
          </button>
        </div>
      )}

      {/* Add Reminder Form */}
      <div className="card">
        <h2 className="text-xl font-bold text-blue-900 mb-1">
          Add Medication Reminder
        </h2>
        <p className="text-gray-500 text-sm mb-4">
          Get notified when it's time to take your medicine.
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1">
              💊 Medication Name
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Metformin 500mg"
              value={form.drugName}
              onChange={(e) => setForm({ ...form, drugName: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1">
              ⏰ Reminder Time
            </label>
            <input
              type="time"
              className="input-field"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1">
              📝 Note (optional)
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Take with food, 2 tablets"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </div>

          <button
            className="btn-primary w-full"
            onClick={addReminder}
            disabled={!form.drugName.trim() || !form.time}
          >
            {saved ? "✅ Reminder Saved!" : "+ Add Reminder"}
          </button>
        </div>
      </div>

      {/* Reminders List */}
      <div className="card">
        <h3 className="text-lg font-bold text-blue-900 mb-4">
          📋 Your Reminders ({reminders.length})
        </h3>

        {reminders.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">💊</div>
            <p>No reminders set yet.</p>
            <p className="text-sm">Add your first medication above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reminders
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-blue-900">{r.drugName}</p>
                    <p className="text-sm text-blue-600">
                      ⏰ {formatTime(r.time)}
                      {r.note && (
                        <span className="ml-2 text-gray-500">· {r.note}</span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteReminder(r.id)}
                    className="text-red-400 hover:text-red-600 text-xl transition"
                    title="Delete reminder"
                  >
                    🗑️
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
