All done. Here's what was built for the Institute Admin Dashboard (/dashboard/institution/):
New Files Created
Model
- src/models/exam/schemas/exam-blueprint.schema.ts — Defines exam "columns" per subject/semester (e.g., Midterm 1=30, Midterm 2=30, Final=40)
Server Actions
- src/actions/institution-actions.ts — 20+ server actions for DB operations (profile, users, subjects, exam blueprints CRUD, marks entry, gradebook, complaints, announcements, activity log, departments)
Dashboard Pages (14 pages)
Route	Page	Key Functionality
/dashboard/institution	Overview	Stats cards (users, faculty, students, subjects, exams, complaints) + recent users table
/profile	Profile	View/edit institution details (name, type, contact, etc.) — saves to InstitutionModel
/activity	Activity Log	Searchable audit log from AuditLogModel
/users	All Users	List all users, suspend/activate toggle buttons
/departments	Departments	Add/delete departments, shows head & faculty count
/marks	Marks Hub	Navigation to 3 sub-pages
/marks/exams	Exam Setup	Create exam blueprints per subject — define columns with name + max marks
/marks/entry	Grade Entry	Select subject + exam column, fill marks per student inline
/marks/grades	Gradebook	Aggregate averages per exam per subject with visual bars
/settings	Settings	Timezone, date format, language
/analytics	Analytics	Stats cards for key metrics
/complaints	Complaints	List tickets, resolve button
/announcements	Announcements	Create, list, delete announcements
/physical	Campus Estate	Add/manage classrooms (name, capacity, resources, location)
/messages	Messages	Compose and send messages
/notices	Notices	Searchable notice list from NoticeModel
Marks Flow (Admin → Faculty → Student)
1. Admin creates exam columns in Exam Setup — defines which exams exist per subject (Midterm 1, Final, etc.) with max marks and order
2. Faculty (or admin) fills marks in Grade Entry — selects a subject + exam column, then enters marks per student
3. Students view marks in the existing /dashboard/student/marksheet page
Sidebar
Updated Sidebar.tsx with all institution admin routes (no new sidebar created). RBAC matrix updated with all new routes.
Error Audit
- Fixed all 25+ TypeScript errors (.lean() type inference, implicit any parameters, Mongoose-in-client imports)
- All pages use "use client" + server actions (no Mongoose in client components)
- TypeScript check passes with zero errors