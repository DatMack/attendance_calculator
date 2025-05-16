import React, { useState } from "react";
import { getAttendanceRecords } from "../utils/storage";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface HistoryEntry {
  date: string;
  name: string;
  reason?: string;
  points?: number;
  note?: string;
}

interface EmployeeSummary {
  name: string;
  temp?: boolean;
  presentDays: number;
  absentDays: number;
  totalPoints: number;
  history: HistoryEntry[];
}

export const HistoryPage = () => {
  const records: HistoryEntry[] = getAttendanceRecords();

  const employeeMap: Record<string, EmployeeSummary> = {};

  records.forEach((entry) => {
    if (!employeeMap[entry.name]) {
      employeeMap[entry.name] = {
        name: entry.name,
        presentDays: 0,
        absentDays: 0,
        totalPoints: 0,
        history: [],
      };
    }
    const summary = employeeMap[entry.name];
    const reason = (entry.reason || "").toLowerCase();
    const points = entry.points ?? 0;

    summary.totalPoints += points;
    if (reason === "present") {
      summary.presentDays += 1;
    } else if (reason === "absent") {
      summary.absentDays += 1;
    }
    summary.history.push({ ...entry, points });
    summary.history.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  });

  const allEmployees = [
    "Kevin Klarich",
    "Todd Newlin",
    "Ana Josine Gonzalez",
    "Jose Mendoza",
    "Justin Wade",
    "Martell Ray",
    "Jeremy Schubert",
    "Maria Garcia",
    "Elieth Obando",
    "Tray Zschunke",
  ];

  // Ensure all employees exist in employeeMap with empty summaries if missing
  allEmployees.forEach((name) => {
    if (!employeeMap[name]) {
      employeeMap[name] = {
        name,
        presentDays: 0,
        absentDays: 0,
        totalPoints: 0,
        history: [],
      };
    }
  });

  const today = new Date();
  const cutoff = new Date();
  cutoff.setHours(6, 0, 0, 0);
  const todayKey = today.toISOString().split("T")[0];

  Object.values(employeeMap).forEach((emp) => {
    const hasTodayEntry = emp.history.some((entry) =>
      entry.date.startsWith(todayKey)
    );
    if (!hasTodayEntry && new Date() > cutoff) {
      emp.history.unshift({
        date: today.toISOString(),
        name: emp.name,
        reason: "Missed Entry",
        points: 0,
      });
    }
  });

  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeSummary | null>(null);

  // New modal state and inputs for adding entries
  const [addEntryModal, setAddEntryModal] = useState<{
    employeeName: string;
    date: string;
  } | null>(null);
  const [addEntryReason, setAddEntryReason] = useState("");
  const [addEntryNote, setAddEntryNote] = useState("");

  const summaries = Object.values(employeeMap).filter((emp) => {
    const matchesName = emp.name.toLowerCase().includes(search.toLowerCase());
    let stage = "";
    if (emp.totalPoints > 4.9) stage = "Termination";
    else if (emp.totalPoints >= 4) stage = "Final Warning";
    else if (emp.totalPoints >= 2) stage = "Written Warning";
    else if (emp.totalPoints > 0.5) stage = "Verbal Warning";
    else stage = "None";
    const matchesStage = stageFilter === "All" || stage === stageFilter;
    return matchesName && matchesStage;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800 tracking-tight">
        Shift History Summary
      </h1>

      <div className="mb-6 flex flex-col sm:flex-row justify-center gap-4 items-center">
        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded text-sm w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="border px-4 py-2 rounded text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="All">All Stages</option>
          <option value="Verbal Warning">Verbal Warning</option>
          <option value="Written Warning">Written Warning</option>
          <option value="Final Warning">Final Warning</option>
          <option value="Termination">Termination</option>
        </select>
      </div>

      {summaries.map((emp) => {
        let stage = "";
        if (emp.totalPoints > 4.9) stage = "Termination";
        else if (emp.totalPoints >= 4) stage = "Final Warning";
        else if (emp.totalPoints >= 2) stage = "Written Warning";
        else if (emp.totalPoints > 0.5) stage = "Verbal Warning";

        return (
          <div
            key={emp.name}
            className="bg-white rounded-xl shadow-md mb-5 p-5 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-center cursor-pointer">
              <div>
                <h2 className="text-lg font-semibold">{emp.name}</h2>
                <p className="text-sm text-gray-600">
                  Days Present: {emp.presentDays} | Days Absent: {emp.absentDays} | Points:{" "}
                  {emp.totalPoints}
                </p>
                <p className="text-xs text-red-500 italic mt-1">Stage: {stage || "None"}</p>
              </div>
              <div className="flex gap-4 items-center">
                <button
                  className="text-sm text-blue-500 hover:underline"
                  onClick={() => setExpanded(expanded === emp.name ? null : emp.name)}
                >
                  {expanded === emp.name ? "Hide" : "View"}
                </button>
                <button
                  className="text-sm text-blue-500 hover:underline"
                  onClick={() => setSelectedEmployee(emp)}
                >
                  More Info
                </button>
              </div>
            </div>

            {expanded === emp.name && (
              <div className="mt-4 border-t pt-3">
                <ul className="text-sm space-y-2">
                  {emp.history.map((h, idx) => (
                    <li key={idx} className="flex justify-between border-b py-1">
                      <span className="text-gray-700">
                        {new Date(h.date).toLocaleDateString()}
                      </span>
                      <span className="text-gray-700">{h.reason || "N/A"}</span>
                      <span className="text-gray-700">
                        {h.points !== undefined ? (h.points > 0 ? `+${h.points}` : h.points) : "0"}
                      </span>
                      {h.note && <span className="italic text-gray-500 ml-2">({h.note})</span>}
                      {h.reason === "Missed Entry" && (
                        <button
                          onClick={() =>
                            setAddEntryModal({ employeeName: emp.name, date: h.date })
                          }
                          className="ml-2 text-xs text-blue-600 hover:underline"
                        >
                          Add Entry
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}

      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-[500px] max-h-[90vh] overflow-y-auto relative">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 tracking-tight">{selectedEmployee.name}</h2>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-800 mb-4">
              <div className="bg-gray-100 p-3 rounded">
                <p className="font-medium">Days Present</p>
                <p>{selectedEmployee.presentDays}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <p className="font-medium">Days Absent</p>
                <p>{selectedEmployee.absentDays}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <p className="font-medium">Total Points</p>
                <p>{selectedEmployee.totalPoints}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <p className="font-medium">Last Entry</p>
                <p>
                  {selectedEmployee.history.length
                    ? new Date(selectedEmployee.history[0].date).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="mb-6 space-y-6">
              {/* Pie Chart: Days Present vs Absent */}
              <div>
                <p className="font-semibold text-sm mb-2">Attendance Breakdown</p>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Present", value: selectedEmployee.presentDays },
                        { name: "Absent", value: selectedEmployee.absentDays },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      <Cell fill="#38A169" />
                      <Cell fill="#E53E3E" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <button
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => window.print()}
              >
                Print
              </button>
              <button
                className="px-3 py-1 text-sm bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={() => setSelectedEmployee(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {addEntryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-96 max-w-full">
            <h3 className="text-xl font-semibold mb-4">
              Add Entry for {addEntryModal.employeeName} on{" "}
              {new Date(addEntryModal.date).toLocaleDateString()}
            </h3>

            <label className="block mb-2 text-sm font-medium text-gray-700">Reason</label>
            <input
              type="text"
              value={addEntryReason}
              onChange={(e) => setAddEntryReason(e.target.value)}
              className="w-full border px-3 py-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Reason (e.g. Present, Late, etc.)"
            />

            <label className="block mb-2 text-sm font-medium text-gray-700">Note (optional)</label>
            <textarea
              value={addEntryNote}
              onChange={(e) => setAddEntryNote(e.target.value)}
              rows={3}
              className="w-full border px-3 py-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes"
            />

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                onClick={() => {
                  setAddEntryModal(null);
                  setAddEntryReason("");
                  setAddEntryNote("");
                }}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                disabled={!addEntryReason.trim()}
                onClick={() => {
                  const newEntry = {
                    date: addEntryModal.date,
                    name: addEntryModal.employeeName,
                    reason: addEntryReason.trim(),
                    points: 0,
                    note: addEntryNote.trim() || undefined,
                  };

                  const existingRecords = getAttendanceRecords();
                  existingRecords.push(newEntry);
                  localStorage.setItem("attendance_records", JSON.stringify(existingRecords));

                  setAddEntryModal(null);
                  setAddEntryReason("");
                  setAddEntryNote("");

                  window.location.reload();
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};