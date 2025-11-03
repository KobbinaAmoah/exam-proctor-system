import { User, Course, Exam, StudentProgress, ProctoringSettings, StudentExamProgress, Lesson, Assignment, Submission, Announcement } from '../types';
import { MOCK_USERS, MOCK_COURSES, ALL_MOCK_EXAMS, DEFAULT_PROCTORING_SETTINGS, MOCK_STUDENT, MOCK_LESSONS, MOCK_ASSIGNMENTS, MOCK_ANNOUNCEMENTS } from '../constants';

// --- localStorage Database Layer ---

const DB_KEYS = {
    USERS: 'm_system_users',
    COURSES: 'm_system_courses',
    EXAMS: 'm_system_exams',
    LESSONS: 'm_system_lessons',
    ASSIGNMENTS: 'm_system_assignments',
    SUBMISSIONS: 'm_system_submissions',
    ANNOUNCEMENTS: 'm_system_announcements',
    STUDENT_PROGRESS: 'm_system_student_progress',
    PROCTORING_SETTINGS: 'm_system_proctoring_settings',
};

// Helper to correctly parse JSON with Date objects
const jsonDateParser = (key: string, value: any) => {
    const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    if (typeof value === 'string' && dateFormat.test(value)) {
        return new Date(value);
    }
    return value;
};

const getFromDB = <T>(key: string, defaultValue: T): T => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item, jsonDateParser) : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

const setToDB = (key: string, value: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing to localStorage key “${key}”:`, error);
    }
};

// --- In-memory state, synchronized with localStorage ---
let users: User[] = [];
let courses: Course[] = [];
let exams: Record<string, Exam> = {};
let lessons: Lesson[] = [];
let assignments: Assignment[] = [];
let submissions: Submission[] = [];
let announcements: Announcement[] = [];
let studentProgress: StudentProgress = {};
let proctoringSettings: ProctoringSettings = DEFAULT_PROCTORING_SETTINGS;


const initDatabase = () => {
    // Check if data exists. If not, seed from constants.
    if (!localStorage.getItem(DB_KEYS.USERS)) {
        setToDB(DB_KEYS.USERS, MOCK_USERS);
        setToDB(DB_KEYS.COURSES, MOCK_COURSES);
        setToDB(DB_KEYS.EXAMS, ALL_MOCK_EXAMS);
        setToDB(DB_KEYS.LESSONS, MOCK_LESSONS);
        setToDB(DB_KEYS.ASSIGNMENTS, MOCK_ASSIGNMENTS);
        setToDB(DB_KEYS.SUBMISSIONS, []);
        setToDB(DB_KEYS.ANNOUNCEMENTS, MOCK_ANNOUNCEMENTS);
        setToDB(DB_KEYS.STUDENT_PROGRESS, { [MOCK_STUDENT.id]: {} });
        setToDB(DB_KEYS.PROCTORING_SETTINGS, DEFAULT_PROCTORING_SETTINGS);
    }
    
    // Load from DB into memory
    users = getFromDB(DB_KEYS.USERS, []);
    courses = getFromDB(DB_KEYS.COURSES, []);
    exams = getFromDB(DB_KEYS.EXAMS, {});
    lessons = getFromDB(DB_KEYS.LESSONS, []);
    assignments = getFromDB(DB_KEYS.ASSIGNMENTS, []);
    submissions = getFromDB(DB_KEYS.SUBMISSIONS, []);
    announcements = getFromDB(DB_KEYS.ANNOUNCEMENTS, []);
    studentProgress = getFromDB(DB_KEYS.STUDENT_PROGRESS, {});
    proctoringSettings = getFromDB(DB_KEYS.PROCTORING_SETTINGS, DEFAULT_PROCTORING_SETTINGS);
};

// Initialize DB on module load
initDatabase();


const SIMULATED_DELAY = 300; // ms

const simulateRequest = <T>(data: T): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => resolve(data), SIMULATED_DELAY);
    });
};

// --- API Functions ---

export const loginUser = (email: string, password?: string): Promise<User | null> => {
    const user = users.find(u => u.email === email);
    return simulateRequest(user || null);
};

export const fetchAllData = (): Promise<{ users: User[]; courses: Course[]; exams: Record<string, Exam>; lessons: Lesson[]; assignments: Assignment[], submissions: Submission[], announcements: Announcement[] }> => {
    // Data is already in memory, just simulate the async call
    return simulateRequest({ users, courses, exams, lessons, assignments, submissions, announcements });
};

export const saveUser = (user: User): Promise<User> => {
    const index = users.findIndex(u => u.id === user.id);
    if (index > -1) users[index] = user;
    else users.push(user);
    setToDB(DB_KEYS.USERS, users);
    return simulateRequest(user);
};

export const deleteUser = (userId: string): Promise<void> => {
    users = users.filter(u => u.id !== userId);
    setToDB(DB_KEYS.USERS, users);
    return simulateRequest(undefined);
};

export const saveCourse = (course: Course): Promise<Course> => {
    const index = courses.findIndex(c => c.id === course.id);
    if (index > -1) courses[index] = course;
    else courses.push(course);
    setToDB(DB_KEYS.COURSES, courses);
    return simulateRequest(course);
};

export const deleteCourse = (courseId: string): Promise<void> => {
    courses = courses.filter(c => c.id !== courseId);
    setToDB(DB_KEYS.COURSES, courses);
    return simulateRequest(undefined);
}

export const saveExam = (exam: Exam): Promise<Exam> => {
    exams[exam.id] = exam;
    setToDB(DB_KEYS.EXAMS, exams);
    return simulateRequest(exam);
};

export const saveLesson = (lesson: Lesson): Promise<Lesson> => {
    const index = lessons.findIndex(l => l.id === lesson.id);
    if (index > -1) lessons[index] = lesson;
    else lessons.push(lesson);
    setToDB(DB_KEYS.LESSONS, lessons);
    return simulateRequest(lesson);
};

export const deleteLesson = (lessonId: string): Promise<void> => {
    lessons = lessons.filter(l => l.id !== lessonId);
    setToDB(DB_KEYS.LESSONS, lessons);
    return simulateRequest(undefined);
}

export const saveAssignment = (assignment: Assignment): Promise<Assignment> => {
    const index = assignments.findIndex(a => a.id === assignment.id);
    if (index > -1) assignments[index] = assignment;
    else assignments.push(assignment);
    setToDB(DB_KEYS.ASSIGNMENTS, assignments);
    return simulateRequest(assignment);
};

export const deleteAssignment = (assignmentId: string): Promise<void> => {
    assignments = assignments.filter(a => a.id !== assignmentId);
    setToDB(DB_KEYS.ASSIGNMENTS, assignments);
    return simulateRequest(undefined);
}

export const saveSubmission = (submission: Submission): Promise<Submission> => {
    const index = submissions.findIndex(s => s.id === submission.id);
    if (index > -1) {
        if (submission.grade !== undefined && submissions[index].grade === undefined) {
            submission.gradedAt = new Date();
        }
        submissions[index] = submission;
    } else {
        submissions.push(submission);
    }
    setToDB(DB_KEYS.SUBMISSIONS, submissions);
    return simulateRequest(submission);
};

export const saveAnnouncement = (announcement: Announcement): Promise<Announcement> => {
    announcements.unshift(announcement);
    setToDB(DB_KEYS.ANNOUNCEMENTS, announcements);
    return simulateRequest(announcement);
}

export const saveStudentProgress = (studentId: string, examId: string, progress: Partial<StudentExamProgress>): Promise<void> => {
    if (!studentProgress[studentId]) studentProgress[studentId] = {};
    studentProgress[studentId][examId] = {
        ...studentProgress[studentId][examId],
        ...progress,
    } as StudentExamProgress;
    setToDB(DB_KEYS.STUDENT_PROGRESS, studentProgress);
    return simulateRequest(undefined);
};

export const saveProctoringSettings = (settings: ProctoringSettings): Promise<ProctoringSettings> => {
    proctoringSettings = settings;
    setToDB(DB_KEYS.PROCTORING_SETTINGS, proctoringSettings);
    return simulateRequest(proctoringSettings);
};