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

const AttendancePage = () => {
  const today = new Date().toISOString().split("T")[0];
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
    "No call / No show",
  ];

  const handlePresent = (name: string) => {
    const record = {
      id: uuidv4(),
      name,
      date: today,
      reason: "present",
      points: 0,
    };
    const existing = JSON.parse(localStorage.getItem("attendance_records") || "[]");
    const alreadyLogged = existing.some(
      (entry: any) =>
        entry.name === name &&
        entry.date === today &&
        (entry.reason === "present" || entry.reason === "absent")
    );
    if (alreadyLogged) {
      alert("This employee already has an attendance entry for today.");
      return;
    }
    localStorage.setItem("attendance_records", JSON.stringify([...existing, record]));
    console.log(`Marked present: ${name}`);
  };

  return (
    <div className="p-6">
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
}

export default AttendancePage;