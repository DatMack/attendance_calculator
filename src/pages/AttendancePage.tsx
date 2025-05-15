import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

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
  const today = new Date().toISOString().split("T")[0];
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [absenceReason, setAbsenceReason] = useState("");
  const [showCallInModal, setShowCallInModal] = useState(false);
  const [showOtherModal, setShowOtherModal] = useState(false);

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
    console.log(`Marked present: ${name}`);
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
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-8 text-center">Attendance - {today}</h1>

      {/* Absence Modal */}
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
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => {
                  setModalOpen(false);
                  setAbsenceReason("");
                  setSelectedEmployee(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={!absenceReason}
                onClick={handleAbsentConfirm}
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
                className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
                onClick={() => {
                  setShowCallInModal(false);
                  setSelectedEmployee(null);
                  setAbsenceReason("");
                }}
              >
                Yes
              </button>
              <button
                className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
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

      {/* Attendance Interface */}
      {lineData.map(({ line, employees }) => (
        <div key={line} className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-center">{line}</h2>
          <div>
            {employees.map((emp) => (
              <div
                key={emp.id}
                className="border-b py-2 text-sm text-gray-700 flex justify-between items-center"
              >
                <div>
                  <span className="font-medium">{emp.name}</span>
                  {emp.temp && (
                    <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded ml-2">
                      Temp
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                    onClick={() => handlePresent(emp.name)}
                  >
                    Present
                  </button>
                  <button
                    className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                    onClick={() => {
                      setSelectedEmployee(emp.name);
                      setModalOpen(true);
                    }}
                  >
                    Absent
                  </button>
                  <button
                    className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
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
        </div>
      ))}
    </div>
  );
};

export default AttendancePage;