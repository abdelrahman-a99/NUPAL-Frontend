'use client';

import { useEffect, useState } from 'react';
import { Job, fetchJobs } from '@/services/jobService';
import { DynamicSkillsProfile, fetchDynamicSkillsProfile } from '@/services/dynamicSkillsService';
import { JobCard } from '@/components/career-hub/JobCard';
import { FilterSidebar, FilterState } from '@/components/career-hub/FilterSidebar';
import { Pagination } from '@/components/career-hub/Pagination';
import { Search, MapPin } from 'lucide-react';
import { BackgroundAnimation } from '@/components/career-hub/BackgroundAnimation';
import { careerPaths } from '@/data/careerData';
import { CareerCategoryBox } from '@/components/career-hub/CareerCategoryBox';
import { CareerPathwaysDisplay } from '@/components/career-hub/CareerPathwaysDisplay';
import Button from '@/components/ui/Button';

export default function CareerHubPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [studentProfile, setStudentProfile] = useState<DynamicSkillsProfile | null>(null);

    // Career Path State
    const [selectedCareerId, setSelectedCareerId] = useState(careerPaths[0].id);
    const selectedCareer = careerPaths.find(c => c.id === selectedCareerId) || careerPaths[0];

    // Search parameters
    const [jobType, setJobType] = useState('');
    const [location, setLocation] = useState('Cairo');

    // Filter state
    const [filters, setFilters] = useState<FilterState>({
        employmentTypes: [],
        workTypes: [],
        categories: [],
        companies: [],
    });
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

    // Derived state for top companies
    const [topCompanies, setTopCompanies] = useState<string[]>([]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 5;

    const loadJobs = async (what?: string, where?: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchJobs({
                what: what || undefined,
                where: where || undefined
            });

            if (data.length === 0) {
                setError('No jobs found for your search criteria. Try different keywords or locations.');
            }
            setJobs(data);

            // Calculate top companies from fetched data
            const companyCounts: { [key: string]: number } = {};
            data.forEach(job => {
                if (job.companyName) {
                    companyCounts[job.companyName] = (companyCounts[job.companyName] || 0) + 1;
                }
            });
            // Get top 5 companies by job count
            const sortedCompanies = Object.entries(companyCounts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([name]) => name);
            setTopCompanies(sortedCompanies);

        } catch (err: any) {
            const errorMessage = err?.message || '';
            if (errorMessage.includes('500') || errorMessage.includes('Failed to fetch')) {
                setError('Unable to fetch jobs from Wuzzuf. Please try again later.');
            } else {
                setError('Failed to load jobs. Please check your internet connection and try again.');
            }
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadJobs();
        loadStudentProfile();
    }, []);

    const loadStudentProfile = async () => {
        console.log('Attempting to load student profile...');
        const profile = await fetchDynamicSkillsProfile();

        if (profile) {
            console.log('Student profile loaded:', profile);
            setStudentProfile(profile);
        } else {
            console.log('No profile loaded, using demo skills');
            // Fallback demo skills for when not logged in
            setStudentProfile({
                name: 'Student',
                skills: [
                    { name: 'Python', level: 85, category: 'Programming' },
                    { name: 'Data Structures', level: 90, category: 'Computer Science' },
                    { name: 'Machine Learning', level: 70, category: 'AI/ML' },
                    { name: 'Web Development', level: 75, category: 'Development' }
                ]
            });
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Only pass location if it's not the default "Cairo" or if user explicitly selected it
        loadJobs(jobType || undefined, location || undefined);
    };

    // Client-side filtering
    useEffect(() => {
        let filtered = jobs;

        // Filter by location (exact match with selected location)
        if (location) {
            filtered = filtered.filter(job =>
                job.location.toLowerCase() === location.toLowerCase()
            );
        }

        // Filter by employment type
        if (filters.employmentTypes.length > 0) {
            filtered = filtered.filter(job => {
                if (!job.contractTime) return false;
                const normalizedJobType = job.contractTime.toLowerCase().replace(/[^a-z0-9]/g, '');
                return filters.employmentTypes.some(type => {
                    const normalizedFilterType = type.toLowerCase().replace(/[^a-z0-9]/g, '');
                    return normalizedJobType.includes(normalizedFilterType);
                });
            });
        }

        // Filter by work type
        if (filters.workTypes.length > 0) {
            filtered = filtered.filter(job =>
                job.workType && filters.workTypes.includes(job.workType.toLowerCase())
            );
        }

        // Filter by companies
        if (filters.companies.length > 0) {
            filtered = filtered.filter(job =>
                job.companyName && filters.companies.includes(job.companyName)
            );
        }



        // Filter by category (based on job title/description)
        if (filters.categories.length > 0) {
            filtered = filtered.filter(job =>
                filters.categories.some(category =>
                    job.title.toLowerCase().includes(category.toLowerCase()) ||
                    job.description.toLowerCase().includes(category.toLowerCase()) ||
                    job.category.toLowerCase().includes(category.toLowerCase())
                )
            );
        }

        setFilteredJobs(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [jobs, filters, location]);

    const handleFilterChange = (newFilters: FilterState) => {
        setFilters(newFilters);
    };

    // Calculate pagination
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    const currentJobs = filteredJobs.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to jobs section instead of top of page
        const jobsSection = document.getElementById('jobs-section');
        if (jobsSection) {
            jobsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleViewJobs = () => {
        setJobType(selectedCareer.title);
        loadJobs(selectedCareer.title, location);
        // Scroll to jobs section
        const jobsSection = document.getElementById('jobs-section');
        if (jobsSection) {
            jobsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top Section: Career Pathways & Skills Gap Analysis */}
            <div className="relative overflow-hidden pb-16 pt-8 bg-slate-50">
                <BackgroundAnimation />

                <div className="relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="text-left mb-8">
                        {/* <h6 className="text-sm font-bold text-slate-500 tracking-wider uppercase mb-2">
                            Read About Career Pathways
                        </h6> */}
                        <h1 className="text-2xl font-bold text-slate-700 sm:text-2xl">
                            Real student results
                        </h1>
                        <div className="mt-2 h-1.5 w-16 bg-blue-500 rounded-full"></div>
                    </div>

                    {/* Dynamic Skills Analysis Display */}
                    <CareerPathwaysDisplay
                        career={selectedCareer}
                        studentProfile={studentProfile}
                        onViewJobs={handleViewJobs}
                    />

                    {/* Career Selection Strip */}
                    <div className="mt-8 mx-auto w-fit bg-white rounded-xl shadow-sm border border-slate-200 flex overflow-hidden divide-x divide-slate-200">
                        {careerPaths.map((career) => (
                            <CareerCategoryBox
                                key={career.id}
                                id={career.id}
                                title={career.title}
                                iconName={career.icon}
                                isSelected={selectedCareerId === career.id}
                                onClick={() => setSelectedCareerId(career.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Section: Header and Search */}
            <div className="relative pb-16 pt-6">
                <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8 z-10">
                    {/* Heading for Job Search */}
                    <h2 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        Find your{' '}
                        <span className="relative inline-block text-blue-500">
                            dream jobs
                            {/* Decorative underline */}
                            <svg
                                className="absolute -bottom-2 left-0 w-full h-3 text-blue-400 opacity-80"
                                viewBox="0 0 100 10"
                                preserveAspectRatio="none"
                            >
                                <path
                                    d="M0 5 Q 50 10 100 5"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                            </svg>
                        </span>
                    </h2>
                    <p className="mt-2 text-lg text-slate-600">
                        Find real opportunities at top companies
                    </p>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="mt-10">
                        <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-lg bg-white p-2 shadow-lg">
                            {/* Job Type Input */}
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Job title or keyword"
                                    value={jobType}
                                    onChange={(e) => setJobType(e.target.value)}
                                    className="w-full rounded-md border-0 bg-transparent py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none"
                                />
                            </div>

                            {/* Divider */}
                            <div className="h-8 w-px bg-slate-200"></div>

                            {/* Location Dropdown */}
                            <div className="relative flex-1">
                                <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                <select
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full appearance-none rounded-md border-0 bg-transparent py-3 pl-12 pr-10 text-slate-900 focus:outline-none"
                                >
                                    <option value="">All</option>
                                    <option value="Cairo">Cairo</option>
                                    <option value="Alexandria">Alexandria</option>
                                    <option value="Giza">Giza</option>
                                </select>
                                {/* Dropdown arrow */}
                                <svg className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            {/* Search Button */}
                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                                disabled={loading}
                                className="px-8 shadow-md"
                            >
                                Search
                            </Button>
                        </div>
                    </form>

                    {/* Popular Searches */}
                    <div className="mt-6 text-sm text-slate-500">
                        <span className="font-medium">Popular:</span>{' '}
                        <Button variant="none" size="none" onClick={() => { setJobType('Software Engineer'); loadJobs('Software Engineer', location); }} className="text-blue-400 hover:underline">Software Engineer</Button>,{' '}
                        <Button variant="none" size="none" onClick={() => { setJobType('AI Engineer'); loadJobs('AI Engineer', location); }} className="text-blue-400 hover:underline">AI Engineer</Button>,{' '}
                        <Button variant="none" size="none" onClick={() => { setJobType('Cloud Engineer'); loadJobs('Cloud Engineer', location); }} className="text-blue-400 hover:underline">Cloud Engineer</Button>,{' '}
                        <Button variant="none" size="none" onClick={() => { setJobType('Data Engineer'); loadJobs('Data Engineer', location); }} className="text-blue-400 hover:underline">Data Engineer</Button>
                    </div>
                </div>
            </div>

            {/* Job Results Section with Sidebar */}
            <div id="jobs-section" className="bg-slate-50 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-8">
                        {/* Left Sidebar - Filters */}
                        <FilterSidebar onFilterChange={handleFilterChange} topCompanies={topCompanies} />

                        {/* Right Side - Job Results */}
                        <div className="flex-1">
                            {/* Results Header */}
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-900">All Jobs</h2>
                                <p className="mt-1 text-sm text-slate-600">
                                    Showing {filteredJobs.length} result{filteredJobs.length !== 1 ? 's' : ''}
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}

                            {/* Loading State */}
                            {loading && (
                                <div className="flex items-center justify-center py-20">
                                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-400 border-t-transparent"></div>
                                </div>
                            )}

                            {/* Job Cards */}
                            {!loading && currentJobs.length > 0 && (
                                <>
                                    <div className="space-y-4">
                                        {currentJobs.map((job) => (
                                            <JobCard key={job.id} job={job} />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={handlePageChange}
                                        />
                                    )}
                                </>
                            )}

                            {/* Empty State */}
                            {!loading && filteredJobs.length === 0 && !error && (
                                <div className="rounded-lg border-2 border-dashed border-slate-300 bg-white p-12 text-center">
                                    <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                                        <Search className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold text-slate-900">No jobs found</h3>
                                    <p className="mt-2 text-sm text-slate-600">
                                        Try adjusting your search criteria or filters.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
