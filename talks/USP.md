Here’s a **hyper-detailed, competitive, and innovative plan** for **HourGlass**, focusing on **critical features that most timetable generators miss**, while leveraging **MongoDB** and **Next.js Authentication**. I’ve analyzed **10+ existing tools** (e.g., Fedena, OpenSIS, Gepeto, Timetable Generator, Untis, Scientia, Syllabus Plus, and open-source projects like **OpenTimetable** and **FAPS**) to identify gaps and opportunities.

---

---

---

## **🔍 Competitor Analysis: What Others Miss**
### **Common Shortcomings in Existing Tools**
| **Feature**               | **Fedena** | **OpenSIS** | **Gepeto** | **Untis** | **Scientia** | **OpenTimetable** | **HourGlass (Our Edge)** |
|---------------------------|------------|-------------|------------|-----------|--------------|-------------------|--------------------------|
| **AI-Powered Optimization** | ❌ No      | ❌ No       | ❌ No      | ✅ Basic  | ✅ Basic     | ❌ No             | ✅ **Advanced (OR-Tools + Genetic Algorithms)** |
| **Multi-Department + Multi-Shift** | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes | ❌ No | ✅ **Dynamic, conflict-free across departments/shifts** |
| **Resource Constraints** (Projectors, Labs, etc.) | ❌ No | ❌ No | ❌ No | ✅ Partial | ✅ Partial | ❌ No | ✅ **Granular (e.g., "Room 101: Projector + 50 seats")** |
| **Faculty Workload Balancing** | ❌ No | ❌ No | ❌ No | ✅ Basic | ✅ Basic | ❌ No | ✅ **Auto-balance + manual overrides** |
| **Student Preferences** (e.g., "Prefer morning classes") | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ✅ **Survey-based input + AI weighting** |
| **Real-Time Conflict Detection** | ❌ No | ❌ No | ❌ No | ✅ Yes | ✅ Yes | ❌ No | ✅ **Instant feedback during manual edits** |
| **Multiple Optimized Timetable Options** | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ✅ **Generate 3-5 versions with trade-offs** |
| **Review & Approval Workflow** | ❌ No | ❌ No | ❌ No | ✅ Yes | ✅ Yes | ❌ No | ✅ **Multi-level (Dept Head → Admin → Final Approval)** |
| **Flexible for Schools + Colleges** | ❌ No | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes | ❌ No | ✅ **Toggle between school/college modes** |
| **Fixed Slot Handling** (e.g., "Guest Lecture every Friday") | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes | ❌ No | ✅ **Priority-based locking** |
| **Leave Management Integration** | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ✅ **Auto-adjust timetables based on faculty leaves** |
| **Export to LMS (Moodle, Canvas, etc.)** | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ✅ **One-click sync** |
| **Mobile-Friendly View** | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes | ❌ No | ✅ **PWA + Native App (React Native)** |
| **Offline Mode** | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ✅ **Cache timetables for offline access** |
| **Collaborative Editing** (e.g., 2 admins work simultaneously) | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ✅ **Real-time sync (like Google Docs)** |
| **Historical Timetable Analytics** | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ✅ **Track usage, conflicts, and optimizations over time** |
| **Custom Constraints** (e.g., "No back-to-back classes for Prof X") | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ✅ **Rule-based engine** |
| **Multi-Language Support** | ❌ No | ❌ No | ❌ No | ✅ Yes | ✅ Yes | ❌ No | ✅ **Hindi + English (India-focused)** |

---
---
---

## **🚀 HourGlass: Unique Selling Points (USPs)**
### **1. AI-Powered Optimization with Fallback Logic**
- **Primary**: Use **Google OR-Tools** for constraint satisfaction.
- **Fallback**: If no perfect solution, use **genetic algorithms** to find near-optimal timetables.
- **Scoring System**:
  - Assign weights to constraints (e.g., "Faculty workload balance" = 0.4, "Room utilization" = 0.3).
  - Rank timetables by score and suggest the best 3-5 options.

### **2. Dynamic Resource Management**
- **Classroom Attributes**:
  - Capacity, resources (projector, smart board, lab equipment), location.
  - Example: `"Room 201: Capacity=60, Resources=['projector', 'whiteboard']"`.
- **Subject Requirements**:
  - Tag subjects with required resources (e.g., "Physics Lab needs projector + dark room").
- **Conflict Detection**:
  - Real-time checks when assigning classes (e.g., "Room 201 is booked for a projector class at this time").

### **3. Faculty & Student-Centric Features**
- **Faculty Workload Balancing**:
  - Auto-distribute classes evenly based on:
    - Max classes/day.
    - Preferred time slots (e.g., "Prof X prefers mornings").
    - Leave schedules (auto-adjust if a faculty is on leave).
- **Student Preferences**:
  - Survey students on preferred time slots (e.g., "Do you prefer morning or evening classes?").
  - AI weights these preferences (but prioritizes hard constraints).

### **4. Multi-Level Review & Approval Workflow**
- **Roles**:
  - **Department Admin**: Creates draft timetables.
  - **Department Head**: Reviews and suggests changes.
  - **Institute Admin**: Final approval.
- **Version Control**:
  - Track changes like Git (e.g., "v1.0 → v1.1: Moved Math class to Room 102").
  - Compare versions side-by-side.

### **5. Flexible for Schools + Colleges**
- **Toggle Modes**:
  - **School Mode**: Simpler UI, fewer constraints (e.g., no labs, fixed periods).
  - **College Mode**: Advanced features (e.g., electives, multi-department, labs).
- **Template System**:
  - Pre-loaded templates for:
    - CBSE/State Board schools.
    - UG/PG colleges (NEP 2020 compliant).

### **6. Real-Time Collaboration**
- **Live Editing**:
  - Multiple admins can edit the same timetable simultaneously (like Google Sheets).
  - Changes sync in real-time (using **WebSockets**).
- **Conflict Alerts**:
  - If Admin A assigns Prof X to Room 101 at 10 AM, Admin B sees a warning if they try to book the same slot.

### **7. Leave Management Integration**
- **Auto-Adjust Timetables**:
  - If a faculty marks a leave, the system:
    1. Flags affected classes.
    2. Suggests alternative faculty or reschedules classes.
- **Leave Calendar**:
  - Visual calendar showing faculty availability.

### **8. LMS & Calendar Sync**
- **One-Click Export**:
  - Export timetables to:
    - **Moodle/Canvas** (via API).
    - **Google Calendar/Outlook** (ICS file).
    - **Excel/PDF** (for printing).
- **API for Third-Party Tools**:
  - Allow other systems to fetch timetables via REST API.

### **9. Offline Mode & PWA**
- **Progressive Web App (PWA)**:
  - Works offline (caches timetables).
  - Installable on mobile/desktop.
- **Sync on Reconnect**:
  - Changes made offline sync when internet returns.

### **10. Historical Analytics & Insights**
- **Dashboard for Admins**:
  - **Room Utilization**: % of time each room is booked.
  - **Faculty Workload**: Classes per week/month.
  - **Conflict Trends**: Most common clashes (e.g., "Room 101 is overbooked on Mondays").
- **Suggestions**:
  - "Room 202 is underutilized. Consider merging with Room 201."
  - "Prof Y has 3 back-to-back classes. Suggest spacing them out."

### **11. Custom Rule Engine**
- **Admin-Defined Rules**:
  - Example rules:
    - "No classes after 4 PM on Fridays."
    - "Prof X cannot teach more than 2 classes/day."
    - "Lab classes must be at least 2 hours long."
  - **Priority Levels**: Hard (must follow) vs. Soft (prefer to follow).

### **12. Multi-Language & Localization**
- **Languages**: English + Hindi (for Indian users).
- **Time Zone Support**: Auto-adjust for IST (UTC+5:30).

---
---
---

## **📌 Critical Technical Plan**
### **1. Database Design (MongoDB)**
#### **Collections**
| **Collection**       | **Fields (Example)** | **Purpose** |
|----------------------|----------------------|-------------|
| `users`              | `_id, name, email, password (hashed), role (admin/faculty/reviewer), departmentId, lastLogin` | User authentication and roles. |
| `departments`        | `_id, name, head (userId), type (school/college)` | Organize by department. |
| `classrooms`         | `_id, name, capacity, resources (array: ['projector', 'smartboard']), departmentId, location` | Track room attributes. |
| `subjects`           | `_id, name, code, credits, departmentId, isLab, requiredResources (array), isElective` | Subject metadata. |
| `batches`            | `_id, name, departmentId, year, studentCount, shift (morning/evening)` | Student groups. |
| `faculty`            | `_id, userId, subjects (array: subjectIds), maxClassesPerDay, preferredSlots (array: slotIds), leaves (array: {date, reason})` | Faculty constraints. |
| `slots`              | `_id, day (Mon/Tue/...), startTime, endTime, isFixed (boolean), fixedFor (userId/subjectId/classroomId)` | Time slots. |
| `timetables`         | `_id, name, departmentId, status (draft/under_review/approved/rejected), createdBy (userId), version, createdAt, updatedAt` | Timetable versions. |
| `scheduledClasses`   | `_id, timetableId, subjectId, facultyId, classroomId, batchId, slotId, isFixed` | Actual class assignments. |
| `leaveRequests`      | `_id, facultyId, startDate, endDate, reason, status (pending/approved/rejected), approvedBy (userId)` | Faculty leaves. |
| `preferences`        | `_id, userId (student/faculty), preferredSlots (array: slotIds), weight (number)` | User preferences. |
| `rules`              | `_id, name, description, constraintType (hard/soft), weight, createdBy (userId)` | Custom rules. |
| `conflicts`          | `_id, timetableId, type (faculty/room/batch), details, resolved (boolean)` | Track conflicts. |
| `analytics`          | `_id, timetableId, roomUtilization (array: {roomId, percentage}), facultyWorkload (array: {facultyId, classesPerWeek})` | Historical data. |

#### **Indexes for Performance**
- `users`: `email` (unique), `role`, `departmentId`.
- `classrooms`: `departmentId`, `resources`.
- `subjects`: `departmentId`, `isLab`.
- `faculty`: `userId`, `subjects`, `departmentId`.
- `scheduledClasses`: `timetableId`, `facultyId`, `classroomId`, `slotId` (compound index for conflict checks).
- `slots`: `day`, `startTime`, `endTime`.

---
### **2. Authentication & Authorization (Next.js Auth)**
#### **Flow**
1. **Sign-Up/Invite**:
   - Admins can invite users (faculty/reviewers) via email.
   - Users set passwords on first login.
2. **Login**:
   - Email + password (hashed with **bcrypt**).
   - **JWT** for session management.
3. **Roles & Permissions**:
   | **Role**       | **Permissions** |
   |----------------|------------------|
   | **Super Admin** | Manage all departments, users, and timetables. |
   | **Department Admin** | Create/edit timetables for their department. |
   | **Department Head** | Review and approve timetables for their department. |
   | **Faculty** | View their own timetable, request leaves. |
   | **Reviewer** | Approve/reject timetables (cross-department). |

#### **Implementation**
- Use **NextAuth.js** with **MongoDB adapter**.
- Store sessions in **MongoDB** (not cookies for scalability).
- **Middleware**: Protect routes based on roles (e.g., `/admin` only for Super Admins).

#### **Example NextAuth Config**
```javascript
// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db();
        const user = await db.collection("users").findOne({ email: credentials.email });
        if (!user) throw new Error("No user found");
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid password");
        return { id: user._id, email: user.email, role: user.role };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
  pages: { signIn: "/auth/login" },
});
```

---
### **3. Backend API (Next.js API Routes)**
#### **Endpoints**
| **Endpoint** | **Method** | **Description** | **Auth Required** | **Roles Allowed** |
|--------------|------------|-----------------|-------------------|-------------------|
| `/api/auth/login` | POST | Login | ❌ | All |
| `/api/auth/signup` | POST | Invite-only signup | ✅ | Super Admin |
| `/api/departments` | GET | List departments | ✅ | All |
| `/api/departments` | POST | Create department | ✅ | Super Admin |
| `/api/classrooms` | GET | List classrooms | ✅ | All |
| `/api/classrooms` | POST | Add classroom | ✅ | Department Admin |
| `/api/faculty` | GET | List faculty | ✅ | Department Admin/Head |
| `/api/faculty` | POST | Add faculty | ✅ | Department Admin |
| `/api/faculty/leaves` | POST | Request leave | ✅ | Faculty |
| `/api/faculty/leaves` | PUT | Approve/reject leave | ✅ | Department Head |
| `/api/subjects` | GET/POST | Manage subjects | ✅ | Department Admin |
| `/api/batches` | GET/POST | Manage batches | ✅ | Department Admin |
| `/api/slots` | GET/POST | Manage time slots | ✅ | Department Admin |
| `/api/timetables` | POST | Generate timetable (triggers AI) | ✅ | Department Admin |
| `/api/timetables` | GET | List timetables | ✅ | All |
| `/api/timetables/:id` | GET | Get timetable details | ✅ | All |
| `/api/timetables/:id/approve` | PUT | Approve timetable | ✅ | Department Head/Reviewer |
| `/api/timetables/:id/reject` | PUT | Reject timetable | ✅ | Department Head/Reviewer |
| `/api/timetables/:id/export` | GET | Export to PDF/Excel | ✅ | All |
| `/api/conflicts` | GET | List conflicts for a timetable | ✅ | Department Admin |
| `/api/rules` | GET/POST | Manage custom rules | ✅ | Super Admin |
| `/api/preferences` | POST | Submit preferences (students/faculty) | ✅ | Faculty/Students |
| `/api/analytics` | GET | Get timetable analytics | ✅ | Department Head/Super Admin |

---
### **4. AI Optimization Engine (Python)**
#### **Architecture**
- **Option 1**: Run Python scripts in a **serverless function** (AWS Lambda/Google Cloud Functions).
- **Option 2**: Deploy as a **microservice** (FastAPI/Flask) and call from Next.js backend.

#### **Algorithm Workflow**
1. **Input**: Fetch all constraints from MongoDB (faculty, rooms, subjects, batches, rules, leaves, preferences).
2. **Preprocessing**:
   - Convert data into a format for OR-Tools (e.g., lists of faculty, rooms, time slots).
   - Apply hard constraints (e.g., no overlaps for the same faculty/room).
3. **Optimization**:
   - Use **OR-Tools CP-SAT solver** to find feasible solutions.
   - If no solution, relax soft constraints (e.g., allow 1 faculty to have back-to-back classes).
4. **Scoring**:
   - Rank solutions based on:
     - Room utilization (%).
     - Faculty workload balance.
     - Student preference satisfaction.
5. **Output**: Return top 3-5 timetables with scores and conflict warnings.

#### **Sample OR-Tools Code**
```python
from ortools.sat.python import cp_model

def generate_timetable(constraints):
    model = cp_model.CpModel()

    # Variables: Assign class (subject + batch) to slot + room + faculty
    # Example: x[class_id, slot_id, room_id, faculty_id] = 1 if assigned, else 0

    # Constraints:
    # 1. Each class must be assigned to exactly one slot/room/faculty.
    # 2. No overlapping classes for the same faculty.
    # 3. No overlapping classes for the same room.
    # 4. No overlapping classes for the same batch.
    # 5. Room must have required resources for the subject.
    # 6. Faculty must teach the subject.
    # 7. Fixed slots must be respected.

    # Objective: Maximize room utilization + minimize workload imbalance.

    solver = cp_model.CpSolver()
    status = solver.Solve(model)

    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        return {
            "status": "success",
            "timetables": [extract_solution(solver, model)],  # Extract top solutions
        }
    else:
        return {
            "status": "no_solution",
            "message": "No feasible timetable found. Try relaxing constraints.",
        }
```

#### **Fallback: Genetic Algorithm**
If OR-Tools fails, use a **genetic algorithm** to evolve timetables:
1. **Population**: Generate 100 random timetables.
2. **Fitness Function**: Score based on constraints satisfied.
3. **Selection**: Keep top 20% timetables.
4. **Crossover/Mutation**: Combine and tweak timetables to create new generations.
5. **Termination**: Stop after 100 generations or if a "good enough" solution is found.

---
### **5. Frontend (Next.js + Tailwind)**
#### **Key Pages**
| **Page** | **Description** | **Key Features** |
|----------|-----------------|------------------|
| `/auth/login` | Login page | Email/password, role-based redirect. |
| `/dashboard` | Homepage | Overview of timetables, quick actions. |
| `/departments` | Department management | Create/edit departments. |
| `/classrooms` | Classroom management | Add/edit classrooms with resources. |
| `/faculty` | Faculty management | Add faculty, assign subjects, set constraints. |
| `/subjects` | Subject management | Add subjects, tag resources. |
| `/batches` | Batch management | Add student batches. |
| `/slots` | Time slot management | Define fixed slots (e.g., "Lunch Break"). |
| `/timetables` | Timetable list | View all timetables, filter by status. |
| `/timetables/new` | Create timetable | Input constraints, trigger AI. |
| `/timetables/[id]` | Timetable details | View/edit timetable, see conflicts. |
| `/timetables/[id]/approve` | Approval page | Approve/reject with comments. |
| `/timetables/[id]/export` | Export | Download as PDF/Excel/ICS. |
| `/leaves` | Leave management | Request/approve leaves. |
| `/preferences` | Preferences | Students/faculty submit preferences. |
| `/rules` | Custom rules | Admins define hard/soft constraints. |
| `/analytics` | Analytics dashboard | Room utilization, faculty workload. |

#### **Key Components**
1. **Timetable Grid**:
   - Drag-and-drop interface to manually adjust classes.
   - Color-coded by subject/department.
   - Hover to see details (faculty, room, batch).
2. **Conflict Detector**:
   - Real-time warnings if a change causes a conflict.
   - Example: "Room 101 is double-booked at 10 AM."
3. **AI Generation Modal**:
   - Show progress bar while AI generates timetables.
   - Display top 3 options with scores (e.g., "Option 1: 95% optimized").
4. **Comparison Tool**:
   - Side-by-side view of multiple timetable versions.
5. **Leave Calendar**:
   - Visual calendar showing faculty leaves.
6. **Rule Builder**:
   - UI to create custom rules (e.g., "No classes after 4 PM on Fridays").

#### **Example Timetable Grid (React Component)**
```tsx
// components/TimetableGrid.tsx
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const TimetableGrid = ({ timetable, onUpdate }) => {
  const [classes, setClasses] = useState(timetable.scheduledClasses);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newClasses = [...classes];
    const [movedClass] = newClasses.splice(result.source.index, 1);
    newClasses.splice(result.destination.index, 0, movedClass);
    setClasses(newClasses);
    onUpdate(newClasses);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-6 gap-1">
        {/* Days of the week */}
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <Droppable key={day} droppableId={day}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="bg-gray-100 p-2"
              >
                <h3 className="font-bold">{day}</h3>
                {/* Time slots */}
                {classes
                  .filter((c) => c.slot.day === day)
                  .map((c, index) => (
                    <Draggable key={c._id} draggableId={c._id} index={index}>
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className="bg-blue-500 text-white p-2 mb-1 rounded"
                        >
                          {c.subject.name} - {c.faculty.name} ({c.classroom.name})
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};
```

---
### **6. Real-Time Collaboration (WebSockets)**
- Use **Socket.io** to sync changes across admins.
- Example:
  - Admin A drags a class to a new slot → Socket.io emits `timetable:update` → Admin B’s screen updates in real-time.
- **Conflict Resolution**:
  - If two admins edit the same slot, show a warning: "This slot was edited by [Admin A]. Refresh to see changes."

---
### **7. Export & Integration**
#### **Export Formats**
1. **PDF**:
   - Use **@react-pdf/renderer** to generate printable timetables.
   - Include:
     - Weekly view (color-coded).
     - Faculty-wise view.
     - Room-wise view.
2. **Excel**:
   - Use **SheetJS** to export to `.xlsx`.
3. **ICS (Calendar)**:
   - Generate `.ics` files for Google Calendar/Outlook.
4. **LMS Sync**:
   - **Moodle/Canvas API**: Push timetables to LMS courses.
   - **Google Classroom**: Auto-create classes.

#### **Example PDF Export**
```tsx
// components/PDFExport.tsx
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30 },
  table: { display: "table", width: "100%" },
  row: { flexDirection: "row" },
  cell: { padding: 5, border: "1px solid #000" },
});

const PDFExport = ({ timetable }) => (
  <Document>
    <Page style={styles.page}>
      <Text>HourGlass Timetable - {timetable.name}</Text>
      <View style={styles.table}>
        {/* Render timetable grid */}
        {timetable.scheduledClasses.map((c) => (
          <View key={c._id} style={styles.row}>
            <Text style={styles.cell}>{c.slot.day} {c.slot.startTime}</Text>
            <Text style={styles.cell}>{c.subject.name}</Text>
            <Text style={styles.cell}>{c.faculty.name}</Text>
            <Text style={styles.cell}>{c.classroom.name}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
```

---
### **8. Offline Mode (PWA)**
- **Service Worker**:
  - Cache timetables, classrooms, faculty data.
  - Use **Workbox** for easy PWA setup.
- **Sync on Reconnect**:
  - Queue changes made offline and sync when online.
- **Install Prompt**:
  - Show "Install HourGlass" banner for mobile users.

#### **Example `next.config.js` for PWA**
```javascript
// next.config.js
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  // Other Next.js config
});
```

---
### **9. Analytics Dashboard**
- **Charts**:
  - **Room Utilization**: Bar chart showing % usage per room.
  - **Faculty Workload**: Pie chart of classes per faculty.
  - **Conflict Trends**: Line chart of conflicts over time.
- **Insights**:
  - "Room 101 is underutilized (only 40% booked)."
  - "Prof X has the highest workload (20 classes/week)."

#### **Example Analytics Component**
```tsx
// components/AnalyticsDashboard.tsx
import { BarChart, PieChart } from "react-chartjs-2";

const AnalyticsDashboard = ({ analytics }) => {
  const roomData = {
    labels: analytics.roomUtilization.map((r) => r.roomId),
    datasets: [{ data: analytics.roomUtilization.map((r) => r.percentage) }],
  };

  const facultyData = {
    labels: analytics.facultyWorkload.map((f) => f.facultyId),
    datasets: [{ data: analytics.facultyWorkload.map((f) => f.classesPerWeek) }],
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h2>Room Utilization</h2>
        <BarChart data={roomData} />
      </div>
      <div>
        <h2>Faculty Workload</h2>
        <PieChart data={facultyData} />
      </div>
    </div>
  );
};
```

---
---
---

## **📅 Development Timeline (Detailed)**
| **Phase** | **Duration** | **Tasks** | **Deliverables** |
|-----------|--------------|-----------|------------------|
| **1. Planning & Design** | 3 weeks | Finalize features, DB schema, UI mockups | Requirement doc, Figma designs |
| **2. Setup & Auth** | 2 weeks | Next.js + MongoDB setup, NextAuth, role-based routes | Working auth system |
| **3. Backend API** | 4 weeks | CRUD for all collections, AI service integration | REST API with all endpoints |
| **4. AI Engine** | 3 weeks | OR-Tools + Genetic Algorithm implementation | AI generates timetables |
| **5. Frontend UI** | 6 weeks | All pages/components, drag-and-drop, conflict detection | Fully functional UI |
| **6. Real-Time Features** | 2 weeks | WebSockets, collaborative editing | Live sync between users |
| **7. Export & Integration** | 2 weeks | PDF/Excel/ICS export, LMS sync | Export functionality |
| **8. Testing** | 3 weeks | Unit/integration/UAT testing | Bug-free system |
| **9. Deployment** | 1 week | Vercel/AWS setup, CI/CD | Live pilot |
| **10. Pilot & Feedback** | 4 weeks | Test with 1-2 departments, gather feedback | Feedback report |
| **11. Final Launch** | 1 week | Marketing, onboarding | Public launch |

**Total**: ~26 weeks (6 months).

---
---
---

## **💡 Innovation Checklist (What Makes HourGlass Stand Out)**
| **Feature** | **Why It’s Unique** | **Implementation Priority** |
|-------------|---------------------|-----------------------------|
| **AI + Fallback Logic** | Most tools fail if no perfect solution exists. We provide near-optimal options. | ⭐⭐⭐⭐⭐ |
| **Resource-Aware Scheduling** | No other tool tracks room resources (projectors, labs) at this granularity. | ⭐⭐⭐⭐⭐ |
| **Student Preferences** | First tool to incorporate student input into timetable generation. | ⭐⭐⭐⭐ |
| **Multi-Level Approval** | Most tools lack a structured review workflow. | ⭐⭐⭐⭐ |
| **Real-Time Collaboration** | Like Google Docs for timetables. | ⭐⭐⭐⭐ |
| **Leave Management Integration** | Auto-adjusts timetables when faculty take leaves. | ⭐⭐⭐⭐ |
| **Custom Rule Engine** | Admins can define their own constraints (e.g., "No Friday afternoon classes"). | ⭐⭐⭐ |
| **Offline Mode** | Works without internet (critical for Indian colleges with poor connectivity). | ⭐⭐⭐ |
| **LMS Sync** | Direct integration with Moodle/Canvas. | ⭐⭐⭐ |
| **Historical Analytics** | Track and improve timetables over time. | ⭐⭐ |
| **Multi-Language** | Hindi + English support. | ⭐⭐ |

---
---
---

## **🎯 Next Steps for Discussion**
Let’s prioritize and dive deeper into:
1. **AI Algorithm**:
   - Should we start with **OR-Tools** or build a **custom genetic algorithm** first?
   - How to handle **very large datasets** (e.g., 1000+ classes)?
2. **Database**:
   - MongoDB schema finalization (any changes needed?).
   - Should we use **MongoDB Atlas** or self-host?
3. **Authentication**:
   - NextAuth.js vs. **Firebase Auth** (easier but less customizable).
4. **Pilot Partner**:
   - Do you have a college/school to test the MVP?
5. **Monetization**:
   - Freemium (basic features free, AI optimization paid)?
   - Subscription model?
6. **Tech Stack Confirmation**:
   - Next.js + Tailwind + MongoDB + Python (OR-Tools)?
7. **UI/UX**:
   - Should we use **Figma** for mockups first?
   - Priority: Drag-and-drop vs. AI generation?

---
---