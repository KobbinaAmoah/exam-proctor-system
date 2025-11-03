import React, { useState, useMemo } from 'react';
import { ArrowLeftIcon, CheckCircleIcon } from '../icons/Icons';
import { useAppContext } from '../../hooks/useAppContext';
import { useToast } from '../../hooks/useToast';
import { saveSubmission } from '../../services/api';
import { Submission } from '../../types';

const AssignmentView: React.FC = () => {
  const { currentUser, assignments, submissions, activeCourseId, dispatch } = useAppContext();
  const addToast = useToast();
  
  // For simplicity, using the first assignment of the course. A real app would track selected assignment ID.
  const assignment = assignments.find(a => a.courseId === activeCourseId);
  
  const existingSubmission = useMemo(() => {
    if (!currentUser || !assignment) return null;
    return submissions.find(s => s.studentId === currentUser.id && s.assignmentId === assignment.id);
  }, [submissions, currentUser, assignment]);

  const [content, setContent] = useState(existingSubmission?.content || '');
  
  const handleBack = () => {
    dispatch({ type: 'SET_STUDENT_VIEW', payload: 'COURSE_DETAIL' });
  };
  
  const handleSubmit = async () => {
    if (!currentUser || !assignment) return;
    
    const submission: Submission = {
        id: existingSubmission?.id || `sub-${Date.now()}`,
        assignmentId: assignment.id,
        studentId: currentUser.id,
        submittedAt: new Date(),
        content,
    };
    
    try {
        const saved = await saveSubmission(submission);
        dispatch({ type: 'SAVE_SUBMISSION_SUCCESS', payload: saved });
        addToast('Assignment submitted successfully!', 'success');
        handleBack();
    } catch (e: any) {
        addToast(e.message, 'error');
    }
  };

  if (!assignment) {
    return <div className="text-center">Assignment not found.</div>;
  }
  
  return (
    <div>
       <button onClick={handleBack} className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6">
        <ArrowLeftIcon className="w-4 h-4 mr-2" />
        Back to Assignments
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{assignment.title}</h2>
            <p className="mt-2 text-md text-gray-500 dark:text-gray-400">Due: {assignment.dueDate.toLocaleDateString()}</p>
        </div>
        
        <div className="p-8">
            <h3 className="text-xl font-semibold mb-2">Instructions</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{assignment.description}</p>
            
            <h3 className="text-xl font-semibold mb-2">Your Submission</h3>
             {existingSubmission ? (
                <div className="p-4 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-md">
                    <p className="font-semibold text-green-800 dark:text-green-200">Submitted on: {existingSubmission.submittedAt.toLocaleString()}</p>
                    <p className="mt-2 font-mono whitespace-pre-wrap p-2 bg-white dark:bg-gray-700 rounded">{existingSubmission.content}</p>
                </div>
             ) : (
                <>
                    <textarea
                      rows={10}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Type your submission here..."
                    />
                    <div className="mt-4 flex justify-end">
                        <button onClick={handleSubmit} className="flex items-center px-4 py-2 text-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                            <CheckCircleIcon className="w-5 h-5 mr-2" />
                            Submit Assignment
                        </button>
                    </div>
                </>
             )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentView;
