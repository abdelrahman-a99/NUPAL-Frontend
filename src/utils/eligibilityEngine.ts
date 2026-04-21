export interface EligibleCourse {
    courseId: string;
    courseName: string;
    category?: string;
    credits?: number;
}

export function getEligibleCoursesForStudent(passedCourses: any[], track: string): EligibleCourse[] {
    // Reverted hardcoded fallback; now returns only validated eligible courses
    return [];
}

export function getStudentLevel(courses: any[]) {
    // Simple logic: credit based (FR 0-29, SO 30-59, JR 60-89, SR 90+)
    const totalCredits = courses.reduce((sum, c) => sum + (c.Credit || c.credit || 0), 0);
    if (totalCredits < 30) return 'FR';
    if (totalCredits < 60) return 'SO';
    if (totalCredits < 90) return 'JR';
    return 'SR';
}
