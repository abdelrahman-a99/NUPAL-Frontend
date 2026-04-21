// ─── Scheduling Module Types ──────────────────────────────────────────────────

export type DayOfWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export type ScheduleType = 'compact' | 'balanced' | 'light';


export interface CourseSession {
    courseId: string;
    courseName: string;
    instructor: string;
    day: DayOfWeek;

    start: string;

    end: string;
    room?: string;

    color?: string;


    status?: string;
    section?: string;
    session?: string;
    subtype?: string;
    type?: string;
    duration?: string;
    credits?: number;
    creditType?: string;
}


export interface Block {
    blockId: string;
    totalCredits: number;
    courses: CourseSession[];
}


export interface SchedulePreferences {

    level: 'FR' | 'JR' | 'SO' | 'SR' | 'ALL' | '';

    preferredDays: DayOfWeek[];

    numPreferredDays?: number;

    dayMode: 'specific' | 'count';

    maxDaysPerWeek: number;

    maxGapHours: number;

    earliestTime: string;
    latestTime: string;
    preferredInstructors: string[];
    scheduleType: ScheduleType;
}


export interface RecommendationResult {
    block: Block;
    matchScore: number; // 0–100
    reasons: string[];
    breakdown: {
        similarity: number;
        coverage: number;
        compactness: number;
        dayBonus: number;
    };
}


export interface EligibleCourse {
    courseId: string;
    courseName: string;
    level: 'FR' | 'JR' | 'SO' | 'SR';
    prerequisitesMet: boolean;
}
