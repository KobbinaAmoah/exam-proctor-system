import React, { useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { ExamStatus, Submission, StudentExamProgress } from '../../types';
import DashboardWidget from '../common/DashboardWidget';
import { AcademicCapIcon, ArrowRightIcon } from '../icons/Icons';

interface GradedItem {
    id: string;
    courseId: string;
    title: string;
    courseTitle: string;
    gradedAt: Date;
    score: string;
    type: 'assignment' | 'exam';
}

const RecentGradesWidget: React.FC = () => {
    const { currentUser, courses, assignments, exams, studentProgress, submissions, dispatch } = useAppContext();

    const recentGrades = useMemo((): GradedItem[] => {
        if (!currentUser) return [];

        const courseMap = new Map(courses.map(c => [c.id, c.title]));

        const gradedSubmissions: GradedItem[] = submissions
            .filter(s => s.studentId === currentUser.id && s.grade !== undefined && s.gradedAt)
            .map(s => {
                const assignment = assignments.find(a => a.id === s.assignmentId);
                return {
                    id: s.id,
                    courseId: assignment?.courseId || '',
                    title: assignment?.title || 'Unknown Assignment',
                    courseTitle: courseMap.get(assignment?.courseId || '') || '',
                    gradedAt: s.gradedAt!,
                    score: `${s.grade}/100`,
                    type: 'assignment'
                };
            });

        const gradedExams: GradedItem[] = [];
        const userProgress = studentProgress[currentUser.id] || {};
        for (const course of courses) {
             const progress = userProgress[course.examId];
             if (progress?.status === ExamStatus.GRADED && progress.gradedAt) {
                gradedExams.push({
                    id: course.examId,
                    courseId: course.id,
                    title: exams[course.examId]?.title || 'Final Exam',
                    courseTitle: course.title,
                    gradedAt: progress.gradedAt,
                    score: `${progress.score}/${exams[course.examId]?.questions.length || '?'}`,
                    type: 'exam'
                });
             }
        }

        return [...gradedSubmissions, ...gradedExams]
            .sort((a, b) => b.gradedAt.getTime() - a.gradedAt.getTime())
            .slice(0, 4);

    }, [currentUser, courses, assignments, exams, studentProgress, submissions]);
    
    const handleNavigate = (item: GradedItem) => {
        dispatch({ type: 'SELECT_COURSE', payload: item.courseId });
        if (item.type === 'exam') {
            dispatch({ type: 'SET_STUDENT_VIEW', payload: 'RESULTS_DETAIL' });
        } else {
            // Navigate to assignment grade view, which is part of the gradebook
             dispatch({ type: 'SET_STUDENT_VIEW', payload: 'COURSE_DETAIL' });
        }
    }


    return (
        <DashboardWidget title="Recent Grades" icon={AcademicCapIcon}>
            <div className="space-y-3">
                {recentGrades.length > 0 ? recentGrades.map(item => (
                    <button key={`${item.type}-${item.id}`} onClick={() => handleNavigate(item)} className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center">
                        <div className="flex-grow">
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{item.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.courseTitle}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-md font-bold text-green-600 dark:text-green-400">{item.score}</p>
                           <p className="text-xs text-gray-400">{item.gradedAt.toLocaleDateString()}</p>
                        </div>
                    </button>
                )) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">No grades have been posted yet.</p>
                )}
            </div>
        </DashboardWidget>
    );
};

export default RecentGradesWidget;
