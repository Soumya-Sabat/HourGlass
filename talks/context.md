Here’s a **comprehensive, well-structured memorandum** that captures **every detail** of our discussions, including the **overall concept, technical plans, execution steps, and future roadmap**. This document is designed to be **self-contained, clear, and actionable**, ensuring that anyone (including you, months later) can understand the **entire context, rationale, and execution plan** for **HourGlass**.

---

---

---

# **📜 HOURGLASS: AI-POWERED TIMETABLE GENERATOR**
### **Memorandum of Understanding (MoU) & Technical Blueprint**
**Version**: 1.0
**Date**: June 1, 2026
**Prepared by**: Soumya


---

---

---

## **📌 Table of Contents**
1. [Introduction](#1-introduction)
   - [1.1 Background](#11-background)
   - [1.2 Problem Statement](#12-problem-statement)
   - [1.3 Objectives](#13-objectives)
   - [1.4 Target Audience](#14-target-audience)

2. [Overall Concept](#2-overall-concept)
   - [2.1 Vision](#21-vision)
   - [2.2 Unique Selling Points (USPs)](#22-unique-selling-points-usps)
   - [2.3 Key Features](#23-key-features)

3. [Technical Architecture](#3-technical-architecture)
   - [3.1 System Overview](#31-system-overview)
   - [3.2 Tech Stack](#32-tech-stack)
   - [3.3 Folder Structure](#33-folder-structure)
   - [3.4 Database Design](#34-database-design)
   - [3.5 AI Optimization Engine](#35-ai-optimization-engine)
   - [3.6 Authentication & Authorization](#36-authentication--authorization)
   - [3.7 Backend API Design](#37-backend-api-design)
   - [3.8 Frontend Design](#38-frontend-design)

4. [Execution Plan](#4-execution-plan)
   - [4.1 Development Phases](#41-development-phases)
   - [4.2 Timeline](#42-timeline)
   - [4.3 Team Roles & Responsibilities](#43-team-roles--responsibilities)
   - [4.4 Development Workflow](#44-development-workflow)

5. [Deployment Strategy](#5-deployment-strategy)
   - [5.1 Local Development](#51-local-development)
   - [5.2 Production Deployment](#52-production-deployment)
   - [5.3 Environment Variables](#53-environment-variables)

6. [Pilot & Monetization Strategy](#6-pilot--monetization-strategy)
   - [6.1 Finding Pilot Partners](#61-finding-pilot-partners)
   - [6.2 Outreach Strategies](#62-outreach-strategies)
   - [6.3 Monetization Model](#63-monetization-model)

7. [Risk Analysis & Mitigation](#7-risk-analysis--mitigation)
8. [Future Roadmap](#8-future-roadmap)
9. [Appendices](#9-appendices)
   - [9.1 Sample Data Models](#91-sample-data-models)
   - [9.2 API Endpoint Specifications](#92-api-endpoint-specifications)
   - [9.3 Cold Email Template for Pilots](#93-cold-email-template-for-pilots)

---

---

---

## **1. Introduction**

---

### **1.1 Background**
Higher education institutions and schools in India face **significant inefficiencies** in class scheduling due to **manual, error-prone processes**. Traditional methods rely on **spreadsheets or basic tools** that fail to account for:
- **Real-time constraints** (faculty availability, room resources, student preferences).
- **Dynamic requirements** (multi-department, multi-shift, elective courses).
- **Scalability issues** (large datasets, complex constraints).

Existing tools like **Fedena, OpenSIS, Untis, and Scientia** lack **AI-driven optimization**, **resource-aware scheduling**, and **collaborative workflows**, leading to:
- **Class clashes** (same faculty/room/batch booked simultaneously).
- **Underutilized infrastructure** (empty classrooms while others are overbooked).
- **Uneven workload distribution** (some faculty overburdened, others underused).
- **Ignored preferences** (students/faculty have no input into scheduling).

With the **National Education Policy (NEP) 2020** pushing for **multidisciplinary and flexible learning**, the need for an **intelligent, adaptive, and user-centric timetable generator** has become critical.

---

### **1.2 Problem Statement**
The primary problem **HourGlass** aims to solve is:
> **"How can educational institutions automate and optimize class scheduling while accounting for complex, real-world constraints like faculty availability, room resources, student preferences, and dynamic departmental requirements?"**

Current solutions fail because they:
1. **Lack AI Optimization**: Most tools use **manual or rule-based** scheduling, which is **time-consuming and error-prone**.
2. **Ignore Resource Constraints**: No tool tracks **room-specific resources** (e.g., projectors, lab equipment) at a granular level.
3. **No Multi-Level Approvals**: Timetables are often created in silos without **structured review workflows**.
4. **Poor Scalability**: Tools struggle with **large datasets** (e.g., 1000+ classes, 50+ rooms, 200+ faculty).
5. **No Real-Time Collaboration**: Multiple admins cannot **edit timetables simultaneously**.
6. **No Fallback for Conflicts**: If no "perfect" timetable exists, most tools **fail silently** without suggesting alternatives.

---

### **1.3 Objectives**
HourGlass aims to:
1. **Automate timetable generation** using **AI-driven optimization** (OR-Tools + Genetic Algorithms).
2. **Handle complex constraints** (faculty workload, room resources, student preferences, fixed slots).
3. **Provide multiple optimized timetable options** ranked by **scores** (e.g., room utilization, workload balance).
4. **Support multi-level approval workflows** (Department Admin → Department Head → Institute Admin).
5. **Enable real-time collaboration** (multiple admins editing simultaneously).
6. **Integrate with leave management** (auto-adjust timetables when faculty take leaves).
7. **Export timetables** to **PDF, Excel, and ICS** (for Google Calendar/Outlook).
8. **Offer historical analytics** to track **room utilization, faculty workload, and conflict trends**.
9. **Be flexible for both schools and colleges** (toggle between simplified and advanced modes).
10. **Support multi-language** (English + Hindi) for Indian users.

---
### **1.4 Target Audience**
| **User Type** | **Description** | **Pain Points** |
|---------------|-----------------|-----------------|
| **Super Admins** | Institute-level administrators | Need **overall control** and **analytics**. |
| **Department Admins** | Department-level administrators | Need to **create and manage timetables** for their department. |
| **Department Heads** | Heads of departments | Need to **review and approve** timetables. |
| **Faculty** | Teachers/Professors | Need to **view their timetable**, **request leaves**, and **set preferences**. |
| **Students** | End users | Need to **view their class schedule** and **submit preferences**. |
| **Reviewers** | Cross-department approvers | Need to **approve/reject timetables** with comments. |

---

---

---

## **2. Overall Concept**

---

### **2.1 Vision**
> **"To become the most intelligent, adaptive, and user-friendly timetable generator for educational institutions, reducing scheduling conflicts by 90%, improving resource utilization by 40%, and saving 20+ hours/week in administrative effort."**

HourGlass will **replace manual spreadsheets** with an **AI-powered, collaborative, and scalable** solution that:
- **Automates** the most complex parts of scheduling.
- **Adapts** to real-world constraints (e.g., last-minute faculty leaves).
- **Empowers** users with **self-service tools** (e.g., preference submissions, leave requests).

---

### **2.2 Unique Selling Points (USPs)**
| **Feature** | **Why It’s Unique** | **Competitor Comparison** |
|-------------|---------------------|----------------------------|
| **Hybrid AI Optimization** | Uses **OR-Tools + Genetic Algorithms + Greedy Fallback** to handle large datasets and edge cases. | Most tools use **basic rule-based** logic or no AI. |
| **Resource-Aware Scheduling** | Tracks **room-specific resources** (e.g., projectors, lab equipment, capacity) and assigns classes accordingly. | No tool supports **granular resource constraints**. |
| **Student & Faculty Preferences** | Incorporates **survey-based input** (e.g., "Prefer morning classes") into AI weighting. | No tool considers **user preferences**. |
| **Multi-Level Approval Workflow** | Structured **3-level approval** (Department Admin → Department Head → Institute Admin). | Most tools lack **structured workflows**. |
| **Real-Time Collaboration** | Multiple admins can **edit timetables simultaneously** (like Google Docs). | No tool supports **live collaboration**. |
| **Leave Management Integration** | **Auto-adjusts timetables** when faculty mark leaves (suggests alternatives). | No tool integrates with **leave systems**. |
| **Multiple Optimized Timetables** | Generates **3-5 ranked options** with trade-offs (e.g., "Option 1: 95% optimized"). | Most tools return **one solution** or fail. |
| **Custom Rule Engine** | Admins can define **hard/soft constraints** (e.g., "No classes after 4 PM on Fridays"). | No tool supports **custom rules**. |
| **Historical Analytics** | Tracks **room utilization, faculty workload, and conflict trends** over time. | No tool provides **actionable insights**. |
| **Flexible for Schools & Colleges** | Toggle between **simplified (school) mode** and **advanced (college) mode**. | Most tools are **rigid** (either for schools or colleges). |
| **Multi-Language Support** | Supports **English + Hindi** for Indian users. | Few tools support **localization**. |

---

### **2.3 Key Features**
#### **Core Features (MVP)**
1. **AI-Powered Timetable Generation**:
   - **Hybrid approach**: Greedy → OR-Tools → Genetic Algorithm.
   - **Scoring system**: Ranks timetables by **room utilization (30%)**, **faculty workload balance (40%)**, **student preferences (20%)**, **conflict avoidance (10%)**.
   - **Fallback logic**: If no perfect solution, suggest **near-optimal alternatives**.

2. **Resource Management**:
   - **Classroom attributes**: Capacity, resources (projector, smart board, lab equipment), location.
   - **Subject requirements**: Tag subjects with **required resources** (e.g., "Physics Lab needs projector + dark room").
   - **Conflict detection**: Real-time checks for **room, faculty, and batch clashes**.

3. **Faculty & Student-Centric Features**:
   - **Workload balancing**: Auto-distribute classes based on **max classes/day**, **preferred time slots**, and **leave schedules**.
   - **Preference surveys**: Students/faculty can **submit preferred time slots**.
   - **Leave integration**: Auto-adjust timetables when faculty **request leaves**.

4. **Multi-Level Approval Workflow**:
   - **Roles**: Super Admin, Department Admin, Department Head, Faculty, Reviewer.
   - **Statuses**: Draft → Under Review → Approved/Rejected.
   - **Version control**: Track changes (e.g., "v1.0 → v1.1: Moved Math class to Room 102").

5. **Flexible Modes**:
   - **School Mode**: Simpler UI, fixed periods, no labs.
   - **College Mode**: Advanced features (electives, multi-department, labs).

6. **Export & Integration**:
   - **PDF/Excel**: Printable timetables with **color-coded views**.
   - **ICS**: Sync with **Google Calendar/Outlook**.
   - **LMS Sync**: One-click export to **Moodle/Canvas** (Phase 2).

7. **Real-Time Collaboration**:
   - **WebSocket-based** live editing (Socket.io).
   - **Conflict alerts**: Warn if two admins edit the same slot.

8. **Historical Analytics**:
   - **Dashboard**: Room utilization %, faculty workload, conflict trends.
   - **Insights**: Suggestions like "Room 101 is underutilized" or "Prof X has 3 back-to-back classes".

9. **Custom Rule Engine**:
   - Admins can define **hard/soft constraints** (e.g., "No classes after 4 PM on Fridays").
   - **Priority levels**: Hard (must follow) vs. Soft (prefer to follow).

10. **Multi-Language Support**:
    - **English + Hindi** (for Indian users).
    - **Time Zone**: Auto-adjust for **IST (UTC+5:30)**.

---

---

---

## **3. Technical Architecture**

---

### **3.1 System Overview**
HourGlass follows a **microservice-like architecture** within a **monorepo** (frontend + backend) and a **separate AI service**:
```
User → [Next.js Frontend] → [Next.js API (Proxy)] → [Golang Backend] → [MongoDB]
                                      ↓
                               [Python AI Service]
```
- **Frontend**: Next.js (App Router) + Tailwind CSS.
- **Backend**: Golang (Fiber/Gin) for business logic.
- **AI Service**: Python (FastAPI) for timetable optimization.
- **Database**: MongoDB Atlas (for scalability).
- **Cache**: Redis (Upstash) for sessions and AI results.

---

### **3.2 Tech Stack**
| **Component** | **Technology** | **Purpose** |
|---------------|----------------|-------------|
| **Frontend** | Next.js (App Router) + TypeScript + Tailwind CSS | Modern, fast, and scalable UI. |
| **Backend** | Golang (Fiber) | High-performance API with concurrent request handling. |
| **AI Engine** | Python (FastAPI) + OR-Tools + Genetic Algorithm | Optimize timetables with constraint satisfaction. |
| **Database** | MongoDB Atlas | Flexible, scalable NoSQL database. |
| **Authentication** | NextAuth.js + JWT + Redis | Secure, session-based auth. |
| **Real-Time** | Socket.io + Redis | Live collaboration and conflict detection. |
| **Caching** | Redis (Upstash) | Cache AI results and user sessions. |
| **Deployment** | Vercel (Frontend) + Railway (Backend + AI) | Serverless, easy scaling. |
| **PDF Export** | Puppeteer (Node.js) | Generate printable timetables. |
| **Excel Export** | SheetJS | Export to `.xlsx`. |
| **Monitoring** | Sentry + Railway Logs | Error tracking and debugging. |

---

### **3.3 Folder Structure**
```
hourglass/
│
├── public/                          # Static files (images, favicon)
│   └── assets/
│       └── logo.svg
│
├── src/                             # Monorepo: Frontend + Backend
│   │
│   ├── app/                         # Next.js App Router (Frontend)
│   │   ├── (auth)/                  # Auth pages
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── (dashboard)/             # Protected pages
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── departments/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── classrooms/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── faculty/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── subjects/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── batches/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── slots/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── timetables/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── edit/page.tsx
│   │   │   │       └── approve/page.tsx
│   │   │   ├── leaves/
│   │   │   │   ├── page.tsx
│   │   │   │   └── request/page.tsx
│   │   │   ├── preferences/page.tsx
│   │   │   ├── rules/
│   │   │   │   ├── page.tsx
│   │   │   │   └── new/page.tsx
│   │   │   └── analytics/page.tsx
│   │   └── api/                      # Next.js API Routes (Proxy to Golang)
│   │       ├── auth/
│   │       │   └── [...nextauth]/route.ts
│   │       ├── timetables/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       ├── route.ts
│   │       │       ├── approve/route.ts
│   │       │       └── export/route.ts
│   │       ├── classrooms/route.ts
│   │       ├── faculty/route.ts
│   │       ├── subjects/route.ts
│   │       ├── batches/route.ts
│   │       ├── slots/route.ts
│   │       ├── leaves/route.ts
│   │       ├── preferences/route.ts
│   │       ├── rules/route.ts
│   │       └── analytics/route.ts
│   │
│   ├── components/                  # Reusable UI components
│   │   ├── ui/ (Button, Input, Modal, etc.)
│   │   ├── layout/ (Navbar, Sidebar, Footer)
│   │   ├── timetable/ (TimetableGrid, ConflictDetector)
│   │   ├── forms/ (ClassroomForm, FacultyForm)
│   │   └── charts/ (RoomUtilizationChart, FacultyWorkloadChart)
│   │
│   ├── lib/                         # Utilities
│   │   ├── db.ts                    # MongoDB connection (Next.js)
│   │   ├── redis.ts                 # Redis connection
│   │   ├── auth.ts                  # NextAuth config
│   │   └── utils.ts
│   │
│   ├── backend/                     # Golang Backend
│   │   ├── main.go                  # Entry point
│   │   ├── go.mod
│   │   ├── go.sum
│   │   ├── config/
│   │   │   └── config.go
│   │   ├── handlers/
│   │   │   ├── auth.go
│   │   │   ├── timetables.go
│   │   │   ├── classrooms.go
│   │   │   ├── faculty.go
│   │   │   ├── subjects.go
│   │   │   ├── batches.go
│   │   │   ├── slots.go
│   │   │   ├── leaves.go
│   │   │   ├── preferences.go
│   │   │   ├── rules.go
│   │   │   └── analytics.go
│   │   ├── models/
│   │   │   ├── user.go
│   │   │   ├── timetable.go
│   │   │   ├── classroom.go
│   │   │   ├── faculty.go
│   │   │   ├── subject.go
│   │   │   ├── batch.go
│   │   │   ├── slot.go
│   │   │   ├── leave.go
│   │   │   ├── preference.go
│   │   │   ├── rule.go
│   │   │   └── conflict.go
│   │   ├── routes/
│   │   │   └── routes.go
│   │   ├── middleware/
│   │   │   ├── auth.go
│   │   │   └── rate_limiter.go
│   │   ├── services/
│   │   │   ├── ai_service.go       # Calls Python AI
│   │   │   ├── timetable_service.go
│   │   │   ├── classroom_service.go
│   │   │   ├── faculty_service.go
│   │   │   ├── subject_service.go
│   │   │   ├── batch_service.go
│   │   │   ├── slot_service.go
│   │   │   ├── leave_service.go
│   │   │   ├── preference_service.go
│   │   │   ├── rule_service.go
│   │   │   └── analytics_service.go
│   │   └── utils/
│   │       ├── db.go                # MongoDB connection (Golang)
│   │       ├── redis.go             # Redis connection
│   │       └── helpers.go
│   │
│   └── types/                       # TypeScript types
│       ├── user.ts
│       ├── timetable.ts
│       ├── classroom.ts
│       └── ...
│
├── ai/                              # Separate AI Service (Python)
│   ├── main.py
│   ├── requirements.txt
│   ├── models/
│   │   ├── constraints.py
│   │   └── timetable.py
│   ├── solvers/
│   │   ├── greedy.py
│   │   ├── or_tools.py
│   │   └── genetic.py
│   └── utils/
│       ├── preprocessing.py
│       └── scoring.py
│
├── scripts/                        # Utility scripts
│   ├── seed_db.js                   # Seed MongoDB with test data
│   └── test_ai.py                   # Test AI with sample data
│
├── .gitignore
├── package.json                    # Frontend dependencies
├── go.mod                          # Golang dependencies
├── next.config.js
├── tailwind.config.js
├── .env.local.example
└── README.md
```

---

### **3.4 Database Design (MongoDB)**
#### **Collections**
| **Collection** | **Fields** | **Indexes** | **Purpose** |
|----------------|------------|-------------|-------------|
| `users` | `_id`, `name`, `email`, `passwordHash`, `role`, `departmentId`, `lastLogin` | `email (unique)`, `role`, `departmentId` | User authentication and roles. |
| `departments` | `_id`, `name`, `head (userId)`, `type (school/college)` | `name`, `head` | Organize by department. |
| `classrooms` | `_id`, `name`, `capacity`, `resources ([]string)`, `departmentId`, `location` | `departmentId`, `resources` | Track room attributes. |
| `subjects` | `_id`, `name`, `code`, `credits`, `departmentId`, `isLab`, `requiredResources ([]string)`, `isElective` | `departmentId`, `isLab` | Subject metadata. |
| `batches` | `_id`, `name`, `departmentId`, `year`, `studentCount`, `shift (morning/evening)` | `departmentId`, `shift` | Student groups. |
| `faculty` | `_id`, `userId`, `subjects ([]string)`, `maxClassesPerDay`, `preferredSlots ([]string)`, `leaves ([]Leave)` | `userId`, `subjects`, `departmentId` | Faculty constraints. |
| `slots` | `_id`, `day (string)`, `startTime (string)`, `endTime (string)`, `isFixed (bool)`, `fixedFor (FixedFor)` | `day`, `startTime`, `endTime` | Time slots. |
| `timetables` | `_id`, `name`, `departmentId`, `status (draft/under_review/approved/rejected)`, `createdBy (userId)`, `version`, `createdAt`, `updatedAt` | `departmentId`, `status`, `createdBy` | Timetable versions. |
| `scheduledClasses` | `_id`, `timetableId`, `subjectId`, `facultyId`, `classroomId`, `batchId`, `slotId`, `isFixed` | `{ timetableId: 1, slotId: 1, facultyId: 1, classroomId: 1, batchId: 1 }` (compound, unique) | Actual class assignments. |
| `leaveRequests` | `_id`, `facultyId`, `startDate`, `endDate`, `reason`, `status (pending/approved/rejected)`, `approvedBy (userId)` | `facultyId`, `status`, `startDate` | Faculty leaves. |
| `preferences` | `_id`, `userId`, `preferredSlots ([]string)`, `weight (float)` | `userId` | User preferences. |
| `rules` | `_id`, `name`, `description`, `constraintType (hard/soft)`, `weight (float)`, `createdBy (userId)`, `constraint (map)` | `constraintType`, `createdBy` | Custom rules. |
| `conflicts` | `_id`, `timetableId`, `type (faculty/room/batch)`, `details (string)`, `resolved (bool)` | `timetableId`, `type`, `resolved` | Track conflicts. |
| `analytics` | `_id`, `timetableId`, `roomUtilization ([]RoomUtil)`, `facultyWorkload ([]FacultyWorkload)` | `timetableId` | Historical data. |

#### **Sample Documents**
- **`users`**:
  ```json
  {
    "_id": "user_1",
    "name": "Dr. Smith",
    "email": "smith@college.edu",
    "passwordHash": "$2a$10$...",
    "role": "department_admin",
    "departmentId": "dept_1",
    "lastLogin": "2026-06-01T10:00:00Z"
  }
  ```
- **`classrooms`**:
  ```json
  {
    "_id": "room_1",
    "name": "Lecture Hall A",
    "capacity": 60,
    "resources": ["projector", "whiteboard"],
    "departmentId": "dept_1",
    "location": "Block A, Floor 1"
  }
  ```
- **`scheduledClasses`**:
  ```json
  {
    "_id": "class_1",
    "timetableId": "tt_1",
    "subjectId": "subj_1",
    "facultyId": "fac_1",
    "classroomId": "room_1",
    "batchId": "batch_1",
    "slotId": "slot_1",
    "isFixed": false
  }
  ```

---
### **3.5 AI Optimization Engine**
#### **Hybrid Approach**
1. **Preprocessing (Golang)**:
   - Fetch constraints from MongoDB.
   - Filter **impossible assignments** (e.g., a lab class in a room without a projector).
   - Split into **smaller sub-problems** (e.g., by department or batch).

2. **Greedy Algorithm (Python)**:
   - Assign classes to the **first available slot/room/faculty** that meets hard constraints.
   - **Output**: A **valid but suboptimal** timetable.

3. **OR-Tools Refinement (Python)**:
   - Use the greedy solution as a **starting point** for OR-Tools.
   - Optimize for **soft constraints** (e.g., faculty preferences, room utilization).
   - **Timeout**: 30 seconds. If no improvement, proceed to Step 4.

4. **Genetic Algorithm Fallback (Python)**:
   - If OR-Tools fails or times out, **evolve the greedy solution** using a genetic algorithm.
   - **Population size**: 20-30 timetables.
   - **Generations**: 50-100 (or until fitness score plateaus).
   - **Fitness function**:
     - Room utilization (30%).
     - Faculty workload balance (40%).
     - Student preferences (20%).
     - Conflict avoidance (10%).

5. **Postprocessing (Golang)**:
   - Validate the final timetable (check for conflicts).
   - Rank solutions and return the **top 3-5** to the frontend.

#### **Python AI Service (FastAPI)**
- **Endpoint**: `POST /generate`
  - **Input**: Constraints (classrooms, faculty, subjects, batches, slots, rules, leaves, preferences).
  - **Output**: Top 3-5 timetables with scores and conflict warnings.
- **Example Request**:
  ```json
  {
    "constraints": {
      "classrooms": [{"id": "room_1", "capacity": 50, "resources": ["projector"]}],
      "faculty": [{"id": "fac_1", "subjects": ["subj_1"], "maxClassesPerDay": 4}],
      "subjects": [{"id": "subj_1", "requiredResources": ["projector"]}],
      "batches": [{"id": "batch_1", "size": 40}],
      "slots": [{"id": "slot_1", "day": "Mon", "startTime": "09:00", "endTime": "10:00"}],
      "fixedSlots": [{"subjectId": "subj_1", "slotId": "slot_1", "classroomId": "room_1"}],
      "rules": [{"type": "hard", "constraint": "no_back_to_back", "facultyId": "fac_1"}]
    }
  }
  ```
- **Example Response**:
  ```json
  {
    "status": "success",
    "timetables": [
      {
        "score": 0.95,
        "conflicts": [],
        "scheduledClasses": [
          {"subjectId": "subj_1", "facultyId": "fac_1", "classroomId": "room_1", "batchId": "batch_1", "slotId": "slot_1"}
        ]
      }
    ]
  }
  ```

---
### **3.6 Authentication & Authorization**
#### **Flow**
1. **Sign-Up/Invite**:
   - Super Admins can **invite users** (Department Admins, Faculty, etc.) via email.
   - Users set passwords on first login.
2. **Login**:
   - Email + password (hashed with **bcrypt**).
   - **JWT** for session management (stored in **Redis**).
3. **Roles & Permissions**:
   | **Role** | **Permissions** |
   |----------|------------------|
   | **Super Admin** | Manage all departments, users, and timetables. |
   | **Department Admin** | Create/edit timetables for their department. |
   | **Department Head** | Review and approve timetables for their department. |
   | **Faculty** | View their timetable, request leaves, set preferences. |
   | **Reviewer** | Approve/reject timetables (cross-department). |

#### **Implementation**
- **NextAuth.js** (Frontend):
  - Handles **login/signup** and **session management**.
  - Stores sessions in **Redis** (not cookies for scalability).
- **Golang Middleware**:
  - Validates **JWT tokens** for protected routes.
  - Example:
    ```go
    func AuthMiddleware(c *fiber.Ctx) error {
      token := c.Get("Authorization")
      if token == "" {
        return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
      }
      // Validate JWT
      claims, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
        return []byte(os.Getenv("JWT_SECRET")), nil
      })
      if err != nil {
        return c.Status(401).JSON(fiber.Map{"error": "Invalid token"})
      }
      c.Locals("user", claims)
      return c.Next()
    }
    ```

---
### **3.7 Backend API Design**
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
| `/api/preferences` | POST | Submit preferences | ✅ | Faculty/Students |
| `/api/analytics` | GET | Get timetable analytics | ✅ | Department Head/Super Admin |

#### **Proxy Pattern (Next.js → Golang → Python AI)**
- **Next.js API Routes** act as a **proxy** to the Golang backend.
- **Golang Backend** calls the **Python AI service** via HTTP.
- Example:
  ```typescript
  // Next.js API Route (src/app/api/timetables/route.ts)
  export async function POST(request: Request) {
    const constraints = await request.json();
    const golangResponse = await fetch('http://localhost:8080/api/timetables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(constraints),
    });
    const data = await golangResponse.json();
    return NextResponse.json(data);
  }
  ```

---
### **3.8 Frontend Design**
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
| `/timetables/[id]/export` | Export | Download as PDF/Excel. |
| `/leaves` | Leave management | Request/approve leaves. |
| `/preferences` | Preferences | Students/faculty submit preferences. |
| `/rules` | Custom rules | Admins define hard/soft constraints. |
| `/analytics` | Analytics dashboard | Room utilization, faculty workload. |

#### **Key Components**
1. **Timetable Grid**:
   - **Drag-and-drop** (Phase 2) or **read-only** (MVP).
   - **Color-coded** by subject/department.
   - **Hover tooltips** for details (faculty, room, batch).
2. **Conflict Detector**:
   - **Real-time warnings** if a change causes a conflict.
3. **AI Generation Modal**:
   - **Progress bar** while AI generates timetables.
   - **Display top 3 options** with scores.
4. **Comparison Tool**:
   - **Side-by-side view** of multiple timetable versions.
5. **Leave Calendar**:
   - **Visual calendar** showing faculty leaves.
6. **Rule Builder**:
   - **UI to create custom rules** (e.g., "No classes after 4 PM on Fridays").

---

---

---

## **4. Execution Plan**

---

### **4.1 Development Phases**
#### **Phase 1: Core MVP (4 Weeks)**
| **Task** | **Duration** | **Details** | **Deliverables** |
|----------|--------------|-------------|------------------|
| **Setup Monorepo** | 1 day | Initialize Git repo, folder structure, `package.json`, `go.mod`. | Ready-to-code repo. |
| **Set Up MongoDB & Redis** | 1 day | Create MongoDB Atlas cluster, Upstash Redis DB. | DB connections ready. |
| **Golang Backend MVP** | 1 week | CRUD for `departments`, `classrooms`, `faculty`, `subjects`, `batches`, `slots`. | Working API endpoints. |
| **NextAuth.js Setup** | 2 days | Configure NextAuth with MongoDB + Redis. | Login/signup working. |
| **Python AI MVP** | 1 week | Greedy algorithm + OR-Tools solver. | AI generates timetables. |
| **Integrate AI with Golang** | 2 days | Golang calls Python AI via HTTP. | End-to-end AI generation. |
| **Frontend MVP** | 1 week | Auth pages, CRUD pages, timetable grid (read-only). | Functional UI. |
| **Testing & Bug Fixes** | 3 days | Test with sample data, fix edge cases. | Stable MVP. |

#### **Phase 2: Advanced Features (4 Weeks)**
| **Task** | **Duration** | **Details** | **Deliverables** |
|----------|--------------|-------------|------------------|
| **Drag-and-Drop Editor** | 1 week | Implement `react-beautiful-dnd` or `dnd-kit`. | Interactive timetable grid. |
| **Conflict Detection** | 2 days | Real-time warnings in UI. | No conflicts in manual edits. |
| **Genetic Algorithm Fallback** | 1 week | Add fallback for large datasets. | Handles 1000+ classes. |
| **Leave Management** | 3 days | Auto-adjust timetables for leaves. | Integrated with AI. |
| **Custom Rule Engine** | 3 days | UI for admins to define rules. | Flexible constraints. |
| **Export to PDF/Excel** | 3 days | Puppeteer for PDF, SheetJS for Excel. | Downloadable timetables. |
| **Analytics Dashboard** | 3 days | Charts for room/faculty utilization. | Actionable insights. |
| **Multi-Language Support** | 2 days | Add Hindi translations. | Localized UI. |

#### **Phase 3: Polish & Scale (2 Weeks)**
| **Task** | **Duration** | **Details** | **Deliverables** |
|----------|--------------|-------------|------------------|
| **Performance Optimizations** | 1 week | Optimize MongoDB queries, cache AI results. | Faster response times. |
| **Real-Time Collaboration** | 1 week | Socket.io for live editing. | Multi-admin support. |
| **Pilot Testing** | 1 week | Onboard 1-2 colleges, gather feedback. | Bug-free system. |
| **Deployment** | 3 days | Deploy to Vercel + Railway. | Live demo. |

---

### **4.2 Timeline**
| **Phase** | **Duration** | **Start Date** | **End Date** | **Key Milestones** |
|-----------|--------------|----------------|--------------|---------------------|
| **Phase 1: Core MVP** | 4 weeks | June 1, 2026 | June 29, 2026 | Working MVP with AI. |
| **Phase 2: Advanced Features** | 4 weeks | June 30, 2026 | July 27, 2026 | Drag-and-drop, rules, exports. |
| **Phase 3: Polish & Scale** | 2 weeks | July 28, 2026 | August 11, 2026 | Pilot testing, deployment. |
| **Total** | **10 weeks** | June 1, 2026 | August 11, 2026 | **HourGlass v1.0** |

---
### **4.3 Team Roles & Responsibilities**
| **Role** | **Responsibilities** | **Skills Required** | **Time Commitment** |
|----------|----------------------|---------------------|----------------------|
| **Project Lead** | Oversee development, coordinate timelines, stakeholder communication. | Project management, Agile. | Full-time |
| **Frontend Developer** | Build Next.js UI, integrate with backend, implement drag-and-drop. | React, TypeScript, Tailwind CSS. | Full-time |
| **Backend Developer** | Build Golang API, integrate with MongoDB/Redis, proxy to AI. | Golang, MongoDB, Redis. | Full-time |
| **AI Engineer** | Implement OR-Tools + Genetic Algorithm, optimize for performance. | Python, OR-Tools, algorithms. | Part-time (20 hrs/week) |
| **QA Engineer** | Test frontend/backend, report bugs, validate edge cases. | Manual/automated testing. | Part-time (10 hrs/week) |

---
### **4.4 Development Workflow**
1. **Branching Strategy**:
   - **`main`**: Stable code (production-ready).
   - **`dev`**: Development branch (merged to `main` after testing).
   - **Feature branches**: `feature/[name]` (e.g., `feature/drag-and-drop`).
   - **Bugfix branches**: `bugfix/[name]` (e.g., `bugfix/ai-timeout`).

2. **Pull Request (PR) Process**:
   - **Code Review**: At least **1 approval** required for merging.
   - **Testing**: All PRs must pass **unit tests** (frontend/backend).
   - **Documentation**: Update **README.md** and **API docs** for new features.

3. **Daily Standups**:
   - **15-minute sync** (via Slack/Zoom) to discuss:
     - Progress.
     - Blockers.
     - Next steps.

4. **Weekly Demos**:
   - **Friday afternoons**: Show progress to stakeholders.
   - **Feedback loop**: Incorporate feedback into next sprint.

---

---
---

## **5. Deployment Strategy**

---
### **5.1 Local Development**
#### **Prerequisites**
- **Node.js** (v18+) for Next.js.
- **Golang** (v1.21+) for backend.
- **Python** (v3.9+) for AI service.
- **MongoDB** (local or Atlas).
- **Redis** (local or Upstash).

#### **Steps**
1. **Clone the repo**:
   ```bash
   git clone https://github.com/your-username/hourglass.git
   cd hourglass
   ```
2. **Install dependencies**:
   ```bash
   # Frontend
   npm install

   # Backend
   cd src/backend
   go mod download
   cd ../..

   # AI Service
   cd ai
   pip install -r requirements.txt
   cd ..
   ```
3. **Run MongoDB & Redis**:
   - **MongoDB**: Start local server or use Atlas.
   - **Redis**: Start local server (`redis-server`) or use Upstash.
4. **Run services**:
   - **Terminal 1 (Golang Backend)**:
     ```bash
     cd src/backend
     go run main.go
     ```
     - Runs on `http://localhost:8080`.
   - **Terminal 2 (Python AI Service)**:
     ```bash
     cd ai
     uvicorn main:app --reload
     ```
     - Runs on `http://localhost:8000`.
   - **Terminal 3 (Next.js Frontend)**:
     ```bash
     npm run dev
     ```
     - Runs on `http://localhost:3000`.

---
### **5.2 Production Deployment**
#### **Frontend (Vercel)**
1. **Connect GitHub repo** to Vercel.
2. **Configure Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: `https://hourglass-backend.up.railway.app`
   - `NEXTAUTH_URL`: `https://hourglass.vercel.app`
   - `NEXTAUTH_SECRET`: Random secret (e.g., `openssl rand -base64 32`).
   - `MONGODB_URI`: MongoDB Atlas connection string.
   - `REDIS_URL`: Upstash Redis URL.
3. **Deploy**:
   - Vercel auto-deploys on `git push` to `main`.

#### **Backend (Railway)**
1. **Create a new Railway project**.
2. **Connect GitHub repo** (point to `src/backend`).
3. **Configure Environment Variables**:
   - `MONGODB_URI`: Same as frontend.
   - `REDIS_URL`: Same as frontend.
   - `AI_SERVICE_URL`: `https://hourglass-ai.up.railway.app`.
   - `JWT_SECRET`: Same as `NEXTAUTH_SECRET` in frontend.
4. **Set Start Command**:
   - `go run main.go`
5. **Deploy**.

#### **AI Service (Railway)**
1. **Create a new Railway project**.
2. **Connect GitHub repo** (point to `ai/`).
3. **Configure Environment Variables**: None (stateless).
4. **Set Start Command**:
   - `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **Deploy**.

#### **Database (MongoDB Atlas)**
1. **Create a free cluster** (M0 tier).
2. **Whitelist IP addresses** (Railway’s IPs + your local IP).
3. **Create a database user** with read/write permissions.

#### **Redis (Upstash)**
1. **Sign up for Upstash**.
2. **Create a Redis database**.
3. **Copy the `REDIS_URL`** and add it to Vercel/Railway.

---
### **5.3 Environment Variables (`.env.local.example`)**
```env
# Next.js (Frontend)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/hourglass?retryWrites=true&w=majority
REDIS_URL=redis://<username>:<password>@<host>:<port>

# Golang (Backend)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/hourglass?retryWrites=true&w=majority
REDIS_URL=redis://<username>:<password>@<host>:<port>
AI_SERVICE_URL=http://localhost:8000
JWT_SECRET=your-jwt-secret-here

# Python AI (Optional)
# No env vars needed for local dev
```

---
---
---

## **6. Pilot & Monetization Strategy**

---
### **6.1 Finding Pilot Partners**
#### **Target Institutions**
| **Type** | **Why?** | **How to Approach** |
|----------|----------|---------------------|
| **Private Engineering Colleges** | High complexity (multi-department, labs, electives). | Cold email **HODs of CSE/IT/ECE**. |
| **CBSE/State Board Schools** | Simpler needs (fixed periods, fewer constraints). | Contact **principals or coordinators**. |
| **Newly Established Colleges** | No legacy systems, open to innovation. | LinkedIn messages to **founders/deans**. |
| **EdTech Startups** | Need timetable tools for their platforms. | Pitch as a **white-label solution**. |

#### **Outreach Channels**
1. **Cold Emails**:
   - Use the template in [Appendix 9.3](#93-cold-email-template-for-pilots).
   - Target **10-20 institutions/week**.
2. **LinkedIn**:
   - Search for **Dean of Academics**, **HOD Computer Science**, **School Principal**.
   - Send **personalized connection requests + messages**.
3. **Local Networking**:
   - Attend **education conferences** (e.g., Educate India, NAAC workshops).
   - Partner with **college consultants** (they recommend tools to institutions).
4. **Alumni Networks**:
   - Reach out to **your college’s alumni network** (if applicable).
5. **Online Communities**:
   - Post in **Quora, Reddit (r/IndianEducation), Facebook groups**.

---
### **6.2 Outreach Strategies**
#### **Cold Email Template**
> **Subject**: Free AI-Powered Timetable Generator for [College Name] – Pilot Program
>
> **Body**:
> ```
> Hi [Name],
>
> I’m [Your Name], founder of HourGlass, an AI-powered timetable generator designed to eliminate scheduling conflicts and save 20+ hours/week for institutions like [College Name].
>
> We’re offering **free access** to a select few colleges for a **3-month pilot program**. HourGlass can:
> ✅ Auto-generate **conflict-free timetables** in minutes.
> ✅ Handle **labs, electives, and multi-department** constraints.
> ✅ Balance **faculty workload** and **room utilization**.
> ✅ Export to **PDF/Excel** for easy sharing.
>
> Would you be open to a **15-minute demo** next week? We’d love to tailor it to [College Name]’s needs.
>
> Best,
> [Your Name]
> [Your Email]
> [Your Phone]
> [Website]
> ```

#### **LinkedIn Message Template**
> ```
> Hi [Name],
>
> I noticed you’re at [College Name]. We’re building an AI tool to automate timetable generation for institutions like yours. Would you be open to a quick chat to see if it’s a fit?
>
> Best,
> [Your Name]
> ```

---
### **6.3 Monetization Model**
#### **Pricing Tiers**
| **Tier** | **Price** | **Features** | **Target Audience** |
|----------|-----------|--------------|---------------------|
| **Free** | $0 | Up to **100 users**, Basic AI (OR-Tools only), Single department, PDF/Excel export, Community support. | Small schools, new colleges. |
| **Pro** | **$20/month** | Everything in Free + **Multi-department**, **Genetic Algorithm Fallback**, **Priority Support**. | Medium-sized colleges. |
| **Enterprise** | **$100/month** | Everything in Pro + **Real-Time Collaboration**, **LMS Sync**, **Custom Branding**, **Dedicated Account Manager**. | Large universities, EdTech platforms. |
| **White-Label** | **Custom** | Full rebranding, API access, On-premise deployment. | EdTech companies. |

#### **Add-Ons**
| **Add-On** | **Price** | **Description** |
|------------|-----------|-----------------|
| **Advanced Analytics Dashboard** | +$10/month | Historical insights and suggestions. |
| **SMS/Email Notifications** | +$5/month | Alerts for faculty/students. |
| **Mobile App Access** | +$15/month | React Native app for timetables. |

#### **Payment Gateway**
- **India**: **Razorpay** (supports UPI, cards, net banking).
- **Global**: **Stripe** (for international users).
- **Invoicing**: Manual invoices for enterprise clients.

---
---
---

## **7. Risk Analysis & Mitigation**

| **Risk** | **Likelihood** | **Impact** | **Mitigation Strategy** |
|----------|----------------|------------|--------------------------|
| **AI is too slow for large datasets** | High | High | Start with small datasets, optimize with preprocessing + hybrid approach. |
| **No pilot partners** | Medium | High | Leverage personal networks, offer free access, attend education events. |
| **MongoDB queries are slow** | Medium | Medium | Denormalize where possible, add indexes, cache results. |
| **Golang-Python integration fails** | Low | High | Test locally first, use timeouts, fallback to greedy algorithm. |
| **Frontend performance issues** | Medium | Medium | Virtualize grids, memoize components, lazy-load data. |
| **Deployment complexity** | Low | Medium | Use Vercel (frontend) + Railway (backend/AI) for simplicity. |
| **Monetization fails** | Medium | High | Start free, upsell later, focus on value first. |
| **Competitors copy features** | Low | Medium | Focus on **unique USPs** (AI, resource-aware scheduling, collaboration). |

---
---
---

## **8. Future Roadmap**

| **Phase** | **Timeline** | **Features** | **Priority** |
|-----------|--------------|--------------|--------------|
| **v1.0 (MVP)** | 10 weeks | Core AI, CRUD, basic UI, export. | ⭐⭐⭐⭐⭐ |
| **v1.1** | 2 weeks | Drag-and-drop, conflict detection, leave management. | ⭐⭐⭐⭐ |
| **v1.2** | 2 weeks | Real-time collaboration, custom rules, analytics. | ⭐⭐⭐ |
| **v1.3** | 1 week | Multi-language (Hindi), performance optimizations. | ⭐⭐ |
| **v2.0** | 4 weeks | LMS sync (Moodle/Canvas), mobile app (React Native). | ⭐⭐ |
| **v2.1** | 2 weeks | White-label solution, on-premise deployment. | ⭐ |
| **v3.0** | 6 weeks | Predictive analytics, auto-rescheduling for leaves. | ⭐ |

---
---
---

## **9. Appendices**

---
### **9.1 Sample Data Models**
#### **`users` Collection**
```json
{
  "_id": "user_1",
  "name": "Dr. Rajesh Kumar",
  "email": "rajesh.kumar@college.edu",
  "passwordHash": "$2a$10$N9qo8uLOickgx2ZMRZoMy...",
  "role": "department_admin",
  "departmentId": "dept_1",
  "lastLogin": "2026-06-01T10:00:00Z"
}
```

#### **`classrooms` Collection**
```json
{
  "_id": "room_1",
  "name": "Lecture Hall A",
  "capacity": 60,
  "resources": ["projector", "whiteboard", "smartboard"],
  "departmentId": "dept_1",
  "location": "Block A, Floor 1"
}
```

#### **`timetables` Collection**
```json
{
  "_id": "tt_1",
  "name": "2026-27 Semester 1",
  "departmentId": "dept_1",
  "status": "approved",
  "createdBy": "user_1",
  "version": "1.2",
  "createdAt": "2026-06-01T10:00:00Z",
  "updatedAt": "2026-06-05T14:30:00Z"
}
```

#### **`scheduledClasses` Collection**
```json
{
  "_id": "class_1",
  "timetableId": "tt_1",
  "subjectId": "subj_1",
  "facultyId": "fac_1",
  "classroomId": "room_1",
  "batchId": "batch_1",
  "slotId": "slot_1",
  "isFixed": false
}
```

---
### **9.2 API Endpoint Specifications**
#### **`POST /api/timetables` (Generate Timetable)**
- **Request Body**:
  ```json
  {
    "departmentId": "dept_1",
    "constraints": {
      "classroomIds": ["room_1", "room_2"],
      "facultyIds": ["fac_1", "fac_2"],
      "subjectIds": ["subj_1", "subj_2"],
      "batchIds": ["batch_1", "batch_2"],
      "slotIds": ["slot_1", "slot_2"],
      "rules": [
        { "type": "hard", "constraint": "no_back_to_back", "facultyId": "fac_1" }
      ]
    }
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "timetables": [
      {
        "id": "tt_1",
        "score": 0.95,
        "conflicts": [],
        "scheduledClasses": [
          {
            "subjectId": "subj_1",
            "facultyId": "fac_1",
            "classroomId": "room_1",
            "batchId": "batch_1",
            "slotId": "slot_1"
          }
        ]
      }
    ]
  }
  ```

---
### **9.3 Cold Email Template for Pilots**
> **Subject**: Free AI-Powered Timetable Generator for [College Name] – Pilot Program
>
> **Body**:
> ```
> Dear [Name],
>
> I hope this email finds you well. I’m [Your Name], founder of HourGlass, an AI-powered timetable generator designed to streamline scheduling for educational institutions like [College Name].
>
> **Why HourGlass?**
> - **Eliminate Conflicts**: Our AI ensures **no overlapping classes** for faculty, rooms, or batches.
> - **Save Time**: Reduce timetable creation time from **days to minutes**.
> - **Optimize Resources**: Maximize **room utilization** and balance **faculty workload**.
> - **Flexible & Scalable**: Works for **schools, colleges, and universities** of all sizes.
>
> We’re offering **free access** to a select group of institutions for a **3-month pilot program**. As part of the pilot, you’ll get:
> ✅ Full access to HourGlass.
> ✅ **1-on-1 onboarding** and support.
> ✅ **Customization** to fit [College Name]’s needs.
>
> Would you be available for a **15-minute demo** next week? We’d love to show you how HourGlass can simplify scheduling for your institution.
>
> Looking forward to your response.
>
> Best regards,
> [Your Name]
> [Your Position]
> [Your Organization]
> [Your Email]
> [Your Phone]
> [Website URL]
> ```

---
---
---
---
---
**End of Document**
**Prepared by**: 0xSoumya
**Last Updated**: June 1, 2026

---
---
