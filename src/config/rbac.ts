export type UserRole = 
  | "student" 
  | "faculty" 
  | "reviewer" 
  | "department_head" 
  | "department_admin" 
  | "institution_admin" 
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
    "/dashboard/student/settings",          // Student settings
    "/dashboard/events",
    "/dashboard/alerts"
  ],
  
  faculty: [
    "/dashboard/faculty",                  // Main Faculty Overview Board
    "/dashboard/faculty/timetable",        // Teacher schedules across batches
    "/dashboard/faculty/exchange-desk",    // Request/Trade slot manager
    "/dashboard/faculty/subjects",         // Handled syllabus tracking
    "/dashboard/faculty/messages",         // Instructor inter-app messages
    "/dashboard/faculty/notices",          // Faculty official notices
    "/dashboard/faculty/attendance",       // Attendance update/marking terminal
    "/dashboard/faculty/downloads",        // Department sheet templates
    "/dashboard/faculty/clusters",         // My teaching clusters
    "/dashboard/events",
    "/dashboard/alerts"
  ],

  reviewer: [
    "/dashboard/review",                   // Reviewer overview
    "/dashboard/review/clusters",          // Manage subject clusters
    "/dashboard/review/timetable-review",  // Review & suggest timetable changes
    "/dashboard/faculty/timetable",        // Teacher schedules across batches
    "/dashboard/faculty/exchange-desk",    // Request/Trade slot manager
    "/dashboard/faculty/subjects",         // Handled syllabus tracking
    "/dashboard/faculty/messages",         // Instructor inter-app messages
    "/dashboard/faculty/notices",          // Faculty official notices
    "/dashboard/faculty/attendance",       // Attendance update/marking terminal
    "/dashboard/faculty/downloads",        // Department sheet templates
    "/dashboard/faculty/clusters",         // Cluster chat access
    "/dashboard/events",
    "/dashboard/alerts"
  ],
  
  department_head: [
    "/dashboard/head",                    // Head Approvals terminal
    "/dashboard/head/subjects",           // Dept syllabus review maps
    "/dashboard/head/faculty-roster",     // HOD overview of instructors
    "/dashboard/head/messages",
    "/dashboard/head/notices",
    "/dashboard/head/clusters",           // Cluster oversight & rearrangement
    "/dashboard/events",
    "/dashboard/alerts"
  ],
  
  department_admin: [
    "/dashboard/department",               // Building raw schedules
    "/dashboard/department/faculty-roster",// Allocating teaching staffs
    "/dashboard/department/students",
    "/dashboard/department/timetable",
    "/dashboard/department/exams",
    "/dashboard/department/events",
    "/dashboard/department/settings",
    "/dashboard/department/analytics",
    "/dashboard/department/alerts",
    "/dashboard/department/messages",
    "/dashboard/department/notices",
    "/dashboard/events",
    "/dashboard/alerts"
  ],
  
  institution_admin: [
    "/dashboard/institution",              // Override controls & verification
    "/dashboard/institution/profile",
    "/dashboard/institution/activity",
    "/dashboard/institution/users",
    "/dashboard/institution/departments",
    "/dashboard/institution/marks",
    "/dashboard/institution/marks/exams",
    "/dashboard/institution/marks/entry",
    "/dashboard/institution/marks/grades",
    "/dashboard/institution/settings",
    "/dashboard/institution/analytics",
    "/dashboard/institution/complaints",
    "/dashboard/institution/announcements",
    "/dashboard/institution/messages",
    "/dashboard/institution/notices",
    "/dashboard/institution/physical",
    "/dashboard/events",
    "/dashboard/alerts"
  ],

  
  super_admin: [
    "/dashboard/super-admin",              // Root system configuration logs
    "/dashboard/super-admin/institutions",
    "/dashboard/super-admin/institutions/pending",
    "/dashboard/super-admin/institutions/approved",
    "/dashboard/super-admin/institutions/rejected",
    "/dashboard/super-admin/institutions/suspended",
    "/dashboard/super-admin/users",
    "/dashboard/super-admin/users/super-admins",
    "/dashboard/super-admin/users/department-admins",
    "/dashboard/super-admin/users/faculty",
    "/dashboard/super-admin/users/students",
    "/dashboard/super-admin/users/invite",
    "/dashboard/super-admin/users/activity-logs",
    "/dashboard/super-admin/pricing",
    "/dashboard/super-admin/pricing/create",
    "/dashboard/super-admin/pricing/subscriptions",
    "/dashboard/super-admin/pricing/billing",
    "/dashboard/super-admin/pricing/payment-methods",
    "/dashboard/super-admin/pricing/discounts",
    "/dashboard/super-admin/pricing/refunds",
    "/dashboard/super-admin/pricing/revenue",
    "/dashboard/super-admin/analytics",
    "/dashboard/super-admin/analytics/institution",
    "/dashboard/super-admin/analytics/user-activity",
    "/dashboard/super-admin/analytics/ai-performance",
    "/dashboard/super-admin/analytics/resource-utilization",
    "/dashboard/super-admin/analytics/conflicts",
    "/dashboard/super-admin/analytics/custom-reports",
    "/dashboard/super-admin/analytics/scheduled-reports",
    "/dashboard/super-admin/support",
    "/dashboard/super-admin/support/open",
    "/dashboard/super-admin/support/in-progress",
    "/dashboard/super-admin/support/resolved",
    "/dashboard/super-admin/support/create",
    "/dashboard/super-admin/support/faq",
    "/dashboard/super-admin/support/feedback",
    "/dashboard/super-admin/support/system-logs",
    "/dashboard/super-admin/settings",
    "/dashboard/super-admin/settings/email",
    "/dashboard/super-admin/settings/email-templates",
    "/dashboard/super-admin/settings/notifications",
    "/dashboard/super-admin/settings/api-keys",
    "/dashboard/super-admin/settings/security",
    "/dashboard/super-admin/settings/backup",
    "/dashboard/super-admin/settings/maintenance",
    "/dashboard/super-admin/settings/feature-flags",
    "/dashboard/super-admin/audit",
    "/dashboard/super-admin/audit/data-privacy",
    "/dashboard/super-admin/audit/gdpr",
    "/dashboard/super-admin/audit/compliance",
    "/dashboard/super-admin/announcements",
    "/dashboard/super-admin/announcements/create",
    "/dashboard/super-admin/announcements/email-campaigns",
    "/dashboard/super-admin/announcements/in-app-notifications",
    "/dashboard/super-admin/announcements/surveys",
    "/dashboard/student",
    "/dashboard/faculty",
    "/dashboard/head",
    "/dashboard/department",
    "/dashboard/institution",
    "/dashboard/events",
    "/dashboard/alerts"
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