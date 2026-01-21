export interface Job {
    id: string;
    title: string;
    companyName: string;
    location: string;
    description: string;
    salaryMin?: number;
    salaryMax?: number;
    redirectUrl: string;
    created: string;
    category: string;
    contractTime?: string;
    workType?: string;
}


export interface JobSearchParams {
    what?: string;
    where?: string;
}

import { API_ENDPOINTS } from '../config/api';


export const fetchJobs = async (params?: JobSearchParams): Promise<Job[]> => {
    // Build query string from parameters
    const queryParams = new URLSearchParams();
    if (params?.what) queryParams.append('what', params.what);
    if (params?.where) queryParams.append('where', params.where);
    queryParams.append('limit', '100'); // Increase limit to try and exceed 75

    const queryString = queryParams.toString();
    const url = `${API_ENDPOINTS.JOBS}${queryString ? `?${queryString}` : ''}`;


    const response = await fetch(url);

    if (!response.ok) {
        const errorMessage = `Failed to fetch jobs (Status: ${response.status})`;
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
};
