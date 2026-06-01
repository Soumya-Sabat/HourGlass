```text

hourglass/                          # Root (Monorepo: Frontend + Backend)
│
├── public/                         # Static files
│   ├── favicon.ico
│   └── assets/
│       └── logo.svg
│
├── src/                            # Shared source (Frontend + Backend)
│   │
│   ├── app/                        # Next.js App Router (Frontend)
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/
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
│   │   │   ├── preferences/
│   │   │   │   └── page.tsx
│   │   │   ├── rules/
│   │   │   │   ├── page.tsx
│   │   │   │   └── new/page.tsx
│   │   │   └── analytics/
│   │   │       └── page.tsx
│   │   └── api/                     # Next.js API Routes (Backend)
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts
│   │       ├── departments/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── classrooms/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── faculty/
│   │       │   ├── route.ts
│   │       │   ├── [id]/route.ts
│   │       │   └── leaves/
│   │       │       ├── route.ts
│   │       │       └── [id]/route.ts
│   │       ├── subjects/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── batches/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── slots/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── timetables/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       ├── route.ts
│   │       │       ├── approve/route.ts
│   │       │       └── export/route.ts
│   │       ├── conflicts/
│   │       │   └── route.ts
│   │       ├── rules/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── preferences/
│   │       │   └── route.ts
│   │       └── analytics/
│   │           └── route.ts
│   │
│   ├── components/                   # Reusable UI components
│   │   ├── ui/ (Button, Input, Modal, etc.)
│   │   ├── layout/ (Navbar, Sidebar, Footer)
│   │   ├── timetable/ (TimetableGrid, ConflictDetector)
│   │   ├── forms/ (ClassroomForm, FacultyForm)
│   │   └── charts/ (RoomUtilizationChart, FacultyWorkloadChart)
│   │
│   ├── lib/                          # Utilities
│   │   ├── db.ts                     # MongoDB connection
│   │   ├── redis.ts                  # Redis connection
│   │   ├── auth.ts                   # NextAuth config
│   │   └── utils.ts
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useTimetable.ts
│   │   └── ...
│   │
│   ├── styles/                       # Global styles
│   │   └── globals.css
│   │
│   ├── types/                        # TypeScript types
│   │   ├── user.ts
│   │   ├── timetable.ts
│   │   └── ...
│   │
│   └── backend/                      # Golang Backend (inside src/)
│       ├── main.go                  # Entry point
│       ├── config/
│       │   └── config.go
│       ├── handlers/
│       │   ├── auth.go
│       │   ├── timetables.go
│       │   ├── classrooms.go
│       │   ├── faculty.go
│       │   ├── subjects.go
│       │   ├── batches.go
│       │   ├── slots.go
│       │   ├── leaves.go
│       │   ├── preferences.go
│       │   ├── rules.go
│       │   └── analytics.go
│       ├── models/
│       │   ├── user.go
│       │   ├── timetable.go
│       │   ├── classroom.go
│       │   ├── faculty.go
│       │   ├── subject.go
│       │   ├── batch.go
│       │   ├── slot.go
│       │   ├── leave.go
│       │   ├── preference.go
│       │   ├── rule.go
│       │   └── conflict.go
│       ├── routes/
│       │   └── routes.go
│       ├── middleware/
│       │   ├── auth.go
│       │   └── rate_limiter.go
│       ├── services/
│       │   ├── ai_service.go          # Calls Python AI service
│       │   ├── timetable_service.go
│       │   ├── classroom_service.go
│       │   ├── faculty_service.go
│       │   ├── subject_service.go
│       │   ├── batch_service.go
│       │   ├── slot_service.go
│       │   ├── leave_service.go
│       │   ├── preference_service.go
│       │   ├── rule_service.go
│       │   └── analytics_service.go
│       └── utils/
│           ├── db.go
│           ├── redis.go
│           └── helpers.go
│
├── ai/                              # Separate AI Service (Python)
│   ├── main.py
│   ├── models/
│   │   ├── constraints.py
│   │   └── timetable.py
│   ├── solvers/
│   │   ├── greedy.py
│   │   ├── or_tools.py
│   │   └── genetic.py
│   ├── utils/
│   │   ├── preprocessing.py
│   │   └── scoring.py
│   └── requirements.txt
│
├── scripts/                         # Utility scripts
│   ├── seed_db.go                    # Seed MongoDB with test data
│   └── test_ai.py                    # Test AI with sample data
│
├── config/                          # Shared configs
│   └── shared_config.json
│
├── .gitignore
├── package.json                     # Frontend dependencies
├── go.mod                           # Golang dependencies
├── next.config.js
├── tailwind.config.js
└── README.md
```