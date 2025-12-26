import { getToken } from '../lib/auth';

const API_BASE_URL = 'http://localhost:5009/api';

export interface StudentResponse {
    account: {
        id: string;
        email: string;
        name: string;
    };
    education: {
        totalCredits: number;
        numSemesters: number;
        semesters: Array<{
            term: string;
            optional: boolean;
            courses: Array<{
                courseId: string;
                courseName: string;
                credit: number;
                grade: string;
                gpa: number | null;
            }>;
            semesterCredits: number;
            semesterGpa: number;
            cumulativeGpa: number;
        }>;
    };
}

export async function getStudentByEmail(email: string): Promise<StudentResponse | null> {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_BASE_URL}/students/by-email/${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error(`Failed to fetch student data: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching student data:', error);
        throw error;
    }
}
