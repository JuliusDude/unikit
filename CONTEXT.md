# Project Context

## Current Objective
- [x] Remove the `+ Add Notice` button from the Campus News Widget header.

## Active Tasks
- [x] Started backend server via `npm start` (port 4000).
- [x] Started frontend server via `npm run dev` (port 3000).
- [x] Updated `CampusNewsWidget`:
  - Removed the `+ Add Notice` button from the widget header.
  - Strictly filters for upcoming notices/events (deadline/event date >= today).
  - Sorts by priority rank (High > Medium > Low/Normal) and then earliest deadline/event date.
  - Limits display to a maximum of 3 items in default view.
  - In expanded view (`PopoutWidget`), renders all upcoming items with a scrollable view.
- [x] Passed `isExpanded` prop through `PopoutWidget` to its children via `React.cloneElement`.
- [x] Reordered Tasks filter tabs in `/dashboard/tasks`: Today, Upcoming, Completed, All.
- [x] Announcements page (`/dashboard/notices`) tabs configured to: Upcoming, Previous, All.

## Completed Tasks
- [x] Create/Update README.md with "what is unikit and why?" including System Architecture and flowcharts.
- [x] Run the backend program via `npm start`. (Running on Port 4000)
- [x] Install frontend dependencies and start the frontend Next.js server (`npm run dev`). (Running on Port 3000)
- [x] Initialized `Rules.md` with core workflow and guidelines.
- [x] Initialized `CONTEXT.md` to track project state.

## Important Notes & Constraints
- Always follow `Rules.md` (Workflow: Input -> Read Rules -> Act, Strict Scoping, Context Maintenance, Design System adherence from `DESIGN.md`).
- Primary brand accent is Deep Amethyst/Crimson, used strictly for active states, key interactive elements, and focused indicators. Never use uncoordinated accent colors or pill-shaped buttons.
- Maintain consistent tab styling: underline tabs (`border-b-2 transition-standard capitalize`) as used in `/tasks`.
