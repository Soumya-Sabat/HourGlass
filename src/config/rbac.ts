export type UserRole = 
  | "student" 
  | "faculty" 
  | "department_head" 
  | "department_admin" 
  | "institution_admin" 
  | "admin"
  | "super_admin";

export const ROLE_ROUTES_MATRIX: Record<UserRole, string[]> = {
  student: [
    "/dashboard/student",                  // Main Student Home Console
    "/dashboard/student/timetable",        // Student's specific class timetable
    "/dashboard/student/subjects",         // Student registered subjects view
    "/dashboard/student/faculties",        // Student view of assigned faculties
    "/dashboard/student/messages",         // Student chat/queries desk
    "/dashboard/student/alerts",           // Student relevant notice boards
    "/dashboard/student/attendance",       // Student personal attendance logs
    "/dashboard/student/marksheet",        // Student marksheet
    "/dashboard/student/settings"          // Student settings
  ],
  
  faculty: [
    "/dashboard/faculty",                  // Main Faculty Overview Board
    "/dashboard/faculty/timetable",        // Teacher schedules across batches
    "/dashboard/faculty/exchange-desk",    // Request/Trade slot manager
    "/dashboard/faculty/subjects",         // Handled syllabus tracking
    "/dashboard/faculty/messages",         // Instructor inter-app messages
    "/dashboard/faculty/notices",          // Faculty official notices
    "/dashboard/faculty/attendance",       // Attendance update/marking terminal
    "/dashboard/faculty/downloads"         // Department sheet templates
  ],
  
  department_head: [
    "/dashboard/head",                    // Head Approvals terminal
    "/dashboard/head/subjects",           // Dept syllabus review maps
    "/dashboard/head/faculty-roster",     // HOD overview of instructors
    "/dashboard/head/messages",
    "/dashboard/head/notices"
  ],
  
  department_admin: [
    "/dashboard/department",               // Building raw schedules
    "/dashboard/department/faculty-roster",// Allocating teaching staffs
    "/dashboard/department/messages",
    "/dashboard/department/notices"
  ],
  
  institution_admin: [
    "/dashboard/institution",              // Override controls & verification
    "/dashboard/institution/messages",
    "/dashboard/institution/notices"
  ],

  admin: [
    "/dashboard/admin",                    // Main admin board panel
    "/dashboard/admin/messages",
    "/dashboard/admin/notices"
  ],
  
  super_admin: [
    "/dashboard/super-admin",              // Root system configuration logs
    "/dashboard/admin",
    // Super admins retain full passthrough to explicitly audit any sub-role layout
    "/dashboard/student",
    "/dashboard/faculty",
    "/dashboard/head",
    "/dashboard/department",
    "/dashboard/institution"
  ]
};

/**
 * Validates if a role has authorization to step into a specific route path.
 * Checks against the clean namespaced prefix matrix.
 */
export function canRoleAccessRoute(role: UserRole, currentPath: string): boolean {
  const allowedRoutes = ROLE_ROUTES_MATRIX[role] || [];
  
  // Exact match helper or prefix folder capture validation matching path segments
  return allowedRoutes.some(route => 
    currentPath === route || currentPath.startsWith(route + "/")
  );
}