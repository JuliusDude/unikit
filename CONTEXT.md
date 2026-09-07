# Project Context

## Current Objective
- [x] Add smooth transition scroll to navbar linking.

## Active Tasks
- [x] Started backend server via `npm start` (port 4000).
- [x] Started frontend server via `npm run dev` (port 3000).
- [x] Integrated smooth transition scrolling into [page.tsx](file:///F:/Project/unikit/unikit/frontend/src/app/page.tsx):
  - Added Lenis smooth scrolling (`useLenis`) with easing function and top offset (`offset: -80`) to accommodate the fixed navbar.
  - Added active section indicator with Framer Motion layout animations (`layoutId="activeNavIndicator"`).
  - Added mobile navigation dropdown menu with animated toggle and smooth anchor jumping.
  - Linked Hero "Learn More" button and Footer navigation links to use the same butter-smooth transition scrolling.
- [x] Added `scroll-behavior: smooth` and `scroll-padding-top: 5rem` in [globals.css](file:///F:/Project/unikit/unikit/frontend/src/app/globals.css).
- [x] Created `sql/add_telegram_chat_id.sql` to support `telegram_chat_id` on `public.students`.
- [x] Built Telegram service (`backend/src/services/telegram.js`) supporting link code generation, validation, and hybrid persistence (`preferences.settings` JSONB fallback + `students.telegram_chat_id`).
- [x] Created Telegram routes (`backend/src/routes/telegram.js`):
  - `GET /api/telegram/status`: returns connection state, link code, and deep link URL.
  - `POST /api/telegram/verify-link`: called by n8n or direct webhook to bind Telegram chat ID to student.
  - `POST /api/telegram/unlink`: disconnects Telegram.
  - `POST /api/telegram/test-notification`: dispatches test alert to linked Telegram chat.
- [x] Created task reminder polling & webhook endpoints (`backend/src/routes/reminders.js`):
  - `GET /api/reminders/tasks/due`: lists due task reminders for students with linked Telegram chats.
  - `PATCH /api/reminders/tasks/:id/mark-sent`: marks `n8n_triggered = true` and records in `automation_logs`.
- [x] Integrated `triggerN8nDeadline` on task create & update in `backend/src/routes/tasks.js`.
- [x] Implemented Telegram Notifications management card in [SettingsPage](file:///F:/Project/unikit/unikit/frontend/src/app/(dashboard)/dashboard/settings/page.tsx) with Deep Amethyst styling, deep linking, verification code copy, test dispatch, and disconnect.

## Completed Tasks
- [x] Telegram ID linking and n8n reminder notifications integration.
- [x] Updated `CampusNewsWidget`:
  - Removed the `+ Add Notice` button from the widget header.
  - Strictly filters for upcoming notices/events (deadline/event date >= today).
  - Sorts by priority rank (High > Medium > Low/Normal) and then earliest deadline/event date.
  - Limits display to a maximum of 3 items in default view.
  - In expanded view (`PopoutWidget`), renders all upcoming items with a scrollable view.
- [x] Passed `isExpanded` prop through `PopoutWidget` to its children via `React.cloneElement`.
- [x] Reordered Tasks filter tabs in `/dashboard/tasks`: Today, Upcoming, Completed, All.
- [x] Announcements page (`/dashboard/notices`) tabs configured to: Upcoming, Previous, All.
- [x] Create/Update README.md with "what is unikit and why?" including System Architecture and flowcharts.
- [x] Run the backend program via `npm start`. (Running on Port 4000)
- [x] Install frontend dependencies and start the frontend Next.js server (`npm run dev`). (Running on Port 3000)
- [x] Initialized `Rules.md` with core workflow and guidelines.
- [x] Initialized `CONTEXT.md` to track project state.

## Important Notes & Constraints
- Always follow `Rules.md` (Workflow: Input -> Read Rules -> Act, Strict Scoping, Context Maintenance, Design System adherence from `DESIGN.md`).
- Primary brand accent is Deep Amethyst/Crimson, used strictly for active states, key interactive elements, and focused indicators. Never use uncoordinated accent colors or pill-shaped buttons.
- Maintain consistent tab styling: underline tabs (`border-b-2 transition-standard capitalize`) as used in `/tasks`.
