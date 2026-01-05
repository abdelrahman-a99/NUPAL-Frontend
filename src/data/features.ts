export interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
  path: string;
}

export const features: Feature[] = [
  {
    id: 1,
    title: 'AI-Powered Recommendations',
    description: 'Get personalized course suggestions based on your academic history and career goals.',
    icon: '🤖',
    path: '/chat',
  },
  {
    id: 2,
    title: 'Semester Planning',
    description: 'Plan your entire semester with ease and optimize your course schedule.',
    icon: '📅',
    path: '/dashboard',
  },
  {
    id: 3,
    title: 'Progress Tracking',
    description: 'Monitor your academic progress with real-time dashboards and analytics.',
    icon: '📊',
    path: '/dashboard',
  },
  {
    id: 4,
    title: 'Advisor Connection',
    description: 'Connect seamlessly with academic advisors for expert guidance.',
    icon: '👥',
    path: '/chat',
  },
  {
    id: 5,
    title: 'Course Analytics',
    description: 'Analyze course difficulty and success rates to make informed decisions.',
    icon: '📈',
    path: '/dashboard',
  },
  {
    id: 6,
    title: 'Degree Planning',
    description: 'Track your degree requirements and plan your path to graduation.',
    icon: '🎓',
    path: '/dashboard',
  },
  {
    id: 7,
    title: 'Smart Scheduling',
    description: 'Automatically generate optimal class schedules based on your preferences.',
    icon: '⏰',
    path: '/dashboard',
  },
  {
    id: 8,
    title: 'Academic Map',
    description: 'Get a visual map of your academic performance and areas for improvement.',
    icon: '💡',
    path: '/dashboard',
  },
];

