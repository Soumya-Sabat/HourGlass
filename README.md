```text

hourglass/
│
├── **public/**                          # Static files
│   ├── favicon.ico
│   ├── logo.svg
│   └── assets/                          # Images, fonts, etc.
│       ├── icons/
│       └── illustrations/
│
├── **src/**                             # Source code (frontend + backend)
│   │
│   ├── **app/**                         # Next.js App Router (Frontend)
│   │   ├── (auth)/                      # Auth group
│   │   │   ├── login/
│   │   │   │   └── page.tsx             # Login page
│   │   │   └── signup/
│   │   │       └── page.tsx             # Signup page
│   │   │
│   │   ├── (dashboard)/                 # Protected routes
│   │   │   ├── layout.tsx               # Dashboard layout
│   │   │   ├── page.tsx                 # Dashboard home
│   │   │   ├── departments/
│   │   │   │   ├── page.tsx             # List departments
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx         # Edit department
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
│   │   │   │   ├── page.tsx             # List timetables
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx         # Create timetable (AI trigger)
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx         # View timetable
│   │   │   │       ├── edit/
│   │   │   │       │   └── page.tsx       # Edit timetable
│   │   │   │       └── approve/
│   │   │   │           └── page.tsx     # Approve/reject
│   │   │   ├── leaves/
│   │   │   │   ├── page.tsx             # List leaves
│   │   │   │   └── request/
│   │   │   │       └── page.tsx         # Request leave
│   │   │   ├── preferences/
│   │   │   │   └── page.tsx             # Submit preferences
│   │   │   ├── rules/
│   │   │   │   ├── page.tsx             # List rules
│   │   │   │   └── new/
│   │   │   │       └── page.tsx         # Add rule
│   │   │   └── analytics/
│   │   │       └── page.tsx             # Analytics dashboard
│   │   │
│   │   ├── api/                         # Next.js API Routes (Backend)
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts         # Login API
│   │   │   │   ├── signup/
│   │   │   │   │   └── route.ts         # Signup API
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts         # NextAuth config
│   │   │   ├── departments/
│   │   │   │   ├── route.ts             # GET (list), POST (create)
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts         # GET, PUT, DELETE
│   │   │   ├── classrooms/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── faculty/
│   │   │   │   ├── route.ts
│   │   │   │   ├── [id]/route.ts
│   │   │   │   └── leaves/
│   │   │   │       ├── route.ts         # GET (list), POST (request)
│   │   │   │       └── [id]/route.ts     # PUT (approve/reject)
│   │   │   ├── subjects/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── batches/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── slots/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── timetables/
│   │   │   │   ├── route.ts             # GET (list), POST (generate)
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts         # GET, PUT, DELETE
│   │   │   │       ├── approve/
│   │   │   │       │   └── route.ts     # Approve timetable
│   │   │   │       └── export/
│   │   │   │           └── route.ts     # Export PDF/Excel/ICS
│   │   │   ├── conflicts/
│   │   │   │   └── route.ts             # GET conflicts for a timetable
│   │   │   ├── rules/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   └── preferences/
│   │   │       └── route.ts             # POST (submit preferences)
│   │   │
│   │   ├── lib/                         # Utility functions
│   │   │   ├── db.ts                   # MongoDB connection
│   │   │   ├── auth.ts                 # Auth helpers
│   │   │   └── utils.ts                # General utilities
│   │   │
│   │   ├── components/                  # Reusable UI components
│   │   │   ├── ui/                     # Base UI (buttons, inputs)
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── ...
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Footer.tsx
│   │   │   ├── timetable/
│   │   │   │   ├── TimetableGrid.tsx   # Drag-and-drop grid
│   │   │   │   ├── ConflictDetector.tsx
│   │   │   │   └── ...
│   │   │   ├── forms/
│   │   │   │   ├── ClassroomForm.tsx
│   │   │   │   ├── FacultyForm.tsx
│   │   │   │   └── ...
│   │   │   └── charts/
│   │   │       ├── RoomUtilizationChart.tsx
│   │   │       └── FacultyWorkloadChart.tsx
│   │   │
│   │   ├── hooks/                       # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useTimetable.ts
│   │   │   └── ...
│   │   │
│   │   ├── styles/                      # Global styles
│   │   │   └── globals.css
│   │   │
│   │   └── types/                       # TypeScript types
│   │       ├── user.ts
│   │       ├── timetable.ts
│   │       └── ...
│   │
│   ├── **ai/**                          # AI Optimization Engine (Python)
│   │   ├── requirements.txt             # Python dependencies
│   │   ├── timetable_optimizer.py        # OR-Tools + Genetic Algorithm
│   │   ├── models/                      # Data models for AI
│   │   │   ├── constraints.py
│   │   │   └── ...
│   │   └── utils/                       # Helper functions
│   │       ├── preprocessing.py
│   │       └── scoring.py
│   │
│   └── **scripts/**                     # Utility scripts
│       ├── seed_db.js                   # Seed MongoDB with test data
│       └── ...
│
├── **config/**                          # Configuration files
│   ├── next.config.js                   # Next.js config
│   ├── tailwind.config.js               # Tailwind config
│   └── .env.local.example               # Environment variables template
│
├── **tests/**                           # Test files
│   ├── unit/
│   │   ├── frontend/
│   │   └── backend/
│   └── integration/
│
├── **.gitignore**
├── **package.json**                      # Frontend dependencies
├── **requirements.txt**                 # Backend (Python) dependencies
└── **README.md**                         # Project documentation

    
```