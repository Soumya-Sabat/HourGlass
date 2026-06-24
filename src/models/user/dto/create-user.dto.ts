import { UserRole } from "@/models/user/types/user-role.enum";

export type CreateUserProfileDto = Record<string, unknown>;

export type CreateUserDto = {
  accountType?: "institution" | "user";
  institutionId?: string;
  institution?: {
    name?: string;
    type?: string;
    academicMode?: string;
    affiliation?: string;
    establishedYear?: number;
    website?: string;
    contactPerson?: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: {
      country?: string;
      state?: string;
      city?: string;
      postalCode?: string;
      line?: string;
    };
    academicYear?: string;
    timetableCycle?: string;
    workingDays?: string[];
    periodDurationMinutes?: number;
    dailyPeriods?: number;
    breakSlots?: string[];
    departmentsOrSections?: string[];
    classroomResources?: string[];
    approvalWorkflow?: string[];
    schedulingRules?: string[];
  };
  fullName: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
  designation?: string;
  bio?: string;
  skills?: string[];
  gender?: string;
  nationality?: string;
  dateOfBirth?: string;
  address?: {
    country?: string;
    state?: string;
    city?: string;
    postalCode?: string;
    line?: string;
  };
  classGroup?: string;
  section?: string;
  batch?: string;
  yearsOfExperience?: number;
  areasOfInterest?: string[];
  education?: {
    highestStudy?: string;
    specialization?: string;
    collegeOrUniversity?: string;
    graduationYear?: number;
  };
  socialLinks?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    twitter?: string;
    reddit?: string;
  };
  profile?: CreateUserProfileDto;
};
