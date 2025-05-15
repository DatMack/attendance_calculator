import React, { useState } from "react";
import { getAttendanceRecords } from "../utils/storage";

export const HistoryPage: React.FC = () => {
  const records = getAttendanceRecords();

  // Group records by employee
  const grouped = records.reduce((acc: Record<string, typeof records>, entry) => {
    if (!acc[entry.name]) acc[entry.name] = [];
    acc[entry.name].push(entry);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Attendance History</h1>

      {Object.entries(grouped).map(([name, entries]) => {
        const [open, setOpen] = useState(false);

        let totalPoints = entries.reduce((sum, entry) => sum + (entry.points || 0), 0);
        let action = null;
        if (totalPoints > 5) action = "Termination";
        else if (totalPoints > 4) action = "Final Written Warning";
        else if (totalPoints > 2) action = "Written Warning";
        else if (totalPoints > 0.5) action = "Verbal Warning";

        return (
          <div key={name} className="mb-4 border rounded shadow">
            <button
              onClick={() => setOpen(!open)}
              className="w-full text-left px-4 py-3 bg-blue-100 hover:bg-blue-200 font-semibold text-blue-800"
            >
              {name} {action && <span className="ml-2 font-normal text-red-600">({action})</span>}
            </button>
            {open && (
              <div className="p-4 bg-white">
                {entries.map((entry) => (
                  <div key={entry.id} className="border-b py-2 text-sm">
                    <p><strong>Status:</strong> {entry.status}</p>
                    <p><strong>Date:</strong> {new Date(entry.date).toLocaleString()}</p>
                    {entry.reason && <p><strong>Reason:</strong> {entry.reason}</p>}
                    {entry.time && <p><strong>Time:</strong> {entry.time}</p>}
                    {entry.points !== undefined && <p><strong>Points:</strong> {entry.points}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}