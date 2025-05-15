# 📝 Attendance Calculator

A modern attendance and point-tracking tool built to help supervisors and team leads monitor employee attendance, assess points based on company policy, and track disciplinary stages — all from a clean, responsive interface.

---

## 🚀 Features

- ✅ Track attendance for each employee per day
- ⏰ Assign points based on custom absence rules (tardy, no call, late from break, etc.)
- 🔁 Automatically assess points on a rolling 12-month basis
- 📊 View employee history including reasons and total points
- 🟡 Color-coded shift schedules (Yellow/Blue) to help validate working days
- ➕ Log overtime hours for off-shift employees
- 📦 Local storage-based (no backend required)

---

## 🧠 Disciplinary Logic

Points are calculated and used to determine disciplinary stages:

| Total Points | Action              |
|--------------|---------------------|
| > 0.5        | Verbal Warning       |
| 2            | Written Warning      |
| 4            | Final Written Warning|
| 5+           | Termination Review   |

---

## 🖥️ Tech Stack

- **React** + **TypeScript**
- **Tailwind CSS** for styling
- **Vite** for fast builds
- LocalStorage for offline persistence

---

## 📂 Project Structure
src/
├── pages/
│   ├── AttendancePage.tsx   # Core tracking UI
│   └── HistoryPage.tsx      # Employee history & points
├── utils/
│   └── storage.ts           # Save/load localStorage
├── data/
│   └── employee_shift_schedule_2025.json # Imported work schedule
├── App.tsx
└── main.tsx

---

## 🛠️ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/DatMack/attendance_calculator.git
cd attendance_calculator
npm install
npm run dev

🔐 License

MIT

Created by DatMack
PRs and feedback welcome!
