import { Dispatch } from "react";

export enum Role {
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  name: string;
  role: Role;
  email?: string; 
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string; // Can be markdown or HTML
  type: 'text' | 'video'; // Simple content types
  videoUrl?: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: Date;
}

export interface Submission {
    id: string;
    assignmentId: string;
    studentId: string;
    submittedAt: Date;
    content: string; // For text-based submissions
    grade?: number; // Out of 100
    gradedAt?: Date;
}

export interface Announcement {
  id: string;
  courseId: string;
  title: string;
  content: string;
  createdAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  examId: string;
  enrolledStudentIds: string[];
}

export enum QuestionType {
  MCQ = 'MCQ',
  SHORT_ANSWER = 'SHORT_ANSWER',
  CHECKBOX = 'CHECKBOX',
  DROPDOWN = 'DROPDOWN',
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswers?: string[]; // Renamed for multi-answer support
  points: number;
  isRequired: boolean;
  feedback?: {
    correct: string;
    incorrect: string;
  };
}

export interface Exam {
  id: string;
  title: string;
  durationMinutes: number;
  questions: Question[];
  // Google Forms-like settings
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  releaseGrades: 'IMMEDIATELY' | 'LATER';
}

export enum FlagType {
  LOOKING_AWAY = 'LOOKING_AWAY',
  PHONE_DETECTED = 'PHONE_DETECTED',
  MULTIPLE_PEOPLE = 'MULTIPLE_PEOPLE',
  UNKNOWN_PERSON = 'UNKNOWN_PERSON',
  SUSPICIOUS_AUDIO = 'SUSPICIOUS_AUDIO',
  TAB_SWITCH = 'TAB_SWITCH',
  FULLSCREEN_EXIT = 'FULLSCREEN_EXIT',
}

export interface FlaggedEvent {
  id: string;
  studentId: string;
  studentName: string;
  type: FlagType;
  timestamp: Date;
  snapshotUrl: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export enum ExamStatus {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  SUBMITTED = 'Submitted for Review',
  GRADED = 'Graded',
}

export interface StudentExamProgress {
  status: ExamStatus;
  answers: Record<string, string | string[]>; // Support for checkbox answers
  score?: number;
  gradedAnswers?: Record<string, boolean>;
  startTime?: Date;
  endTime?: Date;
  gradedAt?: Date;
}

export interface StudentProgress {
  [studentId: string]: {
    [examId: string]: StudentExamProgress;
  };
}

export type ProctoringSensitivity = 'Low' | 'Medium' | 'High';

export interface ProctoringSettings {
  sensitivities: Record<FlagType, ProctoringSensitivity>;
  autoFailThreshold: number;
}

// New Types for Production-Ready Architecture

export interface AppState {
  currentUser: User | null;
  users: User[];
  courses: Course[];
  exams: Record<string, Exam>;
  lessons: Lesson[];
  assignments: Assignment[];
  submissions: Submission[];
  announcements: Announcement[];
  studentProgress: StudentProgress;
  flaggedEvents: FlaggedEvent[];
  proctoringSettings: ProctoringSettings;
  isLoading: boolean;
  error: string | null;
  activeView: string;
  activeCourseId: string | null;
  activeExamId: string | null; // For the exam builder
  studentView: 'STUDENT_DASHBOARD' | 'COURSE_DETAIL' | 'LESSON_VIEW' | 'ASSIGNMENT_VIEW' | 'PRE_EXAM_CHECKLIST' | 'EXAM_VIEW' | 'EXAM_RESULTS' | 'RESULTS_DETAIL';
}

export type AppAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'FETCH_DATA_START' }
  | { type: 'FETCH_DATA_SUCCESS'; payload: { users: User[]; courses: Course[]; exams: Record<string, Exam>, lessons: Lesson[], assignments: Assignment[], submissions: Submission[], announcements: Announcement[] } }
  | { type: 'FETCH_DATA_FAILURE'; payload: string }
  | { type: 'SET_VIEW'; payload: string }
  | { type: 'SET_STUDENT_VIEW'; payload: AppState['studentView'] }
  | { type: 'SELECT_COURSE'; payload: string | null }
  | { type: 'EDIT_EXAM'; payload: string }
  | { type: 'CLOSE_EXAM_BUILDER' }
  | { type: 'UPDATE_STUDENT_PROGRESS'; payload: { studentId: string; examId: string; progress: Partial<StudentExamProgress> } }
  | { type: 'ADD_FLAGGED_EVENT'; payload: FlaggedEvent }
  | { type: 'SAVE_USER_SUCCESS'; payload: User }
  | { type: 'DELETE_USER_SUCCESS'; payload: string }
  | { type: 'SAVE_COURSE_SUCCESS'; payload: Course }
  | { type: 'DELETE_COURSE_SUCCESS'; payload: string }
  | { type: 'SAVE_EXAM_SUCCESS'; payload: Exam }
  | { type: 'SAVE_PROCTORING_SETTINGS_SUCCESS'; payload: ProctoringSettings }
  | { type: 'SAVE_LESSON_SUCCESS'; payload: Lesson }
  | { type: 'DELETE_LESSON_SUCCESS'; payload: string }
  | { type: 'SAVE_ASSIGNMENT_SUCCESS'; payload: Assignment }
  | { type: 'DELETE_ASSIGNMENT_SUCCESS'; payload: string }
  | { type: 'SAVE_SUBMISSION_SUCCESS'; payload: Submission }
  | { type: 'SAVE_ANNOUNCEMENT_SUCCESS'; payload: Announcement }
  | { type: 'DISMISS_ERROR' };

export interface AppContextType extends AppState {
  dispatch: Dispatch<AppAction>;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

export interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
}