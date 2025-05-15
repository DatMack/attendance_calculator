export type AttendanceEntry = {
  id: string;
  name: string;
  date: string;
  status: "Present" | "Absent" | "Other";
  reason?: string;
  time?: string;
  points?: number;
};

const STORAGE_KEY = "attendance_records";

export function getAttendanceRecords(): AttendanceEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Failed to load attendance records:", err);
    return [];
  }
}

export function saveAttendanceRecord(entry: AttendanceEntry): void {
  try {
    const existing = getAttendanceRecords();
    existing.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (err) {
    console.error("Failed to save attendance record:", err);
  }
}