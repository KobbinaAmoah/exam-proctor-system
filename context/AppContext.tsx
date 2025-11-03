import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, AppAction, AppContextType, Role, ExamStatus } from '../types';
import { fetchAllData } from '../services/api';
import { DEFAULT_PROCTORING_SETTINGS } from '../constants';

const initialState: AppState = {
    currentUser: null,
    users: [],
    courses: [],
    exams: {},
    lessons: [],
    assignments: [],
    submissions: [],
    announcements: [],
    studentProgress: {},
    flaggedEvents: [],
    proctoringSettings: DEFAULT_PROCTORING_SETTINGS,
    isLoading: false,
    error: null,
    activeView: 'DASHBOARD',
    activeCourseId: null,
    activeExamId: null,
    studentView: 'STUDENT_DASHBOARD',
};

const appReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case 'LOGIN_START':
            return { ...state, isLoading: true, error: null };
        case 'LOGIN_SUCCESS':
            const role = action.payload.role;
            let initialView = 'DASHBOARD';
            if (role === Role.INSTRUCTOR) initialView = 'courses';
            if (role === Role.ADMIN) initialView = 'stats';
            return { ...state, isLoading: false, currentUser: action.payload, activeView: initialView };
        case 'LOGIN_FAILURE':
            return { ...state, isLoading: false, error: action.payload };
        case 'LOGOUT':
            // Reset to initial state, but without triggering a full page reload if we can avoid it.
            // This ensures all user data is cleared from the state.
            return { ...initialState, users: state.users, courses: state.courses, exams: state.exams }; // Keep global data
        case 'FETCH_DATA_START':
            return { ...state, isLoading: true };
        case 'FETCH_DATA_SUCCESS':
            return { ...state, isLoading: false, ...action.payload };
        case 'FETCH_DATA_FAILURE':
            return { ...state, isLoading: false, error: action.payload };
        case 'SET_VIEW':
            return { ...state, activeView: action.payload, studentView: 'STUDENT_DASHBOARD', activeCourseId: null };
        case 'SET_STUDENT_VIEW':
            return { ...state, studentView: action.payload };
        case 'SELECT_COURSE':
            let nextStudentView = state.studentView;
            if (action.payload && state.currentUser?.role === Role.STUDENT) {
                 nextStudentView = 'COURSE_DETAIL';
            }
            return { ...state, activeCourseId: action.payload, studentView: nextStudentView };
        case 'EDIT_EXAM':
            return { ...state, activeExamId: action.payload };
        case 'CLOSE_EXAM_BUILDER':
            return { ...state, activeExamId: null };
        case 'UPDATE_STUDENT_PROGRESS':
             const { studentId, examId, progress } = action.payload;
             return {
                ...state,
                studentProgress: {
                    ...state.studentProgress,
                    [studentId]: {
                        ...state.studentProgress[studentId],
                        [examId]: {
                            ...state.studentProgress[studentId]?.[examId],
                            ...progress,
                        } as any,
                    },
                },
            };
        case 'ADD_FLAGGED_EVENT':
            return { ...state, flaggedEvents: [action.payload, ...state.flaggedEvents] };
        case 'SAVE_USER_SUCCESS':
            const userIndex = state.users.findIndex(u => u.id === action.payload.id);
            const newUsers = [...state.users];
            if (userIndex > -1) newUsers[userIndex] = action.payload;
            else newUsers.push(action.payload);
            return { ...state, users: newUsers };
        case 'DELETE_USER_SUCCESS':
            return { ...state, users: state.users.filter(u => u.id !== action.payload) };
        case 'SAVE_COURSE_SUCCESS':
            const courseIndex = state.courses.findIndex(c => c.id === action.payload.id);
            const newCourses = [...state.courses];
            if (courseIndex > -1) newCourses[courseIndex] = action.payload;
            else newCourses.push(action.payload);
            return { ...state, courses: newCourses };
        case 'DELETE_COURSE_SUCCESS':
            return { ...state, courses: state.courses.filter(c => c.id !== action.payload) };
        case 'SAVE_EXAM_SUCCESS':
            return { ...state, exams: { ...state.exams, [action.payload.id]: action.payload } };
        case 'SAVE_PROCTORING_SETTINGS_SUCCESS':
            return { ...state, proctoringSettings: action.payload };
        case 'SAVE_LESSON_SUCCESS':
            const lessonIndex = state.lessons.findIndex(l => l.id === action.payload.id);
            const newLessons = [...state.lessons];
            if (lessonIndex > -1) newLessons[lessonIndex] = action.payload;
            else newLessons.push(action.payload);
            return { ...state, lessons: newLessons };
        case 'DELETE_LESSON_SUCCESS':
            return { ...state, lessons: state.lessons.filter(l => l.id !== action.payload) };
        case 'SAVE_ASSIGNMENT_SUCCESS':
            const assignmentIndex = state.assignments.findIndex(a => a.id === action.payload.id);
            const newAssignments = [...state.assignments];
            if (assignmentIndex > -1) newAssignments[assignmentIndex] = action.payload;
            else newAssignments.push(action.payload);
            return { ...state, assignments: newAssignments };
        case 'DELETE_ASSIGNMENT_SUCCESS':
            return { ...state, assignments: state.assignments.filter(a => a.id !== action.payload) };
        case 'SAVE_SUBMISSION_SUCCESS':
            const submissionIndex = state.submissions.findIndex(s => s.id === action.payload.id);
            const newSubmissions = [...state.submissions];
            if (submissionIndex > -1) newSubmissions[submissionIndex] = action.payload;
            else newSubmissions.push(action.payload);
            return { ...state, submissions: newSubmissions };
         case 'SAVE_ANNOUNCEMENT_SUCCESS':
            return { ...state, announcements: [action.payload, ...state.announcements] };
        case 'DISMISS_ERROR':
            return { ...state, error: null };
        default:
            return state;
    }
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    useEffect(() => {
        const loadData = async () => {
            if (state.currentUser) {
                dispatch({ type: 'FETCH_DATA_START' });
                try {
                    const data = await fetchAllData();
                    dispatch({ type: 'FETCH_DATA_SUCCESS', payload: data });
                } catch (e: any) {
                    dispatch({ type: 'FETCH_DATA_FAILURE', payload: e.message });
                }
            }
        };
        loadData();
    }, [state.currentUser]);

    return (
        <AppContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};