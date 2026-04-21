'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    CalendarDays, Layers, Sparkles, List, Calendar as CalendarIcon,
    ShoppingCart, Search, Check, ChevronLeft, ChevronRight,
    Eye, Database, BookOpen, Users, Clock, Loader2, Info, UserCheck, Compass, Library,
    Minus, Plus, ArrowRight, RotateCcw
} from 'lucide-react';
import { getToken, parseJwt, removeToken } from '@/lib/auth';
import { MY_SCHEDULE_COURSES } from '@/data/schedulingData';
import { Block, CourseSession, DayOfWeek, SchedulePreferences, RecommendationResult } from '@/types/scheduling';
import { schedulingApi } from '@/services/schedulingApi';
import { getEligibleCoursesForStudent, getStudentLevel } from '@/utils/eligibilityEngine';
import { GENERAL_TRACK_COMPLETE } from '@/data/general-track-complete';
import { BIGDATA_TRACK_COMPLETE } from '@/data/bigdata-track-complete';
import { MEDIA_TRACK_COMPLETE } from '@/data/media-track-complete';
import SchedulingHeader from '@/components/scheduling/SchedulingHeader';
import MyScheduleTab from '@/components/scheduling/MyScheduleTab';
import BlocksExplorerTab from '@/components/scheduling/BlocksExplorerTab';
import ScheduleAssistantTab from '@/components/scheduling/ScheduleAssistantTab';
import SchedulePreviewModal from '@/components/scheduling/SchedulePreviewModal';

// Helper for robust, general course name matching
const normalizeCourseName = (s: string) => 
    (s || '')
        .toLowerCase()
        .replace(/\b(and|&|of|the|in|with|to|concepts?|concept)\b/g, '') // Remove stopwords
        .replace(/[^a-z0-9]/g, ''); // Remove all non-alphanumeric

// Robust registry for all known courses from tracks
interface CourseEntry {
    name: string;   // Full human name (e.g. "Design & Analysis of Algorithms")
    code: string;   // Academic code (e.g. "CSCI 208")
    trackId: string; // Internal track ID (e.g. "CSCI208")
}

const COURSE_REGISTRY: CourseEntry[] = [];

[...GENERAL_TRACK_COMPLETE.nodes, ...BIGDATA_TRACK_COMPLETE.nodes, ...MEDIA_TRACK_COMPLETE.nodes].forEach(n => {
    if (n.id && n.label) {
        const parts = n.label.split('\n');
        if (parts.length > 1) {
            COURSE_REGISTRY.push({
                code: parts[0].trim(),
                name: parts.slice(1).join(' ').trim(),
                trackId: n.id
            });
        } else {
            COURSE_REGISTRY.push({
                code: n.id.match(/[A-Z]{2,4}\s?\d{3}/) ? n.id : '',
                name: n.label,
                trackId: n.id
            });
        }
    }
});

// Manual overrides for courses with metadata inconsistencies
const MANUAL_OVERRIDES: CourseEntry[] = [
    { name: 'Data Mining and Analytics', code: 'CSCI 467', trackId: '' },
    { name: 'Data Preparation and Visualization', code: 'CSCI 467', trackId: '' },
    { name: 'Software Engineering', code: 'CSCI 313', trackId: '' },
    { name: 'Machine Intelligence', code: 'CSCI 417', trackId: '' },
];
COURSE_REGISTRY.push(...MANUAL_OVERRIDES);

/**
 * Shared similarity logic for course matching
 */
const isSimilarCourse = (s1: string, s2: string) => {
    if (!s1 || !s2) return false;
    
    const getWords = (s: string) => 
        s.toLowerCase()
         .replace(/\b(and|&|of|the|in|with|to|concepts?|concept|computer|com)\b/g, ' ')
         .split(/[^a-z0-9]/)
         .filter(w => w.length >= 4 || /^(i|ii|iii|iv|v|vi|vii|viii|ix|x)$/i.test(w));

    const words1 = getWords(s1);
    const words2 = getWords(s2);

    if (words1.length === 0 || words2.length === 0) {
        const n1 = s1.toLowerCase().replace(/[^a-z0-9]/g, '');
        const n2 = s2.toLowerCase().replace(/[^a-z0-9]/g, '');
        return n1.length > 2 && (n1.includes(n2) || n2.includes(n1));
    }

    const [short, long] = words1.length <= words2.length ? [words1, words2] : [words2, words1];
    const matchCount = short.filter(w => long.includes(w)).length;
    
    // Strict level check: If Roman numerals exist, they MUST match exactly
    const isRom = (w: string) => /^(i|ii|iii|iv|v|vi|vii|viii|ix|x)$/i.test(w);
    const r1 = words1.find(isRom);
    const r2 = words2.find(isRom);
    if (r1 !== r2) return false;

    // Match if at least 2 significant words overlap, or all words overlap if less than 2
    return matchCount >= Math.min(short.length, 2);
};

/**
 * General fuzzy matcher to find a course name from various input formats
 */
function findBestCourseMatch(input: string, catalogue: string[] = []): string {
    if (!input) return input;
    
    // 1. Search in Registry
    const match = COURSE_REGISTRY.find(e => 
        e.name.toLowerCase() === input.toLowerCase() || 
        e.trackId.toLowerCase() === input.toLowerCase().replace(/[^a-z0-9]/g, '') ||
        isSimilarCourse(e.name, input)
    );
    if (match) return match.name;

    // 2. Search in current semester catalogue
    const catalogueMatch = catalogue.find(name => isSimilarCourse(name, input));
    return catalogueMatch || input;
}

/**
 * General fuzzy matcher to find a course code from a course name or ID
 */
function findBestCourseCode(name: string, fallback: string): string {
    if (!name && !fallback) return fallback;
    
    const match = COURSE_REGISTRY.find(e => 
        (name && isSimilarCourse(e.name, name)) || 
        (fallback && isSimilarCourse(e.name, fallback)) ||
        (fallback && e.trackId.toLowerCase() === fallback.toLowerCase().replace(/[^a-z0-9]/g, ''))
    );

    return match ? match.code : fallback;
}

type Tab = 'my' | 'blocks' | 'smart';

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }> }[] = [
    { id: 'my', label: 'My Schedule', icon: CalendarDays },
    { id: 'blocks', label: 'Blocks Explorer', icon: Layers },
    { id: 'smart', label: 'Schedule Assistant', icon: Sparkles },
];

const DAYS: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'];
const LEVELS: { id: 'FR' | 'JR' | 'SO' | 'SR' | 'ALL'; label: string; desc: string }[] = [
    { id: 'FR', label: 'Freshman', desc: 'Level 1 (1st year)' },
    { id: 'SO', label: 'Sophomore', desc: 'Level 2 (2nd year)' },
    { id: 'JR', label: 'Junior', desc: 'Level 3 (3rd year)' },
    { id: 'SR', label: 'Senior', desc: 'Level 4 (4th year)' },
    { id: 'ALL', label: 'All Levels', desc: 'Search all block levels' },
];

const DEFAULT_PREFS: SchedulePreferences = {
    level: 'ALL',
    preferredDays: [],
    numPreferredDays: 6,
    dayMode: 'count',
    maxDaysPerWeek: 6,
    maxGapHours: 6,
    earliestTime: '08:30',
    latestTime: '18:30',
    preferredInstructors: [],
    scheduleType: 'balanced',
};

export default function SchedulingPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('my');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [availableBlocks, setAvailableBlocks] = useState<Block[]>([]);
    const [blocksLoading, setBlocksLoading] = useState(false);
    const [blockQuery, setBlockQuery] = useState('');
    const [blockLevelTab, setBlockLevelTab] = useState<'FR' | 'JR' | 'SO' | 'SR' | 'ALL'>('ALL');
    const [blockCurrentPage, setBlockCurrentPage] = useState(1);
    const BLOCKS_PER_PAGE = 9;

    const filteredBlocks = useMemo(() => {
        const q = blockQuery.toLowerCase().trim();
        let list = availableBlocks;

        // Reset page when filters change
        // (This is handled by a separate useEffect below to avoid side-effects in useMemo)

        // 1. Filter by Level Tab
        if (blockLevelTab !== 'ALL') {
            list = list.filter(b => {
                const id = b.blockId.toUpperCase();
                const pattern = new RegExp(`(^|[-_ ])${blockLevelTab}([-_ ]|$)`);
                return pattern.test(id);
            });
        }

        // 2. Filter by Search Query
        if (!q) return list;
        return list.filter((b: Block) =>
            b.blockId.toLowerCase().includes(q) ||
            b.courses.some((c: CourseSession) => c.courseName.toLowerCase().includes(q))
        );
    }, [blockQuery, availableBlocks, blockLevelTab]);

    const paginatedBlocks = useMemo(() => {
        const start = (blockCurrentPage - 1) * BLOCKS_PER_PAGE;
        return filteredBlocks.slice(start, start + BLOCKS_PER_PAGE);
    }, [filteredBlocks, blockCurrentPage]);

    const totalBlockPages = Math.ceil(filteredBlocks.length / BLOCKS_PER_PAGE);

    // Reset pagination on filter change
    useEffect(() => {
        setBlockCurrentPage(1);
    }, [blockLevelTab, blockQuery]);

    
    const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
    const [useMyData, setUseMyData] = useState<boolean | null>(null);
    const [query, setQuery] = useState('');
    const [instrQuery, setInstrQuery] = useState('');
    const [manualSelectedNames, setManualSelectedNames] = useState<string[]>([]);
    const [advisorSelectedNames, setAdvisorSelectedNames] = useState<string[]>([]);
    const [prefs, setPrefs] = useState<SchedulePreferences>(DEFAULT_PREFS);
    const [results, setResults] = useState<RecommendationResult[]>([]);
    const [computing, setComputing] = useState(false);
    const [previewBlock, setPreviewBlock] = useState<CourseSession[] | null>(null);
    const [previewCourse, setPreviewCourse] = useState<CourseSession | null>(null);
    const [rlRecommendedNames, setRlRecommendedNames] = useState<string[]>([]);
    const [rlLoading, setRlLoading] = useState(false);
    const [allCourseNames, setAllCourseNames] = useState<string[]>([]);
    const [allInstructors, setAllInstructors] = useState<string[]>([]);
    const [studentData, setStudentData] = useState<any>(null);
    const [lastConfig, setLastConfig] = useState<string | null>(null);
    const [appliedCourses, setAppliedCourses] = useState<string[]>([]);

    const isDirty = useMemo(() => {
        if (!results.length || !lastConfig) return false;
        const current = JSON.stringify({ prefs, manualSelectedNames, advisorSelectedNames, useMyData });
        return lastConfig !== current;
    }, [results.length, lastConfig, prefs, manualSelectedNames, advisorSelectedNames, useMyData]);

    const prefsAreDefault = useMemo(
        () =>
            prefs.preferredDays.length === 0 &&
            prefs.numPreferredDays === DEFAULT_PREFS.numPreferredDays &&
            prefs.maxDaysPerWeek === DEFAULT_PREFS.maxDaysPerWeek &&
            prefs.maxGapHours === DEFAULT_PREFS.maxGapHours &&
            prefs.earliestTime === DEFAULT_PREFS.earliestTime &&
            prefs.latestTime === DEFAULT_PREFS.latestTime &&
            prefs.preferredInstructors.length === 0 &&
            prefs.scheduleType === DEFAULT_PREFS.scheduleType,
        [prefs]
    );

    // Note: results filtering is handled inside the ScheduleAssistantTab UI.

    // Load Student Profile & RL Recommendation
    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const token = getToken();
                if (!token) return;
                const user = parseJwt(token);
                if (!user || !user.email) return;
                const { getStudentByEmail } = await import('@/services/studentService');
                const data = await getStudentByEmail(user.email);
                if (data) {
                    setStudentData(data);

                    // Fetch RL recommendation
                    setRlLoading(true);
                    try {
                        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5009';
                        const url = `${baseUrl}/api/students/${data.account.id}/rl-recommendation`;
                        console.log('[DEBUG] Fetching RL Recommendation from:', url);

                        const res = await fetch(url, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });

                        if (res.ok) {
                            const rlRaw = await res.json();
                            console.log('[DEBUG] RL Data Fetched:', rlRaw);

                            if (rlRaw.courses && Array.isArray(rlRaw.courses)) {
                                // Translate from RL ID (which blocks don't possess) to Human Name (which Blocks do possess)
                                // Using general fuzzy matcher to handle internal IDs like 'DESIGN_AND_A'
                                const mappedCourses = rlRaw.courses.map((cId: string) => 
                                    findBestCourseMatch(cId, allCourseNames)
                                );

                                setRlRecommendedNames(mappedCourses);
                                // Only auto-switch to "My Data" if we actually found courses
                                if (mappedCourses.length > 0) {
                                    setUseMyData(true);
                                }
                            }
                        } else {
                            console.warn('[DEBUG] RL Fetch response not OK:', res.status, await res.text());
                        }
                    } catch (e) {
                        console.error('[DEBUG] RL Fetch Exception:', e);
                    } finally {
                        setRlLoading(false);
                    }
                }
            } catch (err) {
                console.error('Failed to load student data:', err);
            }
        };
        fetchStudentData();
    }, []);

    // Load blocks when Blocks Explorer tab is opened
    const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

    useEffect(() => {
        if (activeTab === 'blocks' && availableBlocks.length === 0 && !blocksLoading && !hasAttemptedFetch) {
            setBlocksLoading(true);
            setHasAttemptedFetch(true);
            schedulingApi.getBlocks()
                .then(blocks => {
                    // Decorate blocks: Replace internal IDs with academic codes where possible
                    const decoratedBlocks = blocks.map(b => ({
                        ...b,
                        courses: b.courses.map(c => ({
                            ...c,
                            courseId: findBestCourseCode(c.courseName, c.courseId)
                        }))
                    }));
                    setAvailableBlocks(decoratedBlocks);
                })
                .catch(e => console.warn('Failed to load blocks:', e))
                .finally(() => setBlocksLoading(false));
        }
    }, [activeTab]);

    // Reload course names & instructors when level changes
    useEffect(() => {
        const lvl = prefs.level || undefined;
        Promise.all([
            schedulingApi.getCourseNames(lvl),
            schedulingApi.getInstructors(lvl),
        ])
            .then(([names, instructors]) => {
                setAllCourseNames(names);
                setAllInstructors(Array.from(new Set(instructors)));
            })
            .catch(e => console.warn('Failed to load course metadata:', e));
    }, [prefs.level]);

    // Auto-update Level if My Data is selected
    useEffect(() => {
        if (useMyData) {
            // Unrestrict the level boundary to search all blocks globally 
            // when Auto-Recommend is chosen.
            setPrefs(p => ({ ...p, level: 'ALL' }));
        }
    }, [useMyData]);

    const eligibleCourses = useMemo(() => {
        if (!studentData?.education?.semesters) return [];
        const passedCourses = studentData.education.semesters.flatMap((s: any) => s.courses);
        const mapped = passedCourses.map((c: any) => ({
            CourseId: c.courseId,
            CourseName: c.courseName,
            Grade: c.grade,
            Credit: c.credit
        }));
        return getEligibleCoursesForStudent(mapped, 'general');
    }, [studentData]);

    const displayCoursesByCategory = useMemo(() => {
        const q = query.toLowerCase().trim();
        if (!useMyData) {
            // Flat list
            const pool = allCourseNames;
            const filtered = q ? pool.filter(n => n.toLowerCase().includes(q)) : pool;
            return { 'Catalogue': filtered };
        }

        // Categorized list of eligible courses
        const grouped: Record<string, string[]> = {};

        // 1. Add recommendations if they exist
        if (rlRecommendedNames.length > 0) {
            grouped['Recommended for You'] = [...rlRecommendedNames];
        }

        // 2. Add other eligible courses
        const rlNamesSet = new Set(rlRecommendedNames.map(n => n.toLowerCase()));
        for (const item of eligibleCourses) {
            if (q && !item.courseName.toLowerCase().includes(q)) continue;
            if (rlNamesSet.has(item.courseName.toLowerCase())) continue; // Avoid duplicates

            const cat = item.category || 'Core';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(item.courseName);
        }
        return grouped;
    }, [useMyData, eligibleCourses, allCourseNames, query]);
    const displayInstructors = useMemo(() => {
        const q = instrQuery.toLowerCase().trim();
        const base = Array.from(new Set(allInstructors));
        return q ? base.filter((i: string) => i.toLowerCase().includes(q)) : base;
    }, [allInstructors, instrQuery]);


    const toggleCourseName = (name: string) => {
        if (useMyData) {
            setAdvisorSelectedNames(p => p.includes(name) ? p.filter(x => x !== name) : [...p, name]);
        } else {
            setManualSelectedNames(p => p.includes(name) ? p.filter(x => x !== name) : [...p, name]);
        }
    };
    const toggleDay = (d: DayOfWeek) =>
        setPrefs(p => ({
            ...p,
            preferredDays: p.preferredDays.includes(d)
                ? p.preferredDays.filter(x => x !== d)
                : [...p.preferredDays, d],
        }));
    const toggleInstructor = (i: string) =>
        setPrefs(p => ({
            ...p,
            preferredInstructors: p.preferredInstructors.includes(i)
                ? p.preferredInstructors.filter(x => x !== i)
                : [...p.preferredInstructors, i],
        }));

    const handleGetRecommendations = useCallback(async (matchCoursesOnly: boolean = false) => {
        setComputing(true);
        try {
            const coursesToUse = useMyData ? advisorSelectedNames : manualSelectedNames;
            const canonicalKey = (s: string) =>
                s
                    .toLowerCase()
                    .replace(/[\u2010-\u2015]/g, '-') // normalize hyphens
                    .replace(/\s+and\s+/g, ' & ') // normalize 'and' to '&'
                    .replace(/\s+/g, ' ')
                    .trim()
                    .replace(/^[a-z]{2,4}\s*\d{3}\s*[-:]\s*/i, '') // drop code prefix like "CSCI 313 - "
                    .replace(/\s*\([^)]*\)\s*/g, ' ')
                    .replace(/\s+/g, ' ')
                    .split('-')[0]
                    .trim();
            const normalizeName = (s: string) =>
                s
                    .toLowerCase()
                    .replace(/\s+/g, ' ')
                    .replace(/[\u2010-\u2015]/g, '-') // normalize hyphens
                    .trim();

            // Map selected names (especially from Sync/MyData) to the backend's exact catalogue names.
            // Using fuzzy matching to bridge the gap between track names and catalogue names.
            const coursesAlignedToCatalogue = coursesToUse.map(n => {
                const match = allCourseNames.find(catName => isSimilarCourse(catName, n));
                return match || n;
            });
            const expandCourseNameVariants = (name: string) => {
                const n = name.trim();
                const baseNoParens = n.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
                const baseNoDash = baseNoParens.split('-')[0].trim();
                const swappedAnd = n.includes('&') ? n.replaceAll('&', 'and') : n;
                const swappedAmp = n.toLowerCase().includes(' and ') ? n.replaceAll(' and ', ' & ') : n;

                const variants = [
                    n,
                    baseNoParens,
                    baseNoDash,
                    swappedAnd,
                    swappedAmp,
                    normalizeName(n),
                    normalizeName(baseNoParens),
                    normalizeName(baseNoDash),
                    normalizeName(swappedAnd),
                    normalizeName(swappedAmp),
                ];

                const code = findBestCourseCode(n, '');
                if (code && code !== n) {
                    variants.push(code, normalizeName(code));
                }

                return Array.from(new Set(variants.filter(Boolean)));
            };
            const coursesToSend = Array.from(new Set(coursesAlignedToCatalogue.flatMap(expandCourseNameVariants)));

            // Auto-detect: if the user hasn't modified any preferences from defaults,
            // use matchCoursesOnly=true to focus purely on course content matching.
            const prefsAreDefault =
                prefs.preferredDays.length === 0 &&
                prefs.numPreferredDays === DEFAULT_PREFS.numPreferredDays &&
                prefs.maxDaysPerWeek === DEFAULT_PREFS.maxDaysPerWeek &&
                prefs.maxGapHours === DEFAULT_PREFS.maxGapHours &&
                prefs.earliestTime === DEFAULT_PREFS.earliestTime &&
                prefs.latestTime === DEFAULT_PREFS.latestTime &&
                prefs.preferredInstructors.length === 0 &&
                prefs.scheduleType === DEFAULT_PREFS.scheduleType;

            const shouldMatchCoursesOnly = matchCoursesOnly || prefsAreDefault;
            const res = await schedulingApi.getRecommendations(prefs, coursesToSend, 5, shouldMatchCoursesOnly);

            // Decorate results: Replace internal IDs with academic codes where possible
            const decoratedResults = res.map(r => ({
                ...r,
                block: {
                    ...r.block,
                    courses: r.block.courses.map(c => ({
                        ...c,
                        courseId: findBestCourseCode(c.courseName, c.courseId)
                    }))
                }
            }));

            setResults(decoratedResults);
            setAppliedCourses(coursesAlignedToCatalogue);
            setLastConfig(JSON.stringify({ prefs, manualSelectedNames, advisorSelectedNames, useMyData }));
        } catch (e) {
            console.warn('Recommender error:', e);
            setResults([]);
        } finally {
            setComputing(false);
        }
    }, [prefs, manualSelectedNames, advisorSelectedNames, useMyData]);

    const handleReset = () => {
        setUseMyData(null);
        setManualSelectedNames([]);
        setAdvisorSelectedNames([]);
        setAppliedCourses([]);
        setPrefs(p => ({ ...p, ...DEFAULT_PREFS }));
        setResults([]);
        setLastConfig(null);
        setQuery('');
        setInstrQuery('');
    };

    const scoreColor = (score: number) =>
        score >= 70 ? '#10b981' : score >= 45 ? '#f59e0b' : '#ef4444';

    const canAdvanceStep0 = useMyData !== null;

    return (
        <div className="min-h-screen bg-slate-50">
            <SchedulingHeader activeTab={activeTab} setActiveTab={setActiveTab} TABS={TABS} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                {activeTab === 'my' && (
                    <MyScheduleTab viewMode={viewMode} setViewMode={setViewMode} />
                )}

                {activeTab === 'blocks' && (
                    <BlocksExplorerTab
                        filteredBlocks={filteredBlocks}
                        paginatedBlocks={paginatedBlocks}
                        blocksLoading={blocksLoading}
                        blockLevelTab={blockLevelTab}
                        setBlockLevelTab={setBlockLevelTab}
                        blockQuery={blockQuery}
                        setBlockQuery={setBlockQuery}
                        totalBlockPages={totalBlockPages}
                        blockCurrentPage={blockCurrentPage}
                        setBlockCurrentPage={setBlockCurrentPage}
                    />
                )}

                {activeTab === 'smart' && (
                    <ScheduleAssistantTab
                        useMyData={useMyData}
                        setUseMyData={setUseMyData}
                        LEVELS={LEVELS}
                        prefs={prefs}
                        setPrefs={setPrefs}
                        query={query}
                        setQuery={setQuery}
                        instrQuery={instrQuery}
                        setInstrQuery={setInstrQuery}
                        displayCoursesByCategory={displayCoursesByCategory}
                        advisorSelectedNames={advisorSelectedNames}
                        setAdvisorSelectedNames={setAdvisorSelectedNames}
                        manualSelectedNames={manualSelectedNames}
                        rlRecommendedNames={rlRecommendedNames}
                        toggleCourseName={toggleCourseName}
                        displayInstructors={displayInstructors}
                        toggleInstructor={toggleInstructor}
                        toggleDay={toggleDay}
                        DAYS={DAYS}
                        computing={computing}
                        results={results}
                        appliedCourses={appliedCourses}
                        isDirty={isDirty}
                        handleReset={handleReset}
                        handleGetRecommendations={handleGetRecommendations}
                        setPreviewBlock={setPreviewBlock}
                        prefsAreDefault={prefsAreDefault}
                    />
                )}
                <SchedulePreviewModal
                    previewBlock={previewBlock}
                    setPreviewBlock={setPreviewBlock}
                    previewCourse={previewCourse}
                    setPreviewCourse={setPreviewCourse}
                />
            </div>

        </div>
    );
}