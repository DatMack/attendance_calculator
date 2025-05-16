import React from "react";
import scheduleData from "./data/employee_shift_schedule_2025.json";
import {
  HomeIcon,
  ClockIcon,
  DocumentIcon as DocumentReportIcon,
  Cog6ToothIcon as CogIcon,
} from "@heroicons/react/24/outline";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AttendancePage from "./pages/AttendancePage";
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
        <aside className="w-24 bg-gradient-to-b from-blue-600 to-blue-500 text-white flex flex-col items-center py-6 fixed h-full shadow-xl transition-all duration-300 ease-in-out">
          <nav className="flex flex-col flex-1 justify-center gap-10">
            <Link
              to="/"
              className="group relative flex flex-col items-center gap-1 bg-blue-500 rounded-lg px-2.5 py-2.5 hover:bg-blue-400 hover:scale-105 transition-transform duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            >
              <ClockIcon className="h-6 w-6" />
              <span className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Attendance
              </span>
            </Link>
            <Link
              to="/history"
              className="group relative flex flex-col items-center gap-1 bg-blue-500 rounded-lg px-2.5 py-2.5 hover:bg-blue-400 hover:scale-105 transition-transform duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            >
              <ClockIcon className="h-6 w-6" />
              <span className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                History
              </span>
            </Link>
            <button
              onClick={exportData}
              className="group relative flex flex-col items-center gap-1 bg-blue-500 rounded-lg px-2.5 py-2.5 hover:bg-blue-400 hover:scale-105 transition-transform duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            >
              <DocumentReportIcon className="h-6 w-6" />
              <span className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Export
              </span>
            </button>
            <button
              onClick={resetData}
              className="group relative flex flex-col items-center gap-1 bg-blue-500 rounded-lg px-2.5 py-2.5 hover:bg-blue-400 hover:scale-105 transition-transform duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            >
              <CogIcon className="h-6 w-6" />
              <span className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Reset
              </span>
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