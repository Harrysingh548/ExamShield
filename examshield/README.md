# ExamShield

ExamShield is a premium frontend-only examination management dashboard designed for colleges to streamline exam planning, hall configuration, and seating allocations. It is built with Next.js, TypeScript, Tailwind CSS, and local browser storage to keep everything functional without a backend.

## Features

- Smart dashboard with exam readiness KPIs
- Examination setup and scheduling workflow
- Hall management with capacity, aisle, and blocked-seat controls
- Deterministic seating allocation algorithm with conflict checks
- Interactive seat grid with drag-and-drop reassignments
- Student search and exam schedule filtering
- Frontend reporting and CSV export
- Demo data reset and local persistence with LocalStorage

## Tech Stack

- React.js + Next.js App Router
- TypeScript
- Tailwind CSS
- Lucide React
- Recharts
- LocalStorage persistence

## Installation

```bash
npm install
npm run dev
```

Then open http://localhost:3000 in your browser.

## Usage

1. Open the dashboard to review exam health metrics.
2. Configure new examinations from the Exams page.
3. Add and manage halls from the Halls page.
4. Generate seating plans from the Seating page.
5. Review schedules, search students, and export reports.
6. Use the Settings page to reset demo data or update seating rules.

## Seating Algorithm Explanation

The seating allocation engine assigns students based on hall availability and rule configuration. It avoids blocked seats, respects aisle restrictions, and prevents adjacent students from sharing the same subject or department when enabled. The algorithm uses a deterministic candidate ordering and fallback allocation pattern so the result is explainable and repeatable in frontend-only logic.

## Screenshots

Add screenshots of the dashboard, seating grid, and reports in the project screenshot folder or include image references here as you capture them.

## Deployment

This app can be deployed to Vercel or any Node.js-compatible hosting platform that supports Next.js. For Vercel:

```bash
npm run build
```

Then deploy the project through the Vercel dashboard or CLI.
