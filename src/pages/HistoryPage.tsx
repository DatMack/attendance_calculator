import React, { useState } from "react";
import { getAttendanceRecords } from "../utils/storage";

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

  // Group entries by employee name
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
    const reason = (entry.reason || '').toLowerCase();
    const points = entry.points ?? 0;

    summary.totalPoints += points;
    if (reason === "present") {
      summary.presentDays += 1;
    } else if (reason === "absent") {
      summary.absentDays += 1;
    }
    summary.history.push({ ...entry, points });
    summary.history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");

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
      <h1 className="text-2xl font-bold mb-4 text-center">Shift History Summary</h1>

      <div className="mb-6 flex flex-col sm:flex-row justify-center gap-4 items-center">
        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded text-sm w-64"
        />
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="border px-4 py-2 rounded text-sm"
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
            className="bg-white shadow rounded mb-4 p-4 border border-gray-200"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setExpanded(expanded === emp.name ? null : emp.name)}
            >
              <div>
                <h2 className="text-lg font-semibold">{emp.name}</h2>
                <p className="text-sm text-gray-600">
                  Days Present: {emp.presentDays} | Days Absent: {emp.absentDays} | Points: {emp.totalPoints}
                </p>
                <p className="text-xs text-red-500 italic mt-1">Stage: {stage || "None"}</p>
              </div>
              <div className="text-sm text-blue-500">{expanded === emp.name ? "Hide" : "View"}</div>
            </div>

            {expanded === emp.name && (
              <div className="mt-4 border-t pt-2">
                <ul className="text-sm space-y-1">
                  {emp.history.map((h, idx) => (
                    <li key={idx} className="flex justify-between border-b py-1">
                      <span>{new Date(h.date).toLocaleDateString()}</span>
                      <span>{h.reason || "N/A"}</span>
                      <span>{h.points !== undefined ? (h.points > 0 ? `+${h.points}` : h.points) : "0"}</span>
                      {h.note && <span className="italic text-gray-500 ml-2">({h.note})</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};