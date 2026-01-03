export interface CareerPath {
    id: string;
    title: string;
    icon: string;
    description: string;
    roleReality: string[];
    marketDemand: 'Very High' | 'High' | 'Moderate';
    salaryRange: string;
    requiredSkills: {
        name: string;
        level: number; // 0-100 required proficiency
        category: string;
        importance: 'Critical' | 'Important' | 'Bonus';
    }[];
    learningPath: string[];
    roadmapUrl?: string;
}

export const careerPaths: CareerPath[] = [
    {
        id: 'software-engineer',
        title: 'Software Engineer',
        icon: 'Code',
        description: 'Build robust, scalable applications and systems that power the modern world.',
        roleReality: [
            'Design and implement software solutions',
            'Write clean, maintainable code',
            'Collaborate with cross-functional teams',
            'Debug and optimize legacy systems'
        ],
        marketDemand: 'Very High',
        salaryRange: '$80k - $160k',
        requiredSkills: [
            { name: 'Python', level: 90, category: 'Programming', importance: 'Critical' },
            { name: 'JavaScript/TypeScript', level: 85, category: 'Frontend', importance: 'Critical' },
            { name: 'Data Structures', level: 90, category: 'CS Fundamentals', importance: 'Critical' },
            { name: 'SQL', level: 80, category: 'Database', importance: 'Important' },
            // { name: 'React', level: 75, category: 'Frontend', importance: 'Important' },
            { name: 'Git', level: 85, category: 'Tools', importance: 'Critical' }
        ],
        learningPath: [
            'Master core algorithms and data structures',
            'Build full-stack project with React & Node',
            'Learn system design principles'
        ],
        roadmapUrl: 'https://roadmap.sh/software-architect'
    },
    {
        id: 'ai-engineer',
        title: 'AI Engineer',
        icon: 'Brain',
        description: 'Develop intelligent systems that can learn and adapt using state-of-the-art models.',
        roleReality: [
            'Train and fine-tune machine learning models',
            'Build RAG pipelines and LLM applications',
            'Optimize model performance and inference',
            'Clean and process large datasets'
        ],
        marketDemand: 'Very High',
        salaryRange: '$100k - $180k',
        requiredSkills: [
            { name: 'Python', level: 95, category: 'Programming', importance: 'Critical' },
            { name: 'Machine Learning', level: 90, category: 'AI/ML', importance: 'Critical' },
            { name: 'Deep Learning', level: 85, category: 'AI/ML', importance: 'Critical' },
            // { name: 'PyTorch/TensorFlow', level: 85, category: 'AI/ML', importance: 'Important' },
            { name: 'Data Engineering', level: 75, category: 'Data', importance: 'Important' },
            { name: 'Linear Algebra', level: 80, category: 'Math', importance: 'Important' }
        ],
        learningPath: [
            'Deep dive into Neural Networks',
            'Build an LLM-powered application',
            'Learn MLOps for deployment'
        ],
        roadmapUrl: 'https://roadmap.sh/ai-engineer'
    },
    {
        id: 'data-scientist',
        title: 'Data Scientist',
        icon: 'BarChart',
        description: 'Extract actionable insights from complex data to drive strategic business decisions.',
        roleReality: [
            'Analyze large datasets to find patterns',
            'Create visualizations to communicate findings',
            'Build predictive models',
            'Design A/B tests and experiments'
        ],
        marketDemand: 'High',
        salaryRange: '$90k - $170k',
        requiredSkills: [
            { name: 'Python', level: 90, category: 'Programming', importance: 'Critical' },
            { name: 'Statistics', level: 90, category: 'Math', importance: 'Critical' },
            { name: 'SQL', level: 95, category: 'Database', importance: 'Critical' },
            { name: 'Data Visualization', level: 85, category: 'Data', importance: 'Important' },
            { name: 'Machine Learning', level: 75, category: 'AI/ML', importance: 'Important' }
        ],
        learningPath: [
            'Master Statistical Analysis',
            'Learn Advanced SQL & dbt',
            'Create a predictive modeling portfolio'
        ],
        roadmapUrl: 'https://roadmap.sh/ai-data-scientist'
    },
    {
        id: 'cloud-engineer',
        title: 'Cloud Engineer',
        icon: 'Cloud',
        description: 'Design and manage scalable cloud infrastructure for modern applications.',
        roleReality: [
            'Architect cloud-native solutions',
            'Manage CI/CD pipelines',
            'Ensure security and compliance',
            'Optimize cloud costs and performance'
        ],
        marketDemand: 'High',
        salaryRange: '$95k - $175k',
        requiredSkills: [
            { name: 'AWS/Azure', level: 90, category: 'Cloud', importance: 'Critical' },
            { name: 'Docker/Kubernetes', level: 85, category: 'DevOps', importance: 'Critical' },
            { name: 'Terraform', level: 80, category: 'DevOps', importance: 'Important' },
            { name: 'Linux', level: 85, category: 'OS', importance: 'Important' },
            { name: 'Networking', level: 75, category: 'Infrastructure', importance: 'Important' }
        ],
        learningPath: [
            'Get AWS/Azure Certified',
            'Master Docker & Kubernetes',
            'Build Infrastructure as Code projects'
        ],
        roadmapUrl: 'https://www.nextwork.org/roadmaps/cloud-engineer/'
    },
    // {
    //     id: 'cybersecurity',
    //     title: 'Cybersecurity',
    //     icon: 'Shield',
    //     description: 'Protect systems and data from evolving digital threats and vulnerabilities.',
    //     roleReality: [
    //         'Monitor for security breaches',
    //         'Conduct penetration testing',
    //         'Implement security protocols',
    //         'Respond to incidents'
    //     ],
    //     marketDemand: 'Very High',
    //     salaryRange: '$90k - $165k',
    //     requiredSkills: [
    //         { name: 'Network Security', level: 90, category: 'Security', importance: 'Critical' },
    //         { name: 'Ethical Hacking', level: 85, category: 'Security', importance: 'Critical' },
    //         { name: 'Cryptography', level: 80, category: 'Math', importance: 'Important' },
    //         { name: 'Security Tools', level: 85, category: 'Tools', importance: 'Important' },
    //         { name: 'Operating Systems', level: 85, category: 'OS', importance: 'Important' }
    //     ],
    //     learningPath: [
    //         'CompTIA Security+ Certification',
    //         'Practice on HackTheBox',
    //         'Learn Scripting for Security'
    //     ]
    // }
];
