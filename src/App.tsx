import React from "react";
import scheduleData from "./data/employee_shift_schedule_2025.json";
import {
  HomeIcon,
  ClockIcon,
  DocumentIcon as DocumentReportIcon,
  Cog6ToothIcon as CogIcon,
} from "@heroicons/react/24/outline";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AttendancePage } from "./pages/AttendancePage";
import { HistoryPage } from "./pages/HistoryPage";
import { getAttendanceRecords } from "./utils/storage";

function exportData() {
  const data = getAttendanceRecords();
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "attendance_records.json";
  a.click();
  URL.revokeObjectURL(url);
}

function resetData() {
  localStorage.removeItem("attendance_records");
  alert("All attendance records have been reset.");
  window.location.reload();
}

function getShiftsForDate(dateStr: string) {
  return scheduleData.find(day => day.date === dateStr)?.shifts || [];
}

const allEmployees = {
  "Line One": [
    { name: "Kevin Klarich" },
    { name: "Todd Newlin" },
    { name: "Ana Josine Gonzalez" },
    { name: "Jose Mendoza" },
    { name: "Justin Wade", temp: true },
  ],
  "Line Two": [
    { name: "Martell Ray" },
    { name: "Jeremy Schubert", temp: true },
    { name: "Maria Garcia" },
    { name: "Elieth Obando" },
    { name: "Tray Zschunke", temp: true },
  ],
};

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-20 bg-blue-600 text-white flex flex-col items-center py-6 fixed h-full">
          <nav className="flex flex-col flex-1 justify-center gap-10">
            <Link
              to="/"
              className="flex flex-col items-center gap-1 bg-blue-500 rounded-md px-3 py-3 hover:bg-blue-400 transition"
            >
              <HomeIcon className="h-6 w-6" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link
              to="/history"
              className="flex flex-col items-center gap-1 bg-blue-500 rounded-md px-3 py-3 hover:bg-blue-400 transition"
            >
              <ClockIcon className="h-6 w-6" />
              <span className="text-xs mt-1">History</span>
            </Link>
            <button
              onClick={exportData}
              className="flex flex-col items-center gap-1 bg-blue-500 rounded-md px-3 py-3 hover:bg-blue-400 transition"
            >
              <DocumentReportIcon className="h-6 w-6" />
              <span className="text-xs mt-1">Export</span>
            </button>
            <button
              onClick={resetData}
              className="flex flex-col items-center gap-1 bg-blue-500 rounded-md px-3 py-3 hover:bg-blue-400 transition"
            >
              <CogIcon className="h-6 w-6" />
              <span className="text-xs mt-1">Reset</span>
            </button>
          </nav>
        </aside>

        {/* Main content area */}
        <main className="ml-20 p-6 flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<AttendancePage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
