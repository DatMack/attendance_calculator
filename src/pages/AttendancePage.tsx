import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { saveAttendanceRecord } from "../utils/storage";

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

export const AttendancePage: React.FC = () => {
  const today = new Date().toLocaleDateString();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [absenceReason, setAbsenceReason] = useState("");
  const [showCallInModal, setShowCallInModal] = useState(false);
  const [showOtherModal, setShowOtherModal] = useState(false);

  const absenceOptions = [
    "No call < 2 hrs",
    "Transportation call-in < 6 hrs",
    "Tardy ≤ 2 hrs",
    "Tardy > 2 hrs",
    "No call / No show"
  ];

  return (
    <div className="p-6">
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">Reason for {selectedEmployee}'s absence</h3>
            <select
              className="w-full border px-3 py-2 mb-4 rounded"
              value={absenceReason}
              onChange={(e) => setAbsenceReason(e.target.value)}
            >
              <option value="">Select a reason</option>
              {absenceOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
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
                onClick={() => {
                  setModalOpen(false);
                  setShowCallInModal(true);
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

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
                  saveAttendanceRecord({
                    id: uuidv4(),
                    name: selectedEmployee!,
                    date: new Date().toISOString(),
                    status: "Absent",
                    reason: absenceReason,
                    points: 0,
                  });
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
                  saveAttendanceRecord({
                    id: uuidv4(),
                    name: selectedEmployee!,
                    date: new Date().toISOString(),
                    status: "Absent",
                    reason: absenceReason,
                    points: 0.5,
                  });
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

      {showOtherModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">
              What kind of exception for {selectedEmployee}?
            </h3>
            <div className="flex flex-col gap-3">
              <button
                className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                onClick={() => {
                  const time = prompt("What time did they leave early?");
                  if (time) {
                    saveAttendanceRecord({
                      id: uuidv4(),
                      name: selectedEmployee!,
                      date: new Date().toISOString(),
                      status: "Other",
                      reason: "Left Early",
                      time
                    });
                  }
                  setShowOtherModal(false);
                  setSelectedEmployee(null);
                }}
              >
                Left Early
              </button>
              <button
                className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                onClick={() => {
                  saveAttendanceRecord({
                    id: uuidv4(),
                    name: selectedEmployee!,
                    date: new Date().toISOString(),
                    status: "Other",
                    reason: "Late Back from Break",
                    points: 1,
                  });
                  setShowOtherModal(false);
                  setSelectedEmployee(null);
                }}
              >
                Late Back from Break
              </button>
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={() => {
                  setShowOtherModal(false);
                  setSelectedEmployee(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-8 text-center">Attendance - {today}</h1>

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
                    onClick={() => {
                      saveAttendanceRecord({
                        id: uuidv4(),
                        name: emp.name,
                        date: new Date().toISOString(),
                        status: "Present",
                      });
                    }}
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