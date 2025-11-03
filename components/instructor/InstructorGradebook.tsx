import React, { useState, useMemo } from 'react';
import { Course, Submission } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import { useToast } from '../../hooks/useToast';
import { saveSubmission } from '../../services/api';
import { XIcon, CheckCircleIcon } from '../icons/Icons';

interface GradingModalProps {
    submission: Submission;
    onClose: () => void;
    onSave: (submission: Submission) => void;
}

const GradingModal: React.FC<GradingModalProps> = ({ submission, onClose, onSave }) => {
    const { users, assignments } = useAppContext();
    const [grade, setGrade] = useState(submission.grade?.toString() || '');
    
    const student = users.find(u => u.id === submission.studentId);
    const assignment = assignments.find(a => a.id === submission.assignmentId);

    const handleSave = () => {
        const numericGrade = parseInt(grade, 10);
        if (isNaN(numericGrade) || numericGrade < 0 || numericGrade > 100) {
            // Basic validation
            return;
        }
        onSave({ ...submission, grade: numericGrade });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold">Grade Submission</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{assignment?.title} - {student?.name}</p>
                    </div>
                    <button onClick={onClose}><XIcon className="w-6 h-6" /></button>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    <p className="font-semibold mb-2">Student's Submission:</p>
                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md whitespace-pre-wrap font-mono">{submission.content}</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex items-center justify-end space-x-4">
                    <label htmlFor="grade" className="font-medium">Grade (0-100):</label>
                    <input 
                        type="number"
                        id="grade"
                        value={grade}
                        onChange={e => setGrade(e.target.value)}
                        className="w-24 px-2 py-1 border border-gray-300 rounded-md dark:bg-gray-600 dark:border-gray-500"
                    />
                    <button onClick={handleSave} className="flex items-center px-4 py-2 text-sm rounded-md text-white bg-green-600 hover:bg-green-700">
                        <CheckCircleIcon className="w-5 h-5 mr-2" />
                        Save Grade
                    </button>
                </div>
            </div>
        </div>
    );
};


interface InstructorGradebookProps {
    course: Course;
}

const InstructorGradebook: React.FC<InstructorGradebookProps> = ({ course }) => {
    const { assignments, submissions, users, dispatch } = useAppContext();
    const addToast = useToast();
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

    const courseAssignments = assignments.filter(a => a.courseId === course.id);
    const enrolledStudents = users.filter(u => course.enrolledStudentIds.includes(u.id));

    const gradebookData = useMemo(() => {
        return enrolledStudents.map(student => {
            const studentSubmissions = submissions.filter(s => s.studentId === student.id);
            const grades = courseAssignments.reduce((acc, assignment) => {
                const submission = studentSubmissions.find(s => s.assignmentId === assignment.id);
                acc[assignment.id] = submission || null;
                return acc;
            }, {} as Record<string, Submission | null>);
            return { student, grades };
        });
    }, [enrolledStudents, courseAssignments, submissions]);
    
    const handleSaveGrade = async (submission: Submission) => {
        try {
            const saved = await saveSubmission(submission);
            dispatch({ type: 'SAVE_SUBMISSION_SUCCESS', payload: saved });
            addToast('Grade saved!', 'success');
            setSelectedSubmission(null);
        } catch (e: any) {
            addToast(e.message, 'error');
        }
    };

    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student</th>
                            {courseAssignments.map(a => (
                                <th key={a.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{a.title}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {gradebookData.map(({ student, grades }) => (
                            <tr key={student.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{student.name}</td>
                                {courseAssignments.map(a => {
                                    const submission = grades[a.id];
                                    return (
                                        <td key={a.id} className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                            {submission ? (
                                                <button onClick={() => setSelectedSubmission(submission)} className={`px-2 py-0.5 rounded-full text-xs ${submission.grade !== undefined ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                                                    {submission.grade !== undefined ? `${submission.grade}/100` : 'Needs Grading'}
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 dark:text-gray-500">—</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {gradebookData.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-8">No students enrolled to display in gradebook.</p>}
            </div>
            {selectedSubmission && (
                <GradingModal submission={selectedSubmission} onClose={() => setSelectedSubmission(null)} onSave={handleSaveGrade} />
            )}
        </>
    );
};

export default InstructorGradebook;
