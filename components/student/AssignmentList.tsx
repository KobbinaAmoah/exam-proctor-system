import React from 'react';
import { DocumentTextIcon, CheckCircleIcon, ClockIcon } from '../icons/Icons';
import { useAppContext } from '../../hooks/useAppContext';

interface AssignmentListProps {
  courseId: string;
  examId: string;
}

const AssignmentList: React.FC<AssignmentListProps> = ({ courseId, examId }) => {
  const { assignments, exams, submissions, currentUser, dispatch } = useAppContext();

  const courseAssignments = assignments.filter(a => a.courseId === courseId);
  const exam = exams[examId];

  const handleSelectAssignment = (assignmentId: string) => {
    // In a real app, track the selected assignment in context state
    dispatch({ type: 'SET_STUDENT_VIEW', payload: 'ASSIGNMENT_VIEW' });
  }

  const handleStartExam = () => {
    dispatch({ type: 'SET_STUDENT_VIEW', payload: 'PRE_EXAM_CHECKLIST' });
  };
  
  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Assignments & Exams</h3>
      <div className="space-y-4">
        {courseAssignments.map(assignment => {
            const submission = currentUser ? submissions.find(s => s.assignmentId === assignment.id && s.studentId === currentUser.id) : null;
            const isSubmitted = !!submission;
            return (
                <div key={assignment.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200">{assignment.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Due: {assignment.dueDate.toLocaleDateString()}</p>
                    </div>
                    {isSubmitted ? (
                         <div className="flex items-center text-green-600 dark:text-green-400">
                            <CheckCircleIcon className="w-5 h-5 mr-2" />
                            <span>Submitted</span>
                         </div>
                    ) : (
                        <button onClick={() => handleSelectAssignment(assignment.id)} className="flex items-center px-3 py-1 text-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                            View & Submit
                        </button>
                    )}
                </div>
            );
        })}

        {exam && (
             <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/50">
                <div>
                    <p className="font-bold text-indigo-800 dark:text-indigo-200">{exam.title}</p>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400">{exam.questions.length} Questions, {exam.durationMinutes} Minutes</p>
                </div>
                <button onClick={handleStartExam} className="flex items-center px-4 py-2 text-sm rounded-md text-white bg-green-600 hover:bg-green-700 font-bold">
                    Start Exam
                </button>
            </div>
        )}

      </div>
    </div>
  );
};

export default AssignmentList;
