import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import schedule from "../data/employee_shift_schedule_2025.json";

const lineData = [
  {
    line: "Line One",
    employees: [
      { id: 1, name: "Kevin Klarich" },
      { id: 2, name: "Todd Newlin" },
      { id: 3, name: "Ana Josine Gonzalez" },
      { id: 4, name: "Jose Mendoza" },
      { id: 5, name: "Justin Wade", temp: true },
    ],
  },
  {
    line: "Line Two",
    employees: [
      { id: 6, name: "Martell Ray" },
      { id: 7, name: "Jeremy Schubert", temp: true },
      { id: 8, name: "Maria Garcia" },
      { id: 9, name: "Elieth Obando" },
      { id: 10, name: "Tray Zschunke", temp: true },
    ],
  },
];

const AttendancePage = () => {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [absenceReason, setAbsenceReason] = useState("");
  const [showCallInModal, setShowCallInModal] = useState(false);
  const [showOtherModal, setShowOtherModal] = useState(false);
  const [leftEarlyTime, setLeftEarlyTime] = useState("");
  const [confirmedPresent, setConfirmedPresent] = useState<string[]>([]);
  const [confirmedAbsent, setConfirmedAbsent] = useState<string[]>([]);

  const absenceReasons = [
    "No call < 2 hrs",
    "Transportation call-in < 6 hrs",
    "Tardy ≤ 2 hrs",
    "Tardy > 2 hrs",
    "No call / No show",
  ];

  const reasonPoints: Record<string, number> = {
    "No call < 2 hrs": 0.5,
    "Transportation call-in < 6 hrs": 0.5,
    "Tardy ≤ 2 hrs": 0.5,
    "Tardy > 2 hrs": 1,
    "No call / No show": 1.5,
  };

  const hasAttendanceEntryToday = (name: string): boolean => {
    const existing = JSON.parse(localStorage.getItem("attendance_records") || "[]");
    return existing.some(
      (entry: any) =>
        entry.name === name &&
        entry.date === today &&
        (entry.reason === "present" || absenceReasons.includes(entry.reason))
    );
  };

  const getShiftInfo = () => {
    const currentMonthName = now.toLocaleString("default", { month: "long" });
    const day = now.getDate();
    const yellowDays = schedule["yellow"]?.[currentMonthName] || [];
    const isYellowShift = yellowDays.includes(day);

    const hour = now.getHours();
    const isNightShift = hour >= 18 || hour < 6;

    return {
      shiftColor: isYellowShift ? "Yellow" : "Blue",
      shiftTime: isNightShift ? "Night" : "Day",
    };
  };

  const shiftInfo = getShiftInfo();

  const handlePresent = (name: string) => {
    if (hasAttendanceEntryToday(name)) {
      alert(`${name} already has a Present or Absent entry for today.`);
      return;
    }

    const record = {
      id: uuidv4(),
      name,
      date: today,
      reason: "present",
      points: 0,
    };
    const existing = JSON.parse(localStorage.getItem("attendance_records") || "[]");
    localStorage.setItem("attendance_records", JSON.stringify([...existing, record]));
    const updated = [...confirmedPresent, name];
    setConfirmedPresent(updated);
  };

  const handleAbsentConfirm = () => {
    if (!selectedEmployee || !absenceReason) return;

    if (hasAttendanceEntryToday(selectedEmployee)) {
      alert("This employee already has an attendance entry for today.");
      setModalOpen(false);
      return;
    }

    const record = {
      id: uuidv4(),
      name: selectedEmployee,
      date: today,
      reason: absenceReason,
      points: reasonPoints[absenceReason] || 0,
    };

    const existing = JSON.parse(localStorage.getItem("attendance_records") || "[]");
    localStorage.setItem("attendance_records", JSON.stringify([...existing, record]));
    setModalOpen(false);
    setShowCallInModal(true);

    const updatedAbsent = [...confirmedAbsent, selectedEmployee];
    setConfirmedAbsent(updatedAbsent);
  };

  const handleOtherSubmit = (type: string) => {
    if (!selectedEmployee) return;

    const existing = JSON.parse(localStorage.getItem("attendance_records") || "[]");

    const record = {
      id: uuidv4(),
      name: selectedEmployee,
      date: today,
      reason: type === "late" ? "Late from break" : `Left early at ${leftEarlyTime}`,
      points: 1,
    };

    localStorage.setItem("attendance_records", JSON.stringify([...existing, record]));
    setShowOtherModal(false);
    setSelectedEmployee(null);
    setLeftEarlyTime("");
  };

  return (
    <div className="p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-gray-800 tracking-tight">Attendance</h1>
        <div className="text-lg text-gray-600">{new Date(today).toLocaleDateString()}</div>
        <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 border border-blue-300 text-blue-900 rounded-full shadow">
          {shiftInfo.shiftColor === "Yellow" ? "🟡" : "🔵"} {shiftInfo.shiftColor} {shiftInfo.shiftTime} Shift
        </div>
      </div>

      {/* Absent Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">
              Reason for {selectedEmployee}'s absence
            </h3>
            <select
              className="w-full border px-3 py-2 mb-4 rounded"
              value={absenceReason}
              onChange={(e) => setAbsenceReason(e.target.value)}
            >
              <option value="">Select a reason</option>
              {absenceReasons.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => {
                  setModalOpen(false);
                  setSelectedEmployee(null);
                  setAbsenceReason("");
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleAbsentConfirm}
                disabled={!absenceReason}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Call-in Modal */}
      {showCallInModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">
              Did {selectedEmployee} follow proper call-in procedure?
            </h3>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-green-100 text-green-700 rounded"
                onClick={() => {
                  setShowCallInModal(false);
                  setSelectedEmployee(null);
                  setAbsenceReason("");
                }}
              >
                Yes
              </button>
              <button
                className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded"
                onClick={() => {
                  const noteRecord = {
                    id: uuidv4(),
                    name: selectedEmployee,
                    date: today,
                    reason: "Failure to follow call-in procedure",
                    points: 0.5,
                  };
                  const existing = JSON.parse(localStorage.getItem("attendance_records") || "[]");
                  localStorage.setItem("attendance_records", JSON.stringify([...existing, noteRecord]));
                  setShowCallInModal(false);
                  setSelectedEmployee(null);
                  setAbsenceReason("");
                }}
              >
                Add 0.5 Point
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Other Modal */}
      {showOtherModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">Exception for {selectedEmployee}</h3>
            <label className="block mb-2">Left early time:</label>
            <input
              type="time"
              value={leftEarlyTime}
              onChange={(e) => setLeftEarlyTime(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-2 bg-red-100 text-red-700 rounded"
                disabled={!leftEarlyTime}
                onClick={() => handleOtherSubmit("early")}
              >
                Submit Left Early
              </button>
              <button
                className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded"
                onClick={() => handleOtherSubmit("late")}
              >
                Late from Break
              </button>
              <button
                className="px-3 py-2 bg-gray-200 text-gray-800 rounded"
                onClick={() => {
                  setShowOtherModal(false);
                  setSelectedEmployee(null);
                  setLeftEarlyTime("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Buttons */}
      {lineData.map(({ line, employees }) => (
        <div key={line} className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200 hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-semibold mb-4 text-center">{line}</h2>
          {employees.map((emp) => (
            <div key={emp.id} className="py-3 flex justify-between items-center text-sm border-b border-gray-100">
              <div>
                <span className="font-medium">{emp.name}</span>
                {emp.temp && (
                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                    Temp
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  className={`px-4 py-1.5 text-xs font-medium rounded transition-all duration-150 ${
                    confirmedPresent.includes(emp.name)
                      ? "bg-green-500 text-white"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                  onClick={() => handlePresent(emp.name)}
                  disabled={confirmedPresent.includes(emp.name)}
                >
                  Present
                </button>
                <button
                  className={`px-4 py-1.5 text-xs font-medium rounded transition-all duration-150 ${
                    confirmedAbsent.includes(emp.name)
                      ? "bg-red-500 text-white"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                  onClick={() => {
                    setSelectedEmployee(emp.name);
                    setModalOpen(true);
                  }}
                  disabled={confirmedAbsent.includes(emp.name)}
                >
                  Absent
                </button>
                <button
                  className="px-4 py-1.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded transition-all duration-150 hover:bg-yellow-200"
                  onClick={() => {
                    setSelectedEmployee(emp.name);
                    setShowOtherModal(true);
                  }}
                >
                  Other
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AttendancePage;