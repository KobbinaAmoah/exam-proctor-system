import React from 'react';
import { User, Role, Exam, QuestionType, FlagType, Course, ProctoringSettings, ProctoringSensitivity, Lesson, Assignment, Announcement } from './types';
import { EyeOffIcon, PhoneIcon, UsersIcon, UserCircleIcon, MicrophoneIcon, ExternalLinkIcon, BanIcon } from './components/icons/Icons';

export const MOCK_STUDENT: User = {
  id: 'student-01',
  name: 'Alex Johnson',
  email: 'alex.j@university.edu',
  role: Role.STUDENT,
};

export const MOCK_INSTRUCTOR: User = {
  id: 'instructor-01',
  name: 'Dr. Evelyn Reed',
  email: 'e.reed@university.edu',
  role: Role.INSTRUCTOR,
};

export const MOCK_ADMIN: User = {
  id: 'admin-01',
  name: 'System Admin',
  email: 'admin@m-system.com',
  role: Role.ADMIN,
};

export const MOCK_USERS: User[] = [MOCK_STUDENT, MOCK_INSTRUCTOR, MOCK_ADMIN];

export const MOCK_EXAM: Exam = {
  id: 'exam-101',
  title: 'Introduction to Quantum Physics - Midterm',
  durationMinutes: 60,
  shuffleQuestions: true,
  shuffleOptions: true,
  releaseGrades: 'LATER',
  questions: [
    {
      id: 'q1',
      type: QuestionType.MCQ,
      text: 'What is the fundamental principle of quantum mechanics?',
      options: ['Heisenberg Uncertainty Principle', 'Pauli Exclusion Principle', 'Wave-particle duality', 'Principle of Superposition'],
      correctAnswers: ['Wave-particle duality'],
      points: 10,
      isRequired: true,
    },
    {
      id: 'q2',
      type: QuestionType.CHECKBOX,
      text: 'Which of the following are considered quantum numbers? (Select all that apply)',
      options: ['Principal quantum number (n)', 'Angular momentum quantum number (l)', 'Magnetic quantum number (ml)', 'Atomic mass number (A)'],
      correctAnswers: ['Principal quantum number (n)', 'Angular momentum quantum number (l)', 'Magnetic quantum number (ml)'],
      points: 15,
      isRequired: true,
    },
    {
      id: 'q3',
      type: QuestionType.SHORT_ANSWER,
      text: 'Briefly explain the concept of quantum entanglement in your own words.',
      points: 20,
      isRequired: true,
    },
     {
      id: 'q4',
      type: QuestionType.DROPDOWN,
      text: 'Schrödinger\'s cat is a thought experiment that illustrates which concept?',
      options: ['Quantum tunneling', 'Quantum superposition', 'Special relativity', 'General relativity'],
      correctAnswers: ['Quantum superposition'],
      points: 10,
      isRequired: false,
    },
  ],
};

export const MOCK_EXAM_2: Exam = {
  id: 'exam-102',
  title: 'Advanced Astrophysics - Final',
  durationMinutes: 90,
  shuffleQuestions: false,
  shuffleOptions: true,
  releaseGrades: 'LATER',
  questions: [
    {
      id: 'a1',
      type: QuestionType.MCQ,
      text: 'What is a standard candle in astronomy?',
      options: ['A star of known luminosity', 'A type of supernova', 'A unit of distance', 'A specific type of nebula'],
      correctAnswers: ['A star of known luminosity'],
      points: 25,
      isRequired: true,
    },
    {
      id: 'a2',
      type: QuestionType.SHORT_ANSWER,
      text: 'Describe the primary evidence for the existence of dark matter.',
      points: 25,
      isRequired: true,
    },
  ],
};


export const MOCK_COURSES: Course[] = [
  {
    id: 'course-01',
    title: 'Quantum Physics 101',
    description: 'An introductory course on the principles of quantum mechanics.',
    instructor: 'Dr. Evelyn Reed',
    examId: 'exam-101',
    enrolledStudentIds: ['student-01'],
  },
   {
    id: 'course-02',
    title: 'Advanced Astrophysics',
    description: 'Explore the mysteries of black holes, dark matter, and the origins of the universe.',
    instructor: 'Dr. Evelyn Reed',
    examId: 'exam-102',
    enrolledStudentIds: ['student-01'],
  }
];

export const MOCK_LESSONS: Lesson[] = [
  { id: 'l1-c1', courseId: 'course-01', type: 'text', title: 'Introduction to Quantum States', content: 'This lesson covers the basics of quantum states, including superposition and the wave function.' },
  { id: 'l2-c1', courseId: 'course-01', type: 'text', title: 'Wave-Particle Duality', content: 'Explore the dual nature of light and matter, a cornerstone of quantum mechanics.' },
  { id: 'l3-c1', courseId: 'course-01', type: 'text', title: 'The Schrödinger Equation', content: 'A deep dive into the fundamental equation governing the behavior of quantum systems.' },
  { id: 'l1-c2', courseId: 'course-02', type: 'text', title: 'The Lifecycle of Stars', content: 'From stellar nurseries to supernovae, we trace the complete life of a star.' },
  { id: 'l2-c2', courseId: 'course-02', type: 'video', title: 'General Relativity and Black Holes', content: 'An introduction to Einstein\'s theory and its most extreme prediction.', videoUrl: 'https://www.youtube.com/embed/DYq774z4dws' },
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  { id: 'a1-c1', courseId: 'course-01', title: 'Problem Set 1: Wave Functions', description: 'Solve the provided problems related to the wave function and probability density.', dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  { id: 'a2-c1', courseId: 'course-01', title: 'Essay: The Copenhagen Interpretation', description: 'Write a 500-word essay explaining the Copenhagen interpretation of quantum mechanics.', dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
  { id: 'a1-c2', courseId: 'course-02', title: 'Lab Report: Starlight Spectroscopy', description: 'Analyze the provided spectral data from a distant star and identify its composition.', dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
    { id: 'ann1-c1', courseId: 'course-01', title: 'Welcome to Quantum Physics 101!', content: 'Welcome, everyone! Please review the syllabus and course materials before our first lecture on Monday.', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: 'ann2-c1', courseId: 'course-01', title: 'Office Hours Update', content: 'My office hours for this week will be moved to Tuesday at 3 PM. Please plan accordingly.', createdAt: new Date() },
];

export const ALL_MOCK_EXAMS: Record<string, Exam> = {
  [MOCK_EXAM.id]: MOCK_EXAM,
  [MOCK_EXAM_2.id]: MOCK_EXAM_2,
};


export const FLAG_DETAILS: Record<FlagType, { text: string; icon: React.FC<{className?: string}>; color: string, riskLevel: 'Low' | 'Medium' | 'High' }> = {
  [FlagType.LOOKING_AWAY]: {
    text: 'Looking away from screen',
    icon: EyeOffIcon,
    color: 'text-yellow-500',
    riskLevel: 'Low',
  },
  [FlagType.PHONE_DETECTED]: {
    text: 'Mobile phone detected',
    icon: PhoneIcon,
    color: 'text-orange-500',
    riskLevel: 'High',
  },
  [FlagType.MULTIPLE_PEOPLE]: {
    text: 'Multiple people in view',
    icon: UsersIcon,
    color: 'text-red-500',
    riskLevel: 'High',
  },
  [FlagType.UNKNOWN_PERSON]: {
    text: 'Unrecognized person',
    icon: UserCircleIcon,
    color: 'text-purple-500',
    riskLevel: 'High',
  },
  [FlagType.SUSPICIOUS_AUDIO]: {
    text: 'Suspicious audio detected',
    icon: MicrophoneIcon,
    color: 'text-blue-500',
    riskLevel: 'Medium',
  },
  [FlagType.TAB_SWITCH]: {
    text: 'Switched tab or app',
    icon: ExternalLinkIcon,
    color: 'text-red-600',
    riskLevel: 'High',
  },
  [FlagType.FULLSCREEN_EXIT]: {
    text: 'Exited full-screen mode',
    icon: BanIcon,
    color: 'text-orange-400',
    riskLevel: 'Medium',
  },
};


// Create default settings based on the initial risk levels in FLAG_DETAILS
const defaultSensitivities = Object.entries(FLAG_DETAILS).reduce((acc, [key, value]) => {
  acc[key as FlagType] = value.riskLevel;
  return acc;
}, {} as Record<FlagType, ProctoringSensitivity>);

export const DEFAULT_PROCTORING_SETTINGS: ProctoringSettings = {
  sensitivities: defaultSensitivities,
  autoFailThreshold: 5,
};