export interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  path: string;
}

export const services: Service[] = [
  {
    id: 'academic-dashboard',
    title: 'Interactive Academic Journey',
    description: 'Navigate your curriculum with an intelligent map that visualizes prerequisites and course dependencies for ultimate academic clarity.',
    image: '/academic-plan.png',
    path: '/dashboard',
  },
  {
    id: 'academic-plan',
    title: 'Semester Planning',
    description: 'Visualize your course schedule, manage prerequisites, and optimize your workload ',
    image: '/academic-map.png',
    path: '/dashboard',
  },
  {
    id: 'tracks-map',
    title: 'Progress Tracking',
    description: 'Monitor your academic progress in real-time. Track your GPA, credit hours, and degree completion status with intuitive dashboards.',
    image: '/track-map.png',
    path: '/dashboard',
  },
  {
    id: 'chatbot',
    title: 'AI Academic Concierge',
    description: 'Experience 24/7 intelligent assistance. Our AI-driven concierge provides instant insights and guidance for all your academic inquiries.',
    image: '/chatbot.png',
    path: '/chat',
  },
  {
    id: 'career-hub',
    title: 'Career Hub',
    description: 'Access elite career resources and internship opportunities synchronized with your academic profile.',
    image: '/career-hub.png',
    path: '/career-hub',
  },
];

