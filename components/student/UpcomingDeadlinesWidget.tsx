import React, { useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Assignment, ExamStatus } from '../../types';
import DashboardWidget from '../common/DashboardWidget';
import { CalendarIcon, ArrowRightIcon, DocumentTextIcon } from '../icons/Icons';

interface UpcomingItem {
    id: string;
    courseId: string;
    title: string;
    courseTitle: string;
    dueDate: Date;
    type: 'assignment' | 'exam';
}

const UpcomingDeadlinesWidget: React.FC = () => {
    const { currentUser, courses, assignments, exams, studentProgress, submissions, dispatch } = useAppContext();

    const upcomingItems = useMemo((): UpcomingItem[] => {
        if (!currentUser) return [];

        const enrolledCourseIds = new Set(courses.filter(c => c.enrolledStudentIds.includes(currentUser!.id)).map(c => c.id));
        const courseMap = new Map(courses.map(c => [c.id, c.title]));
        const userSubmissions = new Set(submissions.filter(s => s.studentId === currentUser.id).map(s => s.assignmentId));
        const userProgress = studentProgress[currentUser.id] || {};

        const upcomingAssignments: UpcomingItem[] = assignments
            .filter(a => enrolledCourseIds.has(a.courseId) && !userSubmissions.has(a.id))
            .map(a => ({
                id: a.id,
                courseId: a.courseId,
                title: a.title,
                courseTitle: courseMap.get(a.courseId) || '',
                dueDate: a.dueDate,
                type: 'assignment'
            }));

        const upcomingExams: UpcomingItem[] = courses
            .filter(c => enrolledCourseIds.has(c.id))
            .filter(c => userProgress[c.examId]?.status === undefined || userProgress[c.examId]?.status === ExamStatus.NOT_STARTED)
            .map(c => ({
                id: c.examId,
                courseId: c.id,
                title: exams[c.examId]?.title || 'Final Exam',
                courseTitle: c.title,
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Placeholder due date for exams
                type: 'exam'
            }));

        return [...upcomingAssignments, ...upcomingExams]
            .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
            .slice(0, 5);

    }, [currentUser, courses, assignments, exams, studentProgress, submissions]);

    const handleNavigate = (item: UpcomingItem) => {
        dispatch({ type: 'SELECT_COURSE', payload: item.courseId });
        if (item.type === 'assignment') {
            // In a real app, you would also set the active assignment ID
            dispatch({ type: 'SET_STUDENT_VIEW', payload: 'ASSIGNMENT_VIEW' });
        } else {
            dispatch({ type: 'SET_STUDENT_VIEW', payload: 'PRE_EXAM_CHECKLIST' });
        }
    };

    const formatDate = (date: Date) => {
        const diffDays = Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
        if (diffDays <= 0) return 'Due today';
        if (diffDays === 1) return 'Due tomorrow';
        return `Due in ${diffDays} days`;
    };

    return (
        <DashboardWidget title="Upcoming Deadlines" icon={CalendarIcon}>
            <div className="space-y-3">
                {upcomingItems.length > 0 ? upcomingItems.map(item => (
                    <button key={`${item.type}-${item.id}`} onClick={() => handleNavigate(item)} className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center">
                        <DocumentTextIcon className="w-6 h-6 text-gray-400 mr-4" />
                        <div className="flex-grow">
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{item.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.courseTitle}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-medium text-red-500 dark:text-red-400">{formatDate(item.dueDate)}</p>
                           <p className="text-xs text-gray-400">{item.dueDate.toLocaleDateString()}</p>
                        </div>
                         <ArrowRightIcon className="w-5 h-5 text-gray-400 ml-4" />
                    </button>
                )) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">You're all caught up!</p>
                )}
            </div>
        </DashboardWidget>
    );
};

export default UpcomingDeadlinesWidget;
