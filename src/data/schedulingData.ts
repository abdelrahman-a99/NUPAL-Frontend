import { CourseSession } from '@/types/scheduling';

export const MY_SCHEDULE_COURSES: CourseSession[] = [];

/** Maps course names to academic codes used as courseId */
export const NAME_TO_CODE_MAP: Record<string, string> = {
    'Pre-Calculus Mathematics': 'MATH 100',
    'Analytical Geometry & Calculus I': 'MATH 111',
    'Computer & Information Skills': 'CSCI 101',
    'Introduction to Programming': 'CSCI 102',
    'Physics I': 'PHYS 101',
    'Calculus II': 'MATH 112',
    'Probability & Statistics': 'MATH 201',
    'Discrete Mathematics': 'MATH 211',
    'Intermediate Programming': 'CSCI 112',
    'Electric Circuits': 'ECEN 101',
    'Calculus III': 'MATH 210',
    'Differential Equations': 'MATH 203',
    'Engineering Mathematics': 'MATH 303',
    'Data Analysis': 'CSCI 322',
    'Design & Analysis of Algorithms': 'CSCI 208',
    'Introduction to Computer Systems': 'CSCI 205',
    'Data Structures & Algorithms': 'CSCI 207',
    'Advanced Programming Concepts': 'CSCI 217',
    'Introduction to Computer Networks': 'CSCI 463',
    'Logic Design': 'CSCI 221',
    'Database Systems': 'CSCI 305',
    'Machine Intelligence': 'CSCI 417',
    'Theory of Computing': 'CSCI 419',
    'Software Engineering': 'CSCI 313',
    'Compiler Design': 'CSCI 415',
    'Computer Architecture': 'CSCI 311',
    'Operating Systems': 'CSCI 315',
    'Data Preparation and Visualization': 'CSCI 467',
    'Introduction to Big Data': 'CSCI 461',
    'Information Retrieval': 'CSCI 464',
    'Digital Image Processing': 'CSCI 451',
    'Computer Graphics': 'CSCI 472',
    'Bioinformatics': 'BMD 101',
    'Big Data Analytics': 'CSCI 462',
    '3D Computer Graphics': 'CSCI 452',
    'Big Data Applications': 'CSCI 465',
    'Computer Vision Systems': 'CSCI 455',
    'Interactive Multimedia Systems': 'CSCI 456',
    'Mixed Augmented Reality': 'CSCI 457',
    'Serious Computer Games': 'CSCI 458',
    'Introduction to Cloud Computing': 'CSCI 475',
    'Senior Project I': 'CSCI 495',
    'Senior Project II': 'CSCI 496',
    'English I': 'ENGL 101',
    'English II': 'ENGL 102',
    'Writing Skills': 'ENGL 201',
    'Communication & Presentation Skills': 'ENGL 202',
    'Introduction to Logic and Critical Thinking': 'HUMA 101',
    'Introduction to Ethics': 'HUMA 102',
    'Selected Topics in Egyptian & Arab Heritage': 'SSCI 101',
    'Selected Topics in World Cultures & Diversity': 'SSCI 102',
    'Project Management': 'SSCI 301',
    'Internship and Service Learning': 'COMM 401',
    'Industrial/Research Training': 'CSCI 490'
};

/** Maps course IDs/codes to friendly names for RL processing fallback */
export const COURSE_MAP: Record<string, string> = Object.entries(NAME_TO_CODE_MAP).reduce((acc, [name, code]) => {
    const cleanId = code.toLowerCase().replace(/[^a-z0-9]/g, '');
    acc[cleanId] = name;
    return acc;
}, {} as Record<string, string>);
