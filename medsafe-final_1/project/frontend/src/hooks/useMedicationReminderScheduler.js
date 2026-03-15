import { useEffect } from "react";

const STORAGE_KEY = "medsafe_reminders";
const LAST_FIRED_KEY = "medsafe_last_fired";

function readReminders() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function readLastFired() {
  try {
    return JSON.parse(localStorage.getItem(LAST_FIRED_KEY)) || {};
  } catch {
    return {};
  }
}

function writeLastFired(map) {
  localStorage.setItem(LAST_FIRED_KEY, JSON.stringify(map));
}

function canNotify() {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    window.isSecureContext &&
    Notification.permission === "granted"
  );
}

export default function useMedicationReminderScheduler() {
  useEffect(() => {
    const tick = () => {
      if (!canNotify()) return;

      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;
      const dateKey = now.toISOString().slice(0, 10);

      const reminders = readReminders();
      const lastFired = readLastFired();
      let changed = false;

      reminders.forEach((r) => {
        if (r.time !== currentTime) return;

        const key = `${r.id || r.drugName}-${dateKey}-${currentTime}`;
        if (lastFired[key]) return;

        try {
          new Notification(`💊 Time to take ${r.drugName}!`, {
            body: r.note || "Don't forget your medication.",
          });
          lastFired[key] = Date.now();
          changed = true;
        } catch {
          // Ignore notification errors.
        }
      });

      if (changed) writeLastFired(lastFired);
    };

    tick();
    const interval = setInterval(tick, 15000);
    return () => clearInterval(interval);
  }, []);
}
