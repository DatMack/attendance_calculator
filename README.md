# 📝 Attendance Calculator

A modern React + Vite + Tailwind app designed to help supervisors and team leads track employee attendance, calculate points based on company policy, and monitor disciplinary progress — all from a clean and responsive web interface.

---

## 🚀 Features

- ✅ Track daily attendance status (Present, Absent, Other) for all employees
- 🔢 Calculate attendance points automatically according to company rules
- 📅 Visualize employee shift schedules with color-coded Yellow/Blue day shifts and Day/Night times
- 📊 View detailed employee attendance history, points breakdown, and disciplinary stages
- 📝 Add manual entries with notes for exceptions or corrections
- 💾 Persist data locally using browser LocalStorage (no backend required)
- 📤 Export attendance records as JSON for backups or reporting
- ♻️ Reset attendance data easily from the UI
- 🖥️ Responsive UI with accessible modals and smooth interactions

---

## 📂 Project Structure

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

```
src/
├── data/
│   └── employee_shift_schedule_2025.json   # Shift schedule data for Yellow/Blue shifts
├── pages/
│   ├── AttendancePage.tsx                   # Main attendance tracking UI
│   └── HistoryPage.tsx                      # Employee attendance history & stats
├── utils/
│   └── storage.ts                           # Functions to save/load LocalStorage data
├── App.tsx                                 # Root app component with routing and sidebar
├── main.tsx                                # Entry point for React app
public/
└── favicon.ico                             # Local favicon to fix CSP issues
```
---

## 🛠️ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/DatMack/attendance_calculator.git
cd attendance_calculator
npm install
npm run dev

```
### 2. Build for production
```
npm run build
```

### 3. Deploy to GitHub Pages
```
npm run deploy
```

### Created by DatMack
PRs and feedback welcome!
