// ─── Scheduling API Service (Web) ────────────────────────────────────────────
// All calls go to NUPAL-Core-Services /api/scheduling/…

import { getToken } from '@/lib/auth';
import {
    Block,
    CourseSession,
    SchedulePreferences,
    RecommendationResult,
} from '@/types/scheduling';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

// ── Helper ────────────────────────────────────────────────────────────────────
async function apiFetch<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const token = getToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {}),
    };
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err?.message ?? 'API error');
    }
    return res.json() as Promise<T>;
}

// ── Types returned by backend (mirrors SchedulingDtos.cs) ─────────────────────
export interface RawBlockCourse {
    course_name: string;
    section?: string;
    type?: string;
    instructor?: string;
    day?: string;
    start_time?: string;
    end_time?: string;
    room?: string;
}

export interface RawBlock {
    block_id: string;
    semester?: string;
    major?: string;
    level: string;
    courses: RawBlockCourse[];
}

// ── Map backend CourseSessionDto → frontend CourseSession ─────────────────────
// The backend already returns camelCase-friendly DTOs; we just alias them.
type ApiCourseSession = Omit<CourseSession, 'courseId'> & { courseId: string; courseName: string; instructor: string; day: string; start: string; end: string; room?: string; section?: string; subtype?: string; color?: string };
type ApiBlock = { blockId: string; totalCredits: number; courses: ApiCourseSession[] };
type ApiRecommendation = {
    block: ApiBlock;
    matchScore: number;
    reasons: string[];
    breakdown: { similarity: number; coverage: number; compactness: number; dayBonus: number };
};

const PALETTE = [
    "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444",
    "#06b6d4", "#ec4899", "#84cc16", "#f97316", "#6366f1",
    "#14b8a6", "#a855f7", "#0ea5e9", "#d946ef", "#22c55e",
];

function assignColors(courses: ApiCourseSession[]): ApiCourseSession[] {
    const colorMap = new Map<string, string>();
    let colorIdx = 0;
    
    return courses.map(c => {
        let color = colorMap.get(c.courseName);
        if (!color) {
            color = PALETTE[colorIdx++ % PALETTE.length];
            colorMap.set(c.courseName, color);
        }
        return { ...c, color };
    });
}

// ── Normalise PascalCase API response → camelCase frontend types ──────────────
function normaliseBlock(b: ApiBlock): Block {
    const coloredCourses = assignColors(b.courses || []);
    return {
        blockId: b.blockId,
        totalCredits: b.totalCredits,
        courses: coloredCourses.map(c => ({
            courseId: c.courseId,
            courseName: c.courseName,
            instructor: c.instructor,
            day: c.day as CourseSession['day'],
            start: c.start,
            end: c.end,
            room: c.room,
            section: c.section,
            subtype: c.subtype,
            color: c.color,
        })),
    };
}

function normaliseRawBlock(r: RawBlock): Block {
    const convertedCourses = (r.courses || []).map((c, i) => ({
        courseId: `${r.block_id}_c${i}`,
        courseName: c.course_name,
        instructor: c.instructor || 'TBA',
        day: (c.day || 'Sunday') as CourseSession['day'],
        start: c.start_time || '08:30',
        end: c.end_time || '10:30',
        room: c.room,
        section: c.section,
        subtype: c.type,
        color: undefined,
    })) as ApiCourseSession[];

    const coloredCourses = assignColors(convertedCourses);

    // Calculate accurate credits matching the backend logic: count unique base names only for Lectures
    const lectureSessions = (r.courses || []).filter(c => 
        c.type === 'L' || c.type?.toLowerCase().startsWith('l')
    );
    const uniqueBaseNames = new Set(
        lectureSessions.map(c => c.course_name.split('-')[0].split('(')[0].trim())
    );
    
    // Fallback if no explicit Lectures are found
    let creditCount = uniqueBaseNames.size * 3;
    if (creditCount === 0 && r.courses.length > 0) {
        const fallbackNames = new Set(r.courses.map(c => c.course_name.split('-')[0].split('(')[0].trim()));
        creditCount = fallbackNames.size * 3;
    }

    return {
        blockId: r.block_id,
        totalCredits: creditCount,
        courses: coloredCourses.map(c => ({
            courseId: c.courseId,
            courseName: c.courseName,
            instructor: c.instructor,
            day: c.day as CourseSession['day'],
            start: c.start,
            end: c.end,
            room: c.room,
            section: c.section,
            subtype: c.subtype,
            color: c.color,
        })),
    };
}

function normaliseRecommendation(r: ApiRecommendation): RecommendationResult {
    return {
        block: normaliseBlock(r.block),
        matchScore: r.matchScore,
        reasons: r.reasons || [],
        breakdown: {
            similarity: r.breakdown?.similarity || 0,
            coverage: r.breakdown?.coverage || 0,
            compactness: r.breakdown?.compactness || 0,
            dayBonus: r.breakdown?.dayBonus || 0,
        },
    };
}

// ── API calls ─────────────────────────────────────────────────────────────────

/** Returns all raw blocks (or filtered by level: JR | SO | SR). */
export async function getBlocks(level?: string): Promise<Block[]> {
    const qs = level ? `?level=${encodeURIComponent(level)}` : '';
    const raw = await apiFetch<RawBlock[]>(`/api/scheduling/blocks${qs}`);
    return raw.map(normaliseRawBlock);
}

/** Returns a single block by its ID (e.g. "CS-JR-1A"). */
export async function getBlock(blockId: string): Promise<Block> {
    const raw = await apiFetch<RawBlock>(`/api/scheduling/blocks/${encodeURIComponent(blockId)}`);
    return normaliseRawBlock(raw);
}

/** Returns all unique course names for the given level. */
export async function getCourseNames(level?: string): Promise<string[]> {
    const qs = level ? `?level=${encodeURIComponent(level)}` : '';
    return apiFetch<string[]>(`/api/scheduling/courses${qs}`);
}

/** Returns all unique instructor names for the given level. */
export async function getInstructors(level?: string): Promise<string[]> {
    const qs = level ? `?level=${encodeURIComponent(level)}` : '';
    return apiFetch<string[]>(`/api/scheduling/instructors${qs}`);
}

/** Runs the backend recommender and returns ranked blocks. */
export async function getRecommendations(
    prefs: SchedulePreferences,
    desiredCourseNames: string[],
    topN: number = 5,
    matchCoursesOnly: boolean = false,
): Promise<RecommendationResult[]> {
    const body = {
        Preferences: {
            Level: prefs.level,
            PreferredDays: prefs.preferredDays,
            NumPreferredDays: prefs.numPreferredDays,
            DayMode: prefs.dayMode,
            MaxDaysPerWeek: prefs.maxDaysPerWeek,
            MaxGapHours: prefs.maxGapHours,
            EarliestTime: prefs.earliestTime,
            LatestTime: prefs.latestTime,
            PreferredInstructors: prefs.preferredInstructors,
            ScheduleType: prefs.scheduleType,
        },
        DesiredCourseNames: desiredCourseNames,
        TopN: topN,
        MatchCoursesOnly: matchCoursesOnly,
    };

    const raw = await apiFetch<ApiRecommendation[]>('/api/scheduling/recommend', {
        method: 'POST',
        body: JSON.stringify(body),
    });
    return raw.map(normaliseRecommendation);
}

export const schedulingApi = {
    getBlocks,
    getBlock,
    getCourseNames,
    getInstructors,
    getRecommendations,
};
