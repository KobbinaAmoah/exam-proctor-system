import React from 'react';
import { Course } from '../types';
import { CheckCircleIcon, HomeIcon } from './icons/Icons';
import { useAppContext } from '../hooks/useAppContext';

interface ExamResultsViewProps {
  course: Course;
}

const ExamResultsView: React.FC<ExamResultsViewProps> = ({ course }) => {
  const { dispatch } = useAppContext();
  
  const handleDone = () => {
    dispatch({ type: 'SELECT_COURSE', payload: null });
    dispatch({ type: 'SET_STUDENT_VIEW', payload: 'STUDENT_DASHBOARD' });
  };

  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />
        <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Exam Submitted Successfully!</h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Your submission for the <span className="font-semibold text-indigo-500">{course.title}</span> exam has been received.
        </p>
        <p className="mt-2 text-gray-500 dark:text-gray-500">
            Your instructor will review your submission and results will be posted later.
        </p>
        <button
          onClick={handleDone}
          className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <HomeIcon className="w-5 h-5 mr-2" />
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ExamResultsView;
