'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
    value: string;
    label: string;
}

interface AdminSelectProps {
    value: string;
    options: Option[];
    onChange: (value: string) => void;
    placeholder?: string;
    width?: string;
}

export default function AdminSelect({ value, options, onChange, placeholder, width = '180px' }: AdminSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(o => o.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div 
            ref={containerRef} 
            className="admin-custom-select" 
            style={{ width, position: 'relative', userSelect: 'none' }}
        >
            <div 
                className={`admin-custom-select__trigger ${isOpen ? 'admin-custom-select__trigger--open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{selectedOption ? selectedOption.label : placeholder}</span>
                <ChevronDown size={14} className={`admin-custom-select__arrow ${isOpen ? 'admin-custom-select__arrow--up' : ''}`} />
            </div>

            {isOpen && (
                <div className="admin-custom-select__dropdown">
                    {options.map(option => (
                        <div 
                            key={option.value}
                            className={`admin-custom-select__option ${option.value === value ? 'admin-custom-select__option--selected' : ''}`}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
