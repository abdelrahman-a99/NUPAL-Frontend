'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterSidebarProps {
    onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
    employmentTypes: string[];
    workTypes: string[];
    companies: string[];
    categories: string[];
}

interface FilterSidebarProps {
    onFilterChange: (filters: FilterState) => void;
    topCompanies?: string[];
}

export function FilterSidebar({ onFilterChange, topCompanies = [] }: FilterSidebarProps) {
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
        'Work Type': true,
        'Type of Employment': true,
        'Categories': false,
        'Top Companies': true,
    });

    const [selectedFilters, setSelectedFilters] = useState<FilterState>({
        employmentTypes: [],
        workTypes: [],
        companies: [],
        categories: [],
    });

    // Call onFilterChange whenever selectedFilters changes
    useEffect(() => {
        onFilterChange(selectedFilters);
    }, [selectedFilters, onFilterChange]);

    const toggleSection = (title: string) => {
        setOpenSections(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    const handleCheckboxChange = (filterType: 'employmentTypes' | 'categories' | 'companies' | 'workTypes', value: string, checked: boolean) => {
        setSelectedFilters(prev => {
            const newFilters = { ...prev };
            if (checked) {
                newFilters[filterType] = [...newFilters[filterType], value];
            } else {
                newFilters[filterType] = newFilters[filterType].filter(v => v !== value);
            }
            return newFilters;
        });
    };

    return (
        <div className="w-64 flex-shrink-0 space-y-6">
            {/* Work Type Filter */}
            <div className="border-b border-slate-200 pb-4">
                <button
                    onClick={() => toggleSection('Work Type')}
                    className="flex w-full items-center justify-between text-left font-semibold text-slate-900"
                >
                    Work Type
                    <ChevronDown className={`h-5 w-5 transition-transform ${openSections['Work Type'] ? 'rotate-180' : ''}`} />
                </button>
                {openSections['Work Type'] && (
                    <div className="mt-3 space-y-2">
                        {['on-site', 'Remote', 'Hybrid'].map((option) => (
                            <label key={option} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedFilters.workTypes.includes(option.toLowerCase())}
                                    onChange={(e) => handleCheckboxChange('workTypes', option.toLowerCase(), e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-blue-400 focus:ring-blue-400"
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Employment Type Filter */}
            <div className="border-b border-slate-200 pb-4">
                <button
                    onClick={() => toggleSection('Type of Employment')}
                    className="flex w-full items-center justify-between text-left font-semibold text-slate-900"
                >
                    Employment Type
                    <ChevronDown className={`h-5 w-5 transition-transform ${openSections['Type of Employment'] ? 'rotate-180' : ''}`} />
                </button>
                {openSections['Type of Employment'] && (
                    <div className="mt-3 space-y-2">
                        {['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'].map((option) => (
                            <label key={option} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedFilters.employmentTypes.includes(option)}
                                    onChange={(e) => handleCheckboxChange('employmentTypes', option, e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-blue-400 focus:ring-blue-400"
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Top Companies Filter */}
            {topCompanies.length > 0 && (
                <div className="border-b border-slate-200 pb-4">
                    <button
                        onClick={() => toggleSection('Top Companies')}
                        className="flex w-full items-center justify-between text-left font-semibold text-slate-900"
                    >
                        Top Companies
                        <ChevronDown className={`h-5 w-5 transition-transform ${openSections['Top Companies'] ? 'rotate-180' : ''}`} />
                    </button>
                    {openSections['Top Companies'] && (
                        <div className="mt-3 space-y-2">
                            {topCompanies.map((company) => (
                                <label key={company} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedFilters.companies.includes(company)}
                                        onChange={(e) => handleCheckboxChange('companies', company, e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-blue-400 focus:ring-blue-400"
                                    />
                                    {company}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Categories Filter */}
            <div className="border-b border-slate-200 pb-4">
                <button
                    onClick={() => toggleSection('Categories')}
                    className="flex w-full items-center justify-between text-left font-semibold text-slate-900"
                >
                    Categories
                    <ChevronDown className={`h-5 w-5 transition-transform ${openSections['Categories'] ? 'rotate-180' : ''}`} />
                </button>
                {openSections['Categories'] && (
                    <div className="mt-3 space-y-2">
                        {['Design', 'Marketing', 'Development', 'Sales', 'Customer Service', 'Engineering'].map((option) => (
                            <label key={option} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedFilters.categories.includes(option)}
                                    onChange={(e) => handleCheckboxChange('categories', option, e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-blue-400 focus:ring-blue-400"
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}
