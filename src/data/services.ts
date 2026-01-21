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
    title: 'Semester Planning',
    description: 'Visualize your course schedule, manage prerequisites, and optimize your Academic Journey. ',
    image: '/academic-plan.png',
    path: '/dashboard',
  },
  {
    id: 'academic-plan',
    title: 'Interactive Academic Journey',
    description: 'Navigate your curriculum with an intelligent map that visualizes prerequisites and course dependencies for ultimate academic clarity.',
    image: '/academic-map.png',
    path: '/dashboard',
  },
  {
    id: 'tracks-map',
    title: 'Tracks Map',
    description: 'Explore specialization tracks in detail. Zoom in to visualize course connections, understand prerequisite chains.',
    image: '/track-map.png',
    path: '/dashboard',
  },
  {
    id: 'chatbot',
    title: 'AI Academic Concierge',
    description: 'Get instant answers for any academic question. Ask about course details, prerequisites and Recommendations for your courses.',
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

