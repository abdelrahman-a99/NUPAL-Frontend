// ── Admin Entity Types ─────────────────────────────────────────────────────

export interface AdminStudentSummary {
    id: string;
    name: string;
    email: string;
    totalCredits: number;
    numSemesters: number;
    totalCourses: number;
    cumulativeGpa: number;
    latestSemesterGpa: number;
    latestTerm: string;
    latestRecommendationId?: string;
}

export interface AdminStudentDetail {
    id: string;
    name: string;
    email: string;
    latestRecommendationId?: string;
    education: {
        totalCredits: number;
        numSemesters: number;
        semesters: AdminSemester[];
    };
}

export interface AdminSemester {
    term: string;
    optional: boolean;
    semesterCredits: number;
    semesterGpa: number;
    cumulativeGpa: number;
    courses: AdminCourse[];
}

export interface AdminCourse {
    courseId: string;
    courseName: string;
    credit: number;
    grade: string;
    gpa?: number;
}

// ── RL Engine Types ────────────────────────────────────────────────────────

export type RlJobStatus = 'Queued' | 'Running' | 'Ready' | 'Failed';

export interface AdminRlJob {
    id: string;
    studentId: string;
    status: RlJobStatus;
    createdAt: string;
    startedAt?: string;
    finishedAt?: string;
    isSimulation: boolean;
    resultRecommendationId?: string;
    error?: string;
    educationHash?: string;
}

export interface AdminRlRecommendation {
    id: string;
    studentId: string;
    createdAt: string;
    termIndex: number;
    courses: string[];
    slatesByTerm?: { term: number; slate: string[] }[];
    metrics?: {
        cumGpa: number;
        totalCredits: number;
        graduated: boolean;
    };
    modelVersion?: string;
    policyVersion?: string;
}

// ── Course Mapping Types ───────────────────────────────────────────────────

export interface CourseMapping {
    id: string;
    courseCode: string;
    courseNames: string[];
    credits: number;
    category: string;
}

// Form state — list fields are comma-separated strings for <input> binding
export interface CourseMappingForm {
    courseCode: string;
    courseNames: string;
    credits: number;
    category: string;
}

// API payload — list fields are already parsed into string[]
export interface CourseMappingPayload {
    courseCode: string;
    courseNames: string[];
    credits: number;
    category: string;
}

// ── System Stats Types ─────────────────────────────────────────────────────

export interface AdminSystemStats {
    students: {
        total: number;
        averageGpa: number;
        studentsWithSchedules: number;
        levelDistribution: Record<string, number>;
    };
    rlJobs: {
        total: number;
        byStatus: Record<string, number>;
    };
    courseMappings: { 
        total: number;
        categoryDistribution?: Record<string, number>;
    };
    schedulingBlocks: { total: number };
    activeSemester: string;
    availableSemesters: string[];
}
