
## Background:
Higher education institutions and schools in India face critical inefficiencies in class scheduling due to manual, error-prone processes that fail to account for real-time constraints like faculty availability, room resources (projectors, labs), student preferences, and dynamic departmental requirements. Existing tools (e.g., Fedena, OpenSIS, Untis) lack AI-driven optimization, resource-aware scheduling, and collaborative workflows, leading to:

Class clashes (same faculty/room/batch booked simultaneously).
Underutilized infrastructure (empty classrooms while others are overbooked).
Uneven workload distribution (some faculty overburdened, others underused).
Ignored student/faculty preferences (e.g., morning vs. evening classes).
No fallback for conflicts (tools fail if no "perfect" timetable exists).
Rigid systems (cannot adapt to last-minute changes like faculty leaves or resource unavailability).
With the NEP 2020 pushing multidisciplinary and flexible learning, the need for intelligent, adaptive, and user-centric timetable generation has never been more urgent.

## Problem to Solve:
Design and develop HourGlass, a web-based AI-assisted timetable generator that:

Automates and optimizes class scheduling for schools and colleges using constraint satisfaction algorithms (OR-Tools) and genetic algorithms as fallback.
Handles complex, real-world constraints often ignored by other tools:

Resource-aware scheduling: Assigns classes to rooms based on required resources (e.g., projectors, lab equipment, capacity).
Faculty workload balancing: Distributes classes evenly, respecting max classes/day, preferred time slots, and leave schedules.
Student preferences: Incorporates survey-based input (e.g., "Prefer morning classes") into optimization.
Multi-department & multi-shift support: Generates conflict-free timetables across departments, batches, and shifts.
Fixed slots: Locks mandatory events (e.g., guest lectures, exams) into the timetable.
Custom rules engine: Allows admins to define hard/soft constraints (e.g., "No classes after 4 PM on Fridays").

Provides multiple optimized timetable options (ranked by score) and suggests manual adjustments if no perfect solution exists.
Supports a multi-level review workflow:

Department Admins create drafts.
Department Heads review and suggest changes.
Institute Admins approve/reject with comments.

Enables real-time collaboration (multiple admins editing simultaneously with WebSocket sync).
Integrates with leave management: Auto-adjusts timetables when faculty mark leaves.
Exports to multiple formats (PDF, Excel, ICS for Google Calendar) and syncs with LMS (Moodle, Canvas).
Offers historical analytics to track room utilization, faculty workload, and conflict trends for continuous improvement.
Flexible for schools and colleges: Toggle between simplified (school) mode and advanced (college) mode.
Localization: Supports Hindi + English for Indian users.

# Expected Outcome:
A scalable, user-friendly web platform that replaces manual spreadsheets with an intelligent, adaptive, and collaborative timetable generator, reducing conflicts by 90%, improving resource utilization by 40%, and saving 20+ hours/week in administrative effort.
